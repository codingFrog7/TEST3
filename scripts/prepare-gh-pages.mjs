import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const nojekyllPath = path.join(distDir, ".nojekyll");

if (!fs.existsSync(distDir)) {
  console.error("Error: dist/ directory does not exist. Run 'vite build' first.");
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error("Error: dist/index.html not found.");
  process.exit(1);
}

// 1. Create .nojekyll to prevent GitHub Pages from ignoring asset directories
fs.writeFileSync(nojekyllPath, "", "utf-8");
console.log("✓ Created dist/.nojekyll");

// 2. Create 404.html from index.html for Single Page Application routing
fs.copyFileSync(indexPath, notFoundPath);
console.log("✓ Created dist/404.html (SPA fallback for GitHub Pages)");

console.log("GitHub Pages preparation complete! dist/ is ready for deployment.");
