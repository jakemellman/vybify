#!/usr/bin/env node
/**
 * Pull skills from skills.sh sitemap (top N by popularity) and write
 * candidate JSON entries to src/content/candidates/skills/ for review.
 */
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const TOP_N = 200;
const DELAY_MS = 75;
const TOKEN = process.env.GITHUB_TOKEN;

const SITEMAP_URL = 'https://skills.sh/sitemap.xml';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function fetchSitemap() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`sitemap fetch ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function parseSkillUrl(url) {
  const path = url.replace(/^https:\/\/skills\.sh\//, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 3) return null;
  return { owner: parts[0], repo: parts[1], skill: parts[2] };
}

const PARSE_INSTALLS_RE = /Weekly Installs[\s\S]{0,500}?"children":"([\d.]+[KMB]?)"/;

async function fetchSkillPage(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'vybify-ingest' } });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(PARSE_INSTALLS_RE);
    return { installsLabel: m ? m[1] : null };
  } catch {
    return null;
  }
}

function parseInstallsLabel(s) {
  if (!s) return 0;
  const m = s.match(/^([\d.]+)\s*([KMB]?)$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return n * ({ K: 1e3, M: 1e6, B: 1e9, '': 1 }[m[2] || ''] || 1);
}

const repoCache = new Map();
async function fetchRepo(repo) {
  if (repoCache.has(repo)) return repoCache.get(repo);
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'vybify-ingest',
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) {
      repoCache.set(repo, null);
      return null;
    }
    const data = await res.json();
    const out = {
      description: data.description ?? null,
      stargazers_count: data.stargazers_count ?? null,
      topics: data.topics ?? [],
    };
    repoCache.set(repo, out);
    return out;
  } catch {
    repoCache.set(repo, null);
    return null;
  }
}

async function loadExisting() {
  const dirs = ['src/content/projects', 'src/content/skills'];
  const seenUrls = new Set();
  const seenGithubs = new Set();
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const f of await readdir(dir)) {
      if (!f.endsWith('.json')) continue;
      try {
        const d = JSON.parse(await readFile(join(dir, f), 'utf8'));
        if (d.url) seenUrls.add(d.url);
        if (d.github) seenGithubs.add(d.github.toLowerCase());
      } catch {}
    }
  }
  return { seenUrls, seenGithubs };
}

function deriveTags(owner, ghTopics) {
  const base = new Set(['claude-code', owner.toLowerCase()]);
  for (const t of (ghTopics ?? []).slice(0, 5)) base.add(t.toLowerCase());
  return [...base].slice(0, 6);
}

function deriveKind(owner, ghTopics) {
  const ts = (ghTopics ?? []).map((t) => t.toLowerCase());
  if (ts.some((t) => t.includes('mcp'))) return 'mcp-server';
  if (ts.some((t) => t.includes('cursor'))) return 'cursor-rule';
  return 'claude-code-skill';
}

function humanName(slug) {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  console.log('Fetching sitemap…');
  const allUrls = await fetchSitemap();

  const skillUrls = allUrls
    .map((u) => ({ url: u, parsed: parseSkillUrl(u) }))
    .filter((x) => x.parsed !== null);

  console.log(`Sitemap: ${allUrls.length} URLs, ${skillUrls.length} skill detail pages`);

  const top = skillUrls.slice(0, TOP_N);
  console.log(`Processing top ${top.length}.`);

  const { seenUrls } = await loadExisting();
  await mkdir('src/content/candidates/skills', { recursive: true });

  let added = 0;
  let skippedExisting = 0;
  let skippedFailed = 0;

  for (let i = 0; i < top.length; i++) {
    const { url, parsed } = top[i];
    const { owner, repo, skill } = parsed;

    if (seenUrls.has(url)) {
      skippedExisting++;
      continue;
    }

    const meta = await fetchSkillPage(url);
    if (!meta) {
      skippedFailed++;
      continue;
    }

    const ghRepo = await fetchRepo(`${owner}/${repo}`);
    const installsNum = parseInstallsLabel(meta.installsLabel);

    const name = humanName(skill);
    const tagline = (
      ghRepo?.description ??
      `Skill ${skill} from ${owner}/${repo}.`
    ).slice(0, 160);

    const entry = {
      name,
      tagline,
      url,
      github: `${owner}/${repo}`,
      author: owner,
      tags: deriveTags(owner, ghRepo?.topics),
      kind: deriveKind(owner, ghRepo?.topics),
      install: `npx skills add ${owner}/${repo} --skill ${skill}`,
      addedAt: new Date().toISOString().slice(0, 10),
    };

    // Stamp skills.sh popularity in tags if it's notably popular
    if (installsNum >= 100000) entry.featured = true;

    const fname = slug(`${owner}-${repo}-${skill}`);
    const file = `src/content/candidates/skills/${fname}.json`;
    await writeFile(file, JSON.stringify(entry, null, 2) + '\n');
    added++;

    if ((i + 1) % 25 === 0) {
      console.log(`  ${i + 1}/${top.length} processed (added ${added}, dup ${skippedExisting})`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Added ${added}, skipped ${skippedExisting} duplicates, ${skippedFailed} fetch failures.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
