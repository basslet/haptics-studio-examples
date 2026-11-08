# Expectations

What is not yet proven, and what would prove it wrong.

| Expectation | What would prove it wrong |
| :--- | :--- |
| The **Report a vulnerability** button that `SECURITY.md` describes appears on the Security tab once the repository is public and the setting is on. | An account with no role in the repository opens the Security tab and sees no button. |
| GitHub detects `LICENSE` as CC BY 4.0 on the default branch. | `gh api repos/basslet/haptics-studio-examples --jq .license.spdx_id` returns anything other than `CC-BY-4.0`. |
