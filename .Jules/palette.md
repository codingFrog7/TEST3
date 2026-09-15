# Palette's Journal - Critical Learnings

## 2025-05-20 - Modal Dialog Accessibility Patterns
**Learning:** In React single-window reporting modals, non-semantic interactive components (like language toggles built as styled `div`s) hinder keyboard navigation and screen reader accessibility. Adding explicit `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and replacing non-semantic divs with `<button type="button">` fixes keyboard focus trap and screen reader announcements without affecting visual styling.
**Action:** Always ensure modal backdrops/windows use proper ARIA dialog attributes and interactive header triggers are semantic `<button>` elements.
