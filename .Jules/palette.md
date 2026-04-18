## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Chat Send Button Disabled States
**Learning:** In chat interfaces, users can be confused if the 'Send' button appears active when the input is empty or a message is currently sending. Additionally, icon-only send buttons often lack screen reader support.
**Action:** Always ensure the 'Send' button is fully disabled (both via `disabled` prop and visually via `opacity`) when input is empty, and assign appropriate `accessibilityRole="button"`, `accessibilityLabel`, and `accessibilityState={{ disabled: boolean }}`.
