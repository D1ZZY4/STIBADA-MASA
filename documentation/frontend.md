# Dokumentasi Frontend

## Struktur utama

Frontend berada di `artifacts/kampus/src`.

- `App.tsx` mengatur routing publik dan dashboard role-based.
- `pages/public/` berisi halaman publik: beranda, pendaftaran, program studi, beasiswa, galeri, pengumuman, dan informasi PMB.
- `pages/dashboard/` berisi halaman untuk mahasiswa, dosen, admin, dan rektor.
- `components/layout/` berisi layout publik dan dashboard.
- `components/ui/` berisi komponen UI reusable seperti button, card, badge, table, tabs, dialog, dan form controls.
- `lib/api.ts` berisi helper API fetch untuk endpoint manual.
- `lib/auth.tsx` menyimpan state autentikasi pengguna dan token client-side.

## Tema visual

Aplikasi menggunakan tema modern-minimal dengan radius besar dan warna non-standar:

- Krem hangat: `#f4f1ea`
- Hijau kampus: `#2a6b5a`
- Hijau gelap: `#203d37`
- Pasir emas: `#b8a16d`
- Slate teks: `#2d3748`

Komponen baru sebaiknya menggunakan:

- Rounded card minimal `rounded-2xl` sampai `rounded-[2rem]`
- Border lembut `#ded8ca`
- Background transparan hangat `bg-white/80`, `bg-[#f8f5ec]`, atau `bg-[#f4f1ea]`
- Ikon dari `@phosphor-icons/react` dengan `weight` seperti `duotone`, `bold`, atau `regular`

## Halaman Pengumuman

File: `artifacts/kampus/src/pages/public/pengumuman.tsx`

Fungsi halaman:

- Menampilkan daftar pengumuman publik yang berasal dari `/api/public/landing`.
- Menyediakan fallback data agar halaman tetap berisi informasi saat API belum tersedia.
- Menyediakan pencarian berdasarkan judul dan isi pengumuman.
- Menyediakan filter kategori: Semua, Pendaftaran, Akademik, Kegiatan, dan Beasiswa.
- Menampilkan satu pengumuman utama sebagai sorotan, lalu pengumuman lain dalam kartu rapi.
- Menyediakan panel ringkasan dan kategori di sisi kanan pada desktop.
- Menampilkan gambar kegiatan kampus pada hero dan kartu sorotan agar halaman lebih visual dan mudah dipahami.
- Menggunakan Phosphor Icons untuk pencarian, kategori, tanggal, status verifikasi, dan navigasi.

## Responsivitas

Pola responsif yang digunakan:

- Mobile: konten satu kolom, navigasi dropdown, kartu penuh.
- Tablet: nav horizontal scroll, grid mulai disusun lebih rapat.
- Desktop: layout dua kolom untuk halaman yang membutuhkan panel samping.

Gunakan breakpoint Tailwind seperti `sm:`, `md:`, `lg:` agar tampilan tetap baik di semua ukuran layar.

## Aksesibilitas

Standar yang diterapkan:

- Input pencarian memiliki `label`.
- Tombol kategori memakai elemen `button`, bukan div.
- Warna teks dibuat kontras terhadap background.
- Link dan button memiliki target klik yang cukup besar.
- Gambar dekoratif memakai `alt=""`, sedangkan logo memakai alt deskriptif.