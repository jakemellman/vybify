#!/usr/bin/env node
/**
 * Backfill body content for skills whose .md files have empty bodies.
 * Fetches the GitHub README from raw.githubusercontent.com, sanitizes,
 * truncates to a reasonable length, and writes it as the body.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'src/content/skills';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FETCH_DELAY_MS = 100;
const MAX_BODY_LEN = 4500;

const README_PATHS = ['README.md', 'README.MD', 'Readme.md', 'readme.md'];

async function fetchReadme(repo) {
  for (const path of README_PATHS) {
    const url = `https://raw.githubusercontent.com/${repo}/HEAD/${path}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'vybify-backfill' } });
      if (!res.ok) continue;
      return await res.text();
    } catch {
      // try next
    }
  }
  return '';
}

/**
 * Strip leading badge/shield blocks — typically a sequence of HTML or
 * markdown image/link references at the very top of READMEs.
 */
function stripLeadingBadges(md) {
  const lines = md.split('\n');
  let i = 0;
  // Skip blank lines and lines that are only badge markup
  while (i < lines.length) {
    const l = lines[i].trim();
    if (
      l === '' ||
      /^!\[.*?\]\(.*?\)\s*$/.test(l) || // ![alt](url)
      /^\[!\[.*?\]\(.*?\)\]\(.*?\)\s*$/.test(l) || // [![alt](url)](url)
      /^<p[^>]*>\s*<\/p>\s*$/.test(l) || // <p></p>
      /^<div[^>]*>\s*$/.test(l) ||
      /^<\/div>\s*$/.test(l) ||
      /^<img[^>]*\/?>\s*$/.test(l) ||
      /^<a [^>]*>.*?<\/a>\s*$/.test(l)
    ) {
      i++;
    } else {
      break;
    }
  }
  return lines.slice(i).join('\n');
}

/**
 * Truncate at a sensible boundary (paragraph or heading) under maxLen.
 */
function truncateBody(md, maxLen) {
  if (md.length <= maxLen) return { body: md, truncated: false };

  const slice = md.slice(0, maxLen);
  const cuts = [
    slice.lastIndexOf('\n## '),
    slice.lastIndexOf('\n### '),
    slice.lastIndexOf('\n\n'),
  ].filter((i) => i > maxLen * 0.4);

  const cut = cuts.length ? Math.max(...cuts) : maxLen;
  return { body: slice.slice(0, cut).trimEnd(), truncated: true };
}

/**
 * MDX body sanitizer (same as ingest script).
 */
function sanitizeBody(body) {
  if (!body) return body;
  return body.replace(/<([^>]*)>/g, (match, inner) => {
    const trimmed = inner.trim();
    if (!trimmed || /^[\/\!\?]/.test(trimmed)) return match;
    if (/^[a-zA-Z][a-zA-Z0-9-]*([\s\/>]|$)/.test(trimmed)) return match;
    return `&lt;${inner}&gt;`;
  });
}

/**
 * Rewrite relative paths in markdown links and images to absolute GitHub URLs
 * so they don't 404 when rendered on vybify.com.
 */
function rewriteRelativeUrls(body, repo) {
  // ![alt](path) — image
  body = body.replace(/(!\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix, url, suffix) => {
    if (/^(https?:|data:|#|\/\/)/i.test(url)) return match;
    const cleaned = url.replace(/^\.?\//, '');
    return `${prefix}https://raw.githubusercontent.com/${repo}/HEAD/${cleaned}${suffix}`;
  });
  // [text](path) — link
  body = body.replace(/(\[[^\]]+\]\()([^)]+)(\))/g, (match, prefix, url, suffix) => {
    if (/^(https?:|mailto:|#|\/\/)/i.test(url)) return match;
    const cleaned = url.replace(/^\.?\//, '');
    return `${prefix}https://github.com/${repo}/blob/HEAD/${cleaned}${suffix}`;
  });
  return body;
}

function parseFile(content) {
  const m = content.match(/^(---\s*\n[\s\S]*?\n---\s*\n+)([\s\S]*)$/);
  if (!m) return null;
  return { frontmatter: m[1], body: m[2] };
}

function extractGithub(frontmatter) {
  const m = frontmatter.match(/^github:\s*(.+)$/m);
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, '');
}

function extractName(frontmatter) {
  const m = frontmatter.match(/^name:\s*(.+)$/m);
  if (!m) return 'Unknown';
  return m[1].trim().replace(/^["']|["']$/g, '');
}

async function main() {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));

  let processed = 0;
  let backfilled = 0;
  let skippedNonEmpty = 0;
  let skippedNoGithub = 0;
  let failed = 0;

  for (const f of files) {
    const filePath = join(dir, f);
    const content = await readFile(filePath, 'utf8');
    const parsed = parseFile(content);
    if (!parsed) continue;
    processed++;

    if (parsed.body.trim()) {
      skippedNonEmpty++;
      continue;
    }

    const github = extractGithub(parsed.frontmatter);
    const name = extractName(parsed.frontmatter);
    if (!github) {
      skippedNoGithub++;
      continue;
    }

    process.stdout.write(`[${name}] ${github}... `);
    const readme = await fetchReadme(github);
    if (!readme) {
      console.log('no README');
      failed++;
      await sleep(FETCH_DELAY_MS);
      continue;
    }

    let body = stripLeadingBadges(readme).trim();
    body = rewriteRelativeUrls(body, github);
    const { body: truncated, truncated: wasTruncated } = truncateBody(body, MAX_BODY_LEN);
    body = sanitizeBody(truncated);
    if (wasTruncated) {
      body += `\n\n[Read the full README on GitHub →](https://github.com/${github})`;
    }

    await writeFile(filePath, parsed.frontmatter + body + '\n');
    console.log(`${body.length} chars`);
    backfilled++;
    await sleep(FETCH_DELAY_MS);
  }

  console.log(`\nDone. Processed ${processed}. Backfilled ${backfilled}. Skipped ${skippedNonEmpty} (already had body), ${skippedNoGithub} (no github field). Failed ${failed}.`);
}

main().catch((err) => {
  console.error('[backfill] fatal:', err);
  process.exit(1);
});
