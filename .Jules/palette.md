## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Modal Back Button
**Learning:** React Native `Modal` components often lack `onRequestClose`, causing them to be unclosable via hardware back button on Android.
**Action:** Always add `onRequestClose={onClose}` to `Modal` components to ensure consistent platform behavior.

## 2025-10-26 - UX Pattern: Search Input Clear Button
**Learning:** Search inputs without a clear button force users to backspace repeatedly, which is frustrating.
**Action:** Always include a conditional "Clear" button in search inputs when text is present.
