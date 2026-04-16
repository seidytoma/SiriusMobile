## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Send Message Buttons
**Learning:** Chat inputs often have send buttons that are active even when input is empty, and lack proper semantic roles.
**Action:** When working on Chat/Messaging features, always ensure the send button has an `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an `accessibilityState={{ disabled: boolean }}` when no text is provided, while also visually fading (`opacity`) to indicate its state clearly.
