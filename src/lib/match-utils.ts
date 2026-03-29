import { TournamentMatch, MatchGoal, MatchStatus, MatchStatistics, MatchCard } from "@/types";

/**
 * Calculates the current score of a match based on the list of goals.
 * Correctly handles regular goals, penalties, and own goals.
 * 
 * @param goals - Array of goals scored in the match
 * @param homeTeamId - Unique identifier for the home team
 * @param awayTeamId - Unique identifier for the away team
 * @returns An object containing homeScore and awayScore
 */
export function calculateScore(goals: MatchGoal[], homeTeamId: string, awayTeamId: string): { homeScore: number; awayScore: number } {
  return goals.reduce((score, goal) => {
    const isHomeGoal = goal.teamId === homeTeamId;
    const isOwnGoal = goal.type === "own_goal";

    if (isOwnGoal) {
      // If home team scores an own goal, away team gets a point
      if (isHomeGoal) score.awayScore += 1;
      else score.homeScore += 1;
    } else {
      // Regular goal or penalty
      if (isHomeGoal) score.homeScore += 1;
      else score.awayScore += 1;
    }
    return score;
  }, { homeScore: 0, awayScore: 0 });
}

/**
 * Validates if a match operation is allowed based on the current match state.
 * 
 * @param match - The current match object
 * @param action - The action being performed (e.g., 'ADD_GOAL', 'ADD_CARD')
 * @param value - The data associated with the action
 * @returns A string containing the error message if invalid, otherwise null
 */
export function validateMatchUpdate(
  match: TournamentMatch, 
  action: "ADD_GOAL" | "ADD_CARD" | "UPDATE_STATS" | "UPDATE_STATUS", 
  value: any
): string | null {
  // 1. Check match status
  const forbiddenStatuses: MatchStatus[] = ["completed", "cancelled", "postponed"];
  if (forbiddenStatuses.includes(match.status) && action !== "UPDATE_STATUS") {
    return `Cannot perform ${action} on a match that is ${match.status}.`;
  }

  // 2. Validate specific action data
  try {
    if (action === "ADD_GOAL" || action === "ADD_CARD") {
      const minute = value?.minute;
      if (typeof minute !== 'number' || minute < 0 || minute > 130) {
        return "Invalid match minute. Must be between 0 and 130.";
      }
      if (!value?.playerId || !value?.teamId) {
        return "Missing required player or team identification.";
      }
    }

    if (action === "UPDATE_STATS") {
      if (value?.possession && (value.possession < 0 || value.possession > 100)) {
        return "Possession must be between 0 and 100%.";
      }
    }
  } catch (error) {
    console.error(`Validation error in ${action}:`, error);
    return "Data validation failed due to internal error.";
  }

  return null;
}

/**
 * Creates a standardized audit log entry for match modifications.
 */
export function createAuditLog(
  userId: string, 
  action: string, 
  oldValue?: any, 
  newValue?: any
) {
  return {
    action,
    userId,
    timestamp: new Date().toISOString(),
    oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : null, // Deep copy
    newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : null  // Deep copy
  };
}
