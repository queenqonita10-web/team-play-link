import { describe, it, expect } from 'vitest';
import { calculateScore, validateMatchUpdate } from '../lib/match-utils';
import { MatchGoal, TournamentMatch } from '../types';

describe('Match Management Logic', () => {
  const homeTeamId = 'home-1';
  const awayTeamId = 'away-1';

  describe('Score Calculation', () => {
    it('should calculate regular goals correctly', () => {
      const goals: MatchGoal[] = [
        { id: '1', matchId: 'm1', teamId: homeTeamId, playerId: 'p1', minute: 10, type: 'regular' },
        { id: '2', matchId: 'm1', teamId: homeTeamId, playerId: 'p2', minute: 20, type: 'regular' },
        { id: '3', matchId: 'm1', teamId: awayTeamId, playerId: 'p3', minute: 30, type: 'regular' },
      ];

      const score = calculateScore(goals, homeTeamId, awayTeamId);
      expect(score.homeScore).toBe(2);
      expect(score.awayScore).toBe(1);
    });

    it('should handle own goals correctly', () => {
      const goals: MatchGoal[] = [
        { id: '1', matchId: 'm1', teamId: homeTeamId, playerId: 'p1', minute: 10, type: 'own_goal' },
      ];

      const score = calculateScore(goals, homeTeamId, awayTeamId);
      expect(score.homeScore).toBe(0);
      expect(score.awayScore).toBe(1);
    });

    it('should calculate complex goal scenarios', () => {
      const goals: MatchGoal[] = [
        { id: '1', matchId: 'm1', teamId: homeTeamId, playerId: 'p1', minute: 10, type: 'regular' },
        { id: '2', matchId: 'm1', teamId: awayTeamId, playerId: 'p2', minute: 20, type: 'own_goal' },
        { id: '3', matchId: 'm1', teamId: awayTeamId, playerId: 'p3', minute: 30, type: 'penalty' },
      ];

      const score = calculateScore(goals, homeTeamId, awayTeamId);
      expect(score.homeScore).toBe(2); // 1 regular + 1 own goal by away team
      expect(score.awayScore).toBe(1); // 1 penalty
    });
  });

  describe('Match Update Validation', () => {
    const mockMatch: TournamentMatch = {
      id: 'm1',
      status: 'live',
      homeTeamId,
      awayTeamId,
      homeScore: 0,
      awayScore: 0,
      goals: [],
      cards: [],
      auditLog: [],
      competitionId: 'c1',
      categoryId: 'cat1',
      stage: 'Group',
      date: '2026-03-29',
      time: '10:00',
      venue: 'Stadium'
    };

    it('should prevent updates on completed matches', () => {
      const completedMatch = { ...mockMatch, status: 'completed' as const };
      const error = validateMatchUpdate(completedMatch, 'ADD_GOAL', {});
      expect(error).toBe('Cannot perform ADD_GOAL on a completed match.');
    });

    it('should validate goal minutes', () => {
      const invalidGoal = { minute: 125 };
      const error = validateMatchUpdate(mockMatch, 'ADD_GOAL', invalidGoal);
      expect(error).toBe('Invalid match minute.');
    });

    it('should allow valid updates', () => {
      const validGoal = { minute: 45 };
      const error = validateMatchUpdate(mockMatch, 'ADD_GOAL', validGoal);
      expect(error).toBeNull();
    });
  });
});
