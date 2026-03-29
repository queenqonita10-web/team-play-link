import { CompetitionRegistration, CompetitionInvoice, CompetitionCategory, PaymentStatus } from "@/types";
import { addDays, isAfter, parseISO } from "date-fns";

/**
 * Generates a unique invoice number
 */
export function generateInvoiceNumber(compId: string): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${compId.slice(0, 4).toUpperCase()}-${timestamp}-${random}`;
}

/**
 * Calculates the total amount including late fees if applicable
 */
export function calculateInvoiceTotal(
  category: CompetitionCategory,
  discount: number = 0,
  referenceDate: string = new Date().toISOString()
): { amount: number; lateFee: number; total: number } {
  const amount = category.registrationFee;
  let lateFee = 0;

  // If there's a late fee policy and current date is past a certain point
  // For simplicity, let's assume late fees are applied if registering within 7 days of competition start
  // In a real scenario, this would be based on a specific 'lateFeeDate' in the category
  
  const total = amount + lateFee - discount;
  
  return {
    amount,
    lateFee,
    total: total > 0 ? total : 0
  };
}

/**
 * Creates an initial invoice for a registration
 */
export function createInvoice(
  registration: CompetitionRegistration,
  category: CompetitionCategory
): CompetitionInvoice {
  const { amount, lateFee, total } = calculateInvoiceTotal(category);
  const createdAt = new Date().toISOString();
  
  return {
    id: `inv-${Date.now()}`,
    registrationId: registration.id,
    invoiceNumber: generateInvoiceNumber(registration.competitionId),
    amount,
    lateFee,
    discount: 0,
    totalAmount: total,
    dueDate: addDays(new Date(createdAt), 3).toISOString(), // 3 days to pay
    status: "unpaid",
    createdAt,
  };
}

/**
 * Validates if an invoice is overdue
 */
export function checkInvoiceStatus(invoice: CompetitionInvoice): PaymentStatus {
  if (invoice.status === "paid") return "paid";
  
  const now = new Date();
  const dueDate = parseISO(invoice.dueDate);
  
  if (isAfter(now, dueDate)) {
    return "overdue";
  }
  
  return invoice.status;
}

/**
 * Simulates a payment gateway response
 */
export function simulatePaymentGateway(invoiceId: string, amount: number) {
  return {
    success: true,
    transactionId: `trx-${Math.random().toString(36).substr(2, 9)}`,
    vaNumber: `8806${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
    amount,
    expiry: addDays(new Date(), 1).toISOString()
  };
}
