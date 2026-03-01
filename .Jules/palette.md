## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-26 - Accessibility Pattern: Custom Tab Interfaces
**Learning:** Custom tab interfaces built with standard UI components (e.g., `View` and `TouchableOpacity`) do not automatically convey their tabbed structure or selection state to screen readers.
**Action:** Always wrap the tab container with `accessibilityRole="tablist"` and add `accessibilityRole="tab"` along with `accessibilityState={{ selected: boolean }}` to the individual tab buttons.

## 2025-10-26 - Accessibility Pattern: Empty State Announcements
**Learning:** Empty list states (`ListEmptyComponent`) or specific conditional empty views are often missed by screen readers if they are not dynamically focused or explicitly marked.
**Action:** Apply `accessibilityRole="alert"` to the container of the empty state message to ensure immediate announcement to assistive technologies when the content is empty.
