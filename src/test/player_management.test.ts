import { describe, it, expect } from "vitest";
import { calculateAge, getAgeCategory, validatePlayerInput, validateDocument } from "../lib/player-utils";
import { Player } from "../types";

describe("Player Management Logic & Validation", () => {
  const referenceDate = "2026-03-30";

  describe("Age Calculation & Auto-grouping", () => {
    it("should calculate correct age based on date of birth", () => {
      expect(calculateAge("2016-03-31", referenceDate)).toBe(9);
      expect(calculateAge("2010-01-01", referenceDate)).toBe(16);
    });

    it("should auto-group correct age category (U9-Senior)", () => {
      // Age 9 (born 2017) is U11 (since U9 is < 9)
      // Actually U9 means age < 9. So age 8 is U9.
      expect(getAgeCategory("2017-03-31")).toBe("U11"); // age 8-9
      expect(getAgeCategory("2019-03-31")).toBe("U9");  // age 6-7
      expect(getAgeCategory("2011-03-31")).toBe("U15"); // age 14-15
      expect(getAgeCategory("2000-01-01")).toBe("Senior");
    });
  });

  describe("Player Input Validation", () => {
    const validData: Partial<Player> = {
      name: "Budi Santoso",
      nik: "3201010503160001",
      dateOfBirth: "2016-03-15",
      position: "midfielder",
      parent: {
        motherName: "Siti Aminah",
        contactNumber: "08123456789",
        relationshipType: "Mother"
      }
    };

    it("should pass validation for valid data", () => {
      const errors = validatePlayerInput(validData);
      expect(errors.length).toBe(0);
    });

    it("should fail validation for invalid name length", () => {
      const data = { ...validData, name: "Bu" };
      const errors = validatePlayerInput(data);
      expect(errors).toContain("Full name must be at least 3 characters.");
    });

    it("should fail validation for invalid NIK format", () => {
      const data = { ...validData, nik: "12345" };
      const errors = validatePlayerInput(data);
      expect(errors).toContain("NIK must be exactly 16 digits.");
    });

    it("should fail validation for out-of-range age (under 6 or over 25)", () => {
      const data = { ...validData, dateOfBirth: "2022-01-01" }; // 4 years old
      const errors = validatePlayerInput(data);
      expect(errors).toContain("Player age must be between 6 and 25 years.");
    });

    it("should fail validation for missing parent contact info", () => {
      const data = { ...validData, parent: { ...validData.parent!, contactNumber: "abc" } };
      const errors = validatePlayerInput(data);
      expect(errors).toContain("Valid parent contact number is required.");
    });
  });

  describe("Document Upload Validation", () => {
    it("should allow valid PDF, JPG, PNG", () => {
      const pdf = new File([""], "test.pdf", { type: "application/pdf" });
      expect(validateDocument(pdf)).toBeNull();
    });

    it("should reject invalid file types", () => {
      const doc = new File([""], "test.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      expect(validateDocument(doc)).toBe("Invalid file format. Only PDF, JPG, and PNG are allowed.");
    });

    it("should reject files larger than 5MB", () => {
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
      expect(validateDocument(largeFile)).toBe("File size exceeds 5MB limit.");
    });
  });
});
