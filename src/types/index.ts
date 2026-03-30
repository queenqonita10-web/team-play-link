export type UserRole = "super_admin" | "eo_admin" | "eo_operator" | "ssb_admin" | "coach" | "parent" | "scout";
export { type UserRole as UserRoleType };
export type OrganizationType = "ssb" | "eo" | "scouting_agency";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId?: string;
  photoUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  tenantId: string;
  address: string;
  logoUrl?: string;
}

export type AgeCategory = "U8" | "U9" | "U10" | "U11" | "U12" | "U13" | "U14" | "U15" | "U17" | "U18" | "U20" | "Senior";
export type Position = "goalkeeper" | "defender" | "midfielder" | "forward" | "GK" | "CB" | "LB" | "RB" | "CM" | "LM" | "RM" | "CAM" | "ST" | "LW" | "RW";
export type CompetitionType = "league" | "tournament";
export type TournamentFormat = "group" | "knockout" | "hybrid";
export type MatchStatus = "scheduled" | "live" | "completed" | "cancelled" | "postponed";
export type GoalType = "regular" | "penalty" | "own_goal";
export type RegistrationStatus = "open" | "closed" | "upcoming";
export type PaymentStatus = "paid" | "unpaid" | "pending" | "overdue";
export type PaymentType = "monthly" | "registration" | "event";
export type AttendanceStatus = "present" | "permitted" | "absent";
export type AttendanceMethod = "qr_code" | "manual";
export type CardType = "yellow" | "red";
export type PlayerStatus = "active" | "inactive";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type ScheduleStatus = "scheduled" | "completed" | "cancelled";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface DevelopmentNote {
  id: string;
  date: string;
  type: "training" | "coach";
  note: string;
  author: string;
}

export interface PlayerDocuments {
  birthCertificate?: string; // File Path
  familyCard?: string;      // File Path
  photo?: string;           // File Path
  identityCard?: string;    // NIK/Passport Scan
  
  // Metadata for files
  files?: {
    id: string;
    type: "birth_certificate" | "family_card" | "photo" | "identity_card";
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  }[];
}

export interface ParentData {
  motherName: string;
  contactNumber: string;
  relationshipType: string;
  email?: string;
}

export interface PlayerStatusLog {
  id: string;
  playerId: string;
  oldStatus: PlayerStatus;
  newStatus: PlayerStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface CompetitionHistory {
  id: string;
  playerId: string;
  competitionId: string;
  competitionName: string;
  categoryId: string;
  teamId: string;
  teamName: string;
  participationDate: string;
  achievement?: string;
  pointsEarned?: number;
  stats?: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}

export interface Player {
  id: string;
  globalId: string; // Global Identity (UUID)
  name: string;
  nik: string; // Encrypted in backend
  dateOfBirth: string;
  age: number; // Calculated
  email: string;
  phone: string;
  ageCategory: AgeCategory;
  position: Position;
  
  parent: ParentData;
  
  address: string;
  ssbId: string; // Current SSB
  photoUrl?: string;
  status: PlayerStatus;
  verificationStatus: VerificationStatus;
  documents: PlayerDocuments;
  
  statusLogs?: PlayerStatusLog[];
  
  // Legacy flat fields (deprecated, use parent object)
  parentName?: string;
  motherName?: string;
  parentPhone?: string;
  parentEmail?: string;

  competitionHistory?: CompetitionHistory[];
  developmentNotes: DevelopmentNote[];
  skillRatings?: SkillRating[];
  evaluations?: CoachEvaluation[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // Soft Delete
}

export interface SkillRating {
  id: string;
  playerId: string;
  date: string;
  evaluatorId: string;
  
  // Teknik
  passing: number;
  shooting: number;
  dribbling: number;
  firstTouch: number;
  
  // Fisik
  speed: number;
  stamina: number;
  strength: number;
  agility: number;
  
  // Taktik
  positioning: number;
  vision: number;
  decisionMaking: number;
  teamwork: number;
  
  // Mental
  leadership: number;
  composure: number;
  workEthic: number;
  coachability: number;
  
  overallAverage: number;
}

export interface CoachEvaluation {
  id: string;
  playerId: string;
  evaluatorId: string;
  date: string;
  period: "weekly" | "monthly" | "quarterly";
  comments: {
    technical: string;
    physical: string;
    tactical: string;
    mental: string;
  };
  recommendations: string;
  strengths: string[];
  weaknesses: string[];
  nextTargets: string[];
}

export interface ProgressMetric {
  playerId: string;
  periodStart: string;
  periodEnd: string;
  skillGrowth: {
    category: string;
    growth: number;
  }[];
  summary: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
}

export interface TrainingSchedule {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  location: string;
  maxParticipants: number;
  status: ScheduleStatus;
  ageCategory: AgeCategory;
  groupId?: string;
  recurrence?: {
    type: RecurrenceType;
    endDate?: string; // ISO String
    exceptionDates?: string[]; // ISO Strings
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrainerAssignment {
  id: string;
  trainerId: string;
  scheduleId: string;
  role?: string; // e.g., "Main Coach", "Assistant"
  assignedAt: string;
}

export interface ParticipantGroup {
  id: string;
  name: string;
  ageCategory: AgeCategory;
  minSkillLevel?: number; // 1-5
  maxCapacity: number;
  players: string[]; // Player IDs
}

export interface NotificationLog {
  id: string;
  scheduleId: string;
  recipientId: string; // Parent/Player ID
  channel: "email" | "whatsapp" | "push";
  templateType: "reminder" | "change" | "cancellation";
  status: "sent" | "failed" | "delivered" | "bounced";
  sentAt: string;
  errorMessage?: string;
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
  checkInTime?: string; // ISO String
  status: AttendanceStatus;
  method: AttendanceMethod;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
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

export interface Invoice {
  id: string;
  playerId: string;
  type: PaymentType;
  description: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  paymentMethod?: "midtrans" | "xendit" | "manual";
}

export interface Competition {
  id: string;
  eoId: string;
  name: string;
  type: CompetitionType;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  registrationPeriod: {
    start: string;
    end: string;
  };
  status: "draft" | "upcoming" | "ongoing" | "completed";
  description?: string;
  prizeStructure?: string;
  participantLimit?: number;
}

export interface CompetitionCategory {
  id: string;
  competitionId: string;
  ageCategory: AgeCategory;
  minAge?: number;
  maxAge?: number;
  maxTeams: number;
  registrationFee: number;
  lateFee?: number;
  rules?: string;
}

export type PaymentMethod = "bank_transfer" | "virtual_account" | "ewallet" | "manual";

export interface CompetitionRegistration {
  id: string;
  competitionId: string;
  categoryId: string;
  ssbId: string;
  teamName: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  registeredAt: string;
  paymentStatus: PaymentStatus;
  invoiceId?: string;
  notes?: string;
}

export interface CompetitionInvoice {
  id: string;
  registrationId: string;
  invoiceNumber: string;
  amount: number;
  lateFee: number;
  discount: number;
  totalAmount: number;
  dueDate: string;
  status: PaymentStatus;
  paymentUrl?: string; // For gateway integration
  createdAt: string;
  paidAt?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  externalId: string; // ID from payment gateway
  amount: number;
  method: PaymentMethod;
  status: "pending" | "success" | "failed";
  paidAt?: string;
  metadata?: any;
}

export interface MatchGoal {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  minute: number;
  type: GoalType;
  assistPlayerId?: string;
}

export interface MatchCard {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  minute: number;
  type: CardType;
  reason?: string;
}

export interface MatchStatistics {
  matchId: string;
  teamId: string;
  possession: number; // Percentage
  shotsOnTarget: number;
  shotsOffTarget: number;
  corners: number;
  offsides: number;
  fouls: number;
  passAccuracy: number; // Percentage
}

export interface TournamentMatch {
  id: string;
  competitionId: string;
  categoryId: string;
  stage: string; // e.g., "Group A", "Quarter Final"
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  refereeId?: string;
  goals: MatchGoal[];
  cards: MatchCard[];
  stats?: {
    home: MatchStatistics;
    away: MatchStatistics;
  };
  auditLog: {
    action: string;
    userId: string;
    timestamp: string;
    oldValue?: any;
    newValue?: any;
  }[];
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

export interface TournamentTeam {
  id: string;
  competitionId: string;
  categoryId: string;
  ssbId: string;
  name: string;
  logoUrl?: string;
  status: "pending" | "approved" | "rejected";
  registeredAt: string;
  players: string[]; // Player Global IDs
  submittedAt?: string;
  officialId: string; // User ID of the submitter
}

export interface RegistrationLog {
  id: string;
  teamId: string;
  type: "info" | "error" | "warning";
  message: string;
  timestamp: string;
  metadata?: any;
}

export interface SquadValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
