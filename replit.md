# Kampus Modern - Workspace

## Overview

pnpm workspace monorepo using TypeScript. Full-stack Indonesian university (kampus) information system.

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

- **Kampus Modern** (web): React frontend at port 23485, path `/`
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

## Public Pages (8 Routes)

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/public/home.tsx` | Beranda — overview/ringkasan semua halaman |
| `/pendaftaran` | `pages/public/pendaftaran.tsx` | PMB form, alur 4 langkah, jalur, persyaratan |
| `/program-studi` | `pages/public/program-studi.tsx` | Daftar prodi, kurikulum, dosen, prospek karir |
| `/beasiswa` | `pages/public/beasiswa.tsx` | Jenis beasiswa, kriteria, timeline, manfaat |
| `/galeri` | `pages/public/galeri.tsx` | Grid foto kegiatan kampus + filter kategori |
| `/pengumuman` | `pages/public/pengumuman.tsx` | Berita & pengumuman umum + pencarian |
| `/informasi-pmb` | `pages/public/informasi-pmb.tsx` | Biaya, jadwal gelombang, FAQ, kontak PMB |
| `/login` | `pages/login.tsx` | Form autentikasi semua peran |

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

```
pnpm --filter @workspace/kampus run dev       # Frontend
pnpm --filter @workspace/api-server run dev   # Backend
pnpm --filter @workspace/api-spec run codegen # Regenerate API client
```

## Runtime Notes

- Development workflow runs the API server on port 8080 and the Kampus frontend on port 23485 with `BASE_PATH=/`.
- Vite proxies `/api` requests to the API server during development.
- Dashboard routes are defined explicitly in `artifacts/kampus/src/App.tsx` to avoid wildcard/nested router 404s.
