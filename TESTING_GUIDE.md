# 🧪 Testing Guide - Role-Based Access Control

## 📍 Where is the Login Button?

**Look at the TOP RIGHT of your screen** in the header navigation. You'll see a button that says either:
- 🔓 **Login (Test)** - if not logged in (Orange button)
- 👤 **[User Name]** - if logged in (Green button)

## 🔐 Step 1: How to Login

1. **Click the Login button** in the top-right corner of the header
2. A dropdown menu will appear showing all test users
3. **Click on any user** to login as them
4. The button will change to show the logged-in user's name

## ✅ Step 2: Test the Three Scenarios

### Scenario A: Admin User (Full Access)

**Login as:** Admin User or Both Access User

#### Test Purchase Panel:
1. Click "ADMIN" in the left sidebar
2. You'll see **Purchase Orders** and **Sale Orders** toggle buttons
3. Click **Purchase Orders** - you should see 5 dummy purchase orders
4. Test the action buttons on any order:
   - **View**: Takes you to detail view (currently goes to `/admin/purchase/[id]`)
   - **Edit**: Takes you to purchase form page
   - **Confirm**: Shows confirmation dialog
   - **Delete**: Shows delete confirmation and removes the order

#### Test Sale Panel:
1. Stay on Admin page
2. Click **Sale Orders** toggle button
3. You should see 6 dummy sale orders
4. Test the action buttons:
   - **View**: Takes you to detail view (currently goes to `/admin/sale/[id]`)
   - **Edit**: Takes you to sales form page
   - **Confirm**: Shows confirmation dialog
   - **Delete**: Shows delete confirmation and removes the order

---

### Scenario B: Purchase Manager (Purchase Only)

**Login as:** Purchase Manager

#### Expected Behavior:
1. Click "ADMIN" in the left sidebar
2. **NO TOGGLE BUTTON** - only sees Purchase panel
3. Sees title: "Admin Panel - Purchase Manager"
4. Subtitle: "Manage and review purchase orders"
5. Should see 5 dummy purchase orders
6. Can use all action buttons (View, Edit, Confirm, Delete)
7. **Cannot see Sale Orders** - no toggle available

---

### Scenario C: Sales Manager (Sales Only)

**Login as:** Sales Manager

#### Expected Behavior:
1. Click "ADMIN" in the left sidebar
2. **NO TOGGLE BUTTON** - only sees Sale panel
3. Sees title: "Admin Panel - Sales Manager"
4. Subtitle: "Manage and review sale orders"
5. Should see 6 dummy sale orders
6. Can use all action buttons (View, Edit, Confirm, Delete)
7. **Cannot see Purchase Orders** - no toggle available

---

### Scenario D: Not Logged In

**Logout first** (click the dropdown and select "🚪 Logout")

#### Expected Behavior:
1. Click "ADMIN" in the left sidebar
2. See **"🔒 Authentication Required"** message
3. "Please login to access the admin panel"
4. Button: "Go to Dashboard"
5. **Cannot access any orders**

---

## 📋 Step 3: View Dummy Data on Purchase/Sales Pages

### Purchase Page (http://localhost:3000/ or /purchases)
- Should now show **5 dummy purchase orders**
- Each order shows: time, product, quantity, company, price, port, etc.
- Can test delete functionality

### Sales Page (http://localhost:3000/sales)
- Should now show **6 dummy sale orders**
- Each order shows: time, sale type, product, quantity, company, price, etc.
- Can test delete functionality

---

## 🎯 All Dummy Data Details

### Test Users Available:
| User | Email | Can View Purchases | Can View Sales |
|------|-------|-------------------|----------------|
| Admin User | admin@chemos.com | ✅ | ✅ |
| Purchase Manager | purchase@chemos.com | ✅ | ❌ |
| Sales Manager | sales@chemos.com | ❌ | ✅ |
| Both Access User | both@chemos.com | ✅ | ✅ |

### Dummy Purchase Orders (5 orders):
1. **#1** - Sodium Bicarbonate - 100 MT - Global Chemicals
2. **#2** - Citric Acid Anhydrous - 200 MT - Asian Suppliers
3. **#3** - Potassium Carbonate - 150 MT - Euro Chem Industries
4. **#4** - Phosphoric Acid 85% - 300 MT - Middle East Traders
5. **#5** - Acetic Acid Glacial - 120 MT - Southeast Asia Chemicals

### Dummy Sale Orders (6 orders):
1. **#101** - Sodium Bicarbonate - 50 MT - Pharma Industries
2. **#102** - Citric Acid Anhydrous - 100 MT - Food Processing Co
3. **#103** - Potassium Carbonate - 80 MT - Export House India (Bond Sale)
4. **#104** - Phosphoric Acid 85% - 150 MT - Fertilizer Corporation
5. **#105** - Acetic Acid Glacial - 60 MT - Textile Mills Ltd
6. **#106** - Sodium Bicarbonate - 75 MT - International Traders (Bond Sale)

---

## 🐛 Troubleshooting

### "I don't see the Login button"
- Refresh the page (Ctrl+R or F5)
- Check the **top-right corner** of the header
- Look for orange 🔓 **Login (Test)** button

### "I see 'Authentication Required' in Admin"
- You need to **login first** using the button in the header
- Click the Login button and select any user

### "I don't see dummy data on Purchase/Sales pages"
- Refresh the page
- The data should load automatically now

### "The toggle button doesn't appear"
- Check which user you're logged in as
- Only Admin and "Both Access" users see the toggle
- Purchase/Sales managers only see their respective panel

### "Action buttons don't work"
- **View**: Detail pages may not exist yet (shows `/admin/purchase/[id]` or `/admin/sale/[id]`)
- **Edit**: Redirects to form pages (Purchase or Sales)
- **Confirm**: Shows alert dialog (backend not implemented yet)
- **Delete**: Should work and remove from list

---

## 🔄 Quick Test Flow

1. **Logout** (if logged in)
2. Visit Admin page → See "Authentication Required" ✅
3. **Login as "Purchase Manager"**
4. Visit Admin page → See only Purchase Orders (5 items) ✅
5. Click "View" on any order → Check navigation ✅
6. **Logout** and **Login as "Sales Manager"**
7. Visit Admin page → See only Sale Orders (6 items) ✅
8. **Logout** and **Login as "Admin User"**
9. Visit Admin page → See toggle button ✅
10. Switch between Purchase/Sale panels ✅
11. Visit /purchases → See 5 purchase orders ✅
12. Visit /sales → See 6 sale orders ✅

---

## 📝 Notes

- All action buttons in Admin panel are functional for testing
- "View" takes you to `/admin/[type]/[id]` (detail page may not exist)
- "Edit" takes you to form pages
- "Confirm" shows confirmation alert
- "Delete" removes the order from the list
- **Dummy data is client-side only** - refreshing the page resets deleted items
- When integrating with real API, uncomment the API calls in:
  - `app/admin/page.tsx`
  - `app/purchases/page.tsx`
  - `app/sales/page.tsx`
