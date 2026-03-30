import { describe, it, expect } from "vitest";
import { checkAge } from "../lib/registration-utils";
import { Player, CompetitionCategory } from "../types";

describe("Comprehensive Age Category Validation", () => {
  const refDateStr = "2026-03-30";
  
  const createPlayer = (dob: string): Player => ({
    id: "p1",
    globalId: "G1",
    name: "Test Player",
    dateOfBirth: dob,
    nik: "123",
    age: 0,
    email: "test@test.com",
    phone: "123",
    ageCategory: "U10",
    position: "ST",
    parent: { motherName: "Mother", contactNumber: "123", relationshipType: "Mother", email: "test@test.com" },
    address: "Address",
    ssbId: "ssb1",
    status: "active",
    verificationStatus: "verified",
    documents: {},
    developmentNotes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const createCategory = (ageCat: string, min?: number, max?: number): CompetitionCategory => ({
    id: "c1",
    competitionId: "comp1",
    ageCategory: ageCat as any,
    minAge: min,
    maxAge: max,
    maxTeams: 16
  });

  it("should validate U8 correctly (age < 8)", () => {
    const cat = createCategory("U8");
    expect(checkAge(createPlayer("2019-03-31"), cat, refDateStr).isValid).toBe(true);
    expect(checkAge(createPlayer("2018-03-30"), cat, refDateStr).isValid).toBe(false);
  });

  it("should validate U10 correctly (age < 10)", () => {
    const cat = createCategory("U10");
    expect(checkAge(createPlayer("2018-03-31"), cat, refDateStr).isValid).toBe(true);
    expect(checkAge(createPlayer("2016-03-30"), cat, refDateStr).isValid).toBe(false);
  });

  it("should respect explicit minAge and maxAge", () => {
    const cat = createCategory("U12", 10, 11);
    // Age 11
    expect(checkAge(createPlayer("2015-03-30"), cat, refDateStr).isValid).toBe(true);
    // Age 9
    expect(checkAge(createPlayer("2017-03-30"), cat, refDateStr).isValid).toBe(false);
    // Age 12
    expect(checkAge(createPlayer("2014-03-30"), cat, refDateStr).isValid).toBe(false);
  });
});
