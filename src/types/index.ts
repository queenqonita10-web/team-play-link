export type AgeCategory = "U8" | "U10" | "U12" | "U14" | "U17";
export type Position = "GK" | "CB" | "LB" | "RB" | "CM" | "LM" | "RM" | "CAM" | "LW" | "RW" | "ST";
export type TournamentFormat = "group" | "knockout" | "festival";
export type PaymentStatus = "paid" | "unpaid";
export type AttendanceStatus = "present" | "absent";
export type CardType = "yellow" | "red";
export type PlayerStatus = "active" | "inactive";

export interface DevelopmentNote {
  id: string;
  date: string;
  type: "training" | "coach";
  note: string;
  author: string;
}

export interface PlayerDocuments {
  birthCertificate?: string;
  familyCard?: string;
  photo?: string;
}

export interface Player {
  id: string;
  name: string;
  nik: string;
  dateOfBirth: string;
  ageCategory: AgeCategory;
  position: Position;
  parentName: string;
  motherName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  ssbId: string;
  photoUrl?: string;
  status: PlayerStatus;
  documents: PlayerDocuments;
  developmentNotes: DevelopmentNote[];
}

export interface TrainingSession {
  id: string;
  date: string;
  time: string;
  group: string;
  ageCategory: AgeCategory;
  venue: string;
  coach: string;
}

export interface AttendanceRecord {
  id: string;
  playerId: string;
  sessionId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Payment {
  id: string;
  playerId: string;
  month: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  ageCategories: AgeCategory[];
  startDate: string;
  endDate: string;
  venue: string;
  status: "upcoming" | "ongoing" | "completed";
  teamsCount: number;
}

export interface Team {
  id: string;
  name: string;
  ssbName: string;
  ageCategory: AgeCategory;
  tournamentId: string;
  players: string[];
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  stage: string;
  status: "scheduled" | "live" | "completed";
  scorers?: { playerId: string; playerName: string; team: string; minute: number }[];
  cards?: { playerId: string; playerName: string; team: string; type: CardType; minute: number }[];
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
