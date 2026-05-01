#!/usr/bin/env node
/**
 * One-time migration: convert every src/content/skills/*.json into *.md.
 *
 * For entries that came from skills.sh (url starts with https://skills.sh/),
 * fetch the actual SKILL.md content from raw.githubusercontent.com and use
 * its body (markdown after frontmatter) as the MDX body.
 *
 * For seed entries (no skills.sh URL or no github), MDX body is left empty —
 * detail page will still render frontmatter just like before.
 */
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'src/content/skills';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FETCH_DELAY_MS = 80;

const TOKEN = process.env.GITHUB_TOKEN;

function escapeYaml(value) {
  if (typeof value !== 'string') return JSON.stringify(value);
  // Quote strings that contain YAML-significant chars
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
        for (const item of value) {
          lines.push(`  - ${escapeYaml(item)}`);
        }
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${escapeYaml(String(value))}`);
    }
  }
  return lines.join('\n');
}

function parseSkillsShUrl(url) {
  if (!url || !url.startsWith('https://skills.sh/')) return null;
  const parts = url.replace('https://skills.sh/', '').split('/').filter(Boolean);
  if (parts.length !== 3) return null;
  return { owner: parts[0], repo: parts[1], skill: parts[2] };
}

async function fetchRepoDefaultBranch(repo) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'vybify-migrate',
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) return 'main';
    const data = await res.json();
    return data.default_branch || 'main';
  } catch {
    return 'main';
  }
}

const branchCache = new Map();
async function getBranch(repo) {
  if (!branchCache.has(repo)) {
    branchCache.set(repo, await fetchRepoDefaultBranch(repo));
  }
  return branchCache.get(repo);
}

async function fetchSkillBody(owner, repo, skill, branch) {
  const candidatePaths = [
    `${skill}/SKILL.md`,
    `skills/${skill}/SKILL.md`,
    `agent-skills/${skill}/SKILL.md`,
    `SKILL.md`,
  ];

  for (const path of candidatePaths) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'vybify-migrate' } });
      if (!res.ok) continue;
      const md = await res.text();
      // Strip YAML frontmatter — we already have those fields
      const stripped = md.replace(/^---\s*\n[\s\S]*?\n---\s*\n+/, '');
      return stripped.trim();
    } catch {
      // try next path
    }
  }
  return '';
}

/**
 * Sanitize MDX body: MDX is stricter than markdown about what looks like JSX.
 * Bare `<word>` patterns (e.g., `<your-name>`) get parsed as JSX tags and break.
 * Convert any `<...>` that isn't an HTML tag pattern into escaped form.
 */
function sanitizeMdxBody(body) {
  if (!body) return body;
  // Escape bare angle brackets that look like JSX/HTML but aren't valid
  // Don't escape valid HTML tags like <div>, <a href="...">, etc.
  // Heuristic: escape <something> where "something" contains chars that
  // aren't valid in an HTML tag name.
  return body.replace(
    /<([^>]*)>/g,
    (match, inner) => {
      const trimmed = inner.trim();
      // Empty or starts with /, !, ? -> probably valid HTML, leave alone
      if (!trimmed || /^[\/\!\?]/.test(trimmed)) return match;
      // Valid identifier start (HTML tag) -> leave alone
      if (/^[a-zA-Z][a-zA-Z0-9-]*([\s\/>]|$)/.test(trimmed)) return match;
      // Otherwise escape both brackets
      return `&lt;${inner}&gt;`;
    },
  );
}

async function main() {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  console.log(`Migrating ${files.length} JSON skill files to MDX...`);

  let withBody = 0;
  let withoutBody = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const path = join(dir, f);
    const data = JSON.parse(await readFile(path, 'utf8'));

    let body = '';
    const skillsShRef = parseSkillsShUrl(data.url);
    if (skillsShRef && data.github) {
      const branch = await getBranch(data.github);
      body = await fetchSkillBody(skillsShRef.owner, skillsShRef.repo, skillsShRef.skill, branch);
      await sleep(FETCH_DELAY_MS);
    }

    const fm = buildFrontmatter(data);
    const sanitizedBody = sanitizeMdxBody(body);
    const mdxContent = `---\n${fm}\n---\n\n${sanitizedBody || ''}\n`;

    const mdxPath = path.replace(/\.json$/, '.md');
    await writeFile(mdxPath, mdxContent);
    await unlink(path);

    if (body) withBody++;
    else withoutBody++;

    if ((i + 1) % 25 === 0) {
      console.log(`  ${i + 1}/${files.length} (with body: ${withBody}, without: ${withoutBody})`);
    }
  }

  console.log(`\nDone. Migrated ${files.length} files. With body: ${withBody}, without: ${withoutBody}.`);
}

main().catch((err) => {
  console.error('[migrate] fatal:', err);
  process.exit(1);
});
