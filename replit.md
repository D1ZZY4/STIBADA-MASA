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
- **Icons**: lucide-react + iconsax-react + recharts
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

### Admin
- Overview dashboard
- Manajemen mahasiswa (CRUD)
- Manajemen dosen (CRUD)
- Manajemen mata kuliah (CRUD)
- Manajemen jadwal (CRUD)
- Persetujuan KRS

### Rektor
- Executive dashboard (stats overview)
- Laporan akademik (charts IPK, distribusi nilai)

## Database

Uses MongoDB in-memory (mongodb-memory-server) by default.
Set `MONGODB_URI` env var to use a real MongoDB instance.

## Public Website & Security

- `/` is the public STIBADA MASA landing page with admissions, programs, scholarships, gallery, announcements, and online PMB form.
- `/login` is the protected role-based portal login.
- Admin can manage public content at `/dashboard/admin/content` and system/integration readiness at `/dashboard/admin/sistem`.
- API adds CSP/security headers, rate limiting, password hashing via Node crypto scrypt, signed auth tokens, audit trail entries, analytics events, OpenAPI exposure at `/api/docs`, and WebSocket notifications at `/api/ws`.

## Key Commands

```
pnpm --filter @workspace/kampus run dev       # Frontend
pnpm --filter @workspace/api-server run dev   # Backend
pnpm --filter @workspace/api-spec run codegen # Regenerate API client
```
