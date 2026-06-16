# Role-Based Access Control Implementation

## Overview
This implementation adds role-based access control to the Admin Panel, allowing different users to view Purchase Orders and/or Sale Orders based on their permissions extracted from their login token.

## Features

### 1. **User Roles**
- **Admin**: Full access to both Purchase and Sale orders
- **Purchase Manager**: Access only to Purchase orders  
- **Sales Manager**: Access only to Sale orders
- **Both Access**: Full access to both Purchase and Sale orders

### 2. **Redux State Management**
- User authentication state stored in Redux
- Permissions extracted from user token
- Persistent across page navigation

### 3. **Role-Based Panels**
- Purchase Panel: Visible only to users with `canViewPurchases` permission
- Sale Panel: Visible only to users with `canViewSales` permission
- Users with both permissions see a toggle to switch between panels
- Users with single permission see only their respective panel

### 4. **Dummy Data for Testing**
Created comprehensive dummy data including:
- 4 test users with different role configurations
- 5 dummy purchase orders
- 6 dummy sale orders

## Test Users

### 1. Admin User
- **Email**: admin@chemos.com
- **Role**: admin
- **Permissions**: Full access to Purchase & Sale orders

### 2. Purchase Manager
- **Email**: purchase@chemos.com
- **Role**: purchase
- **Permissions**: View/Edit Purchase orders only

### 3. Sales Manager
- **Email**: sales@chemos.com
- **Role**: sales
- **Permissions**: View/Edit Sale orders only

### 4. Both Access User
- **Email**: both@chemos.com
- **Role**: both
- **Permissions**: Full access to Purchase & Sale orders

## How to Test

### 1. **Start the Application**
```bash
cd chemos-app
npm run dev
```

### 2. **Access the Admin Panel**
Navigate to: http://localhost:3000/admin

### 3. **Switch Between Users**
- Click the **User Switcher** button in the top navigation (shows login status)
- Select any test user from the dropdown
- The admin panel will automatically update based on the selected user's permissions

### 4. **Test Scenarios**

#### Scenario 1: Purchase Manager
1. Login as "Purchase Manager"
2. Navigate to Admin Panel
3. **Expected**: See only Purchase Orders panel, no toggle button
4. **Verify**: Cannot access Sale Orders

#### Scenario 2: Sales Manager
1. Login as "Sales Manager"
2. Navigate to Admin Panel
3. **Expected**: See only Sale Orders panel, no toggle button
4. **Verify**: Cannot access Purchase Orders

#### Scenario 3: Admin / Both Access
1. Login as "Admin User" or "Both Access User"
2. Navigate to Admin Panel
3. **Expected**: See both panels with toggle button
4. **Verify**: Can switch between Purchase and Sale orders

#### Scenario 4: No Authentication
1. Logout (if logged in)
2. Navigate to Admin Panel
3. **Expected**: See "Authentication Required" message
4. **Verify**: No access to any orders

## File Structure

### New Files Created
```
lib/
  redux/
    store.ts          # Redux store configuration
    authSlice.ts      # Authentication & permissions slice
    hooks.ts          # Typed Redux hooks
  dummyData.ts        # Dummy users, purchases, and sales

components/
  ReduxProvider.tsx   # Redux Provider wrapper
  UserSwitcher.tsx    # User switcher component for testing
```

### Modified Files
```
app/
  layout.tsx          # Wrapped with ReduxProvider
  admin/page.tsx      # Added role-based access control

components/
  Header.tsx          # Added UserSwitcher component
```

## Implementation Details

### Redux Store Structure
```typescript
{
  auth: {
    user: {
      id: string
      name: string
      email: string
      role: 'admin' | 'purchase' | 'sales' | 'both'
      permissions: {
        canViewPurchases: boolean
        canViewSales: boolean
        canEditPurchases: boolean
        canEditSales: boolean
      }
      token: string
    }
    isAuthenticated: boolean
  }
}
```

### Permission Checks in Admin Page
```typescript
const canViewPurchases = user?.permissions.canViewPurchases || false;
const canViewSales = user?.permissions.canViewSales || false;
```

### Dynamic Panel Rendering
- If user has both permissions: Show toggle between panels
- If user has only purchase permission: Show only Purchase panel
- If user has only sales permission: Show only Sale panel
- If user has no permissions or not authenticated: Show error/login prompt

## Future Enhancements

### Replace Dummy Data with Real API
Currently using dummy data from `lib/dummyData.ts`. To integrate with real API:

1. **Uncomment API calls in admin page**:
```typescript
// Uncomment these lines in app/admin/page.tsx
const today = new Date().toISOString().slice(0, 10);
const [purchases, sales] = await Promise.all([
  fetchTodayPunches(today, 1, 100),
  fetchTodaySales(today, 1, 100),
]);
setPurchaseOrders(purchases.rows ?? []);
setSaleOrders(sales.rows ?? []);
```

2. **Integrate with authentication backend**:
```typescript
// Replace dummy login with real authentication
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { user, token } = await response.json();
dispatch(login(user));
```

3. **Extract permissions from JWT token**:
```typescript
// Decode JWT and extract permissions
const decoded = jwt.decode(token);
const permissions = decoded.permissions;
```

## Dependencies Installed
- `@reduxjs/toolkit`: Redux state management
- `react-redux`: React bindings for Redux

## Notes
- All dummy data is defined in `lib/dummyData.ts`
- User switcher is only for testing and should be replaced with actual login in production
- Current implementation uses client-side permission checks; add server-side validation for production
- The "All orders" section has been removed (was not present in original implementation)
