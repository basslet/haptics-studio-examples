# Expectations

What is not yet proven, and what would prove it wrong.

| Expectation | What would prove it wrong |
| :--- | :--- |
| The Docs workflow (`.github/workflows/docs.yml`) passes on a pull request from a fork, as it does on a pull request from a branch here and on a push to `main`. | The first run on a pull request from a fork fails at checkout or at the step that checks the documentation links. |
| The banner at the top of `README.md` shows `assets/logo-dark.png` in GitHub's dark theme and `assets/logo-light.png` in the light theme, 800 pixels wide. GitHub's renderer keeps the `<picture>` element, but nobody has looked at it in either theme yet. | On the repository page, dark mode shows the light artwork or no image, light mode shows the dark artwork or no image, or the banner is not 800 pixels wide. |
