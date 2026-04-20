# Dokumentasi Backend dan API

## Struktur backend

Backend berada di `artifacts/api-server/src`.

- `index.ts` membaca `PORT`, membuat HTTP server, dan mengaktifkan WebSocket upgrade.
- `app.ts` memasang logger, security headers, rate limit, CORS, parser JSON, dan router `/api`.
- `routes/` berisi modul endpoint sesuai domain: auth, mahasiswa, dosen, mata kuliah, jadwal, KRS, nilai, absensi, diskusi, statistik, dan publik.
- `lib/mongodb.ts` mengatur koneksi MongoDB native driver.
- `lib/seed.ts` mengisi data awal untuk development.
- `lib/auth.ts` mengatur hashing password scrypt, token HMAC, dan verifikasi token.
- `lib/realtime.ts` mengatur WebSocket untuk notifikasi instan.
- `middlewares/security.ts` mengatur CSP, rate limiting, autentikasi, dan role guard.

## Database

Backend memakai MongoDB native driver secara langsung:

- Tidak memakai Mongoose atau ORM/ODM.
- Query memakai collection MongoDB langsung, misalnya `db.collection("mahasiswa").find(...)`.
- ObjectId dikonversi menjadi `id` string sebelum dikirim ke frontend.
- Jika `MONGODB_URI` tidak tersedia, development memakai MongoDB in-memory.

Collection utama:

- `mahasiswa`, `dosen`, `admin`, `rektor`
- `mataKuliah`, `jadwal`, `krs`, `nilai`, `absensi`
- `diskusiRooms`, `diskusi`
- `publicContent`, `announcements`, `applications`, `gallery`
- `auditLogs`, `analyticsEvents`, `systemSettings`

## API dan OpenAPI

Spesifikasi API berada di:

- `lib/api-spec/openapi.yaml`

Endpoint dokumentasi runtime:

- `/api/docs`
- `/api/openapi.yaml`

Client React Query dihasilkan dari OpenAPI dan diekspor melalui `@workspace/api-client-react`.

## Endpoint penting

- `GET /api/healthz` — cek kesehatan API.
- `POST /api/auth/login` — login berdasarkan role.
- `GET /api/public/landing` — data landing publik, pengumuman, program, beasiswa, dan galeri.
- `POST /api/public/applications` — form pendaftaran mahasiswa baru.
- `GET /api/content` — konten publik, aplikasi PMB, dan audit logs untuk admin/rektor.
- `POST /api/content` — tambah konten publik oleh admin.
- `GET /api/stats/overview` — statistik dashboard.
- `GET /api/diskusi` dan `POST /api/diskusi` — forum diskusi.

## Validasi dan otorisasi

Validasi dasar dilakukan di route handler sebelum operasi database. Endpoint internal memakai:

- `requireAuth` untuk memastikan token valid.
- `requireRole(["admin"])`, `requireRole(["admin", "rektor"])`, dan pola serupa untuk membatasi akses.
- Audit log untuk aksi penting seperti login, pendaftaran, dan perubahan konten.

Untuk pengembangan lanjutan, validasi dapat diperketat dengan schema Zod dari `lib/api-zod`.