import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calendar, Gallery, Login, MedalStar, MessageQuestion, SecuritySafe, Teacher, WalletMoney, DirectboxNotif, UserOctagon, Eye, Routing } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch, trackEvent } from "@/lib/api";
import { toast } from "sonner";

type LandingData = {
  content: { id: string; key: string; type: string; title: string; content: string }[];
  announcements: { id: string; title: string; content: string; createdAt: string }[];
  programs: { id: string; kode: string; nama: string; kurikulum: string[]; dosen: string; prospek: string[] }[];
  scholarships: { id: string; nama: string; kriteria: string; panduan: string }[];
  gallery: { id: string; title: string; category: string; description: string }[];
  admission: { biaya: string; kontak: string; jadwal: string };
};

const fallback: LandingData = {
  content: [
    { id: "visi", key: "visi", type: "profile", title: "Visi STIBADA MASA", content: "Menjadi perguruan tinggi yang membentuk insan akademik beradab, adaptif, dan berdampak bagi masyarakat." },
    { id: "misi", key: "misi", type: "profile", title: "Misi STIBADA MASA", content: "Menguatkan pembelajaran, penelitian, pengabdian, tata kelola, dan jejaring digital yang relevan dengan kebutuhan zaman." },
  ],
  announcements: [
    { id: "ann1", title: "Pendaftaran Mahasiswa Baru Dibuka", content: "PMB STIBADA MASA tahun akademik 2026/2027 telah dibuka. Daftarkan diri Anda sekarang melalui formulir daring.", createdAt: new Date().toISOString() },
    { id: "ann2", title: "Pengingat Batas KRS", content: "Pengisian Kartu Rencana Studi (KRS) ditutup Jumat pukul 23.59 WIB. Segera hubungi dosen wali jika ada kendala.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  programs: [
    { id: "prg1", kode: "PAI", nama: "Pendidikan Agama Islam", kurikulum: ["Studi Al-Qur'an", "Metodologi Pembelajaran", "Teknologi Pendidikan"], dosen: "Dr. Arif Setiawan, M.T.", prospek: ["Guru", "Konsultan Pendidikan", "Pengembang Kurikulum"] },
    { id: "prg2", kode: "ES", nama: "Ekonomi Syariah", kurikulum: ["Fiqh Muamalah", "Keuangan Digital", "Kewirausahaan"], dosen: "Prof. Siti Rahayu, Ph.D.", prospek: ["Analis Keuangan Syariah", "Wirausaha", "Konsultan UMKM"] },
    { id: "prg3", kode: "KPI", nama: "Komunikasi dan Penyiaran Islam", kurikulum: ["Produksi Media", "Public Speaking", "Jurnalisme Digital"], dosen: "Dr. Budi Santoso, M.M.", prospek: ["Jurnalis", "Content Strategist", "Humas"] },
  ],
  scholarships: [
    { id: "sch1", nama: "Beasiswa Prestasi MASA", kriteria: "Rapor atau IPK unggul dan aktif organisasi", panduan: "Unggah portofolio, transkrip, dan surat rekomendasi." },
    { id: "sch2", nama: "Beasiswa Tahfidz", kriteria: "Hafalan minimal 5 juz", panduan: "Ikuti verifikasi hafalan dan wawancara akademik." },
    { id: "sch3", nama: "Beasiswa Keluarga Berdaya", kriteria: "Membutuhkan dukungan pembiayaan", panduan: "Lampirkan dokumen ekonomi keluarga dan esai motivasi." },
  ],
  gallery: [
    { id: "gal1", title: "Wisuda Sarjana", category: "Wisuda", description: "Momen pelepasan lulusan STIBADA MASA." },
    { id: "gal2", title: "Seminar Literasi Digital", category: "Seminar", description: "Kuliah umum transformasi pembelajaran digital." },
    { id: "gal3", title: "Liga Futsal Mahasiswa", category: "Olahraga", description: "Kegiatan olahraga antar prodi." },
    { id: "gal4", title: "Ekstrakurikuler Seni Hadrah", category: "Ekskul", description: "Pembinaan minat bakat mahasiswa." },
  ],
  admission: { biaya: "Mulai Rp 3.500.000 per semester", kontak: "pmb@stibadamasa.ac.id", jadwal: "Gelombang 1: Januari–Maret, Gelombang 2: April–Juni, Gelombang 3: Juli–Agustus" },
};

const images = {
  hero: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85",
  campus: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=85",
  admission: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=85",
  login: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
  profile: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
  ],
  scholarship: [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
  ],
  announcement: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=85",
  programs: [
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85",
  ],
};

export default function Home() {
  const [data, setData] = useState<LandingData>(fallback);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", telepon: "", program: "Pendidikan Agama Islam", jalur: "reguler", pesan: "" });

  useEffect(() => {
    trackEvent("public_home_view");
    apiFetch<LandingData>("/public/landing").then(setData).catch(() => undefined);
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}/api/ws`);
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "announcement.created") toast.info("Pengumuman baru tersedia");
    };
    return () => ws.close();
  }, []);

  const profile = useMemo(() => data.content.filter((item) => item.type === "profile"), [data.content]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/public/applications", { method: "POST", body: JSON.stringify(form) });
      toast.success("Formulir pendaftaran terkirim. Tim PMB akan menghubungi Anda.");
      setForm({ nama: "", email: "", telepon: "", program: form.program, jalur: "reguler", pesan: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengirim formulir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#ded8ca] bg-[#f4f1ea]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#beranda" className="flex items-center gap-3" aria-label="STIBADA MASA Beranda">
            <img src="/logo-stibada.png" alt="Logo STIBADA MASA" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-lg font-bold tracking-tight">STIBADA MASA</p>
              <p className="text-xs text-muted-foreground">Sistem Kampus Terpadu</p>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex" aria-label="Navigasi publik">
            <a href="#pendaftaran">Pendaftaran</a>
            <a href="#prodi">Program Studi</a>
            <a href="#beasiswa">Beasiswa</a>
            <a href="#galeri">Galeri</a>
            <a href="#pengumuman">Pengumuman</a>
            <Link href="/login" className="font-semibold text-primary">Login/Masuk</Link>
          </nav>
          <Link href="/login">
            <Button className="gap-2 rounded-2xl shadow-sm">
              <Login size={18} />
              Login/Masuk
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section id="beranda" className="relative overflow-hidden px-4 py-14 sm:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(42,107,90,.16),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(153,125,89,.20),transparent_28%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-8">
              <Badge className="rounded-full px-4 py-2">PMB 2026/2027 sedang dibuka</Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                  Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel (STIBADA MASA) Surabaya
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Portal akademik terpadu untuk informasi publik, pendaftaran daring, jadwal kuliah, KRS, nilai, absensi, diskusi, dan panel statistik pimpinan.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#pendaftaran"><Button size="lg" className="w-full rounded-2xl sm:w-auto">Daftar Sekarang</Button></a>
                <Link href="/login"><Button size="lg" variant="outline" className="w-full rounded-2xl border-primary/30 bg-white/70 sm:w-auto">Masuk Portal Akademik</Button></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[["KRS interaktif", "Mahasiswa"], ["Diskusi real-time", "Civitas"], ["Audit & keamanan", "Admin"]].map(([title, label]) => (
                  <div key={title} className="rounded-2xl border border-[#ded8ca] bg-white/70 px-4 py-3 text-sm shadow-sm">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={images.hero} alt="Gedung kampus modern STIBADA MASA" className="h-[520px] w-full rounded-[2.4rem] object-cover shadow-2xl" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-[1.7rem] border border-white/40 bg-white/84 p-4 shadow-xl backdrop-blur md:grid-cols-4">
                {[
                  ["Mahasiswa", "Jadwal, KRS, nilai"],
                  ["Dosen", "Nilai & absensi"],
                  ["Admin", "Kelola sistem"],
                  ["Rektor", "Statistik kampus"],
                ].map(([title, desc]) => (
                  <div key={title}>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Badge variant="outline" className="rounded-full bg-white/70">Profil Kampus</Badge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Visi, misi, dan layanan digital kampus dibuat lebih jelas.</h2>
              </div>
              <p className="text-muted-foreground">Bagian ini menjelaskan arah kampus, layanan akademik, keamanan portal, dan komunikasi digital STIBADA MASA.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#ded8ca] bg-white shadow-lg">
                <img src={images.campus} alt="Suasana akademik STIBADA MASA" className="h-full min-h-[480px] w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] bg-white/86 p-5 shadow-lg backdrop-blur">
                  <p className="text-lg font-bold">STIBADA MASA</p>
                  <p className="mt-1 text-sm text-muted-foreground">Lingkungan belajar modern untuk akademik, administrasi, dan kolaborasi civitas kampus.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 content-start">
                {profile.slice(0, 2).map((item, index) => (
                  <Card key={item.id} className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/86 shadow-sm">
                    <img src={images.profile[index % images.profile.length]} alt={item.title} className="h-32 w-full object-cover" loading="lazy" />
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {item.key === "visi" ? <Eye variant="Bulk" size={18} className="text-primary shrink-0" /> : <Routing variant="Bulk" size={18} className="text-primary shrink-0" />}
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-muted-foreground">{item.content}</CardContent>
                  </Card>
                ))}

                <Card className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/86 shadow-sm">
                  <img src={images.profile[2]} alt="Keamanan portal akademik" className="h-32 w-full object-cover" loading="lazy" />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base"><SecuritySafe variant="Bulk" size={18} /> Keamanan Portal</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">Autentikasi berbasis peran, hash password, rate limiting, audit trail, dan opsi 2FA.</CardContent>
                </Card>

                <Card className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/86 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85" alt="Notifikasi dan koordinasi kampus" className="h-32 w-full object-cover" loading="lazy" />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base"><DirectboxNotif variant="Bulk" size={18} /> Notifikasi Instan</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">Pengumuman, diskusi, dan pembaruan status secara real-time.</CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="pendaftaran" className="bg-[#e8e2d4] px-4 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <img src={images.admission} alt="Mahasiswa baru STIBADA MASA" className="h-64 w-full rounded-[2rem] object-cover shadow-lg" loading="lazy" />
              <Badge variant="outline" className="rounded-full bg-white/70">Informasi Pendaftaran</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">Proses PMB ringkas, transparan, dan dapat dipantau daring.</h2>
              <div className="grid gap-4">
                {[["Jadwal", data.admission.jadwal, Calendar], ["Biaya", data.admission.biaya, WalletMoney], ["Kontak PMB", data.admission.kontak, MessageQuestion]].map(([label, value, Icon]) => {
                  const IconComponent = Icon as typeof Calendar;
                  return (
                    <div key={label as string} className="flex gap-4 rounded-3xl bg-white/78 p-5 shadow-sm">
                      <IconComponent variant="Bulk" className="text-primary" />
                      <div>
                        <p className="font-semibold">{label as string}</p>
                        <p className="text-sm text-muted-foreground">{value as string}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Card className="rounded-[2rem] border-[#d8cfbd] bg-white/86 shadow-xl">
              <CardHeader><CardTitle>Formulir Pendaftaran Daring</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={submit} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="nama">Nama Lengkap</Label><Input id="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
                    <div className="space-y-2"><Label htmlFor="telepon">Telepon</Label><Input id="telepon" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="program">Program Pilihan</Label><Input id="program" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} required /></div>
                    <div className="space-y-2"><Label htmlFor="jalur">Jalur</Label><Input id="jalur" value={form.jalur} onChange={(e) => setForm({ ...form, jalur: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="pesan">Catatan</Label><Textarea id="pesan" value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} /></div>
                  <Button disabled={loading} className="rounded-2xl">{loading ? "Mengirim..." : "Kirim Formulir"}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="prodi" className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="outline" className="rounded-full bg-white/70">Program Studi</Badge>
                <h2 className="mt-3 text-3xl font-bold">Kurikulum, profil dosen, dan prospek karir.</h2>
              </div>
              <Teacher variant="Bulk" className="text-primary shrink-0" size={42} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.programs.map((program, index) => (
                <Card key={program.id} className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/82 shadow-sm">
                  <img src={images.programs[index % images.programs.length]} alt={`Program studi ${program.nama}`} className="h-44 w-full object-cover" loading="lazy" />
                  <CardHeader><CardTitle>{program.nama}</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">Dosen pengampu: {program.dosen}</p>
                    <div><p className="font-semibold">Kurikulum inti</p><p className="text-muted-foreground">{program.kurikulum.join(", ")}</p></div>
                    <div><p className="font-semibold">Prospek karir</p><p className="text-muted-foreground">{program.prospek.join(", ")}</p></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="beasiswa" className="bg-[#ebe5d8] px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="outline" className="rounded-full bg-white/70">Beasiswa</Badge>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Program beasiswa untuk mahasiswa berprestasi.</h2>
              </div>
              <MedalStar variant="Bulk" className="text-primary shrink-0" size={42} />
            </div>
            <div className="relative overflow-hidden rounded-[2rem] shadow-lg">
              <img src={images.scholarship[0]} alt="Informasi beasiswa STIBADA MASA" className="h-52 w-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f4f46]/90 via-[#2f4f46]/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
                <p className="text-xl font-bold">Raih masa depan dengan dukungan STIBADA MASA</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/80">Tersedia berbagai jalur beasiswa berdasarkan prestasi akademik, hafalan Al-Qur'an, dan kebutuhan ekonomi.</p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.scholarships.map((item, index) => (
                <Card key={item.id} className="overflow-hidden rounded-3xl border-[#d8cfbd] bg-white/86 shadow-sm">
                  <img src={images.scholarship[index % images.scholarship.length]} alt={item.nama} className="h-40 w-full object-cover" loading="lazy" />
                  <CardHeader><CardTitle className="text-base">{item.nama}</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Kriteria:</span> {item.kriteria}</p>
                    <p><span className="font-semibold text-foreground">Panduan:</span> {item.panduan}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="galeri" className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="outline" className="rounded-full bg-white/70">Galeri</Badge>
                <h2 className="mt-3 text-3xl font-bold">Dokumentasi &amp; Kegiatan Kampus</h2>
              </div>
              <Gallery variant="Bulk" className="text-primary shrink-0" size={42} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.gallery.map((item, index) => (
                <div key={item.id} className="group overflow-hidden rounded-3xl border border-[#ded8ca] bg-white shadow-sm">
                  <div className="overflow-hidden">
                    <img src={images.gallery[index % images.gallery.length]} alt={item.title} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="rounded-full text-xs">{item.category}</Badge>
                    <h3 className="mt-3 font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pengumuman" className="bg-primary/5 px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="outline" className="rounded-full bg-white/70">Pengumuman</Badge>
                <h2 className="mt-3 text-3xl font-bold">Berita &amp; Pengumuman Terbaru</h2>
              </div>
              <DirectboxNotif variant="Bulk" className="text-primary shrink-0" size={42} />
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-stretch">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#ded8ca] shadow-lg">
                <img src={images.announcement} alt="Pengumuman dan berita kampus" className="h-full min-h-[320px] w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#203b35]/90 via-[#203b35]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <p className="text-xl font-bold">Informasi Kampus</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">Berita terbaru, agenda kampus, dan notifikasi penting untuk seluruh civitas dan calon mahasiswa STIBADA MASA.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {data.announcements.length === 0 ? (
                  <Card className="rounded-3xl border-[#ded8ca] bg-white/84">
                    <CardHeader><CardTitle>Belum ada pengumuman baru</CardTitle></CardHeader>
                    <CardContent className="text-muted-foreground">Informasi terbaru akan tampil di sini setelah admin menerbitkan pengumuman.</CardContent>
                  </Card>
                ) : data.announcements.map((item) => (
                  <Card key={item.id} className="rounded-3xl border-[#ded8ca] bg-white/84 shadow-sm">
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit rounded-full bg-white/70 text-xs">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</Badge>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-muted-foreground">{item.content}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="login" className="px-4 py-16">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#ded8ca] bg-white/88 shadow-xl lg:grid lg:grid-cols-[1fr_0.9fr]">
            <img src={images.login} alt="Portal login akademik STIBADA MASA" className="h-64 w-full object-cover lg:h-full lg:min-h-[360px]" loading="lazy" />
            <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
              <Badge className="w-fit rounded-full">Login/Masuk Portal</Badge>
              <div>
                <h2 className="text-3xl font-bold">Masuk sesuai peran Anda.</h2>
                <p className="mt-3 text-muted-foreground">Mahasiswa, dosen, admin, dan rektor menggunakan halaman login khusus sebelum masuk ke dashboard masing-masing.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["Mahasiswa", "Jadwal, KRS, nilai"], ["Dosen", "Nilai & absensi"], ["Admin", "Kelola sistem"], ["Rektor", "Statistik kampus"]].map(([role, desc]) => (
                  <div key={role} className="rounded-2xl bg-[#f4f1ea] p-4">
                    <p className="font-semibold">{role}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/login"><Button size="lg" className="w-fit rounded-2xl gap-2"><UserOctagon size={20} /> Buka Halaman Login</Button></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ded8ca] bg-[#2f4f46] px-4 pt-12 pb-6 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-3 pb-10 border-b border-white/15">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo-stibada.png" alt="Logo STIBADA MASA" className="h-12 w-12 object-contain" />
                <div>
                  <p className="text-lg font-bold leading-tight">STIBADA MASA</p>
                  <p className="text-xs text-white/60">Sekolah Tinggi Ilmu Bahasa Arab Dan Dakwah</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-white/65">Platform kampus modern untuk layanan akademik, administrasi, komunikasi, dan pendaftaran mahasiswa baru STIBADA MASA.</p>
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-white/90">Kontak & Informasi</p>
              <ul className="space-y-2 text-sm text-white/65">
                <li>📧 pmb@stibadamasa.ac.id</li>
                <li>🕐 Senin–Jumat, 08.00–16.00 WIB</li>
                <li>📍 Masjid Agung Sunan Ampel, Surabaya</li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-white/90">Tautan Cepat</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#pendaftaran" className="text-white/65 hover:text-white transition-colors">Pendaftaran Mahasiswa Baru</a></li>
                <li><a href="#prodi" className="text-white/65 hover:text-white transition-colors">Program Studi</a></li>
                <li><a href="#beasiswa" className="text-white/65 hover:text-white transition-colors">Beasiswa</a></li>
                <li><a href="#pengumuman" className="text-white/65 hover:text-white transition-colors">Pengumuman</a></li>
                <li><Link href="/login" className="text-white/65 hover:text-white transition-colors">Login Portal Akademik</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/45">
            <p>© {new Date().getFullYear()} STIBADA MASA. Hak Cipta Dilindungi.</p>
            <p>Sekolah Tinggi Ilmu Bahasa Arab Dan Dakwah — Masjid Agung Sunan Ampel</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
