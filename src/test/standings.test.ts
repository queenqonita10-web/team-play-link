import { describe, it, expect } from "vitest";
import { calculateStandings } from "@/lib/standings-utils";
import { TournamentTeam, TournamentMatch } from "@/types";

describe("Standings Calculation Logic", () => {
  const mockTeams: TournamentTeam[] = [
    { id: "t1", name: "Team A", competitionId: "c1", categoryId: "cat1", ssbId: "ssb1", status: "approved", registeredAt: "", players: [] },
    { id: "t2", name: "Team B", competitionId: "c1", categoryId: "cat1", ssbId: "ssb2", status: "approved", registeredAt: "", players: [] },
    { id: "t3", name: "Team C", competitionId: "c1", categoryId: "cat1", ssbId: "ssb3", status: "approved", registeredAt: "", players: [] },
  ];

  const baseMatch = { goals: [], cards: [], auditLog: [] };

  it("should calculate correct points and goal difference", () => {
    const mockMatches: TournamentMatch[] = [
      {
        ...baseMatch,
        id: "m1", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t1", awayTeamId: "t2", homeScore: 2, awayScore: 0,
        date: "", time: "", venue: "", status: "completed"
      },
      {
        ...baseMatch,
        id: "m2", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t2", awayTeamId: "t3", homeScore: 1, awayScore: 1,
        date: "", time: "", venue: "", status: "completed"
      }
    ];

    const standings = calculateStandings(mockTeams, mockMatches);

    expect(standings[0].teamId).toBe("t1");
    expect(standings[0].points).toBe(3);
    expect(standings[0].goalDifference).toBe(2);

    const teamB = standings.find(s => s.teamId === "t2");
    expect(teamB?.points).toBe(1);
    expect(teamB?.goalDifference).toBe(-2);

    const teamC = standings.find(s => s.teamId === "t3");
    expect(teamC?.points).toBe(1);
    expect(teamC?.goalDifference).toBe(0);
  });

  it("should sort standings correctly (Points > GD > Goals For)", () => {
    const mockMatches: TournamentMatch[] = [
      {
        ...baseMatch,
        id: "m1", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t1", awayTeamId: "t2", homeScore: 1, awayScore: 0,
        date: "", time: "", venue: "", status: "completed"
      },
      {
        ...baseMatch,
        id: "m2", competitionId: "c1", categoryId: "cat1", stage: "Group A",
        homeTeamId: "t3", awayTeamId: "t1", homeScore: 2, awayScore: 1,
        date: "", time: "", venue: "", status: "completed"
      }
    ];

    const standings = calculateStandings(mockTeams, mockMatches);

    expect(standings[0].teamId).toBe("t3");
    expect(standings[1].teamId).toBe("t1");
    expect(standings[2].teamId).toBe("t2");
  });
});