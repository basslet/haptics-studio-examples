# Expectations

What is not yet proven, and what would prove it wrong.

| Expectation | What would prove it wrong |
| :--- | :--- |
| The **Report a vulnerability** button that `SECURITY.md` describes appears on the Security tab once the repository is public and the setting is on. | An account with no role in the repository opens the Security tab and sees no button. |
| The navigation block's links to Haptics Studio's Design & Integration and Architecture pages, and to the Haptics SDK's Getting Started and Documentation pages, open once each repository's documentation branch reaches its `main`. Until then they return 404, which the maintainers accepted. | After those merges, one of those four links in the block on `README.md` returns 404. |
| GitHub detects `LICENSE` as CC BY 4.0 on the default branch. | `gh api repos/basslet/haptics-studio-examples --jq .license.spdx_id` returns anything other than `CC-BY-4.0`. |
