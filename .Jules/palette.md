## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Dynamic Disabled State (Send Buttons)
**Learning:** Chat interface 'Send' buttons must physically prevent empty/duplicate submissions and convey this state to screen readers and visually.
**Action:** When using `TouchableOpacity`, combine `disabled={boolean}`, conditional `opacity: 0.5` styling, and `accessibilityState={{ disabled: boolean }}` for a complete interactive micro-UX improvement.
