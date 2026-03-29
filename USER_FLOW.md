# Football Grassroots Ecosystem Platform - User Flow (BPMN 2.0 Simplified)

## 1. SSB Admin: Player Onboarding & Billing
```mermaid
sequenceDiagram
    participant Admin as SSB Admin
    participant System as Platform
    participant Parent as Parent
    participant PG as Payment Gateway

    Admin->>System: Input Data Pemain (Registrasi)
    System->>System: Generate Global ID (Single Identity)
    System->>Admin: Player Registered
    System->>System: Otomatis Generate Invoice Bulanan
    System->>Parent: Notifikasi Invoice (WhatsApp/Email)
    Parent->>System: Bayar via Portal (Midtrans/Xendit)
    System->>PG: Process Payment
    PG-->>System: Success Callback
    System->>Admin: Update Status Keuangan (Real-time)
```

## 2. Coach: Training & Development Tracking
```mermaid
graph TD
    A[Coach Dashboard] --> B[Buat Jadwal Latihan]
    B --> C[Notifikasi ke Orang Tua]
    C --> D[Scan QR Presensi di Lapangan]
    D --> E{Geo-tag Valid?}
    E -- Yes --> F[Update Attendance Rate]
    E -- No --> G[Warning: Diluar Lokasi]
    F --> H[Input Skill Rating/KPI]
    H --> I[Visualisasi Grafik Progress]
    I --> J[Parent Dashboard Update]
```

## 3. EO Admin & Operator: Competition Workflow
```mermaid
stateDiagram-v2
    [*] --> Draft: Buat Kompetisi
    Draft --> Registration: Buka Pendaftaran
    Registration --> Verification: Validasi Umur & Dokumen
    Verification --> Scheduling: Generate Match Schedule
    Scheduling --> Live: Kompetisi Dimulai
    Live --> InputScore: Operator Input Statistik
    InputScore --> Standings: Update Klasemen Otomatis
    Standings --> Live
    Live --> Finished: Kompetisi Selesai
```

## 4. Parent: Monitoring & Payment
- **Happy Path**: Lihat Jadwal -> Cek Progress Skill -> Bayar Iuran -> Terima Notifikasi Hasil Pertandingan.
- **Exception Handling**: Pembayaran Gagal -> Notifikasi Retry -> Hubungi Admin via WhatsApp Integrated.
