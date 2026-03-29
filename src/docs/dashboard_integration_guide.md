# Panduan Integrasi Dashboard Player Management

Dokumen ini menjelaskan cara menggunakan dan memelihara komponen manajemen pemain yang telah diintegrasikan ke dalam Dashboard SSB.

## 1. Struktur Komponen
- **`PlayersPage` (`src/pages/ssb/Players.tsx`)**: Halaman utama yang mengelola state data pemain, modal form, dan integrasi antar komponen.
- **`PlayerTable` (`src/components/ssb/PlayerTable.tsx`)**: Komponen presentasional untuk menampilkan tabel data dengan fitur:
  - Pencarian (Nama/NIK)
  - Filter (Posisi, Kategori, Status)
  - Pagination (10 item per halaman)
- **`PlayerForm` (`src/components/ssb/PlayerForm.tsx`)**: Formulir input menggunakan `react-hook-form` dan `zod` untuk validasi. Mendukung:
  - Kalkulasi umur otomatis dari tanggal lahir.
  - Pengelompokan kategori umur otomatis (U9-Senior).
  - Simulasi upload dokumen.

## 2. Cara Pemakaian
### Menambahkan Route Baru
Pastikan route telah terdaftar di `App.tsx`:
```tsx
<Route path="players" element={<Players />} />
```

### Navigasi Sidebar
Menu di `AppSidebar.tsx` harus mengarah ke `/ssb/players`.

### Penggunaan Logic Utility
Gunakan `calculateAge` dan `getAgeCategory` dari `src/lib/player-utils.ts` untuk konsistensi perhitungan umur di seluruh aplikasi.

## 3. Pemeliharaan & Pengembangan
- **Validasi**: Aturan validasi input dapat diubah pada skema `zod` di dalam `PlayerForm.tsx`.
- **Data Fetching**: Saat ini menggunakan `mockPlayers`. Untuk integrasi backend, ganti state `players` dengan pengambilan data via `react-query`.
- **Audit Trail**: Log perubahan status dapat diimplementasikan pada fungsi `handleFormSubmit` di `PlayersPage.tsx`.

## 4. Responsivitas
Komponen telah diuji pada viewports berikut:
- **Desktop (1280px+)**: Tampilan tabel penuh dengan filter berjajar.
- **Tablet (768px - 1024px)**: Filter berubah menjadi grid responsif, tabel mendukung horizontal scroll.
- **Mobile (< 768px)**: Dialog form menjadi full-screen, beberapa kolom tabel disembunyikan untuk fokus pada informasi utama.
