import { differenceInYears, parseISO } from "date-fns";
import { AgeCategory, Player, Position } from "@/types";

/**
 * Calculates current age based on date of birth.
 */
export function calculateAge(dob: string, referenceDate: string = new Date().toISOString()): number {
  return differenceInYears(parseISO(referenceDate), parseISO(dob));
}

/**
 * Auto-groups player into age category based on birth date.
 * Mapping: U9, U11, U13, U15, U17, U20.
 */
export function getAgeCategory(dob: string): AgeCategory {
  const age = calculateAge(dob);
  if (age < 9) return "U9";
  if (age < 11) return "U11";
  if (age < 13) return "U13";
  if (age < 15) return "U15";
  if (age < 17) return "U17";
  if (age < 20) return "U20";
  return "Senior";
}

/**
 * Validates player input data based on business rules.
 */
export function validatePlayerInput(data: Partial<Player>): string[] {
  const errors: string[] = [];

  // Full Name Validation
  if (!data.name || data.name.length < 3) {
    errors.push("Full name must be at least 3 characters.");
  }
  if (data.name && data.name.length > 100) {
    errors.push("Full name must not exceed 100 characters.");
  }

  // NIK Validation (16 digits)
  if (!data.nik || !/^\d{16}$/.test(data.nik)) {
    errors.push("NIK must be exactly 16 digits.");
  }

  // Date of Birth & Age Validation
  if (!data.dateOfBirth) {
    errors.push("Date of birth is required.");
  } else {
    const age = calculateAge(data.dateOfBirth);
    if (age < 6 || age > 25) {
      errors.push("Player age must be between 6 and 25 years.");
    }
  }

  // Position Validation
  const validPositions: Position[] = ["goalkeeper", "defender", "midfielder", "forward"];
  if (!data.position || !validPositions.includes(data.position)) {
    errors.push("Invalid playing position selected.");
  }

  // Parent Data Validation
  if (!data.parent?.motherName) {
    errors.push("Mother's name is required.");
  }
  if (!data.parent?.contactNumber || !/^\d+$/.test(data.parent.contactNumber)) {
    errors.push("Valid parent contact number is required.");
  }

  return errors;
}

/**
 * Validates document upload constraints.
 */
export function validateDocument(file: File): string | null {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return "Invalid file format. Only PDF, JPG, and PNG are allowed.";
  }
  if (file.size > maxSize) {
    return "File size exceeds 5MB limit.";
  }

  return null;
}
