import { describe, it, expect } from "vitest";
import { SkillRating } from "@/types";

function calculateOverallAverage(rating: Partial<SkillRating>): number {
  const categories = [
    'passing', 'shooting', 'dribbling', 'firstTouch',
    'speed', 'stamina', 'strength', 'agility',
    'positioning', 'vision', 'decisionMaking', 'teamwork',
    'leadership', 'composure', 'workEthic', 'coachability'
  ];
  
  const sum = categories.reduce((acc, cat) => acc + (rating[cat as keyof SkillRating] as number || 0), 0);
  return Number((sum / categories.length).toFixed(1));
}

describe("Player Development Logic", () => {
  it("should calculate correct overall average for skill rating", () => {
    const rating: Partial<SkillRating> = {
      passing: 8, shooting: 8, dribbling: 8, firstTouch: 8,
      speed: 6, stamina: 6, strength: 6, agility: 6,
      positioning: 7, vision: 7, decisionMaking: 7, teamwork: 7,
      leadership: 5, composure: 5, workEthic: 5, coachability: 5
    };
    
    // Sum = (8*4) + (6*4) + (7*4) + (5*4) = 32 + 24 + 28 + 20 = 104
    // Average = 104 / 16 = 6.5
    expect(calculateOverallAverage(rating)).toBe(6.5);
  });

  it("should handle missing categories in average calculation", () => {
    const partialRating: Partial<SkillRating> = {
      passing: 10,
      shooting: 10
    };
    // Sum = 20, Average = 20 / 16 = 1.25 -> 1.3
    expect(calculateOverallAverage(partialRating)).toBe(1.3);
  });
});
