# AGRO SATHI project structure

This project is a **plain Vite + React JSX application**. The goal is to keep the code easy to find for someone who is learning the project or needs to explain it.

## Top-level folders

| Folder                   | What belongs here                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `client/`                | Everything Vite serves to the browser. This is the frontend application.                                                                                                                               |
| `client/public/`         | Small static browser files such as a favicon or `robots.txt`. Large images should not be copied here.                                                                                                  |
| `client/src/`            | The React source code: app entrypoint, pages, shared data, and styles.                                                                                                                                 |
| `client/src/pages/`      | Full-screen website pages. `Home.jsx` contains the route-aware public pages; `NotFound.jsx` is the fallback page.                                                                                      |
| `client/src/components/` | Reusable interface pieces. The current visual components live in `Home.jsx` so the demo is easy to read; this folder is the natural place to move a component when it becomes shared by several pages. |
| `client/src/data/`       | Shared crop, weather, or advisory data when those lists grow beyond one page.                                                                                                                          |
| `client/src/styles/`     | Optional page-specific CSS. The current global design system stays in `client/src/index.css`.                                                                                                          |
| `docs/`                  | Explanations and project notes for people working on the codebase.                                                                                                                                     |
| `patches/`               | Package patches kept by the dependency manager.                                                                                                                                                        |
| `dist/`                  | Generated production output. It is created by `pnpm build` and is intentionally ignored by Git.                                                                                                        |
| `node_modules/`          | Installed packages. It is created by `pnpm install` and is intentionally ignored by Git.                                                                                                               |

## Important files

| File                            | Purpose                                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client/index.html`             | The single HTML shell Vite serves. It contains the app root and font metadata.                                                                     |
| `client/src/main.jsx`           | The browser entrypoint. It finds `#root`, imports the global CSS, and mounts React.                                                                |
| `client/src/App.jsx`            | The small route table. It maps `/`, `/detect`, `/guides`, `/weather`, `/advisory`, and `/about` to the main page controller.                       |
| `client/src/pages/Home.jsx`     | The main readable page module. It contains the header, footer, crop data, and the page sections. URL-based page selection happens near the bottom. |
| `client/src/pages/NotFound.jsx` | A simple fallback when a visitor opens an unknown URL.                                                                                             |
| `client/src/index.css`          | The design system: colors, typography, layout classes, responsive breakpoints, and animations.                                                     |
| `vite.config.js`                | Vite configuration. It defines React and Tailwind plugins, the `@` source alias, and the `client/` project root.                                   |
| `package.json`                  | Project metadata, the short Vite scripts, and the runtime dependencies.                                                                            |
| `pnpm-lock.yaml`                | Exact dependency versions installed by pnpm. Commit this file so installs remain repeatable.                                                       |
| `README.md`                     | Quick-start instructions for installing, running, checking, and building the project.                                                              |

## How a page is rendered

1. `client/index.html` provides `<div id="root"></div>`.
2. `client/src/main.jsx` mounts `<App />` into that element.
3. `client/src/App.jsx` uses Wouter to match the browser path.
4. `client/src/pages/Home.jsx` reads the matched path and chooses the correct page section.
5. `client/src/index.css` supplies the shared visual language and responsive behavior.

## Local commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

The project intentionally uses `.jsx`, `.js`, and `.css` source files instead of TypeScript. This makes the current code easier to copy, explain, and customize in a standard Vite React workflow.
