## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-27 - Playwright Verification: Modal Overlays
**Learning:** When verifying Modals in React Native Web via Playwright, the modal overlay or loading states can intercept clicks intended for elements behind them or elements that are still rendering.
**Action:** Always check if a modal is already open (especially if it opens automatically on load) before attempting to open it, and use `accessibilityViewIsModal={true}` on the modal content to ensure focus trapping.
