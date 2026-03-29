import { differenceInYears, parseISO } from "date-fns";
import { Player, CompetitionCategory, SquadValidationResult } from "@/types";

/**
 * Validates player age against competition category rules.
 * Standard "U" categories (e.g., U10) mean the player must be UNDER that age 
 * as of the competition date.
 * 
 * @param player - Player object containing dateOfBirth
 * @param category - Competition category with age rules
 * @param competitionDate - The reference date for age calculation (ISO string)
 */
export function checkAge(player: Player, category: CompetitionCategory, competitionDate: string): { isValid: boolean; error?: string } {
  if (!player.dateOfBirth) return { isValid: false, error: "Player birth date is missing." };
  
  const birthDate = parseISO(player.dateOfBirth);
  const compDate = parseISO(competitionDate);
  
  if (isNaN(birthDate.getTime()) || isNaN(compDate.getTime())) {
    return { isValid: false, error: "Invalid date format provided." };
  }

  const ageAtComp = differenceInYears(compDate, birthDate);

  // 1. Explicit minAge/maxAge check
  if (category.minAge !== undefined && ageAtComp < category.minAge) {
    return { 
      isValid: false, 
      error: `Pemain ${player.name} terlalu muda (Usia: ${ageAtComp}, Minimal: ${category.minAge}).` 
    };
  }

  if (category.maxAge !== undefined && ageAtComp > category.maxAge) {
    return { 
      isValid: false, 
      error: `Pemain ${player.name} melampaui batas usia (Usia: ${ageAtComp}, Maksimal: ${category.maxAge}).` 
    };
  }

  // 2. Automatic "U" Category Mapping (e.g., U10 means age < 10)
  const catAgeStr = category.ageCategory.match(/\d+/);
  if (catAgeStr && category.ageCategory.startsWith("U")) {
    const catAge = parseInt(catAgeStr[0]);
    if (ageAtComp >= catAge) {
      return { 
        isValid: false, 
        error: `Pemain ${player.name} (Usia: ${ageAtComp}) tidak memenuhi kriteria kategori ${category.ageCategory} (harus < ${catAge}).` 
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates squad size and mandatory position quotas.
 */
export function checkQuota(players: Player[], min: number = 12, max: number = 22): { isValid: boolean; error?: string } {
  const count = players.length;
  if (count < min) return { isValid: false, error: `Jumlah pemain (${count}) kurang dari minimal (${min}).` };
  if (count > max) return { isValid: false, error: `Jumlah pemain (${count}) melebihi maksimal (${max}).` };

  const hasGK = players.some(p => p.position === "GK");
  if (!hasGK) return { isValid: false, error: "Squad harus memiliki minimal 1 penjaga gawang (GK)." };

  return { isValid: true };
}

/**
 * Validates that there are no duplicate players in the squad using Global ID.
 */
export function checkDuplicates(players: Player[]): { isValid: boolean; error?: string } {
  const seenIds = new Set<string>();
  for (const p of players) {
    if (seenIds.has(p.globalId)) {
      return { isValid: false, error: `Duplikasi pemain ditemukan: ${p.name} (${p.globalId}).` };
    }
    seenIds.add(p.globalId);
  }
  return { isValid: true };
}

/**
 * Performs a comprehensive validation of a squad for competition registration.
 */
export function validateSquad(players: Player[], category: CompetitionCategory, competitionDate: string): SquadValidationResult {
  const result: SquadValidationResult = { isValid: true, errors: [], warnings: [] };

  const dupCheck = checkDuplicates(players);
  if (!dupCheck.isValid) {
    result.isValid = false;
    result.errors.push(dupCheck.error!);
  }

  const quotaCheck = checkQuota(players);
  if (!quotaCheck.isValid) {
    result.isValid = false;
    result.errors.push(quotaCheck.error!);
  }

  players.forEach(player => {
    const ageCheck = checkAge(player, category, competitionDate);
    if (!ageCheck.isValid) {
      result.isValid = false;
      result.errors.push(ageCheck.error!);
    }
    
    if (player.status !== "active") {
      result.warnings.push(`Pemain ${player.name} saat ini berstatus non-aktif.`);
    }
    if (player.verificationStatus !== "verified") {
      result.warnings.push(`Identitas pemain ${player.name} belum terverifikasi.`);
    }
  });

  return result;
}
