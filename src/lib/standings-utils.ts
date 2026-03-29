import { TournamentMatch, StandingRow, TournamentTeam } from "@/types";

/**
 * Calculates league standings based on team information and match results.
 * Sorting criteria: Points > Goal Difference > Goals For > Head-to-Head > Alphabetical.
 * 
 * @param teams - Array of teams in the competition category
 * @param matches - Array of matches played in the competition category
 * @returns Sorted array of standings
 */
export function calculateStandings(teams: TournamentTeam[], matches: TournamentMatch[]): StandingRow[] {
  if (!teams || teams.length === 0) return [];

  const standingsMap = new Map<string, StandingRow>();

  // Initialize standings for all teams
  teams.forEach(team => {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    });
  });

  // Process completed matches efficiently
  const completedMatches = matches.filter(m => m.status === "completed");
  
  for (const match of completedMatches) {
    const home = standingsMap.get(match.homeTeamId);
    const away = standingsMap.get(match.awayTeamId);

    if (!home || !away) continue;

    const hScore = match.homeScore || 0;
    const aScore = match.awayScore || 0;

    home.played += 1;
    away.played += 1;
    home.goalsFor += hScore;
    home.goalsAgainst += aScore;
    away.goalsFor += aScore;
    away.goalsAgainst += hScore;

    if (hScore > aScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (hScore < aScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  }

  // Pre-filter H2H matches for efficiency during sorting
  const h2hLookup = new Map<string, TournamentMatch[]>();
  completedMatches.forEach(m => {
    const key = [m.homeTeamId, m.awayTeamId].sort().join('-');
    if (!h2hLookup.has(key)) h2hLookup.set(key, []);
    h2hLookup.get(key)!.push(m);
  });

  // Sort standings: Points > Goal Difference > Goals For > Head-to-Head > Alphabetical
  return Array.from(standingsMap.values()).sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Goal Difference
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    
    // 3. Goals For
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // 4. Head-to-Head
    const h2hKey = [a.teamId, b.teamId].sort().join('-');
    const h2hMatches = h2hLookup.get(h2hKey) || [];

    if (h2hMatches.length > 0) {
      let aH2HPoints = 0;
      let bH2HPoints = 0;
      let aH2HGD = 0;
      let bH2HGD = 0;

      h2hMatches.forEach(m => {
        const isAHome = m.homeTeamId === a.teamId;
        const aScore = isAHome ? m.homeScore : m.awayScore;
        const bScore = isAHome ? m.awayScore : m.homeScore;

        if (aScore > bScore) aH2HPoints += 3;
        else if (aScore < bScore) bH2HPoints += 3;
        else { aH2HPoints += 1; bH2HPoints += 1; }

        aH2HGD += (aScore - bScore);
        bH2HGD += (bScore - aScore);
      });

      if (bH2HPoints !== aH2HPoints) return bH2HPoints - aH2HPoints;
      if (bH2HGD !== aH2HGD) return bH2HGD - aH2HGD;
    }

    // 5. Alphabetical (fallback)
    return a.teamName.localeCompare(b.teamName);
  });
}
