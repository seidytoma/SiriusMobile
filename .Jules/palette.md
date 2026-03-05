## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-03-05 - Accessibility Pattern: Form Input Submit Actions
**Learning:** TouchableOpacity used for confirming forms or adding selections (like saving a group or confirming actions) lacked accessibility roles and clear descriptions. Disabling interactive elements should use both `disabled` and `accessibilityState={{disabled: true}}`.
**Action:** Added `accessibilityRole="button"` and context-specific `accessibilityLabel` to confirm/cancel buttons, and properly managed the disabled state of the chat send button for screen reader awareness.
