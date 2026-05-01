#!/usr/bin/env node
/**
 * Convert each src/content/projects/*.json to *.md with YAML frontmatter
 * and an empty body. Body is the future home of the build-story content.
 */
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'src/content/projects';

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

async function main() {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  console.log(`Migrating ${files.length} project JSON files...`);

  for (const f of files) {
    const path = join(dir, f);
    const data = JSON.parse(await readFile(path, 'utf8'));
    const fm = buildFrontmatter(data);
    const mdPath = path.replace(/\.json$/, '.md');
    await writeFile(mdPath, `---\n${fm}\n---\n`);
    await unlink(path);
  }

  console.log(`Done. Migrated ${files.length} files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
