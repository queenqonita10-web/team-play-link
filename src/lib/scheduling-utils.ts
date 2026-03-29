import { TournamentMatch, TournamentTeam, MatchStatus } from "@/types";

/**
 * Generates a round-robin schedule for a given set of teams.
 * 
 * @param teams - Array of teams to participate in the round-robin
 * @param competitionId - ID of the competition
 * @param categoryId - ID of the category
 * @param startDate - Start date for the matches (ISO string)
 * @param venue - Venue for the matches
 */
export function generateRoundRobin(
  teams: TournamentTeam[],
  competitionId: string,
  categoryId: string,
  startDate: string,
  venue: string
): TournamentMatch[] {
  if (teams.length < 2) return [];

  const matches: TournamentMatch[] = [];
  const teamList = [...teams];
  
  // If odd number of teams, add a "BYE" team
  if (teamList.length % 2 !== 0) {
    teamList.push({ id: "bye", name: "BYE" } as any);
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;

  let currentDate = new Date(startDate);

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < matchesPerRound; i++) {
      const home = teamList[i];
      const away = teamList[numTeams - 1 - i];

      // Skip matches with "BYE"
      if (home.id !== "bye" && away.id !== "bye") {
        matches.push({
          id: `m-rr-${round}-${i}-${Date.now()}`,
          competitionId,
          categoryId,
          stage: `Round ${round + 1}`,
          homeTeamId: home.id,
          awayTeamId: away.id,
          homeScore: 0,
          awayScore: 0,
          date: currentDate.toISOString().split("T")[0],
          time: "10:00",
          venue,
          status: "scheduled",
          goals: [],
          cards: [],
          auditLog: []
        });
      }
    }

    // Rotate teams (keep the first team fixed)
    teamList.splice(1, 0, teamList.pop()!);
    // Advance date by 1 day per round (simulation)
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return matches;
}

/**
 * Generates a knockout schedule for a given set of teams.
 * 
 * @param teams - Array of teams to participate (must be power of 2: 2, 4, 8, 16, 32)
 * @param competitionId - ID of the competition
 * @param categoryId - ID of the category
 * @param startDate - Start date for the matches (ISO string)
 * @param venue - Venue for the matches
 */
export function generateKnockout(
  teams: TournamentTeam[],
  competitionId: string,
  categoryId: string,
  startDate: string,
  venue: string
): TournamentMatch[] {
  if (teams.length < 2) return [];

  const matches: TournamentMatch[] = [];
  const numTeams = teams.length;
  
  // Simple check for power of 2 (in real scenario, we'd handle "BYEs" or "Play-offs")
  const numRounds = Math.log2(numTeams);
  let currentTeams = [...teams];
  let currentDate = new Date(startDate);

  for (let round = 0; round < numRounds; round++) {
    const stageName = getStageName(numTeams / Math.pow(2, round));
    const nextRoundTeams: string[] = [];
    
    for (let i = 0; i < currentTeams.length; i += 2) {
      const home = currentTeams[i];
      const away = currentTeams[i + 1];

      matches.push({
        id: `m-ko-${round}-${i}-${Date.now()}`,
        competitionId,
        categoryId,
        stage: stageName,
        homeTeamId: home.id,
        awayTeamId: away.id,
        homeScore: 0,
        awayScore: 0,
        date: currentDate.toISOString().split("T")[0],
        time: "10:00",
        venue,
        status: "scheduled",
        goals: [],
        cards: [],
        auditLog: []
      });
    }

    // Advance date by 2 days per round (simulation)
    currentDate.setDate(currentDate.getDate() + 2);
    // In a real KO, we'd need to wait for match results to populate the next round
    // This is just a skeletal generation for the first round
    if (round === 0) break; // Only generate the first round for now
  }

  return matches;
}

function getStageName(numTeamsInRound: number): string {
  switch (numTeamsInRound) {
    case 2: return "Final";
    case 4: return "Semi Final";
    case 8: return "Quarter Final";
    case 16: return "Round of 16";
    case 32: return "Round of 32";
    default: return `Round of ${numTeamsInRound}`;
  }
}
