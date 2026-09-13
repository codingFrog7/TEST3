## 2025-05-18 - Global Escape Key Listener for Modal Overlays
**Learning:** Modal overlays in custom React components often lack accessible keyboard dismissal controls. Attaching a `keydown` event listener for the `Escape` key inside a `useEffect` hook ensures screen readers and keyboard-only users can dismiss dialogs intuitively. Cleanup on unmount/close is mandatory to prevent listener leaks.
**Action:** When adding modal components or overlays, include an `Escape` key handler and clean up listeners on component unmount or state change.
