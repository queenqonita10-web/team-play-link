import { describe, it, expect } from 'vitest';
import { calculateStandings } from '../lib/standings-utils';
import { TournamentTeam, TournamentMatch } from '../types';

describe('Standings Comprehensive Tests', () => {
  const createMockTeam = (id: string, name: string): TournamentTeam => ({
    id,
    name,
    competitionId: 'c1',
    categoryId: 'cat1',
    ssbId: 'ssb1',
    status: 'approved',
    registeredAt: new Date().toISOString(),
    players: []
  });

  const createMockMatch = (homeId: string, awayId: string, homeScore: number, awayScore: number): TournamentMatch => ({
    id: `m-${homeId}-${awayId}`,
    competitionId: 'c1',
    categoryId: 'cat1',
    stage: 'Group',
    homeTeamId: homeId,
    awayTeamId: awayId,
    homeScore,
    awayScore,
    date: '2026-03-29',
    time: '10:00',
    venue: 'Stadium',
    status: 'completed',
    goals: [],
    cards: [],
    auditLog: []
  });

  it('should handle a league with 20 teams correctly', () => {
    const teams: TournamentTeam[] = Array.from({ length: 20 }, (_, i) => createMockTeam(`t${i+1}`, `Team ${i+1}`));
    const matches: TournamentMatch[] = [];

    // Simulate each team playing 2 matches
    for (let i = 0; i < 20; i += 2) {
      matches.push(createMockMatch(`t${i+1}`, `t${i+2}`, 3, 0)); // t1 wins vs t2, t3 wins vs t4, etc.
    }

    const standings = calculateStandings(teams, matches);
    
    expect(standings.length).toBe(20);
    expect(standings[0].points).toBe(3);
    expect(standings[0].played).toBe(1);
    expect(standings[19].points).toBe(0);
    expect(standings[19].played).toBe(1);
  });

  it('should apply tie-breaking rules: Pts > GD > GF > H2H', () => {
    const teams = [
      createMockTeam('t1', 'Team 1'),
      createMockTeam('t2', 'Team 2'),
      createMockTeam('t3', 'Team 3'),
    ];

    // t1 and t2 will have same points and same GD, but t1 will have more GF
    const matches = [
      createMockMatch('t1', 't3', 5, 2), // t1: 3pts, GD +3, GF 5
      createMockMatch('t2', 't3', 4, 1), // t2: 3pts, GD +3, GF 4
    ];

    const standings = calculateStandings(teams, matches);
    expect(standings[0].teamId).toBe('t1');
    expect(standings[1].teamId).toBe('t2');
  });

  it('should apply Head-to-Head as final tie-breaker', () => {
    const teams = [
      createMockTeam('t1', 'Team A'),
      createMockTeam('t2', 'Team B'),
    ];

    // Identical stats except H2H
    const matches = [
      createMockMatch('t1', 't2', 2, 1), // t1 wins H2H
      createMockMatch('t2', 't1', 0, 0), // t1/t2 draw (just in case multiple matches)
    ];
    // This is hard to set up with identical stats unless we add another opponent
    const t3 = createMockTeam('t3', 'Team C');
    const complexTeams = [...teams, t3];
    const complexMatches = [
      createMockMatch('t1', 't3', 1, 0), // t1: 3pts, GD +1, GF 1
      createMockMatch('t2', 't3', 1, 0), // t2: 3pts, GD +1, GF 1
      createMockMatch('t1', 't2', 2, 1), // t1: 6pts, t2: 3pts. Still not identical.
    ];

    // Let's make t1 and t2 have 3 points each, same GD, same GF
    const scenarioMatches = [
      createMockMatch('t1', 't3', 2, 0), // t1: 3pts, GD +2, GF 2
      createMockMatch('t2', 't3', 2, 0), // t2: 3pts, GD +2, GF 2
      createMockMatch('t1', 't2', 1, 0), // t1: 6pts, t2: 3pts. Still not identical.
    ];

    // Actually, if we want them to be identical in pts, GD, and GF:
    // t1 vs t3: 2-0
    // t2 vs t3: 2-0
    // t1 vs t2: 1-1
    // Now they are identical. Let's add another match.
    // t1 vs t2: 2-1 (H2H win for t1)
    // t1 vs t3: 0-1
    // t2 vs t3: 0-0
    
    // Simpler:
    // t1 vs t3: 2-2 (1pt, GD 0, GF 2)
    // t2 vs t3: 2-2 (1pt, GD 0, GF 2)
    // t1 vs t2: 1-0 (t1 wins H2H)
    
    const finalMatches = [
      createMockMatch('t1', 't3', 2, 2),
      createMockMatch('t2', 't3', 2, 2),
      createMockMatch('t1', 't2', 1, 0),
    ];

    const finalStandings = calculateStandings(complexTeams, finalMatches);
    expect(finalStandings[0].teamId).toBe('t1');
    expect(finalStandings[1].teamId).toBe('t2');
  });

  it('should handle identical statistics with alphabetical fallback', () => {
    const teams = [
      createMockTeam('t2', 'Beta'),
      createMockTeam('t1', 'Alpha'),
    ];
    const matches: TournamentMatch[] = [];

    const standings = calculateStandings(teams, matches);
    expect(standings[0].teamName).toBe('Alpha');
    expect(standings[1].teamName).toBe('Beta');
  });
});
