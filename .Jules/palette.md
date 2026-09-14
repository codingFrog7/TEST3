# Palette's Journal - UX & Accessibility Learnings

## 2025-05-18 - Expandable Controls & ARIA Associations
**Learning:** Collapsible drawers and quick-action calculation tools (such as Mandi Profit Calculator in `MandiPriceTracker.jsx`) need explicit `aria-expanded` and `aria-controls` bindings so screen readers announce expansion states accurately.
**Action:** Always link expandable panel IDs (`id="mandi-calculator-panel"`) with `aria-controls` on the toggle button and provide contextual `aria-label` text for crop-specific quick action triggers.
