import { Player, TrainingSession, AttendanceRecord, Payment, Invoice, Tournament, Team, Match, StandingRow } from "@/types";

export const mockPlayers: Player[] = [
  {
    id: "p1", name: "Ahmad Rizki", nik: "3201010503160001", dateOfBirth: "2016-03-15", ageCategory: "U10", position: "ST",
    parentName: "Budi Rizki", motherName: "Siti Aminah", parentPhone: "08123456789", parentEmail: "budi.rizki@email.com",
    address: "Jl. Merdeka No. 12, Jakarta Selatan", ssbId: "ssb1", status: "active",
    documents: { photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn1", date: "2026-03-20", type: "training", note: "Menunjukkan peningkatan kontrol bola. Perlu latihan finishing lebih.", author: "Coach Agus" },
      { id: "dn2", date: "2026-03-15", type: "coach", note: "Pemain potensial untuk posisi striker. Semangat tinggi di setiap latihan.", author: "Coach Agus" },
    ],
  },
  {
    id: "p2", name: "Dimas Pratama", nik: "3201012207160002", dateOfBirth: "2016-07-22", ageCategory: "U10", position: "CM",
    parentName: "Andi Pratama", motherName: "Rina Wati", parentPhone: "08134567890", parentEmail: "andi.pratama@email.com",
    address: "Jl. Sudirman No. 45, Jakarta Pusat", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg", photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn3", date: "2026-03-18", type: "training", note: "Passing akurat, perlu peningkatan stamina.", author: "Coach Agus" },
    ],
  },
  {
    id: "p3", name: "Fajar Setiawan", nik: "3204011001140003", dateOfBirth: "2014-01-10", ageCategory: "U12", position: "GK",
    parentName: "Rudi Setiawan", motherName: "Dewi Lestari", parentPhone: "08145678901", parentEmail: "rudi.setiawan@email.com",
    address: "Jl. Gatot Subroto No. 78, Bandung", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg", familyCard: "/placeholder.svg", photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn4", date: "2026-03-22", type: "coach", note: "Refleks sangat baik. Siap untuk kompetisi U12.", author: "Coach Bimo" },
      { id: "dn5", date: "2026-03-10", type: "training", note: "Latihan distribusi bola dari belakang. Sudah mulai berani keluar kotak.", author: "Coach Bimo" },
    ],
  },
  {
    id: "p4", name: "Galih Permana", nik: "3204012805140004", dateOfBirth: "2014-05-28", ageCategory: "U12", position: "CB",
    parentName: "Hendra Permana", motherName: "Nurul Hidayah", parentPhone: "08156789012", parentEmail: "hendra.permana@email.com",
    address: "Jl. Asia Afrika No. 23, Bandung", ssbId: "ssb1", status: "active",
    documents: { photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn6", date: "2026-03-19", type: "training", note: "Tackling bersih, positioning sudah membaik.", author: "Coach Bimo" },
    ],
  },
  {
    id: "p5", name: "Irfan Hakim", nik: "3578010311120005", dateOfBirth: "2012-11-03", ageCategory: "U14", position: "LW",
    parentName: "Joko Hakim", motherName: "Fatimah Zahra", parentPhone: "08167890123", parentEmail: "joko.hakim@email.com",
    address: "Jl. Diponegoro No. 56, Surabaya", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg", photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn7", date: "2026-03-25", type: "coach", note: "Speed luar biasa. Perlu perbaikan crossing.", author: "Coach Agus" },
    ],
  },
  {
    id: "p6", name: "Kresna Aditya", nik: "3578011708120006", dateOfBirth: "2012-08-17", ageCategory: "U14", position: "RB",
    parentName: "Slamet Aditya", motherName: "Kartini Sari", parentPhone: "08178901234", parentEmail: "slamet.aditya@email.com",
    address: "Jl. Pemuda No. 34, Surabaya", ssbId: "ssb1", status: "inactive",
    documents: {},
    developmentNotes: [
      { id: "dn8", date: "2026-02-28", type: "coach", note: "Pemain disiplin. Saat ini istirahat karena cedera ringan.", author: "Coach Agus" },
    ],
  },
  {
    id: "p7", name: "Mahesa Putra", nik: "3471011402180007", dateOfBirth: "2018-02-14", ageCategory: "U8", position: "ST",
    parentName: "Wawan Putra", motherName: "Ratna Dewi", parentPhone: "08189012345", parentEmail: "wawan.putra@email.com",
    address: "Jl. Veteran No. 89, Yogyakarta", ssbId: "ssb1", status: "active",
    documents: { photo: "/placeholder.svg" },
    developmentNotes: [
      { id: "dn9", date: "2026-03-21", type: "training", note: "Mulai mengenal formasi. Antusias tinggi.", author: "Coach Citra" },
    ],
  },
  {
    id: "p8", name: "Naufal Aziz", nik: "3471013006180008", dateOfBirth: "2018-06-30", ageCategory: "U8", position: "CM",
    parentName: "Yusuf Aziz", motherName: "Anisa Putri", parentPhone: "08190123456", parentEmail: "yusuf.aziz@email.com",
    address: "Jl. Malioboro No. 67, Yogyakarta", ssbId: "ssb1", status: "active",
    documents: { birthCertificate: "/placeholder.svg" },
    developmentNotes: [],
  },
];

export const mockTrainingSessions: TrainingSession[] = [
  { id: "ts1", date: "2026-03-30", time: "07:00", group: "Group A", ageCategory: "U10", venue: "Lapangan Merdeka", coach: "Coach Agus" },
  { id: "ts2", date: "2026-03-30", time: "09:00", group: "Group B", ageCategory: "U12", venue: "Lapangan Merdeka", coach: "Coach Bimo" },
  { id: "ts3", date: "2026-03-31", time: "07:00", group: "Group A", ageCategory: "U14", venue: "Lapangan Garuda", coach: "Coach Agus" },
  { id: "ts4", date: "2026-04-01", time: "15:00", group: "Group C", ageCategory: "U8", venue: "Lapangan Merdeka", coach: "Coach Citra" },
  { id: "ts5", date: "2026-04-02", time: "07:00", group: "Group A", ageCategory: "U10", venue: "Lapangan Merdeka", coach: "Coach Agus" },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "a1", playerId: "p1", sessionId: "ts1", date: "2026-03-30", status: "present" },
  { id: "a2", playerId: "p2", sessionId: "ts1", date: "2026-03-30", status: "present" },
  { id: "a3", playerId: "p3", sessionId: "ts2", date: "2026-03-30", status: "absent" },
  { id: "a4", playerId: "p4", sessionId: "ts2", date: "2026-03-30", status: "present" },
  { id: "a5", playerId: "p5", sessionId: "ts3", date: "2026-03-31", status: "present" },
  { id: "a6", playerId: "p6", sessionId: "ts3", date: "2026-03-31", status: "present" },
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

export const mockTournaments: Tournament[] = [
  { id: "t1", name: "Piala Bupati Cup 2026", format: "group", ageCategories: ["U12", "U14"], startDate: "2026-04-15", endDate: "2026-04-30", venue: "Stadion Gelora", status: "upcoming", teamsCount: 16 },
  { id: "t2", name: "Festival Anak Garuda", format: "festival", ageCategories: ["U8", "U10"], startDate: "2026-05-01", endDate: "2026-05-03", venue: "Lapangan Merdeka", status: "upcoming", teamsCount: 12 },
  { id: "t3", name: "Liga Junior Kota", format: "group", ageCategories: ["U12"], startDate: "2026-03-01", endDate: "2026-06-30", venue: "Various", status: "ongoing", teamsCount: 8 },
];

export const mockTeams: Team[] = [
  { id: "tm1", name: "Garuda Muda A", ssbName: "SSB Garuda Muda", ageCategory: "U12", tournamentId: "t3", players: ["p3", "p4"] },
  { id: "tm2", name: "Elang Jaya A", ssbName: "SSB Elang Jaya", ageCategory: "U12", tournamentId: "t3", players: [] },
  { id: "tm3", name: "Persib Junior", ssbName: "SSB Persib Academy", ageCategory: "U12", tournamentId: "t3", players: [] },
  { id: "tm4", name: "Sriwijaya Muda", ssbName: "SSB Sriwijaya FC", ageCategory: "U12", tournamentId: "t3", players: [] },
];

export const mockMatches: Match[] = [
  { id: "m1", tournamentId: "t3", homeTeam: "Garuda Muda A", awayTeam: "Elang Jaya A", homeScore: 2, awayScore: 1, date: "2026-03-15", time: "08:00", venue: "Lapangan A", stage: "Group A - MD1", status: "completed", scorers: [{ playerId: "p3", playerName: "Fajar S.", team: "Garuda Muda A", minute: 23 }, { playerId: "p4", playerName: "Galih P.", team: "Garuda Muda A", minute: 55 }] },
  { id: "m2", tournamentId: "t3", homeTeam: "Persib Junior", awayTeam: "Sriwijaya Muda", homeScore: 0, awayScore: 0, date: "2026-03-15", time: "10:00", venue: "Lapangan B", stage: "Group A - MD1", status: "completed" },
  { id: "m3", tournamentId: "t3", homeTeam: "Garuda Muda A", awayTeam: "Persib Junior", date: "2026-03-29", time: "08:00", venue: "Lapangan A", stage: "Group A - MD2", status: "scheduled" },
  { id: "m4", tournamentId: "t3", homeTeam: "Elang Jaya A", awayTeam: "Sriwijaya Muda", date: "2026-03-29", time: "10:00", venue: "Lapangan B", stage: "Group A - MD2", status: "scheduled" },
];

export const mockStandings: StandingRow[] = [
  { teamId: "tm1", teamName: "Garuda Muda A", played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 3 },
  { teamId: "tm3", teamName: "Persib Junior", played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 1 },
  { teamId: "tm4", teamName: "Sriwijaya Muda", played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 1 },
  { teamId: "tm2", teamName: "Elang Jaya A", played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 0 },
];
