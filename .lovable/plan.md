

# Billing & Payment Module for SSB

## What We're Building

A complete billing & payment management system replacing the current simple finance table. Includes auto-generated monthly invoices, multiple billing types, overdue tracking, payment gateway UI (Midtrans/Xendit mock), financial dashboard with charts, and notification UI.

**Note**: Payment gateway integration (Midtrans/Xendit) and notifications (WhatsApp/Email) will be UI-only for now — actual backend integration requires Supabase + Edge Functions, which comes later.

## Changes

### 1. Extend Types (`src/types/index.ts`)
- `PaymentStatus`: add `"overdue"` and `"pending"`
- `PaymentType`: new type `"monthly" | "registration" | "event"`
- `Invoice` interface: `{ id, playerId, type: PaymentType, description, amount, status: PaymentStatus, dueDate, paidDate?, createdAt, paymentMethod?: "midtrans" | "xendit" | "manual" }`
- Keep backward-compatible `Payment` or replace with `Invoice`

### 2. Expand Mock Data (`src/data/mock.ts`)
- Replace `mockPayments` with richer `mockInvoices` covering 3 months, multiple types (monthly dues, registration fee, tournament event fee)
- Include mix of paid, pending, overdue statuses
- Add overdue logic: any unpaid invoice past dueDate is "overdue"

### 3. Revamp Finance Page (`src/pages/ssb/Finance.tsx`)
**Dashboard section** (top):
- 4 summary cards: Total Income, Outstanding, Overdue, This Month's Collection
- Bar chart showing monthly revenue (using recharts via shadcn chart)

**Billing table** (below):
- Columns: Player, Type, Amount, Due Date, Status, Actions
- Status badges: green (paid), amber (pending), red (overdue)
- Filter by: month, status, payment type
- "Generate Monthly Bills" button (creates invoices for all active players for selected month)
- "Pay" action button per row opens payment dialog

### 4. Create Payment Dialog (`src/components/ssb/PaymentDialog.tsx`)
- Shows invoice details (player, amount, type)
- Payment method selector: Midtrans / Xendit / Manual
- For Midtrans/Xendit: mock "Redirect to Payment Gateway" button (shows toast "Payment gateway will be integrated with Supabase")
- For Manual: mark as paid with date picker
- Confirmation updates local state

### 5. Create Bill Generator (`src/components/ssb/BillGenerator.tsx`)
- Dialog to select month + billing type + amount
- "Generate for All Active Players" creates invoices in local state
- Preview list before confirming

### 6. Add Notification UI (`src/components/ssb/PaymentNotification.tsx`)
- "Send Reminder" button on overdue invoices
- Shows mock notification preview (WhatsApp/Email template)
- Toast confirmation "Notification sent" (UI-only)

### 7. i18n Updates (`src/i18n/en.ts`, `src/i18n/id.ts`)
New keys: `billing`, `invoice`, `generateBills`, `overdue`, `pending`, `totalIncome`, `outstanding`, `thisMonth`, `paymentMethod`, `midtrans`, `xendit`, `manual`, `sendReminder`, `payNow`, `registration`, `eventFee`, `monthlyDues`, `billGenerated`, `paymentGateway`, `redirectToGateway`, `notificationSent`, `exportPDF`, `exportExcel`

### 8. Mock Export Buttons
- "Export PDF" and "Export Excel" buttons on finance page
- Show toast "Export feature will be available with backend integration"

## Database Schema (for future Supabase implementation)

```text
invoices
├── id (uuid, PK)
├── player_id (uuid, FK → players)
├── ssb_id (uuid, FK → organizations)
├── type (enum: monthly, registration, event)
├── description (text)
├── amount (integer, in IDR)
├── status (enum: pending, paid, overdue)
├── due_date (date)
├── paid_date (date, nullable)
├── payment_method (enum: midtrans, xendit, manual, nullable)
├── payment_ref (text, nullable — gateway transaction ID)
├── created_at (timestamptz)
└── updated_at (timestamptz)

payment_notifications
├── id (uuid, PK)
├── invoice_id (uuid, FK → invoices)
├── channel (enum: whatsapp, email)
├── sent_at (timestamptz)
└── status (enum: sent, failed)
```

## API Endpoints (for future backend)

```text
GET    /api/invoices?month=&status=&type=     — list invoices with filters
POST   /api/invoices/generate                  — auto-generate monthly bills
GET    /api/invoices/:id                       — invoice detail
PATCH  /api/invoices/:id/pay                   — mark as paid (manual)
POST   /api/invoices/:id/pay/midtrans          — create Midtrans transaction
POST   /api/invoices/:id/pay/xendit            — create Xendit invoice
POST   /api/webhooks/midtrans                  — Midtrans payment callback
POST   /api/webhooks/xendit                    — Xendit payment callback
POST   /api/invoices/:id/notify                — send payment reminder
GET    /api/finance/summary?month=             — dashboard totals
```

## Payment Flow

```text
Admin generates bills → Invoices created (status: pending)
    ↓
Parent receives notification (WhatsApp/Email)
    ↓
Parent clicks "Pay Now" → selects gateway (Midtrans/Xendit)
    ↓
Redirect to payment page → completes payment
    ↓
Webhook received → status updated to "paid"
    ↓
Overdue cron: daily check → pending past due_date → mark "overdue"
    ↓
Auto-reminder sent for overdue invoices
```

## Files Modified/Created
1. `src/types/index.ts` — add Invoice, PaymentType, extend PaymentStatus
2. `src/data/mock.ts` — replace mockPayments with mockInvoices
3. `src/i18n/en.ts` — add billing/payment keys
4. `src/i18n/id.ts` — add billing/payment keys
5. `src/pages/ssb/Finance.tsx` — full revamp with dashboard + table + filters
6. `src/components/ssb/PaymentDialog.tsx` — new: payment method selector
7. `src/components/ssb/BillGenerator.tsx` — new: auto-generate invoices
8. `src/components/ssb/PaymentNotification.tsx` — new: reminder UI
9. `src/pages/ssb/Dashboard.tsx` — update to use new invoice data

