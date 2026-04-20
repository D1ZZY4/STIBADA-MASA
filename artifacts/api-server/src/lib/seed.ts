import { getDB, ObjectId } from "./mongodb";
import { logger } from "./logger";
import { hashPassword } from "./auth";

export async function seedIfEmpty(): Promise<void> {
  const db = getDB();

  const mahasiswaCount = await db.collection("mahasiswa").countDocuments();
  if (mahasiswaCount > 0) {
    logger.info("Database already seeded, skipping.");
    return;
  }

  logger.info("Seeding database...");

  const prodi = ["Teknik Informatika", "Sistem Informasi", "Manajemen Bisnis", "Hukum", "Kedokteran"];

  const dosenIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const dosenData = [
    { _id: dosenIds[0], nidn: "0123456789", nama: "Dr. Arif Setiawan, M.T.", email: "arif@kampus.ac.id", prodi: "Teknik Informatika", jabatan: "Lektor Kepala", golongan: "IV/a", status: "aktif", keahlian: ["Machine Learning", "Data Science"], telepon: "08123456789", password: hashPassword("dosen123"), role: "dosen" },
    { _id: dosenIds[1], nidn: "0202029002", nama: "Prof. Siti Rahayu, Ph.D.", email: "siti@kampus.ac.id", prodi: "Sistem Informasi", jabatan: "Guru Besar", golongan: "IV/d", status: "aktif", keahlian: ["Database", "Enterprise Systems"], telepon: "08234567890", password: hashPassword("dosen123"), role: "dosen" },
    { _id: dosenIds[2], nidn: "0303039003", nama: "Dr. Budi Santoso, M.M.", email: "budi@kampus.ac.id", prodi: "Manajemen Bisnis", jabatan: "Lektor", golongan: "III/d", status: "aktif", keahlian: ["Strategic Management", "Finance"], telepon: "08345678901", password: hashPassword("dosen123"), role: "dosen" },
    { _id: dosenIds[3], nidn: "0404049004", nama: "Dr. Dewi Lestari, S.H., M.H.", email: "dewi@kampus.ac.id", prodi: "Hukum", jabatan: "Lektor Kepala", golongan: "IV/b", status: "aktif", keahlian: ["Hukum Perdata", "Hukum Bisnis"], telepon: "08456789012", password: hashPassword("dosen123"), role: "dosen" },
    { _id: dosenIds[4], nidn: "0505059005", nama: "dr. Rizki Pratama, Sp.PD.", email: "rizki@kampus.ac.id", prodi: "Kedokteran", jabatan: "Lektor", golongan: "III/c", status: "aktif", keahlian: ["Internal Medicine", "Cardiology"], telepon: "08567890123", password: hashPassword("dosen123"), role: "dosen" },
  ];
  await db.collection("dosen").insertMany(dosenData);

  const mahasiswaIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const mahasiswaData = [
    { _id: mahasiswaIds[0], nim: "20210001", nama: "Ahmad Fauzi", email: "ahmad@student.kampus.ac.id", prodi: "Teknik Informatika", angkatan: 2021, semester: 7, ipk: 3.85, sks: 120, status: "aktif", telepon: "08111111111", alamat: "Jl. Merdeka No. 1, Jakarta", password: hashPassword("mahasiswa123"), role: "mahasiswa" },
    { _id: mahasiswaIds[1], nim: "20210002", nama: "Bella Safira", email: "bella@student.kampus.ac.id", prodi: "Sistem Informasi", angkatan: 2021, semester: 7, ipk: 3.72, sks: 118, status: "aktif", telepon: "08122222222", alamat: "Jl. Sudirman No. 5, Jakarta", password: hashPassword("mahasiswa123"), role: "mahasiswa" },
    { _id: mahasiswaIds[2], nim: "20220003", nama: "Cahyo Wibowo", email: "cahyo@student.kampus.ac.id", prodi: "Manajemen Bisnis", angkatan: 2022, semester: 5, ipk: 3.45, sks: 90, status: "aktif", telepon: "08133333333", alamat: "Jl. Gatot Subroto No. 10, Jakarta", password: hashPassword("mahasiswa123"), role: "mahasiswa" },
    { _id: mahasiswaIds[3], nim: "20220004", nama: "Diana Putri", email: "diana@student.kampus.ac.id", prodi: "Hukum", angkatan: 2022, semester: 5, ipk: 3.65, sks: 88, status: "aktif", telepon: "08144444444", alamat: "Jl. Thamrin No. 3, Jakarta", password: hashPassword("mahasiswa123"), role: "mahasiswa" },
    { _id: mahasiswaIds[4], nim: "20230005", nama: "Eko Prasetyo", email: "eko@student.kampus.ac.id", prodi: "Kedokteran", angkatan: 2023, semester: 3, ipk: 3.92, sks: 55, status: "aktif", telepon: "08155555555", alamat: "Jl. Rasuna Said No. 7, Jakarta", password: hashPassword("mahasiswa123"), role: "mahasiswa" },
    { _id: mahasiswaIds[5], nim: "20230006", nama: "Fitri Handayani", email: "fitri@student.kampus.ac.id", prodi: "Teknik Informatika", angkatan: 2023, semester: 3, ipk: 3.58, sks: 52, status: "aktif", telepon: "08166666666", alamat: "Jl. Kuningan No. 2, Jakarta", password: hashPassword("mahasiswa123"), role: "mahasiswa" },
  ];
  await db.collection("mahasiswa").insertMany(mahasiswaData);

  const mkIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const mataKuliahData = [
    { _id: mkIds[0], kode: "TI301", nama: "Pemrograman Web", sks: 3, semester: 5, prodi: "Teknik Informatika", dosenId: dosenIds[0].toHexString(), dosenNama: "Dr. Arif Setiawan, M.T.", deskripsi: "Mempelajari teknologi web modern", status: "aktif" },
    { _id: mkIds[1], kode: "TI302", nama: "Machine Learning", sks: 3, semester: 5, prodi: "Teknik Informatika", dosenId: dosenIds[0].toHexString(), dosenNama: "Dr. Arif Setiawan, M.T.", deskripsi: "Pengantar machine learning dan AI", status: "aktif" },
    { _id: mkIds[2], kode: "SI301", nama: "Sistem Basis Data", sks: 3, semester: 5, prodi: "Sistem Informasi", dosenId: dosenIds[1].toHexString(), dosenNama: "Prof. Siti Rahayu, Ph.D.", deskripsi: "Desain dan implementasi database", status: "aktif" },
    { _id: mkIds[3], kode: "MB301", nama: "Manajemen Strategis", sks: 3, semester: 5, prodi: "Manajemen Bisnis", dosenId: dosenIds[2].toHexString(), dosenNama: "Dr. Budi Santoso, M.M.", deskripsi: "Perencanaan strategi bisnis", status: "aktif" },
    { _id: mkIds[4], kode: "HK301", nama: "Hukum Perdata", sks: 3, semester: 5, prodi: "Hukum", dosenId: dosenIds[3].toHexString(), dosenNama: "Dr. Dewi Lestari, S.H., M.H.", deskripsi: "Prinsip hukum perdata Indonesia", status: "aktif" },
    { _id: mkIds[5], kode: "KD301", nama: "Anatomi Dasar", sks: 4, semester: 3, prodi: "Kedokteran", dosenId: dosenIds[4].toHexString(), dosenNama: "dr. Rizki Pratama, Sp.PD.", deskripsi: "Dasar anatomi tubuh manusia", status: "aktif" },
  ];
  await db.collection("matakuLiah").insertMany(mataKuliahData);

  const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const jadwalIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const jadwalData = [
    { _id: jadwalIds[0], mataKuliahId: mkIds[0].toHexString(), mataKuliahNama: "Pemrograman Web", mataKuliahKode: "TI301", dosenId: dosenIds[0].toHexString(), dosenNama: "Dr. Arif Setiawan, M.T.", hari: "Senin", jamMulai: "08:00", jamSelesai: "10:30", ruangan: "Lab A-101", kelas: "TI-A", semester: "2024/2025 Ganjil", sks: 3 },
    { _id: jadwalIds[1], mataKuliahId: mkIds[1].toHexString(), mataKuliahNama: "Machine Learning", mataKuliahKode: "TI302", dosenId: dosenIds[0].toHexString(), dosenNama: "Dr. Arif Setiawan, M.T.", hari: "Rabu", jamMulai: "10:00", jamSelesai: "12:30", ruangan: "Lab A-102", kelas: "TI-A", semester: "2024/2025 Ganjil", sks: 3 },
    { _id: jadwalIds[2], mataKuliahId: mkIds[2].toHexString(), mataKuliahNama: "Sistem Basis Data", mataKuliahKode: "SI301", dosenId: dosenIds[1].toHexString(), dosenNama: "Prof. Siti Rahayu, Ph.D.", hari: "Selasa", jamMulai: "13:00", jamSelesai: "15:30", ruangan: "Lab B-201", kelas: "SI-A", semester: "2024/2025 Ganjil", sks: 3 },
    { _id: jadwalIds[3], mataKuliahId: mkIds[3].toHexString(), mataKuliahNama: "Manajemen Strategis", mataKuliahKode: "MB301", dosenId: dosenIds[2].toHexString(), dosenNama: "Dr. Budi Santoso, M.M.", hari: "Kamis", jamMulai: "08:00", jamSelesai: "10:30", ruangan: "R-301", kelas: "MB-A", semester: "2024/2025 Ganjil", sks: 3 },
    { _id: jadwalIds[4], mataKuliahId: mkIds[4].toHexString(), mataKuliahNama: "Hukum Perdata", mataKuliahKode: "HK301", dosenId: dosenIds[3].toHexString(), dosenNama: "Dr. Dewi Lestari, S.H., M.H.", hari: "Jumat", jamMulai: "10:00", jamSelesai: "12:30", ruangan: "R-401", kelas: "HK-A", semester: "2024/2025 Ganjil", sks: 3 },
    { _id: jadwalIds[5], mataKuliahId: mkIds[5].toHexString(), mataKuliahNama: "Anatomi Dasar", mataKuliahKode: "KD301", dosenId: dosenIds[4].toHexString(), dosenNama: "dr. Rizki Pratama, Sp.PD.", hari: "Senin", jamMulai: "13:00", jamSelesai: "16:50", ruangan: "Lab Med-101", kelas: "KD-A", semester: "2024/2025 Ganjil", sks: 4 },
  ];
  await db.collection("jadwal").insertMany(jadwalData);

  const krsData = [
    { mahasiswaId: mahasiswaIds[0].toHexString(), mahasiswaNama: "Ahmad Fauzi", mataKuliahId: mkIds[0].toHexString(), mataKuliahNama: "Pemrograman Web", mataKuliahKode: "TI301", sks: 3, semester: "2024/2025 Ganjil", status: "disetujui", kelas: "TI-A" },
    { mahasiswaId: mahasiswaIds[0].toHexString(), mahasiswaNama: "Ahmad Fauzi", mataKuliahId: mkIds[1].toHexString(), mataKuliahNama: "Machine Learning", mataKuliahKode: "TI302", sks: 3, semester: "2024/2025 Ganjil", status: "disetujui", kelas: "TI-A" },
    { mahasiswaId: mahasiswaIds[1].toHexString(), mahasiswaNama: "Bella Safira", mataKuliahId: mkIds[2].toHexString(), mataKuliahNama: "Sistem Basis Data", mataKuliahKode: "SI301", sks: 3, semester: "2024/2025 Ganjil", status: "disetujui", kelas: "SI-A" },
    { mahasiswaId: mahasiswaIds[2].toHexString(), mahasiswaNama: "Cahyo Wibowo", mataKuliahId: mkIds[3].toHexString(), mataKuliahNama: "Manajemen Strategis", mataKuliahKode: "MB301", sks: 3, semester: "2024/2025 Ganjil", status: "pending", kelas: "MB-A" },
    { mahasiswaId: mahasiswaIds[4].toHexString(), mahasiswaNama: "Eko Prasetyo", mataKuliahId: mkIds[5].toHexString(), mataKuliahNama: "Anatomi Dasar", mataKuliahKode: "KD301", sks: 4, semester: "2024/2025 Ganjil", status: "disetujui", kelas: "KD-A" },
  ];
  await db.collection("krs").insertMany(krsData);

  const nilaiData = [
    { mahasiswaId: mahasiswaIds[0].toHexString(), mahasiswaNama: "Ahmad Fauzi", mahasiswaNim: "20210001", mataKuliahId: mkIds[0].toHexString(), mataKuliahNama: "Pemrograman Web", mataKuliahKode: "TI301", dosenId: dosenIds[0].toHexString(), semester: "2024/2025 Ganjil", nilaiTugas: 88, nilaiUts: 82, nilaiUas: 90, nilaiAkhir: 87, grade: "A", sks: 3 },
    { mahasiswaId: mahasiswaIds[0].toHexString(), mahasiswaNama: "Ahmad Fauzi", mahasiswaNim: "20210001", mataKuliahId: mkIds[1].toHexString(), mataKuliahNama: "Machine Learning", mataKuliahKode: "TI302", dosenId: dosenIds[0].toHexString(), semester: "2024/2025 Ganjil", nilaiTugas: 85, nilaiUts: 78, nilaiUas: 88, nilaiAkhir: 84, grade: "A-", sks: 3 },
    { mahasiswaId: mahasiswaIds[1].toHexString(), mahasiswaNama: "Bella Safira", mahasiswaNim: "20210002", mataKuliahId: mkIds[2].toHexString(), mataKuliahNama: "Sistem Basis Data", mataKuliahKode: "SI301", dosenId: dosenIds[1].toHexString(), semester: "2024/2025 Ganjil", nilaiTugas: 90, nilaiUts: 85, nilaiUas: 92, nilaiAkhir: 89.5, grade: "A", sks: 3 },
    { mahasiswaId: mahasiswaIds[4].toHexString(), mahasiswaNama: "Eko Prasetyo", mahasiswaNim: "20230005", mataKuliahId: mkIds[5].toHexString(), mataKuliahNama: "Anatomi Dasar", mataKuliahKode: "KD301", dosenId: dosenIds[4].toHexString(), semester: "2024/2025 Ganjil", nilaiTugas: 92, nilaiUts: 88, nilaiUas: 95, nilaiAkhir: 91.8, grade: "A", sks: 4 },
  ];
  await db.collection("nilai").insertMany(nilaiData);

  const today = new Date().toISOString().split("T")[0];
  const absensiData = [
    { mahasiswaId: mahasiswaIds[0].toHexString(), mahasiswaNama: "Ahmad Fauzi", mahasiswaNim: "20210001", dosenId: dosenIds[0].toHexString(), jadwalId: jadwalIds[0].toHexString(), mataKuliahNama: "Pemrograman Web", tanggal: today, status: "hadir", keterangan: "" },
    { mahasiswaId: mahasiswaIds[0].toHexString(), mahasiswaNama: "Ahmad Fauzi", mahasiswaNim: "20210001", dosenId: dosenIds[0].toHexString(), jadwalId: jadwalIds[1].toHexString(), mataKuliahNama: "Machine Learning", tanggal: today, status: "hadir", keterangan: "" },
    { mahasiswaId: mahasiswaIds[1].toHexString(), mahasiswaNama: "Bella Safira", mahasiswaNim: "20210002", dosenId: dosenIds[1].toHexString(), jadwalId: jadwalIds[2].toHexString(), mataKuliahNama: "Sistem Basis Data", tanggal: today, status: "hadir", keterangan: "" },
    { mahasiswaId: mahasiswaIds[4].toHexString(), mahasiswaNama: "Eko Prasetyo", mahasiswaNim: "20230005", dosenId: dosenIds[4].toHexString(), jadwalId: jadwalIds[5].toHexString(), mataKuliahNama: "Anatomi Dasar", tanggal: today, status: "hadir", keterangan: "" },
  ];
  await db.collection("absensi").insertMany(absensiData);

  const roomIds = [new ObjectId(), new ObjectId(), new ObjectId()];
  const diskusiRoomData = [
    { _id: roomIds[0], nama: "Diskusi TI-A Pemrograman Web", type: "kelas", participants: [mahasiswaIds[0].toHexString(), mahasiswaIds[5].toHexString(), dosenIds[0].toHexString()], lastMessage: "Kapan deadline tugas besar?", lastMessageAt: new Date().toISOString(), unreadCount: 2 },
    { _id: roomIds[1], nama: "Forum Umum Kampus", type: "umum", participants: [], lastMessage: "Selamat datang di forum kampus!", lastMessageAt: new Date().toISOString(), unreadCount: 0 },
    { _id: roomIds[2], nama: "Chat Ahmad - Dr. Arif", type: "personal", participants: [mahasiswaIds[0].toHexString(), dosenIds[0].toHexString()], lastMessage: "Pak, bisa konsultasi TA?", lastMessageAt: new Date().toISOString(), unreadCount: 1 },
  ];
  await db.collection("diskusiRooms").insertMany(diskusiRoomData);

  const diskusiData = [
    { roomId: roomIds[0].toHexString(), senderId: mahasiswaIds[0].toHexString(), senderNama: "Ahmad Fauzi", senderRole: "mahasiswa", pesan: "Kapan deadline tugas besar?", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { roomId: roomIds[0].toHexString(), senderId: dosenIds[0].toHexString(), senderNama: "Dr. Arif Setiawan, M.T.", senderRole: "dosen", pesan: "Deadline tugas besar adalah 30 November 2024.", createdAt: new Date(Date.now() - 1800000).toISOString() },
    { roomId: roomIds[1].toHexString(), senderId: dosenIds[0].toHexString(), senderNama: "Dr. Arif Setiawan, M.T.", senderRole: "dosen", pesan: "Selamat datang di forum kampus!", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { roomId: roomIds[2].toHexString(), senderId: mahasiswaIds[0].toHexString(), senderNama: "Ahmad Fauzi", senderRole: "mahasiswa", pesan: "Pak, bisa konsultasi TA?", createdAt: new Date(Date.now() - 7200000).toISOString() },
  ];
  await db.collection("diskusi").insertMany(diskusiData);

  const adminData = [
    { nama: "Administrator Sistem", email: "admin@kampus.ac.id", role: "admin", password: hashPassword("admin123"), nim: "admin001", twoFactorEnabled: true, permissions: ["*"] },
  ];
  await db.collection("admin").insertMany(adminData);

  const rektorData = [
    { nama: "Prof. Dr. H. Suyono, M.B.A.", email: "rektor@kampus.ac.id", role: "rektor", password: hashPassword("rektor123"), nim: "rektor001", jabatan: "Rektor STIBADA MASA", twoFactorEnabled: true },
  ];
  await db.collection("rektor").insertMany(rektorData);

  await db.collection("programs").insertMany([
    { kode: "PAI", nama: "Pendidikan Agama Islam", kurikulum: ["Studi Al-Qur'an", "Metodologi Pembelajaran", "Teknologi Pendidikan"], dosen: "Dr. Arif Setiawan, M.T.", prospek: ["Guru", "Konsultan Pendidikan", "Pengembang Kurikulum"] },
    { kode: "ES", nama: "Ekonomi Syariah", kurikulum: ["Fiqh Muamalah", "Keuangan Digital", "Kewirausahaan"], dosen: "Prof. Siti Rahayu, Ph.D.", prospek: ["Analis Keuangan Syariah", "Wirausaha", "Konsultan UMKM"] },
    { kode: "KPI", nama: "Komunikasi dan Penyiaran Islam", kurikulum: ["Produksi Media", "Public Speaking", "Jurnalisme Digital"], dosen: "Dr. Budi Santoso, M.M.", prospek: ["Jurnalis", "Content Strategist", "Humas"] },
  ]);
  await db.collection("scholarships").insertMany([
    { nama: "Beasiswa Prestasi MASA", kriteria: "Rapor atau IPK unggul dan aktif organisasi", panduan: "Unggah portofolio, transkrip, dan surat rekomendasi." },
    { nama: "Beasiswa Tahfidz", kriteria: "Hafalan minimal 5 juz", panduan: "Ikuti verifikasi hafalan dan wawancara akademik." },
    { nama: "Beasiswa Keluarga Berdaya", kriteria: "Membutuhkan dukungan pembiayaan", panduan: "Lampirkan dokumen ekonomi keluarga dan esai motivasi." },
  ]);
  await db.collection("gallery").insertMany([
    { title: "Wisuda Sarjana", category: "wisuda", description: "Momen pelepasan lulusan STIBADA MASA.", createdAt: new Date().toISOString() },
    { title: "Seminar Literasi Digital", category: "seminar", description: "Kuliah umum transformasi pembelajaran digital.", createdAt: new Date().toISOString() },
    { title: "Liga Futsal Mahasiswa", category: "olahraga", description: "Kegiatan olahraga antar prodi.", createdAt: new Date().toISOString() },
    { title: "Ekstrakurikuler Seni Hadrah", category: "ekskul", description: "Pembinaan minat bakat mahasiswa.", createdAt: new Date().toISOString() },
  ]);
  await db.collection("announcements").insertMany([
    { title: "Pendaftaran Mahasiswa Baru Dibuka", content: "PMB STIBADA MASA tahun akademik 2026/2027 telah dibuka.", audience: "publik", createdAt: new Date().toISOString() },
    { title: "Pengingat Batas KRS", content: "Pengisian KRS ditutup Jumat pukul 23.59 WIB.", audience: "semua", createdAt: new Date().toISOString() },
  ]);
  await db.collection("systemSettings").insertOne({ key: "integrations", paymentGateway: "Stripe siap dihubungkan melalui koneksi resmi saat akun tersedia", digitalLibrary: "Mode katalog internal aktif", elearning: "Sinkronisasi materi dan tugas disiapkan via endpoint integrasi", backups: "Backup berkala dikonfigurasi melalui MONGODB_URI production", updatedAt: new Date().toISOString() });

  logger.info("Database seeded successfully!");
}
