## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-27 - Accessibility Pattern: Tabs on Web
**Learning:** React Native Web's `accessibilityRole="tab"` with `accessibilityState={{ selected: true }}` does not reliably map to `aria-selected` on the same DOM element, causing Playwright checks to fail.
**Action:** Use visual verification for tab selection on web, or consider explicit `aria-selected` prop if web a11y is critical, while prioritizing native behavior.
