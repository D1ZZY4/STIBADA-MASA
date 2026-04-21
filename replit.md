# STIBADA MASA - Workspace

## Overview

pnpm workspace monorepo menggunakan TypeScript. Sistem informasi kampus full-stack untuk STIBADA MASA.
Domain produksi target: **stibada-masa.id**

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + React Compiler + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express 5 + MongoDB native driver + mongodb-memory-server
- **Icons**: Phosphor Icons + lucide-react + recharts
- **API codegen**: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- **API client**: @workspace/api-client-react (auto-generated React Query hooks)
- **Build**: esbuild

## Artifacts

- **STIBADA MASA** (web): React frontend at port 23485, path `/`
- **API Server** (api): Express backend at port 8080

## Architecture

```
artifacts/
  kampus/        - React frontend (Vite, React Compiler, Tailwind)
  api-server/    - Express backend (MongoDB native driver)
lib/
  api-spec/      - OpenAPI spec + codegen scripts
  api-client-react/ - Auto-generated React Query hooks
  api-zod/       - Auto-generated Zod schemas
```

## Authentication (Seeded Credentials)

| Role | Identifier | Password |
|------|-----------|----------|
| Mahasiswa | NIM: 20210001 | mahasiswa123 |
| Dosen | NIDN: 0123456789 | dosen123 |
| Admin | Email: admin@kampus.ac.id | admin123 |
| Rektor | Email: rektor@kampus.ac.id | rektor123 |

## Public Pages (12 Routes)

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/public/home.tsx` | Beranda — overview/ringkasan semua halaman |
| `/pendaftaran` | `pages/public/pendaftaran.tsx` | PMB form, alur 4 langkah, jalur, persyaratan |
| `/program-studi` | `pages/public/program-studi.tsx` | Daftar prodi, kurikulum, dosen, prospek karir |
| `/beasiswa` | `pages/public/beasiswa.tsx` | Jenis beasiswa, kriteria, timeline, manfaat |
| `/galeri` | `pages/public/galeri.tsx` | Grid foto kegiatan kampus + filter kategori |
| `/pengumuman` | `pages/public/pengumuman.tsx` | Berita & pengumuman umum + pencarian |
| `/informasi-pmb` | `pages/public/informasi-pmb.tsx` | Biaya, jadwal gelombang, FAQ, kontak PMB |
| `/siakad` | `pages/public/siakad.tsx` | Landing SIAKAD — fitur, CTA login akademik |
| `/pendaftaran-online` | `pages/public/pendaftaran-online.tsx` | Landing PMB online — alur 4 langkah, benefits |
| `/perpustakaan` | `pages/public/perpustakaan.tsx` | Landing Perpustakaan Online — koleksi & fitur |
| `/e-journal` | `pages/public/ejournal.tsx` | Landing E-Journal — daftar jurnal, OJS info |
| `/login` | `pages/login.tsx` | Form autentikasi semua peran |

## Design System

- **Tokens:** maroon primary (`hsl(0 60% 28%)` = #8A1F22) + cream background (`#FAF6EC`).
- **Semantic tokens** (Tailwind utilities) digunakan di seluruh halaman: `bg-primary`, `bg-background`, `bg-card`, `text-primary`, `text-muted-foreground`, `border-border`, dst.
- **Aesthetic:** modern, minimalis, rounded modern (radius 0.75rem default + 2xl/3xl pada cards), glass modern (`bg-card/70 backdrop-blur-xl border border-border/60`).
- **Icons:** `@phosphor-icons/react` dengan `weight="duotone"` (Bulk equivalent).
- **Tipografi:** Inter (sans), Plus Jakarta Sans + Nunito (heading).
- **Favicon:** `/logo-stibada.png` (PNG resmi STIBADA MASA).
- **Kontak email** (footer): 4 alamat aktif — `humas@stibada-masa.id`, `pmb@stibada-masa.id`, `humas@stibada.ac.id`, `pmb@stibasa.ac.id`.

## Shared Components

- `components/layout/public-layout.tsx` — Navbar sticky + footer untuk semua halaman publik
- `components/layout/dashboard-layout.tsx` — Sidebar dashboard untuk peran terautentikasi

## Features (4 Dashboards)

### Mahasiswa
- Overview dashboard (IPK, SKS, jadwal hari ini, absensi)
- Jadwal kuliah mingguan
- KRS (pengambilan & persetujuan mata kuliah)
- Nilai & IPK per mata kuliah
- Rekap absensi
- Forum diskusi

### Dosen
- Overview dashboard
- Jadwal mengajar
- Input & kelola nilai mahasiswa
- Kelola absensi mahasiswa
- Absensi dosen
- Forum diskusi dosen

### Admin
- Overview dashboard
- Manajemen mahasiswa (CRUD)
- Manajemen dosen (CRUD)
- Manajemen mata kuliah (CRUD)
- Manajemen jadwal (CRUD)
- Persetujuan KRS
- Kelola konten publik
- Pengaturan sistem website: editor teks, gambar tiap halaman publik, pengumuman, dan layout/kontak global

### Rektor
- Executive dashboard (stats overview)
- Laporan akademik (charts IPK, distribusi nilai)

## Database

Uses MongoDB in-memory (mongodb-memory-server) by default.
Set `MONGODB_URI` env var to use a real MongoDB instance.

## Public Website & Security

- `/` is the public STIBADA MASA landing page with admissions, programs, scholarships, gallery, announcements, and online PMB form.
- Landing page uses campus/activity imagery throughout public sections and avoids exposing technical API/WebSocket copy to public users.
- `/pengumuman` now uses a more polished responsive layout with Phosphor icons, visible campus imagery, category filters, search, a featured announcement card, and a side information panel.
- `/login` is the role-based portal login with a dedicated visual panel and role selector.
- Admin can manage public content at `/dashboard/admin/content`, KRS at `/dashboard/admin/krs`, and full public website configuration at `/dashboard/admin/sistem`.
- `/dashboard/admin/sistem` now controls editable public page content keys (for example `home.hero`, `pendaftaran.form`, `pengumuman.hero`), image URLs, announcement CRUD, and global layout/contact settings.
- Public pages consume `/api/public/landing` dynamic content with safe fallbacks, so edited titles, descriptions, footer/contact text, announcement images, hero images, and content images can be changed without code edits.
- API adds CSP/security headers, rate limiting, password hashing via Node crypto scrypt, signed auth tokens, audit trail entries, analytics events, OpenAPI exposure at `/api/docs`, and WebSocket notifications at `/api/ws`.

## Documentation

- Project documentation is centralized in `documentation/`.
- Current files cover frontend structure, backend/API architecture, security/operations, and implementation examples.

## Key Commands

```bash
# Development
pnpm dev                               # Jalankan frontend + backend sekaligus
pnpm start:all                         # Alias untuk pnpm dev
pnpm start:frontend                    # Hanya frontend (PORT=5173)
pnpm start:backend                     # Hanya backend (PORT=8080)

# Per-package
pnpm --filter @workspace/kampus run dev       # Frontend langsung
pnpm --filter @workspace/api-server run dev   # Backend langsung
pnpm --filter @workspace/api-spec run codegen # Regenerate API client

# Screenshot (simpan ke screenshots/<page>/<page>-DD.MM.YYYY-HH.MM-WxH-mode.png)
pnpm screenshot home                         # Desktop default (1280×720)
pnpm screenshot home mobile                  # Mobile iPhone 15 (390×844)
pnpm screenshot home tablet dark             # Tablet + dark mode
pnpm screenshot home iphone-17-pro-max       # Device preset spesifik
pnpm screenshot home 1440 900                # Custom dimensi
pnpm screenshot:home                         # Shortcut home desktop
pnpm screenshot:dashboard                    # Shortcut dashboard desktop
# Page aliases: home, pendaftaran, program-studi, beasiswa, galeri,
#               pengumuman, informasi-pmb, dashboard, admin, dosen, rektor,
#               krs, nilai, absensi, diskusi, jadwal
# Device presets: desktop, desktop-hd, laptop, laptop-lg, tablet, ipad,
#                 ipad-pro, mobile, iphone-se, iphone-15, iphone-15-pro-max,
#                 iphone-17, iphone-17-pro, iphone-17-pro-max,
#                 pixel-9, galaxy-s25, android, surface-pro, 4k
```

## Screenshot Tool

- Script: `scripts/screenshot.mjs`
- Chromium: Playwright dengan NixOS pre-installed browser di `/nix/store/...-playwright-browsers-1.55.0-with-cjk/`
- Auto-detect Replit vs local (gunakan `localhost:80` vs `localhost:PORT`)
- Support dark/light mode via `colorScheme` context + `document.documentElement.classList.add('dark')`
- Output: `screenshots/<page>/<page>-DD.MM.YYYY-HH.MM-WxH-mode.png`

## Database (MongoDB Atlas)

- Production: MongoDB Atlas via `MONGODB_URI` env (SRV format, shared environment).
- Development fallback: mongodb-memory-server jika `MONGODB_URI` tidak diset.
- Cluster: `clusterweb.fhaygtz.mongodb.net`, dbName: `kampus`.
- Seeder cek koleksi `mahasiswa`, skip jika sudah ada; jalankan `migrateGallery()` untuk update data lama.

## Image Upload System

- **Endpoint upload:** `POST /api/upload/image` (multipart/form-data, field: `image`).
- **Serve gambar:** `GET /api/images/:id` (Cache-Control: immutable, 1 tahun).
- **Daftar gambar:** `GET /api/upload/images` (admin/rektor only).
- **Hapus gambar:** `DELETE /api/upload/images/:id` (admin only).
- Gambar disimpan sebagai base64 di koleksi `images` di MongoDB.
- Batas: maks **5 MB** per file, hanya `image/*`.
- Frontend: komponen `ImageUploader` di `src/components/ui/image-uploader.tsx` — support URL tab dan Upload tab dengan drag & drop.

### Panduan Ukuran Gambar

| Penggunaan | Ukuran Ideal | Rasio | Format | Maks |
|---|---|---|---|---|
| Hero / Banner besar | 1400 × 600 px | 7:3 | JPEG, WebP | 2 MB |
| Card / Profil | 800 × 500 px | 16:10 | JPEG, PNG, WebP | 1 MB |
| Galeri kampus | 800 × 600 px | 4:3 | JPEG, PNG, WebP | 2 MB |
| Upload umum | bebas | bebas | JPEG, PNG, WebP, GIF | 5 MB |

## Gallery Management

- Koleksi `gallery` di MongoDB (CRUD penuh via admin).
- API: `GET/POST /api/gallery`, `PUT/DELETE /api/gallery/:id`.
- Frontend: halaman admin content tab "Galeri Kampus" dengan ImageUploader.

## Runtime Notes

- Development workflow runs the API server on port 8080 and the STIBADA MASA frontend on port 23485 with `BASE_PATH=/`.
- Vite proxies `/api` requests to the API server during development.
- Dashboard routes are defined explicitly in `artifacts/kampus/src/App.tsx` to avoid wildcard/nested router 404s.
- `express.json` limit dinaikkan ke **10 MB** untuk mendukung base64 payload.

---

## Konvensi Batas Baris Kode per Kategori File

### 1. Frontend (UI & UX)

| Kategori File | Fungsi | Maksimal (Baris) |
|---|---|---|
| **Atomic/Base UI** | Komponen terkecil (Button, Input, Badge). | 40 |
| **Complex Components** | Komponen gabungan (Navbar, Sidebar, Card). | 120 |
| **Layouts** | Struktur dasar halaman (AdminLayout, AuthLayout). | 100 |
| **Pages/Views** | File utama per halaman (Dashboard.tsx, Login.tsx). | 250 |
| **Forms/Validation** | Khusus logika validasi form (Zod/Yup schemas). | 150 |
| **Custom Hooks** | Logika state yang dipisah dari UI. | 150 |
| **State Store** | Manajemen state global (Zustand, Redux). | 200 |
| **Services/API Calls** | Integrasi Axios/Fetch untuk satu modul. | 150 |
| **Assets/Styles** | File CSS, SCSS, atau Tailwind Config. | 300 |

### 2. Backend (Server-Side)

| Kategori File | Fungsi | Maksimal (Baris) |
|---|---|---|
| **Routes/Router** | Definisi jalur URL dan mapping ke Controller. | 100 |
| **Controllers** | Mengatur request masuk dan response keluar. | 150 |
| **Services** | Inti logika bisnis (perhitungan, aturan sistem). | 350 |
| **Repositories** | Khusus untuk query database (SQL/NoSQL). | 250 |
| **Models/Entities** | Definisi struktur tabel dan relasi. | 150 |
| **Middlewares** | Filter keamanan, auth, dan logging. | 80 |
| **DTO (Data Transfer Object)** | Definisi tipe data yang dikirim antar layer. | 100 |
| **Seeders/Migrations** | Setup data awal dan struktur DB. | 300 |
| **Mailers/Templates** | Logika pengiriman email atau notifikasi. | 150 |

### 3. Infrastructure & DevOps

| Kategori File | Fungsi | Maksimal (Baris) |
|---|---|---|
| **Config/Init** | Inisialisasi database, Redis, atau Cloud storage. | 100 |
| **Dockerfiles/YAML** | Konfigurasi kontainer dan CI/CD. | 150 |
| **Environment** | File .env.example atau setup env loader. | 100 |
| **Scripts** | Script otomasi (Bash, Python, atau JS script). | 200 |

### 4. Global & Utilities

| Kategori File | Fungsi | Maksimal (Baris) |
|---|---|---|
| **Constants/Enums** | List kode error, status, atau role user. | 200 |
| **Helpers/Utils** | Fungsi umum (format mata uang, manipulasi string). | 150 |
| **Types/Interfaces** | Definisi tipe data global (untuk TypeScript). | 250 |
| **Internationalization** | File JSON/JS untuk multi-bahasa (i18n). | 500+ |
