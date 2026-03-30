import { describe, it, expect } from 'vitest';
import { checkAge } from '../lib/registration-utils';
import { Player, CompetitionCategory } from '../types';

describe('Single Player Identity Logic & Age Validation', () => {
  const mockPlayer: Player = {
    id: 'p1',
    globalId: 'P-2026-0001',
    name: 'Ahmad Rizki',
    nik: '3201010503160001',
    dateOfBirth: '2016-03-15',
    age: 10,
    email: 'ahmad@email.com',
    phone: '08123456789',
    ageCategory: 'U10',
    position: 'ST',
    parent: { motherName: 'Siti Aminah', contactNumber: '08123456789', relationshipType: 'Mother', email: 'budi.rizki@email.com' },
    address: 'Jl. Merdeka No. 12, Jakarta',
    ssbId: 'ssb1',
    status: 'active',
    verificationStatus: 'verified',
    documents: {},
    developmentNotes: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  const createCategory = (ageCat: string, minAge?: number, maxAge?: number): CompetitionCategory => ({
    id: 'cat1',
    competitionId: 'comp1',
    ageCategory: ageCat as any,
    minAge,
    maxAge,
    maxTeams: 16,
    registrationFee: 500000
  });

  describe('Age Validation Rules', () => {
    it('should pass validation for player within U10 category (Date: 2026-01-01)', () => {
      // Player born 2016-03-15, in 2026-01-01 he is 9 years old.
      const category = createCategory('U10', 8, 9);
      const result = checkAge(mockPlayer, category, '2026-01-01');
      expect(result.isValid).toBe(true);
    });

    it('should fail validation if player exceeds max age for U10 in 2027', () => {
      // In 2027-04-01, he will be 11 years old.
      const category = createCategory('U10', 8, 9);
      const result = checkAge(mockPlayer, category, '2027-04-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('melampaui batas usia');
    });

    it('should pass validation for U12 if born in 2016 (Age 11 in 2027)', () => {
      const category = createCategory('U12', 10, 11);
      const result = checkAge(mockPlayer, category, '2027-04-01');
      expect(result.isValid).toBe(true);
    });

    it('should handle standard "U" prefix categories automatically (U10 means < 10 years)', () => {
      // In 2026-01-01, he is 9 years old. U10 means < 10.
      const category = createCategory('U10');
      const result = checkAge(mockPlayer, category, '2026-01-01');
      expect(result.isValid).toBe(true);

      // In 2026-04-01, he is 10 years old. U10 means < 10.
      const result2 = checkAge(mockPlayer, category, '2026-04-01');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('tidak memenuhi kriteria kategori U10');
    });
  });

  describe('Competition History Integrity', () => {
    it('should allow adding competition history records', () => {
      const updatedPlayer = { ...mockPlayer };
      updatedPlayer.competitionHistory.push({
        id: 'h1',
        playerId: 'p1',
        competitionId: 'comp1',
        competitionName: 'Liga Junior 2026',
        categoryId: 'cat1',
        teamId: 'tt1',
        teamName: 'Garuda Muda',
        participationDate: '2026-04-01',
        achievement: 'Winner',
        pointsEarned: 10
      });

      expect(updatedPlayer.competitionHistory.length).toBe(1);
      expect(updatedPlayer.competitionHistory[0].achievement).toBe('Winner');
    });
  });
});
