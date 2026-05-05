#!/usr/bin/env node
/**
 * Pull skills from skills.sh sitemap (top N by popularity) and write
 * candidate JSON entries to src/content/candidates/skills/ for review.
 */
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const TOP_N = 500;
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
  return { owner: decodeURIComponent(parts[0]), repo: decodeURIComponent(parts[1]), skill: decodeURIComponent(parts[2]) };
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
      defaultBranch: data.default_branch ?? 'main',
    };
    repoCache.set(repo, out);
    return out;
  } catch {
    repoCache.set(repo, null);
    return null;
  }
}

/**
 * Try common SKILL.md locations in a repo and return both the parsed
 * frontmatter description and the markdown body (for MDX content).
 */
async function fetchSkillContent(owner, repo, skill, branch) {
  const candidatePaths = [
    `${skill}/SKILL.md`,
    `skills/${skill}/SKILL.md`,
    `agent-skills/${skill}/SKILL.md`,
    `SKILL.md`,
  ];

  for (const path of candidatePaths) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'vybify-ingest' } });
      if (!res.ok) continue;
      const md = await res.text();
      const fm = parseFrontmatter(md);
      const body = md.replace(/^---\s*\n[\s\S]*?\n---\s*\n+/, '').trim();
      return {
        description: fm?.description?.trim() ?? null,
        body,
      };
    } catch {
      // try next
    }
  }
  return { description: null, body: '' };
}

function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return null;
  const out = {};
  let currentKey = null;
  let multilineBuffer = [];
  for (const rawLine of m[1].split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) {
      // Flush previous multiline value
      if (currentKey !== null && multilineBuffer.length) {
        out[currentKey] = multilineBuffer.join(' ').trim();
        multilineBuffer = [];
      }
      const [, key, valRaw] = kv;
      const val = valRaw.trim().replace(/^["']|["']$/g, '');
      if (val === '' || val === '|' || val === '>') {
        currentKey = key;
      } else {
        out[key] = val;
        currentKey = null;
      }
    } else if (currentKey !== null && line.trim()) {
      multilineBuffer.push(line.trim());
    }
  }
  if (currentKey !== null && multilineBuffer.length) {
    out[currentKey] = multilineBuffer.join(' ').trim();
  }
  return out;
}

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const urlMatch = yaml.match(/^url:\s*['"]?([^\s'"#]+)/m);
  const ghMatch = yaml.match(/^github:\s*['"]?([^\s'"#]+)/m);
  return { url: urlMatch?.[1], github: ghMatch?.[1] };
}

async function loadExisting() {
  const dirs = ['src/content/projects', 'src/content/skills', 'src/content/candidates/skills'];
  const seenUrls = new Set();
  const seenGithubs = new Set();
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const f of await readdir(dir)) {
      try {
        const raw = await readFile(join(dir, f), 'utf8');
        let d;
        if (f.endsWith('.json')) {
          d = JSON.parse(raw);
        } else if (f.endsWith('.md') || f.endsWith('.mdx')) {
          d = parseYamlFrontmatter(raw);
        } else {
          continue;
        }
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

function escapeYaml(value) {
  if (typeof value !== 'string') return JSON.stringify(value);
  if (/[:#&*!|>'"%@`,{}[\]?\-]/.test(value) || /^\s|\s$/.test(value) || /^(true|false|null|yes|no)$/i.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function buildFrontmatter(data) {
  const lines = [];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of value) lines.push(`  - ${escapeYaml(item)}`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${escapeYaml(String(value))}`);
    }
  }
  return lines.join('\n');
}

function sanitizeMdxBody(body) {
  if (!body) return body;
  return body.replace(/<([^>]*)>/g, (match, inner) => {
    const trimmed = inner.trim();
    if (!trimmed || /^[\/\!\?]/.test(trimmed)) return match;
    if (/^[a-zA-Z][a-zA-Z0-9-]*([\s\/>]|$)/.test(trimmed)) return match;
    return `&lt;${inner}&gt;`;
  });
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

    const skillContent = await fetchSkillContent(
      owner,
      repo,
      skill,
      ghRepo?.defaultBranch ?? 'main',
    );

    const name = humanName(skill);
    const tagline = (
      skillContent.description ??
      ghRepo?.description ??
      `Skill ${skill} from ${owner}/${repo}.`
    )
      .replace(/\s+/g, ' ')
      .slice(0, 160);

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

    if (installsNum >= 100000) entry.featured = true;

    const fname = slug(`${owner}-${repo}-${skill}`);
    const file = `src/content/candidates/skills/${fname}.md`;
    const fm = buildFrontmatter(entry);
    const sanitizedBody = sanitizeMdxBody(skillContent.body);
    const mdxContent = `---\n${fm}\n---\n\n${sanitizedBody || ''}\n`;
    await writeFile(file, mdxContent);
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
