## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Custom Tab Interfaces
**Learning:** Custom tab interfaces built with `TouchableOpacity` containers lack structure for screen readers without specific roles.
**Action:** Containers wrapping tab buttons must have `accessibilityRole="tablist"`, and individual tab buttons need `accessibilityRole="tab"` along with `accessibilityState={{ selected: isActive }}` to convey their state.

## 2025-10-26 - Accessibility Pattern: Disabled States
**Learning:** Simply omitting an `onPress` action or changing the visual style of a button doesn't communicate its disabled state to screen readers.
**Action:** Use the `disabled` prop and `accessibilityState={{ disabled: boolean }}` alongside visual indicators (like lower opacity) to ensure clear communication of interactivity.
