# Decisions

Decisions in force, and why.

| Decision | Why |
| :--- | :--- |
| The project is under CC BY 4.0, and only material that can be released under it is added, apart from the Code of Conduct, which keeps its own attribution. Nothing here comes from another company's samples, guidelines or templates. | The project is mainly knowledge and media, and its code teaches rather than ships as software, so anyone can use it with credit. Haptics Studio and the Haptics SDK stay under MIT because they are software. |
| Every sample file records its source, author and licence in its folder's README. | The right to release a file can be checked without asking who added it. |
| The repository stays private until a maintainer has reviewed all content. | Publishing cannot be undone, so the review comes first. |
| No contributor agreement. | Contributions are released under `LICENSE`, which keeps contributing simple. |
| Every page a reader opens starts with one navigation block for the whole suite, which `scripts/doc_nav.js` generates. The documentation lint (`scripts/doc_nav.js`, `scripts/check_doc_links.js` and their tests) is the same in Haptics Studio, the Haptics SDK and this repository, and reads the repository's name from its git remote: a change is made in one and copied to the other two. `AGENTS.md` and `docs/journal/` have no block. | A reader sees the three repositories as one suite, and where they are in it. One set of files keeps the three blocks the same. |
| Design guidance for one platform, longer guides and worked examples live in `1 Design Guidelines`. Guidance that applies on every platform lives on one page in Haptics Studio, Haptics Guidelines, under Design & Integration. Haptics Studio's Resources page, also under Design & Integration, is the one list of outside documentation for the three repositories; this repository links to it. | Each piece of guidance is written once, so the three repositories cannot drift apart. |
