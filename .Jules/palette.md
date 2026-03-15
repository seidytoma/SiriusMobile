## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-03-15 - Accessibility Pattern: Custom Tabs and Icon Buttons
**Learning:** Custom tab implementations (using `TouchableOpacity`) and icon-only buttons (like back arrows or delete icons) often lack ARIA roles and labels, causing them to be read simply as "button" or not at all by screen readers.
**Action:** Always verify custom interactive elements have appropriate `accessibilityRole`, `accessibilityLabel`, and `accessibilityState` properties explicitly defined.
