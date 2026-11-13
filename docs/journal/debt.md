# Debt

Known problems that are not issues yet.

| What and where | What repays it |
| :--- | :--- |
| There is a single conduct contact. The Enforcement section of `CODE_OF_CONDUCT.md` names one maintainer, with no independent reviewer until a second is named. | Naming a second maintainer in that section. |
| The License section of `README.md` names "Haptics Studio Examples contributors" because the maintainer collective has no name yet. | Updating the copyright line when the name is settled. |
| The link check in `scripts/check_doc_links.js` skips a link whose target holds a raw space. Markdown shows no link for it, so it fails silently, and most paths here hold spaces. | A check that flags a raw space in a link target, or a Markdown parser in the check. |
| `node scripts/doc_nav.js --compare` runs only by hand, so a shared lint file in `scripts/` that differs from the other two copies is found only when someone runs it. | Running the compare daily in CI. |
| `CODE_OF_CONDUCT.md` uses the Contributor Covenant 1.4, whose file states no licence. The source repository's `LICENSE.md` is the Hippocratic License 3.0, and whether that covers the 1.4 text is not established. | Establishing which terms cover the 1.4 text, and following them. |
| The link check in `scripts/check_doc_links.js` reads Markdown links and backticked paths, not HTML attributes, so a wrong `src` or `srcset` path, such as the banner's `<picture>` in `README.md`, passes. | A check of HTML `src` and `srcset` paths in the shared lint, made in all three repositories. |
| The comment above the `--compare` code in `scripts/doc_nav.js` says `gh` must be signed in "while the repositories are private". They are public, and `gh` must be signed in regardless. The same line is in Haptics Studio's and the Haptics SDK's copies of the shared lint. | Rewording it to "gh must be signed in; the first copy it cannot read stops the run." in all three copies together. |
