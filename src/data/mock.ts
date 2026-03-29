import { Player, TrainingSession, AttendanceRecord, Payment, Invoice, StandingRow, Trainer, TrainingSchedule, TrainerAssignment, ParticipantGroup, NotificationLog, SkillRating, CoachEvaluation, Competition, CompetitionCategory, TournamentTeam, TournamentMatch } from "@/types";

export const mockSkillRatings: SkillRating[] = [
  {
    id: "sr1", playerId: "p1", date: "2026-01-15", evaluatorId: "t1",
    passing: 6, shooting: 7, dribbling: 6, firstTouch: 5,
    speed: 7, stamina: 6, strength: 5, agility: 7,
    positioning: 5, vision: 6, decisionMaking: 5, teamwork: 7,
    leadership: 4, composure: 5, workEthic: 8, coachability: 9,
    overallAverage: 6.0
  },
  {
    id: "sr2", playerId: "p1", date: "2026-02-15", evaluatorId: "t1",
    passing: 7, shooting: 7, dribbling: 7, firstTouch: 6,
    speed: 7, stamina: 7, strength: 5, agility: 8,
    positioning: 6, vision: 6, decisionMaking: 6, teamwork: 8,
    leadership: 5, composure: 6, workEthic: 8, coachability: 9,
    overallAverage: 6.8
  },
  {
    id: "sr3", playerId: "p1", date: "2026-03-15", evaluatorId: "t1",
    passing: 8, shooting: 7, dribbling: 8, firstTouch: 7,
    speed: 8, stamina: 7, strength: 6, agility: 8,
    positioning: 7, vision: 7, decisionMaking: 6, teamwork: 8,
    leadership: 6, composure: 7, workEthic: 9, coachability: 9,
    overallAverage: 7.5
  }
];

export const mockCoachEvaluations: CoachEvaluation[] = [
  {
    id: "ce1", playerId: "p1", evaluatorId: "t1", date: "2026-03-20", period: "monthly",
    comments: {
      technical: "Peningkatan signifikan pada kontrol bola dan akurasi passing.",
      physical: "Stamina membaik, namun perlu penguatan otot inti.",
      tactical: "Mulai memahami konsep ruang dan pergerakan tanpa bola.",
      mental: "Sangat disiplin dan memiliki kemauan belajar yang tinggi."
    },
    recommendations: "Fokus pada latihan finishing dengan kaki kiri dan penguatan fisik.",
    strengths: ["Speed", "Work Ethic", "Passing"],
    weaknesses: ["Left Foot Finishing", "Core Strength"],
    nextTargets: ["Mencetak gol dengan kaki kiri", "Meningkatkan durasi plank"]
  }
];

export const mockPlayers: Player[] = [
  {
    id: "p1", globalId: "P-2026-0001", name: "Ahmad Rizki", nik: "3201010503160001", dateOfBirth: "2016-03-15", ageCategory: "U10", position: "ST",
    parentName: "Budi Rizki", motherName: "Siti Aminah", parentPhone: "08123456789", parentEmail: "budi.rizki@email.com",
    address: "Jl. Merdeka No. 12, Jakarta Selatan", ssbId: "ssb1", status: "active",
    documents: { photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn1", date: "2026-03-20", type: "training", note: "Menunjukkan peningkatan kontrol bola. Perlu latihan finishing lebih.", author: "Coach Agus" },
      { id: "dn2", date: "2026-03-15", type: "coach", note: "Pemain potensial untuk posisi striker. Semangat tinggi di setiap latihan.", author: "Coach Agus" },
    ],
    skillRatings: mockSkillRatings.filter(sr => sr.playerId === "p1"),
    evaluations: mockCoachEvaluations.filter(ce => ce.playerId === "p1")
  },
  {
    id: "p2", globalId: "P-2026-0002", name: "Dimas Pratama", nik: "3201012207160002", dateOfBirth: "2016-07-22", ageCategory: "U10", position: "CM",
    parentName: "Andi Pratama", motherName: "Rina Wati", parentPhone: "08134567890", parentEmail: "andi.pratama@email.com",
    address: "Jl. Sudirman No. 45, Jakarta Pusat", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg", photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn3", date: "2026-03-18", type: "training", note: "Passing akurat, perlu peningkatan stamina.", author: "Coach Agus" },
    ],
  },
  {
    id: "p3", globalId: "P-2026-0003", name: "Fajar Setiawan", nik: "3204011001140003", dateOfBirth: "2014-01-10", ageCategory: "U12", position: "GK",
    parentName: "Rudi Setiawan", motherName: "Dewi Lestari", parentPhone: "08145678901", parentEmail: "rudi.setiawan@email.com",
    address: "Jl. Gatot Subroto No. 78, Bandung", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg", familyCard: "/placeholder.svg", photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn4", date: "2026-03-22", type: "coach", note: "Refleks sangat baik. Siap untuk kompetisi U12.", author: "Coach Bimo" },
      { id: "dn5", date: "2026-03-10", type: "training", note: "Latihan distribusi bola dari belakang. Sudah mulai berani keluar kotak.", author: "Coach Bimo" },
    ],
  },
  {
    id: "p4", globalId: "P-2026-0004", name: "Galih Permana", nik: "3204012805140004", dateOfBirth: "2014-05-28", ageCategory: "U12", position: "CB",
    parentName: "Hendra Permana", motherName: "Nurul Hidayah", parentPhone: "08156789012", parentEmail: "hendra.permana@email.com",
    address: "Jl. Asia Afrika No. 23, Bandung", ssbId: "ssb1", status: "active",
    documents: { photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn6", date: "2026-03-19", type: "training", note: "Tackling bersih, positioning sudah membaik.", author: "Coach Bimo" },
    ],
  },
  {
    id: "p5", globalId: "P-2026-0005", name: "Irfan Hakim", nik: "3578010311120005", dateOfBirth: "2012-11-03", ageCategory: "U15", position: "LW",
    parentName: "Joko Hakim", motherName: "Fatimah Zahra", parentPhone: "08167890123", parentEmail: "joko.hakim@email.com",
    address: "Jl. Diponegoro No. 56, Surabaya", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg", photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn7", date: "2026-03-25", type: "coach", note: "Speed luar biasa. Perlu perbaikan crossing.", author: "Coach Agus" },
    ],
  },
  {
    id: "p6", globalId: "P-2026-0006", name: "Kresna Aditya", nik: "3578011708120006", dateOfBirth: "2012-08-17", ageCategory: "U15", position: "RB",
    parentName: "Slamet Aditya", motherName: "Kartini Sari", parentPhone: "08178901234", parentEmail: "slamet.aditya@email.com",
    address: "Jl. Pemuda No. 34, Surabaya", ssbId: "ssb1", status: "inactive",
    documents: {},
    developmentNotes: [
      { id: "dn8", date: "2026-02-28", type: "coach", note: "Pemain disiplin. Saat ini istirahat karena cedera ringan.", author: "Coach Agus" },
    ],
  },
  {
    id: "p7", globalId: "P-2026-0007", name: "Mahesa Putra", nik: "3471011402180007", dateOfBirth: "2018-02-14", ageCategory: "U8", position: "ST",
    parentName: "Wawan Putra", motherName: "Ratna Dewi", parentPhone: "08189012345", parentEmail: "wawan.putra@email.com",
    address: "Jl. Veteran No. 89, Yogyakarta", ssbId: "ssb1", status: "active",
    documents: { photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn9", date: "2026-03-21", type: "training", note: "Mulai mengenal formasi. Antusias tinggi.", author: "Coach Citra" },
    ],
  },
  {
    id: "p8", globalId: "P-2026-0008", name: "Naufal Aziz", nik: "3471013006180008", dateOfBirth: "2018-06-30", ageCategory: "U8", position: "CM",
    parentName: "Yusuf Aziz", motherName: "Anisa Putri", parentPhone: "08190123456", parentEmail: "yusuf.aziz@email.com",
    address: "Jl. Malioboro No. 67, Yogyakarta", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg" },
    developmentNotes: [],
  },
];

export const mockTrainers: Trainer[] = [
  { id: "t1", name: "Coach Agus", specialization: "Tactics & Finishing", phone: "08123456789", email: "agus@powersport.com" },
  { id: "t2", name: "Coach Bimo", specialization: "Defense & Physical", phone: "08134567890", email: "bimo@powersport.com" },
  { id: "t3", name: "Coach Citra", specialization: "Basic Skills & Fun", phone: "08145678901", email: "citra@powersport.com" },
];

export const mockTrainingSessions: TrainingSession[] = [
  { id: "ts1", date: "2026-03-30", time: "07:00", group: "Group A", ageCategory: "U10", venue: "Lapangan Merdeka", coach: "Coach Agus" },
  { id: "ts2", date: "2026-03-30", time: "09:00", group: "Group B", ageCategory: "U12", venue: "Lapangan Merdeka", coach: "Coach Bimo" },
  { id: "ts3", date: "2026-03-31", time: "07:00", group: "Group A", ageCategory: "U15", venue: "Lapangan Garuda", coach: "Coach Agus" },
  { id: "ts4", date: "2026-04-01", time: "15:00", group: "Group C", ageCategory: "U8", venue: "Lapangan Merdeka", coach: "Coach Citra" },
  { id: "ts5", date: "2026-04-02", time: "07:00", group: "Group A", ageCategory: "U10", venue: "Lapangan Merdeka", coach: "Coach Agus" },
];

export const mockTrainingSchedules: TrainingSchedule[] = [
  {
    id: "sch1",
    title: "Latihan Teknik Dasar U10",
    description: "Fokus pada ball control dan passing pendek",
    startTime: "2026-03-30T07:00:00Z",
    endTime: "2026-03-30T09:00:00Z",
    location: "Lapangan Merdeka",
    maxParticipants: 20,
    status: "scheduled",
    ageCategory: "U10",
    groupId: "g1",
    recurrence: { type: "weekly", endDate: "2026-06-30T00:00:00Z" },
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "sch2",
    title: "Latihan Fisik & Defense U12",
    description: "Latihan intensitas tinggi untuk ketahanan fisik",
    startTime: "2026-03-30T09:00:00Z",
    endTime: "2026-03-30T11:00:00Z",
    location: "Lapangan Merdeka",
    maxParticipants: 15,
    status: "scheduled",
    ageCategory: "U12",
    groupId: "g2",
    recurrence: { type: "weekly", endDate: "2026-06-30T00:00:00Z" },
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-03-01T11:00:00Z",
  },
];

export const mockTrainerAssignments: TrainerAssignment[] = [
  { id: "ta1", trainerId: "t1", scheduleId: "sch1", role: "Main Coach", assignedAt: "2026-03-01T10:05:00Z" },
  { id: "ta2", trainerId: "t2", scheduleId: "sch2", role: "Main Coach", assignedAt: "2026-03-01T11:05:00Z" },
];

export const mockParticipantGroups: ParticipantGroup[] = [
  { id: "g1", name: "Group A - U10", ageCategory: "U10", maxCapacity: 20, players: ["p1", "p2"] },
  { id: "g2", name: "Group B - U12", ageCategory: "U12", maxCapacity: 15, players: ["p3", "p4"] },
];

export const mockNotificationLogs: NotificationLog[] = [
  { id: "nl1", scheduleId: "sch1", recipientId: "p1", channel: "whatsapp", templateType: "reminder", status: "delivered", sentAt: "2026-03-29T18:00:00Z" },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "a1", playerId: "p1", sessionId: "ts1", date: "2026-03-30", checkInTime: "2026-03-30T06:55:00Z", status: "present", method: "qr_code", qrCode: "qr-p1-ts1", createdAt: "2026-03-30T06:55:00Z", updatedAt: "2026-03-30T06:55:00Z" },
  { id: "a2", playerId: "p2", sessionId: "ts1", date: "2026-03-30", checkInTime: "2026-03-30T07:05:00Z", status: "present", method: "manual", createdAt: "2026-03-30T07:05:00Z", updatedAt: "2026-03-30T07:05:00Z" },
  { id: "a3", playerId: "p3", sessionId: "ts2", date: "2026-03-30", status: "absent", method: "manual", createdAt: "2026-03-30T09:15:00Z", updatedAt: "2026-03-30T09:15:00Z" },
  { id: "a4", playerId: "p4", sessionId: "ts2", date: "2026-03-30", checkInTime: "2026-03-30T08:58:00Z", status: "present", method: "qr_code", qrCode: "qr-p4-ts2", createdAt: "2026-03-30T08:58:00Z", updatedAt: "2026-03-30T08:58:00Z" },
  { id: "a5", playerId: "p5", sessionId: "ts3", date: "2026-03-31", status: "permitted", method: "manual", createdAt: "2026-03-31T07:00:00Z", updatedAt: "2026-03-31T07:00:00Z" },
  { id: "a6", playerId: "p6", sessionId: "ts3", date: "2026-03-31", checkInTime: "2026-03-31T07:02:00Z", status: "present", method: "qr_code", qrCode: "qr-p6-ts3", createdAt: "2026-03-31T07:02:00Z", updatedAt: "2026-03-31T07:02:00Z" },
];

export const mockPayments: Payment[] = [
  { id: "pay1", playerId: "p1", month: "2026-03", amount: 250000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-08" },
  { id: "pay2", playerId: "p2", month: "2026-03", amount: 250000, status: "unpaid", dueDate: "2026-03-10" },
  { id: "pay3", playerId: "p3", month: "2026-03", amount: 300000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-09" },
  { id: "pay4", playerId: "p4", month: "2026-03", amount: 300000, status: "unpaid", dueDate: "2026-03-10" },
  { id: "pay5", playerId: "p5", month: "2026-03", amount: 350000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-07" },
  { id: "pay6", playerId: "p6", month: "2026-03", amount: 350000, status: "unpaid", dueDate: "2026-03-10" },
  { id: "pay7", playerId: "p7", month: "2026-03", amount: 200000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-05" },
  { id: "pay8", playerId: "p8", month: "2026-03", amount: 200000, status: "unpaid", dueDate: "2026-03-10" },
];

export const mockInvoices: Invoice[] = [
  // January 2026
  { id: "inv1", playerId: "p1", type: "monthly", description: "Iuran Bulanan Januari 2026", amount: 250000, status: "paid", dueDate: "2026-01-10", paidDate: "2026-01-08", createdAt: "2026-01-01", paymentMethod: "manual" },
  { id: "inv2", playerId: "p2", type: "monthly", description: "Iuran Bulanan Januari 2026", amount: 250000, status: "paid", dueDate: "2026-01-10", paidDate: "2026-01-09", createdAt: "2026-01-01", paymentMethod: "midtrans" },
  { id: "inv3", playerId: "p3", type: "monthly", description: "Iuran Bulanan Januari 2026", amount: 300000, status: "paid", dueDate: "2026-01-10", paidDate: "2026-01-07", createdAt: "2026-01-01", paymentMethod: "xendit" },
  { id: "inv4", playerId: "p4", type: "monthly", description: "Iuran Bulanan Januari 2026", amount: 300000, status: "paid", dueDate: "2026-01-10", paidDate: "2026-01-10", createdAt: "2026-01-01", paymentMethod: "manual" },
  { id: "inv5", playerId: "p5", type: "registration", description: "Biaya Pendaftaran", amount: 500000, status: "paid", dueDate: "2026-01-15", paidDate: "2026-01-12", createdAt: "2026-01-01", paymentMethod: "midtrans" },
  // February 2026
  { id: "inv6", playerId: "p1", type: "monthly", description: "Iuran Bulanan Februari 2026", amount: 250000, status: "paid", dueDate: "2026-02-10", paidDate: "2026-02-08", createdAt: "2026-02-01", paymentMethod: "manual" },
  { id: "inv7", playerId: "p2", type: "monthly", description: "Iuran Bulanan Februari 2026", amount: 250000, status: "paid", dueDate: "2026-02-10", paidDate: "2026-02-10", createdAt: "2026-02-01", paymentMethod: "xendit" },
  { id: "inv8", playerId: "p3", type: "monthly", description: "Iuran Bulanan Februari 2026", amount: 300000, status: "paid", dueDate: "2026-02-10", paidDate: "2026-02-09", createdAt: "2026-02-01", paymentMethod: "manual" },
  { id: "inv9", playerId: "p4", type: "monthly", description: "Iuran Bulanan Februari 2026", amount: 300000, status: "overdue", dueDate: "2026-02-10", createdAt: "2026-02-01" },
  // March 2026
  { id: "inv10", playerId: "p1", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 250000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-08", createdAt: "2026-03-01", paymentMethod: "midtrans" },
  { id: "inv11", playerId: "p2", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 250000, status: "pending", dueDate: "2026-03-10", createdAt: "2026-03-01" },
  { id: "inv12", playerId: "p3", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 300000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-09", createdAt: "2026-03-01", paymentMethod: "xendit" },
  { id: "inv13", playerId: "p4", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 300000, status: "pending", dueDate: "2026-03-10", createdAt: "2026-03-01" },
  { id: "inv14", playerId: "p5", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 350000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-07", createdAt: "2026-03-01", paymentMethod: "manual" },
  { id: "inv15", playerId: "p6", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 350000, status: "overdue", dueDate: "2026-03-10", createdAt: "2026-03-01" },
  { id: "inv16", playerId: "p7", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 200000, status: "paid", dueDate: "2026-03-10", paidDate: "2026-03-05", createdAt: "2026-03-01", paymentMethod: "manual" },
  { id: "inv17", playerId: "p8", type: "monthly", description: "Iuran Bulanan Maret 2026", amount: 200000, status: "pending", dueDate: "2026-03-10", createdAt: "2026-03-01" },
  { id: "inv18", playerId: "p3", type: "event", description: "Biaya Turnamen Piala Bupati Cup", amount: 150000, status: "paid", dueDate: "2026-03-20", paidDate: "2026-03-18", createdAt: "2026-03-01", paymentMethod: "midtrans" },
  { id: "inv19", playerId: "p4", type: "event", description: "Biaya Turnamen Piala Bupati Cup", amount: 150000, status: "pending", dueDate: "2026-03-20", createdAt: "2026-03-01" },
];

export const mockCompetitions: Competition[] = [
  {
    id: "comp1",
    eoId: "eo1",
    name: "Liga Junior Kota 2026",
    type: "league",
    format: "group",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    registrationPeriod: { start: "2026-03-01", end: "2026-03-25" },
    status: "upcoming",
    description: "Kompetisi liga untuk talenta muda se-kota.",
    participantLimit: 32,
  },
  {
    id: "comp2",
    eoId: "eo1",
    name: "Piala Walikota U15",
    type: "tournament",
    format: "hybrid",
    startDate: "2026-05-15",
    endDate: "2026-05-20",
    registrationPeriod: { start: "2026-04-01", end: "2026-05-01" },
    status: "draft",
    description: "Turnamen bergengsi tahunan piala walikota.",
  },
];

export const mockCompetitionCategories: CompetitionCategory[] = [
  { id: "cat1", competitionId: "comp1", ageCategory: "U10", maxTeams: 16 },
  { id: "cat2", competitionId: "comp1", ageCategory: "U12", maxTeams: 16 },
  { id: "cat3", competitionId: "comp2", ageCategory: "U15", maxTeams: 24 },
];

export const mockTournamentTeams: TournamentTeam[] = [
  { id: "tt1", competitionId: "comp1", categoryId: "cat1", ssbId: "ssb1", name: "Garuda Muda U10", status: "approved", registeredAt: "2026-03-05T10:00:00Z", players: ["p1", "p2"] },
  { id: "tt2", competitionId: "comp1", categoryId: "cat1", ssbId: "ssb2", name: "Elang Biru U10", status: "approved", registeredAt: "2026-03-06T11:00:00Z", players: [] },
];

export const mockTournamentMatches: TournamentMatch[] = [
  {
    id: "tm1",
    competitionId: "comp1",
    categoryId: "cat1",
    stage: "Group A",
    homeTeamId: "tt1",
    awayTeamId: "tt2",
    homeScore: 2,
    awayScore: 1,
    date: "2026-04-05",
    time: "08:00",
    venue: "Lapangan Merdeka",
    status: "completed",
    goals: [
      { id: "g1", matchId: "tm1", teamId: "tt1", playerId: "p1", minute: 15, type: "regular" },
      { id: "g2", matchId: "tm1", teamId: "tt2", playerId: "p3", minute: 42, type: "regular" },
      { id: "g3", matchId: "tm1", teamId: "tt1", playerId: "p2", minute: 88, type: "regular" },
    ],
    cards: [
      { id: "c1", matchId: "tm1", teamId: "tt2", playerId: "p4", minute: 30, type: "yellow", reason: "Foul" },
    ],
    stats: {
      home: { matchId: "tm1", teamId: "tt1", possession: 55, shotsOnTarget: 8, shotsOffTarget: 4, corners: 5, offsides: 2, fouls: 10, passAccuracy: 82 },
      away: { matchId: "tm1", teamId: "tt2", possession: 45, shotsOnTarget: 4, shotsOffTarget: 6, corners: 3, offsides: 1, fouls: 12, passAccuracy: 75 },
    },
    auditLog: [
      { action: "FINISH_MATCH", userId: "u1", timestamp: "2026-04-05T10:00:00Z" }
    ]
  },
];

export const mockStandings: StandingRow[] = [
  { teamId: "tt1", teamName: "Garuda Muda U10", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { teamId: "tt2", teamName: "Elang Biru U10", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
];
