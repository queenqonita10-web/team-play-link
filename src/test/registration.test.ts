import { describe, it, expect } from "vitest";
import { checkAge, checkQuota, checkDuplicates, validateSquad } from "@/lib/registration-utils";
import { Player, CompetitionCategory } from "@/types";

describe("Registration Logic Validation", () => {
  const mockCategory: CompetitionCategory = {
    id: "cat1",
    competitionId: "comp1",
    ageCategory: "U12",
    minAge: 10,
    maxAge: 11,
    maxTeams: 16
  };

  const competitionDate = "2026-04-01";

  const validPlayer: Player = {
    id: "p1", globalId: "G1", name: "Player 1", nik: "123", 
    dateOfBirth: "2015-01-01", ageCategory: "U12", position: "GK",
    parentName: "", motherName: "", parentPhone: "", parentEmail: "", 
    address: "", ssbId: "ssb1", status: "active", documents: {}, developmentNotes: []
  };

  describe("checkAge", () => {
    it("should validate age correctly within range", () => {
      // Born 2015, Comp 2026 -> Age 11
      const result = checkAge(validPlayer, mockCategory, competitionDate);
      expect(result.isValid).toBe(true);
    });

    it("should reject players who are too old", () => {
      const oldPlayer = { ...validPlayer, dateOfBirth: "2013-01-01" }; // Age 13
      const result = checkAge(oldPlayer, mockCategory, competitionDate);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("melampaui batas usia");
    });

    it("should reject players who are too young", () => {
      const youngPlayer = { ...validPlayer, dateOfBirth: "2018-01-01" }; // Age 8
      const result = checkAge(youngPlayer, mockCategory, competitionDate);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("terlalu muda");
    });
  });

  describe("checkQuota", () => {
    it("should reject squads smaller than minimum", () => {
      const result = checkQuota([validPlayer], 12, 22);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("kurang dari minimal");
    });

    it("should reject squads without a goalkeeper", () => {
      const outfieldPlayer = { ...validPlayer, position: "ST" as any };
      const squad = Array(12).fill(outfieldPlayer);
      const result = checkQuota(squad, 12, 22);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("minimal 1 penjaga gawang");
    });
  });

  describe("checkDuplicates", () => {
    it("should detect duplicate players by globalId", () => {
      const squad = [validPlayer, { ...validPlayer, id: "p2" }]; // Same globalId "G1"
      const result = checkDuplicates(squad);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("duplikasi");
    });
  });

  describe("validateSquad", () => {
    it("should return valid result for a perfect squad", () => {
      const squad = [
        { ...validPlayer, id: "p1", globalId: "G1", position: "GK" as any },
        ...Array(11).fill(null).map((_, i) => ({
          ...validPlayer, id: `p${i+2}`, globalId: `G${i+2}`, position: "ST" as any
        }))
      ];
      const result = validateSquad(squad, mockCategory, competitionDate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
