## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.
## 2026-04-20 - Improve Send Button UX
**Learning:** React Native touchable components used for icon buttons lack semantic meaning by default. Setting `accessibilityRole="button"`, `accessibilityLabel`, and handling the disabled state logically (with `disabled` prop and visual opacity change) and semantically (`accessibilityState={{ disabled: true }}`) is crucial for both UX and accessibility, especially in chat interfaces where empty messages shouldn't be sent.
**Action:** Always verify that icon-only action buttons have accessibility labels, proper roles, and visually/semantically managed disabled states.
