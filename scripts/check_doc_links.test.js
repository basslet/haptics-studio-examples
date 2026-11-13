// Run with: node --test scripts/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const script = path.join(__dirname, 'check_doc_links.js');
const { navBlock } = require('./doc_nav');

// Builds a throwaway git repo from { 'path': 'content' }, runs the lint on it with args, and returns the files as they end.
const lint = (files, ...args) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doclinks-'));
  for (const [f, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), content);
  }
  const env = { ...process.env, HOME: dir }; // no global git config
  execFileSync('git', ['init', '-q'], { cwd: dir, env });
  execFileSync('git', ['add', '-A'], { cwd: dir, env });
  execFileSync('git', ['remote', 'add', 'origin', 'https://github.com/basslet/haptics-studio.git'], { cwd: dir, env });
  const r = spawnSync('node', [script, dir, ...args], { encoding: 'utf8', env: { ...process.env, HOME: dir, DOCS_REPO: '' } });
  r.files = Object.fromEntries(Object.keys(files).map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));
  fs.rmSync(dir, { recursive: true, force: true });
  return r;
};

// A page as the generator writes it.
const page = (f, body) => `${navBlock(f, 'haptics-studio')}\n\n${body}\n`;
// Every page the navigation block links in this repository, so its links resolve.
const site = Object.fromEntries(
  ['README.md', 'docs/design-and-integration/README.md', 'docs/building.md', 'docs/architecture.md', 'CODE_OF_CONDUCT.md', 'CONTRIBUTING.md', 'SECURITY.md'].map(
    (f) => [f, page(f, '# Page')],
  ),
);
const ok = { ...site, LICENSE: 'MIT', 'companion/ios/a.txt': 'x' };

test('passes when links and paths exist', () => {
  const r = lint({ ...ok, 'README.md': page('README.md', 'See [ios](companion/ios/a.txt) and `companion/ios/`.') });
  assert.strictEqual(r.status, 0, r.stderr);
});

test('fails on a missing backticked path', () => {
  const r = lint({ ...ok, 'README.md': 'See `companion/mobile/`.' });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /README\.md:1: no such path companion\/mobile\//);
});

test('fails on a broken relative link and ignores URLs and anchors', () => {
  const r = lint({ ...ok, 'README.md': '[a](https://x.io/nope) [b](#top) [c](missing.md)' });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /broken link missing\.md/);
  assert.doesNotMatch(r.stderr, /x\.io|#top/);
});

test('in source files only comment lines are checked', () => {
  const code = 'const p = `companion/gone/`;\n// see `companion/gone/`\n';
  const r = lint({ ...ok, 'src/a.ts': code });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /src\/a\.ts:2:/);
  assert.doesNotMatch(r.stderr, /src\/a\.ts:1:/);
});

test('names the line for a malformed percent-escape instead of crashing', () => {
  const r = lint({ ...ok, 'README.md': '[a](100%.md)' });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /README\.md:1: broken link 100%\.md/);
  assert.doesNotMatch(r.stderr, /URIError/);
});

test('ignores backticked text that does not start at a repo directory', () => {
  const r = lint({ ...ok, 'README.md': page('README.md', 'Send `application/json` and `text/plain`.') });
  assert.strictEqual(r.status, 0, r.stderr);
});

test('navigation block: a good page passes; a missing block, a wrong marker and a leftover bottom line fail', () => {
  const r = lint({
    ...ok,
    'docs/building.md': page('docs/building.md', '# Building\n\n[a](architecture.md) · [b](design-and-integration/README.md)\n\nEnd.'),
    'main/README.md': '# Main',
    'docs/architecture.md': page('docs/building.md', '# Architecture'),
    'SECURITY.md': page('SECURITY.md', '# Security\n\n[Getting Started](README.md) · [Architecture](docs/architecture.md)'),
    'CONTRIBUTING.md': page('CONTRIBUTING.md', `# Contributing\n\n${navBlock('CONTRIBUTING.md', 'haptics-studio')}`),
    'AGENTS.md': '# Agents',
    'docs/journal/STATUS.md': '# Status',
  });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /^main\/README\.md:1: no navigation block at the top/m);
  assert.match(r.stderr, /^docs\/architecture\.md:1: navigation block differs from the generated one/m);
  assert.match(r.stderr, /^SECURITY\.md:10: leftover navigation line/m);
  assert.match(r.stderr, /^CONTRIBUTING\.md:10: second navigation block/m);
  assert.doesNotMatch(r.stderr, /building|AGENTS|journal|broken link/);
});

test('--fix replaces the block at the top, drops old navigation and keeps the body', () => {
  const old = '[Getting Started](../README.md) · [Architecture](architecture.md)';
  const body = '# Building\n\n| | |\n| --- | --- |\n| Key | Value |\n\n[a](architecture.md) · [b](design-and-integration/README.md)\n\nText.';
  const r = lint(
    {
      ...ok,
      'docs/building.md': `${old}\n\n${body}\n\n${old}\n\n`,
      'docs/architecture.md': page('README.md', '# Architecture').replace(/\n/g, '\r\n'), // a stale block, CRLF
    },
    '--fix',
  );
  assert.strictEqual(r.status, 0, r.stderr);
  assert.strictEqual(r.files['docs/building.md'], page('docs/building.md', body));
  assert.strictEqual(r.files['docs/architecture.md'], page('docs/architecture.md', '# Architecture'));
});

test('--fix never deletes a second copy of the block; the lint asks for its removal by hand', () => {
  const twice = page('docs/building.md', `# Building\n\n${navBlock('docs/building.md', 'haptics-studio')}`);
  const r = lint({ ...ok, 'docs/building.md': twice }, '--fix');
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /^docs\/building\.md:10: second navigation block; remove it by hand$/m);
  assert.strictEqual(r.files['docs/building.md'], twice);
});

test('stops with one line when the origin is not one of the three repositories', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doclinks-'));
  const env = { ...process.env, HOME: dir, DOCS_REPO: '' }; // unset: the origin decides
  execFileSync('git', ['init', '-q'], { cwd: dir, env });
  const run = () => spawnSync('node', [script, dir], { encoding: 'utf8', env });
  const none = run();
  execFileSync('git', ['remote', 'add', 'origin', 'git@github.com:someone/Haptics-SDK.git'], { cwd: dir, env });
  const ssh = run();
  execFileSync('git', ['remote', 'set-url', 'origin', 'https://user:SE/C@RET@example.com/fork.git'], { cwd: dir, env });
  const fork = run();
  fs.rmSync(dir, { recursive: true, force: true });
  assert.strictEqual(none.status, 1);
  assert.strictEqual(none.stderr, 'origin "none" is not haptics-studio, haptics-sdk or haptics-studio-examples; set DOCS_REPO to the one this clone is\n');
  assert.strictEqual(ssh.status, 0, ssh.stderr);
  assert.strictEqual(fork.status, 1);
  assert.match(fork.stderr, /^origin "https:\/\/example\.com\/fork\.git" is not /, 'credentials in the origin are not printed');
  assert.doesNotMatch(fork.stderr, /SE|RET/);
});

test('DOCS_REPO names the repository of a fork under another name, and only then', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doclinks-'));
  const env = { ...process.env, HOME: dir };
  execFileSync('git', ['init', '-q'], { cwd: dir, env });
  execFileSync('git', ['remote', 'add', 'origin', 'https://github.com/someone/my-studio.git'], { cwd: dir, env });
  const run = (repo) => spawnSync('node', [script, dir], { encoding: 'utf8', env: { ...env, DOCS_REPO: repo } });
  const named = run('Haptics-Studio');
  const wrong = run('my-studio');
  for (const [f, content] of Object.entries({ ...ok, 'README.md': page('README.md', 'Body.') })) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), content);
  }
  execFileSync('git', ['add', '-A'], { cwd: dir, env });
  execFileSync('git', ['remote', 'set-url', 'origin', 'https://github.com/basslet/haptics-studio.git'], { cwd: dir, env });
  const leftover = run('haptics-sdk');
  fs.rmSync(dir, { recursive: true, force: true });
  assert.strictEqual(named.status, 0, named.stderr);
  assert.strictEqual(wrong.status, 1);
  assert.match(wrong.stderr, /^DOCS_REPO "my-studio" is not haptics-studio, /);
  // Studio's block passes; with DOCS_REPO winning, the page would get the SDK's block and fail.
  assert.strictEqual(leftover.status, 0, `an origin that names the repository wins over DOCS_REPO: ${leftover.stderr}`);
});

test('stops with one line outside a git work tree, even with DOCS_REPO set', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doclinks-'));
  const r = spawnSync('node', [script, dir], { encoding: 'utf8', env: { ...process.env, HOME: dir, DOCS_REPO: 'haptics-studio' } });
  fs.rmSync(dir, { recursive: true, force: true });
  assert.strictEqual(r.status, 1);
  assert.strictEqual(r.stderr, `${dir} is not a git work tree; run the lint in a clone\n`);
});
