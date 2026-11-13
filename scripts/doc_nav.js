// doc_nav.js: the navigation block every documentation page of the three Haptics repositories starts with
// (layout C of basslet/haptics-studio#32). The SHARED files below are the same in basslet/haptics-studio,
// basslet/haptics-sdk and basslet/haptics-studio-examples: change them in one, copy them to the other two, then run
// `node scripts/doc_nav.js --compare`, which names every repository whose copy on main differs.
// An entry is listed once its page exists on its repository's working branch; until that reaches main, links to it
// from the other repositories 404 (accepted by the maintainers on basslet/haptics-studio#32).
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path').posix;

const REPOS = ['haptics-studio', 'haptics-sdk', 'haptics-studio-examples'];
const SHARED = ['doc_nav.js', 'doc_nav.test.js', 'check_doc_links.js', 'check_doc_links.test.js'];

// [group, repository (null: the page's own), [[label, path from that repository's root]]].
const NAV = [
  [
    'Haptics Studio',
    'haptics-studio',
    [
      ['Overview', 'README.md'],
      ['Design & Integration', 'docs/design-and-integration/README.md'],
      ['Source Code', 'docs/building.md'],
      ['Architecture', 'docs/architecture.md'],
    ],
  ],
  [
    'Haptics SDK',
    'haptics-sdk',
    [
      ['Overview', 'README.md'],
      ['Getting Started', 'docs/getting-started.md'],
      ['Documentation', 'docs/README.md'],
    ],
  ],
  [
    'Haptics Studio Examples',
    'haptics-studio-examples',
    [
      ['Overview', 'README.md'],
      ['Guidelines', '1 Design Guidelines/README.md'],
      ['Examples', '2 Design Examples/README.md'],
      ['Code', '3 Integration & Code Snippets/README.md'],
      ['Knowledge', '4 Knowledge Base/README.md'],
      ['Skills', '5 Skills/README.md'],
    ],
  ],
  [
    'General',
    null,
    [
      ['Code of Conduct', 'CODE_OF_CONDUCT.md'],
      ['Contributing', 'CONTRIBUTING.md'],
      ['License', 'LICENSE'],
      ['Security', 'SECURITY.md'],
    ],
  ],
];

const encode = (p) => p.split('/').map(encodeURIComponent).join('/');

// The block for `page`, a path from the root of `repo`. The page's own entry, or else that of the nearest section
// README above it with one, is bold, marked ▸ and not a link; the root README marks only itself, so a page outside
// every section marks nothing. Links within `repo` are relative to the page; links into another repository go to its
// main branch, and to its root for its README.
const navBlock = (page, repo) => {
  if (!REPOS.includes(repo)) throw new Error(`unknown repository ${repo}`);
  const own = NAV.flatMap(([, r, entries]) => ((r ?? repo) === repo ? entries.map(([, p]) => p) : []));
  const ancestors = [page];
  for (let dir = path.dirname(page); dir !== '.'; dir = path.dirname(dir)) ancestors.push(path.join(dir, 'README.md'));
  const here = ancestors.find((p) => own.includes(p));
  const rows = NAV.map(([group, r, entries]) => {
    const target = r ?? repo;
    const entry = ([label, p]) => {
      if (target !== repo) return `[${label}](https://github.com/basslet/${target}${p === 'README.md' ? '' : `/blob/main/${encode(p)}`})`;
      return p === here ? `**▸ ${label}**` : `[${label}](${encode(path.relative(path.dirname(page), p))})`;
    };
    return `| **${group}** | ${entries.map(entry).join(' · ')} |`;
  });
  return ['| | |', '| :--- | :--- |', ...rows].join('\n');
};

// --compare: gh must be signed in while the repositories are private; the first copy it cannot read stops the run.
if (require.main === module) {
  if (process.argv[2] !== '--compare') throw new Error('usage: node scripts/doc_nav.js --compare');
  const mine = (f) => fs.readFileSync(`${__dirname}/${f}`, 'utf8').replace(/\r\n/g, '\n');
  const theirs = (repo, f) => {
    try {
      return execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', `repos/basslet/${repo}/contents/scripts/${f}`], { encoding: 'utf8', stdio: 'pipe' });
    } catch (e) {
      console.error(`${repo}: scripts/${f} on main cannot be read: ${String(e.stderr || e.message).trim().split('\n')[0]}`);
      process.exit(1);
    }
  };
  const differs = REPOS.flatMap((repo) => SHARED.filter((f) => theirs(repo, f) !== mine(f)).map((f) => `${repo}: scripts/${f} on main differs`));
  if (differs.length) console.error(differs.join('\n'));
  process.exit(differs.length ? 1 : 0);
}

module.exports = { navBlock, REPOS };
