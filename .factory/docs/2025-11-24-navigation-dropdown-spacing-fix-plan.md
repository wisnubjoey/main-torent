## Navigation Dropdown & Spacing Fix Plan

I'll fix the navigation dropdown functionality and improve spacing in the AdminLayout:

### Issues Identified:
1. **Dropdown not working**: The Order menu has children but doesn't have proper dropdown functionality - missing state management and click handlers
2. **Poor spacing**: Navigation items don't have proper visual separation between groups

### Implementation Plan:

1. **Fix Dropdown Functionality**:
   - Add `useState` to track dropdown open/closed state
   - Implement click handler for parent item with children
   - Add proper chevron rotation animation
   - Conditionally render children based on open state

2. **Add Visual Grouping & Spacing**:
   - Add a new nav item to create better visual separation
   - Insert visual divider/spacing between navigation groups
   - Group related items (Overview, Vehicle Management, User Management) vs (Order, Settings)

3. **Improve Navigation Structure**:
   - Add a new nav item for better visual balance
   - Apply proper CSS classes for spacing between groups
   - Ensure dropdown functionality works smoothly

### New Navigation Structure:
- Overview
- Vehicle Management
- User Management
- [VISUAL SEPARATOR]
- [NEW NAV ITEM]
- Order (with working dropdown: Approval, Order History)
- Settings

This will create a cleaner, more organized navigation with proper dropdown functionality and visual grouping.