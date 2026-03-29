import { Player, TournamentTeam, CompetitionRegistration, SquadValidationResult } from "@/types";
import { validateSquad } from "@/lib/registration-utils";

/**
 * Service to handle integration between SSB and EO.
 * Manages player synchronization and registration approval workflows.
 */
export class IntegrationService {
  /**
   * Syncs a player from SSB database to EO competition database.
   * Ensures the Global Player Identity (UUID) is maintained.
   * 
   * @param player - The source player from SSB
   * @param competitionId - The target competition ID
   */
  static syncPlayerToCompetition(player: Player, competitionId: string): Player {
    // In a real system, this would involve cross-tenant database operations
    // or calls to the Global Player Identity Microservice.
    console.log(`Syncing Player ${player.globalId} to Competition ${competitionId}...`);
    
    return {
      ...player,
      // Ensure specific fields are sanitized or updated for competition context
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Submits a squad for registration in a competition category.
   * Triggers the validation and approval workflow.
   * 
   * @param players - The selected squad (SSB players)
   * @param competitionId - The target competition
   * @param categoryId - The target category
   * @param ssbId - The registering SSB ID
   */
  static async submitSquadRegistration(
    players: Player[],
    competitionId: string,
    categoryId: string,
    ssbId: string,
    teamName: string
  ): Promise<{ success: boolean; result: SquadValidationResult; registrationId?: string }> {
    // 1. Validate the squad using shared rules
    // (In a real app, this would fetch the category rules from DB)
    const mockCategory = { 
      id: categoryId, 
      competitionId, 
      ageCategory: "U12" as any, 
      maxTeams: 16,
      registrationFee: 500000 
    };
    
    const validation = validateSquad(players, mockCategory, new Date().toISOString());

    if (!validation.isValid) {
      return { success: false, result: validation };
    }

    // 2. If valid, create a pending registration record
    const registrationId = `REG-${Date.now()}`;
    
    // Simulate API call to EO System
    console.log(`Squad registration submitted: ${registrationId} for ${teamName}`);

    return { 
      success: true, 
      result: validation,
      registrationId 
    };
  }

  /**
   * Handles the EO Admin's decision on a registration.
   */
  static async handleRegistrationDecision(
    registrationId: string,
    decision: "approve" | "reject",
    reason?: string
  ): Promise<boolean> {
    // Simulate updating the registration status and notifying the SSB Admin
    console.log(`Registration ${registrationId} has been ${decision}ed. Reason: ${reason || 'N/A'}`);
    
    // Integration logic: If approved, create the TournamentTeam record
    return true;
  }
}
