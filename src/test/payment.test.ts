import { describe, it, expect } from "vitest";
import { generateInvoiceNumber, calculateInvoiceTotal, createInvoice, checkInvoiceStatus } from "../lib/payment-utils";
import { CompetitionRegistration, CompetitionCategory, CompetitionInvoice } from "../types";
import { addDays, subDays } from "date-fns";

describe("Tournament Registration & Payment Logic", () => {
  const mockCategory: CompetitionCategory = {
    id: "cat1",
    competitionId: "comp1",
    ageCategory: "U12",
    maxTeams: 16,
    registrationFee: 500000,
    lateFee: 50000,
    rules: "Test rules",
  };

  const mockRegistration: CompetitionRegistration = {
    id: "reg1",
    competitionId: "comp1",
    categoryId: "cat1",
    ssbId: "ssb1",
    teamName: "Garuda Muda",
    status: "pending",
    registeredAt: new Date().toISOString(),
    paymentStatus: "unpaid",
  };

  describe("Invoice Generation", () => {
    it("should generate a valid invoice number format", () => {
      const invNum = generateInvoiceNumber("comp1");
      expect(invNum).toMatch(/^INV-COMP-\d{6}-\d{3}$/);
    });

    it("should calculate the correct total amount without discount", () => {
      const result = calculateInvoiceTotal(mockCategory);
      expect(result.amount).toBe(500000);
      expect(result.total).toBe(500000);
    });

    it("should apply discount correctly", () => {
      const result = calculateInvoiceTotal(mockCategory, 50000);
      expect(result.total).toBe(450000);
    });

    it("should create a valid invoice object with 3 days due date", () => {
      const invoice = createInvoice(mockRegistration, mockCategory);
      expect(invoice.registrationId).toBe(mockRegistration.id);
      expect(invoice.totalAmount).toBe(500000);
      expect(invoice.status).toBe("unpaid");
      
      const dueDate = new Date(invoice.dueDate);
      const createdAt = new Date(invoice.createdAt);
      const diffTime = Math.abs(dueDate.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(3);
    });
  });

  describe("Payment Status Management", () => {
    it("should mark invoice as overdue if past due date", () => {
      const pastInvoice: CompetitionInvoice = {
        id: "inv1",
        registrationId: "reg1",
        invoiceNumber: "INV-1",
        amount: 500000,
        lateFee: 0,
        discount: 0,
        totalAmount: 500000,
        dueDate: subDays(new Date(), 1).toISOString(), // Yesterday
        status: "unpaid",
        createdAt: subDays(new Date(), 4).toISOString(),
      };

      const status = checkInvoiceStatus(pastInvoice);
      expect(status).toBe("overdue");
    });

    it("should remain paid even if past due date", () => {
      const paidPastInvoice: CompetitionInvoice = {
        id: "inv1",
        registrationId: "reg1",
        invoiceNumber: "INV-1",
        amount: 500000,
        lateFee: 0,
        discount: 0,
        totalAmount: 500000,
        dueDate: subDays(new Date(), 1).toISOString(),
        status: "paid",
        createdAt: subDays(new Date(), 4).toISOString(),
      };

      const status = checkInvoiceStatus(paidPastInvoice);
      expect(status).toBe("paid");
    });
  });
});
