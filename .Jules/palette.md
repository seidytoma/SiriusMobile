## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2026-02-09 - Accessibility Pattern: Android Modal Back Button
**Learning:** React Native `Modal` on Android crashes the app if the hardware back button is pressed without an `onRequestClose` prop.
**Action:** Always include `onRequestClose={() => setVisible(false)}` on every `Modal` component.

## 2026-02-09 - UX Pattern: Modal Input Accessibility
**Learning:** Inputs inside Modals are often obscured by the keyboard on mobile devices.
**Action:** Wrap Modal content in `KeyboardAvoidingView` with `behavior={Platform.OS === "ios" ? "padding" : undefined}`.
