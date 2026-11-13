| | |
| :--- | :--- |
| **Haptics Studio** | [Overview](https://github.com/basslet/haptics-studio) · [Design & Integration](https://github.com/basslet/haptics-studio/blob/main/docs/design-and-integration/README.md) · [Source Code](https://github.com/basslet/haptics-studio/blob/main/docs/building.md) · [Architecture](https://github.com/basslet/haptics-studio/blob/main/docs/architecture.md) |
| **Haptics SDK** | [Overview](https://github.com/basslet/haptics-sdk) · [Getting Started](https://github.com/basslet/haptics-sdk/blob/main/docs/getting-started.md) · [Documentation](https://github.com/basslet/haptics-sdk/blob/main/docs/README.md) |
| **Haptics Studio Examples** | [Overview](README.md) · [Guidelines](1%20Design%20Guidelines/README.md) · [Examples](2%20Design%20Examples/README.md) · [Code](3%20Integration%20%26%20Code%20Snippets/README.md) · [Knowledge](4%20Knowledge%20Base/README.md) · [Skills](5%20Skills/README.md) |
| **General** | [Code of Conduct](CODE_OF_CONDUCT.md) · **▸ Contributing** · [License](LICENSE) · [Security](SECURITY.md) |

# Contributing

Haptics Studio Examples is run by volunteers, so answers and reviews come when someone has time.

## Suggesting a Change

Fork the repository, work on a branch made from `main`, and open a pull request against `main`. For anything larger than a small fix, open an issue first, so the approach is agreed before you write it.

Every page starts with the navigation block. Before you open the pull request, run `node scripts/check_doc_links.js`: it checks the block and every link within the repository, and with `--fix` it writes the block on a page you added. The same check runs on the pull request. In a fork under another name, or a clone without an origin, set the environment variable `DOCS_REPO` to `haptics-studio-examples` before you run it; a correct origin still takes precedence.

## What Can Be Added

Everything here except the Code of Conduct, which keeps its own attribution, is released under CC BY 4.0. So only add what you made yourself, what its owner allows to be released that way, or what is released under CC0. Audio, images, code and text taken from a product or a game usually do not qualify, even when they are easy to download. Ask a maintainer in an issue before adding anything under another license, such as MIT or CC BY-SA.

Each folder that holds sample files has a **Sources** table in its README. Add a row for every file you add, with its source, author and licence.

## Reporting a Problem

Open an issue that says what you did, what you expected and what happened, and which version of the tools you used on which operating system.

A security problem does not belong in an issue. See [SECURITY.md](SECURITY.md).

## How Maintainers Work

These are the rules the maintainers follow, so you know what happens to your issue or pull request.

### Issues

- A maintainer reads each new issue, labels it, and either asks for what is missing, accepts it, or closes it with a reason.
- A question that is answered, or a request that does not fit the project, is closed with a short explanation and a pointer where one helps.
- An issue that waits on its author for 30 days is closed. Reopening it with the missing details is always welcome.

### Pull Requests

- Every change reaches `main` through a pull request. Nobody pushes to `main` directly, maintainers included.
- A pull request is merged when its checks pass, it does what its issue asks (for a small fix, what its description says), and a maintainer has read the whole diff.
- For a contributor outside the project, a maintainer starts the checks by hand after reading the changes.
- A maintainer reads any change to `.github/workflows/` or `scripts/` line by line, because these run on the project's infrastructure.
- Review comments say what must change and why. A pull request that waits on its author for 30 days is closed, and can be reopened.
- Pull requests are squash-merged by default: one commit on `main` per pull request. Its message starts as the pull request's title and description, so write the description as the record of the change.
- A change that is bigger than its issue, or that mixes unrelated work, is split before it is merged.

### Security Reports

- Reports go through the private channel in [SECURITY.md](SECURITY.md).
- A maintainer confirms receipt and checks whether the report is a vulnerability in this project. A confirmed one is fixed in private and published as a security advisory together with the fix; any other report is closed with the reason.

### Code of Conduct Reports

- Reports go to the contact in the [Code of Conduct](CODE_OF_CONDUCT.md).
- A maintainer does not discuss a report in public and does not handle a report about themselves. Until a second maintainer is named, a report about the maintainer has no independent reviewer, as the Code of Conduct says.

### Becoming a Maintainer

The project is looking for maintainers. Contributors whose pull requests have been merged and who review others' work may be invited. A maintainer can merge, label and close issues, and follows the rules on this page.

## License

Your contribution is released under the project's [CC BY 4.0 license](LICENSE). There is no contributor agreement to sign.

## Code of Conduct

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).
