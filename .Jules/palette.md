## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Icon-Only Chat Send Button
**Learning:** The 'Send' button in chat interfaces is often just an icon (`MaterialIcons`), missing an `accessibilityLabel` and clear disabled visual states when the input is empty or sending.
**Action:** Added `accessibilityRole="button"`, `accessibilityLabel="Enviar mensagem"`, and tied both the `disabled` prop and `opacity` to the `!newMessage.trim() || sendingMsg` state. Also applied `accessibilityState={{ disabled: ... }}`.

## 2025-10-26 - Accessibility Pattern: Custom Tab Navigation
**Learning:** Custom UI tabs in React Native using `View` and `TouchableOpacity` (e.g. "Detalhes" and "Chat") are read by screen readers as standard buttons, not tabs.
**Action:** Applied `accessibilityRole="tablist"` to the parent `View` and `accessibilityRole="tab"` along with `accessibilityState={{ selected: activeTab === '...' }}` to each tab button.
