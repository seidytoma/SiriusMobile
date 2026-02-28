## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-27 - Accessibility Pattern: Custom Tabs
**Learning:** Custom tab interfaces using `TouchableOpacity` frequently lack the structural role `tablist` on their container and `tab` on the items, making navigation confusing for screen reader users. They also miss state reporting (`accessibilityState={{selected: true/false}}`).
**Action:** Always verify custom tab navigation blocks are wrapped in a container with `accessibilityRole="tablist"`, and individual buttons use `accessibilityRole="tab"` along with `accessibilityState={{selected: isActive}}`.