## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-27 - Disabled Button UX and Accessibility
**Learning:** Chat interfaces with send buttons often lack clear disabled states when input is empty or sending, confusing users. Using `disabled` alone is insufficient in React Native.
**Action:** Ensure both physical disability via the `disabled` prop and visual feedback via styling (e.g. `opacity: 0.5`) are applied, accompanied by `accessibilityState={{ disabled: boolean }}`.
