import { describe, it, expect } from "vitest";
import { calculateStandings } from "@/lib/standings-utils";
import { TournamentTeam, TournamentMatch } from "@/types";

describe("Standings Calculation Logic", () => {
  const mockTeams: TournamentTeam[] = [
    { id: "t1", name: "Team A", competitionId: "c1", categoryId: "cat1", ssbId: "ssb1", status: "approved", registeredAt: "", players: [] },
    { id: "t2", name: "Team B", competitionId: "c1", categoryId: "cat1", ssbId: "ssb2", status: "approved", registeredAt: "", players: [] },
    { id: "t3", name: "Team C", competitionId: "c1", categoryId: "cat1", ssbId: "ssb3", status: "approved", registeredAt: "", players: [] },
  ];

  it("should calculate correct points and goal difference", () => {
    const mockMatches: TournamentMatch[] = [
      {
        id: "m1", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t1", awayTeamId: "t2", homeScore: 2, awayScore: 0,
        date: "", time: "", venue: "", status: "completed"
      },
      {
        id: "m2", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t2", awayTeamId: "t3", homeScore: 1, awayScore: 1,
        date: "", time: "", venue: "", status: "completed"
      }
    ];

    const standings = calculateStandings(mockTeams, mockMatches);

    // Team A: 1 Win, 3 Pts, +2 GD
    expect(standings[0].teamId).toBe("t1");
    expect(standings[0].points).toBe(3);
    expect(standings[0].goalDifference).toBe(2);

    // Team B: 1 Draw, 1 Loss, 1 Pts, -2 GD
    const teamB = standings.find(s => s.teamId === "t2");
    expect(teamB?.points).toBe(1);
    expect(teamB?.goalDifference).toBe(-2);

    // Team C: 1 Draw, 1 Pts, 0 GD
    const teamC = standings.find(s => s.teamId === "t3");
    expect(teamC?.points).toBe(1);
    expect(teamC?.goalDifference).toBe(0);
  });

  it("should sort standings correctly (Points > GD > Goals For)", () => {
    const mockMatches: TournamentMatch[] = [
      {
        id: "m1", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t1", awayTeamId: "t2", homeScore: 1, awayScore: 0,
        date: "", time: "", venue: "", status: "completed"
      },
      {
        id: "m2", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t3", awayTeamId: "t1", homeScore: 2, awayScore: 1,
        date: "", time: "", venue: "", status: "completed"
      }
    ];

    const standings = calculateStandings(mockTeams, mockMatches);

    // Team T3: 3 Pts (1W, 0L), GD +1
    // Team T1: 3 Pts (1W, 1L), GD 0
    // Team T2: 0 Pts (0W, 1L), GD -1

    expect(standings[0].teamId).toBe("t3");
    expect(standings[1].teamId).toBe("t1");
    expect(standings[2].teamId).toBe("t2");
  });
});
