# AGRO SATHI — Farmer Advisory

AGRO SATHI is a farmer-first **Vite + React JSX** website for crop photo checks, crop guides, weather context, and practical agricultural advisories.

The code intentionally uses plain `.jsx` and `.js` files instead of TypeScript so it is easy to read, explain, and customize.

## Features

- Responsive home page with crop watch and field-weather preview
- Camera/gallery crop scan flow with image preview and a simulated first-check result
- Crop guides for chilli, tomato, cotton, and wheat
- Five-day weather desk with India Meteorological Department context link
- Advisory desk with Integrated Pest Management guidance and FAO reference link
- Responsive navigation and mobile layouts

## Run locally

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local Vite URL shown in the terminal.

## Validate and build

```bash
pnpm build
pnpm preview
```

## Understand the folders

Read [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) for an explanation of every important folder and file, plus the route-to-render flow.

The site is frontend-only. Crop imagery is loaded from remote Unsplash URLs, and the scan result is a demo interaction until a production crop-disease model/API is connected.
