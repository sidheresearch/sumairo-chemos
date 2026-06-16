# Purchase Enquiry System

## Overview
The Purchase Enquiry system provides a streamlined workflow for managing purchase enquiries and converting them into full purchase orders.

## Features

### 1. Enquiry Form (Limited Fields)
The enquiry form collects essential purchase information:
- **Purchase Type**: Import, HSS, Local, Tow
- **Date**: Current date (auto-generated, read-only)
- **Company From**: Supplier/seller name
- **Product**: Product name
- **Origin**: Country of origin
- **Port**: Destination port
- **Quantity (MT)**: Quantity in metric tons
- **Price (FC)**: Price in foreign currency
- **Currency**: USD, EUR, INR, etc.
- **Exchange Rate (₹/$)**: Exchange rate
- **Price (₹/kg)**: Auto-calculated from Price(FC) × Exchange Rate / 1000
- **Market Price (₹/kg)**: Current market price

### 2. Two Workflow Options

#### Option A: Direct Purchase
- Navigate directly to the purchase form
- Fill in all required fields
- Submit as a complete purchase order

#### Option B: Enquiry → Purchase Conversion
1. Fill out the enquiry form with basic details
2. Save the enquiry (stores in database)
3. Click "Convert to Purchase" button
4. Enquiry data automatically carries over to the full purchase form
5. Complete additional fields (vessel, shipment, delivery terms, etc.)
6. Submit as a complete purchase order

### 3. Data Flow
When converting an enquiry to purchase, the following fields are automatically populated:
- Purchase Type
- Company From
- Product
- Origin
- Port
- Quantity
- Price (FC)
- Currency
- Exchange Rate
- Price (₹/kg)
- Market Price

## File Structure

### Frontend Files
```
chemos-app/
├── lib/
│   └── types.ts                          # Type definitions (EnquiryPayload, EnquiryFormData, etc.)
├── components/
│   ├── EnquiryForm.tsx                   # Enquiry form component
│   └── SaleEntryCard.tsx                 # Purchase form (updated to accept initialData)
├── app/
│   ├── enquiry/
│   │   └── page.tsx                      # Main enquiry page with tab navigation
│   └── api/
│       └── feed/
│           └── enquiry/
│               ├── route.ts              # GET, POST /api/feed/enquiry
│               └── [id]/
│                   └── route.ts          # GET, PUT, DELETE /api/feed/enquiry/:id
```

### Backend Files
```
backend/src/
├── models/
│   └── Enquiry.ts                        # Enquiry interface & DTOs
├── db/
│   └── EnquiryModel.ts                   # Sequelize model for enquiry table
├── repository/
│   └── EnquiryRepository.ts              # Database operations
├── services/
│   └── EnquiryService.ts                 # Business logic
├── controllers/
│   └── EnquiryController.ts              # HTTP request handlers
└── routes/
    ├── enquiryRoutes.ts                  # Enquiry route definitions
    └── index.ts                          # Route registration (updated)
```

## API Endpoints

### Enquiry Endpoints
- `GET /api/enquiry` - Get all enquiries (with optional filters: day, page, limit)
- `GET /api/enquiry/:id` - Get enquiry by ID
- `POST /api/enquiry` - Create new enquiry
- `PUT /api/enquiry/:id` - Update enquiry
- `DELETE /api/enquiry/:id` - Delete enquiry

## Database Schema

### Table: enquiry
```sql
CREATE TABLE sumairochemos.enquiry (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMP DEFAULT NOW(),
  purchase_type VARCHAR(50) DEFAULT '',
  company_from VARCHAR(255) NOT NULL,
  product VARCHAR(255) NOT NULL,
  quantity FLOAT NOT NULL,
  port VARCHAR(255) NOT NULL,
  origin VARCHAR(100) DEFAULT '',
  price_fc FLOAT NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  exchange_rate FLOAT NOT NULL,
  price_inr FLOAT NOT NULL,
  market_price FLOAT DEFAULT 0
);
```

## Usage

### Access the Enquiry System
Navigate to: `http://localhost:3000/enquiry`

### Create an Enquiry
1. Select "Create Enquiry" tab
2. Fill in the form fields
3. Click "Save Enquiry" to store it
4. OR click "Convert to Purchase" to go directly to purchase form with pre-filled data

### Direct Purchase
1. Select "Direct Purchase" tab
2. Fill in complete purchase form
3. Click "Submit"

## Component Integration

### Using EnquiryForm in Your Page
```tsx
import EnquiryForm from '@/components/EnquiryForm';

<EnquiryForm 
  feedOptions={feedOptions}
  onSubmit={handleEnquirySubmit}
  onConvertToPurchase={handleConvertToPurchase}
/>
```

### Using SaleEntryCard with Initial Data
```tsx
import SaleEntryCard from '@/components/SaleEntryCard';

<SaleEntryCard 
  feedOptions={feedOptions}
  onSubmit={handlePurchaseSubmit}
  initialData={enquiryData}  // Optional: Pre-fill from enquiry
/>
```

## Benefits
- **Faster data entry**: Save time by not re-entering the same information
- **Reduced errors**: Auto-calculated fields and data carry-over minimize mistakes
- **Flexible workflow**: Choose between quick enquiry or direct purchase
- **Complete audit trail**: All enquiries are saved with timestamps
- **Easy conversion**: One-click conversion from enquiry to purchase order

## Notes
- The `initialData` prop in `SaleEntryCard` is optional and backward-compatible
- Existing purchase workflows are not affected
- Enquiry data is stored in a separate table for easy tracking
- All computed fields (Price ₹/kg) are automatically calculated in both forms
