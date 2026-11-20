# Contributing

Thanks for wanting to make the city better! 🌴

## Using this as your own portfolio

You don't need to contribute anything. Fork it or use it as a template, follow [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md), and ship it.

## Contributing back to the template

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`.
2. `npm install && npm run dev`.
3. Keep the template working **without any environment variables**. Database, email and admin must stay optional.
4. Keep personal content out of PRs. Use the placeholder persona in `src/config/site.ts`.
5. Before opening a PR, run:
   ```bash
   npm run typecheck
   npm run build
   ```
6. Describe what changed and add a screenshot or GIF for visual changes.

## Guidelines

- **Accessibility first:** every interactive element must work with a keyboard and respect `prefers-reduced-motion`.
- **No copyrighted game assets.** Logos, fonts, music, character art and screenshots from real games are not allowed. Draw it in SVG/CSS or generate it.
- **Performance:** prefer CSS/SVG over large images or 3D libraries, and lazy-load heavy client code.
- **Config over code:** if a user would want to change something, put it in `src/config/site.ts`.

## Ideas welcome

- More radio presets
- A 3D city mode with React Three Fiber (optional, lazy-loaded)
- i18n
- More map themes
