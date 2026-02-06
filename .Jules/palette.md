## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2024-05-24 - Interaction Pattern: Haptic Feedback on Tabs
**Learning:** Adding `Haptics.selectionAsync()` to tab switching provides a subtle but confirming physical response that reinforces the navigation action, making the app feel more "native" and responsive.
**Action:** Consider adding light haptics to major state-switching interactions (like Tabs or segmented controls).

## 2024-05-24 - Accessibility Pattern: Dynamic Action Labels
**Learning:** Buttons that change text/function based on state (like "Start" vs "Finish") need their `accessibilityLabel` to be equally dynamic to prevent confusion for screen reader users who might only hear "Button" or a stale label.
**Action:** Ensure `accessibilityLabel` logic mirrors the visual text/state logic.
