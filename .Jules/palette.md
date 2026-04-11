## 2025-10-26 - Accessibility Pattern: Icon-Only Buttons
**Learning:** Icon-only buttons (like Header actions and Modal close buttons) frequently lack `accessibilityLabel`, making them invisible to screen readers.
**Action:** Always verify `TouchableOpacity` with icons have explicit `accessibilityLabel` describing the action, not just the icon name.

## 2025-10-26 - Accessibility Pattern: Custom Checkboxes
**Learning:** Custom list items behaving as checkboxes (e.g., sector selection) often use visual cues (icons/colors) without semantic roles.
**Action:** Use `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` on the interactive container.

## 2025-10-27 - Accessibility Pattern: Custom Tab Interfaces
**Learning:** Custom tab interfaces built with standard React Native views/touchables lack inherent semantic meaning, causing screen readers to announce them merely as buttons without indicating they are part of a tab list or their selected state.
**Action:** Always ensure the tab container uses `accessibilityRole="tablist"` and individual tab controls use `accessibilityRole="tab"` with `accessibilityState={{ selected: boolean }}` to provide correct semantics for assistive technologies.
