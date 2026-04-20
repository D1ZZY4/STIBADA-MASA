# Dokumentasi Kampus Modern

Folder ini menjadi pusat dokumentasi proyek STIBADA MASA / Kampus Modern. Semua catatan teknis, panduan pengembangan, dan contoh implementasi ditempatkan di sini agar mudah ditemukan dan dipelihara.

## Isi dokumentasi

- `frontend.md` — struktur UI, halaman publik, dashboard, tema visual, responsivitas, aksesibilitas, dan penggunaan ikon.
- `backend-api.md` — arsitektur backend Express, MongoDB native driver, endpoint utama, OpenAPI, dan pola validasi data.
- `security-operations.md` — keamanan aplikasi, audit trail, CSP, rate limiting, environment, backup, deployment, dan integrasi eksternal.
- `examples.md` — contoh implementasi autentikasi, manajemen data dinamis, API fetch, WebSocket, dan pencarian.

## Ringkasan produk

Kampus Modern adalah sistem informasi kampus untuk STIBADA MASA yang mencakup:

- Website publik: beranda, pendaftaran, program studi, beasiswa, galeri, pengumuman, dan informasi PMB.
- Portal role-based: mahasiswa, dosen, admin, dan rektor.
- Backend API: autentikasi, data akademik, KRS, nilai, absensi, diskusi, statistik, konten publik, analytics, dan realtime notification.
- Database: MongoDB native driver, dengan mode in-memory untuk development dan `MONGODB_URI` untuk database produksi.

## Prinsip pengembangan

- Desain modern, minimalis, rounded, responsif, dan konsisten.
- Palet warna khas: hijau kampus gelap, sage, pasir emas, krem hangat, dan aksen netral.
- Ikon modern diprioritaskan menggunakan Phosphor Icons untuk komponen baru agar konsisten dengan halaman publik dan dashboard yang sudah ada.
- Backend memakai driver `mongodb` langsung tanpa ORM/ODM agar query dan indeks tetap eksplisit.
- API dilindungi token, role authorization, validasi input, CSP, audit logs, dan rate limiting.
- Dokumentasi API sumber utama berada di `lib/api-spec/openapi.yaml` dan dapat diakses melalui `/api/docs`.