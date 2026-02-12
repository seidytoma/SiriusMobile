## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Modal Focus Trap
**Learning:** Native `Modal` components need explicit `accessibilityViewIsModal={true}` on their content container to properly trap screen reader focus, otherwise background elements remain accessible.
**Action:** Always add `accessibilityViewIsModal={true}` and `accessibilityRole="alert"` (for confirmations) to the main content wrapper inside a `Modal`.
