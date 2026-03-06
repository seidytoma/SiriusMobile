## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Custom Tab Interfaces
**Learning:** Custom tab interfaces using `TouchableOpacity` frequently lack semantic structure, making them difficult to navigate with screen readers.
**Action:** Use `accessibilityRole="tablist"` on the container and `accessibilityRole="tab"` with `accessibilityState={{ selected: isActive }}` on the individual tab buttons.
