# Dokumentasi Keamanan dan Operasional

## Autentikasi dan otorisasi

- Login berada di `POST /api/auth/login`.
- Password disimpan dengan hashing `crypto.scrypt`.
- Token sesi dibuat memakai HMAC SHA-256 dan memiliki masa berlaku 8 jam.
- Role utama: mahasiswa, dosen, admin, dan rektor.
- Endpoint sensitif dilindungi middleware role guard.

## Audit trail

Aktivitas penting dicatat di collection `auditLogs`, contohnya:

- Login pengguna.
- Pendaftaran mahasiswa baru.
- Pembuatan atau perubahan konten publik.

Audit log dipakai untuk membantu admin menelusuri aktivitas operasional.

## Content Security Policy dan header keamanan

Middleware security memasang:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Content-Security-Policy`

CSP membatasi sumber script, style, font, image, dan koneksi WebSocket untuk mengurangi risiko XSS.

## Rate limiting

Rate limit sederhana berbasis IP diterapkan di API:

- Login dibatasi lebih ketat.
- Endpoint lain memiliki batas request per menit.

Ini membantu mengurangi brute-force dan abuse API.

## HTTPS dan deployment

Di lingkungan publik, komunikasi harus berjalan melalui HTTPS. Saat aplikasi dipublikasikan di Replit, TLS dikelola oleh platform hosting.

## Environment management

Variabel yang relevan:

- `PORT` — wajib untuk frontend dan backend service.
- `BASE_PATH` — base path frontend, saat ini `/`.
- `MONGODB_URI` — koneksi MongoDB production.
- `MONGO_URL` — alternatif koneksi MongoDB.
- `AUTH_SECRET` — secret token auth; wajib diset kuat di production.

Jangan menyimpan secret di source code. Simpan secret di pengelola environment/secrets.

## Backup database

Mode development memakai MongoDB in-memory, sehingga data tidak permanen. Untuk production:

- Gunakan MongoDB permanen melalui `MONGODB_URI`.
- Aktifkan backup otomatis dari provider database.
- Simpan jadwal backup dan prosedur restore di dokumentasi operasional internal.

## Integrasi eksternal

Area integrasi yang disiapkan secara konseptual:

- Payment gateway untuk biaya kuliah, PMB, dan layanan kampus.
- Perpustakaan digital untuk katalog e-book, jurnal, dan materi bacaan.
- E-learning untuk materi, tugas, dan forum.
- SIAKAD existing untuk sinkronisasi mahasiswa, mata kuliah, nilai, dan jadwal.
- Analytics untuk memantau perilaku pengguna.

Integrasi eksternal sebaiknya dibuat melalui endpoint backend agar credential tidak bocor ke browser.

## Catatan peningkatan lanjutan

- 2FA opsional untuk admin dan rektor.
- Permission granular per modul.
- Job scheduler untuk email konfirmasi, pengingat KRS, dan backup.
- Cache backend untuk data sering diakses.
- Index MongoDB untuk pencarian pengumuman, dosen, mata kuliah, dan program studi.