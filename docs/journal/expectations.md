# Expectations

What is not yet proven, and what would prove it wrong.

| Expectation | What would prove it wrong |
| :--- | :--- |
| The **Report a vulnerability** button that `SECURITY.md` describes appears on the Security tab once the repository is public and the setting is on. | An account with no role in the repository opens the Security tab and sees no button. |
| The navigation block's links to Haptics Studio's Design & Integration, Source Code and Architecture pages, and to the Haptics SDK's Getting Started and Documentation pages, open once each repository's documentation branch reaches its `main`; the SDK's two pages also wait for basslet/haptics-sdk#24. So do the links from `1 Design Guidelines/README.md` to Haptics Studio's Haptics Guidelines and Resources pages. Until then they return 404, which the maintainers accepted. | After those merges, one of those five links in the block on `README.md`, or one of the two on `1 Design Guidelines/README.md`, returns 404. |
| The Docs workflow (`.github/workflows/docs.yml`) passes on a push to `main` and on a pull request from a fork, as it does on a pull request from a branch here. | The first run on `main` after a merge, or the first run on a pull request from a fork, fails at checkout or at the step that reads the repository's name. |
| GitHub detects `LICENSE` as CC BY 4.0 on the default branch. | `gh api repos/basslet/haptics-studio-examples --jq .license.spdx_id` returns anything other than `CC-BY-4.0`. |
