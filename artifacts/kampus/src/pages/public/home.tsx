import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Book2, Teacher, MedalStar, Gallery, DirectboxNotif, UserOctagon, ArrowRight, Login, Eye, Routing, SecuritySafe, TickCircle } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/public-layout";
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
    { id: "ann1", title: "Pendaftaran Mahasiswa Baru Dibuka", content: "PMB STIBADA MASA tahun akademik 2026/2027 telah dibuka. Daftarkan diri Anda sekarang.", createdAt: new Date().toISOString() },
    { id: "ann2", title: "Pengingat Batas KRS", content: "Pengisian KRS ditutup Jumat pukul 23.59 WIB. Segera hubungi dosen wali jika ada kendala.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  programs: [
    { id: "prg1", kode: "PAI", nama: "Pendidikan Agama Islam", kurikulum: ["Studi Al-Qur'an", "Metodologi Pembelajaran", "Teknologi Pendidikan"], dosen: "Dr. Arif Setiawan, M.T.", prospek: ["Guru", "Konsultan Pendidikan"] },
    { id: "prg2", kode: "ES", nama: "Ekonomi Syariah", kurikulum: ["Fiqh Muamalah", "Keuangan Digital", "Kewirausahaan"], dosen: "Prof. Siti Rahayu, Ph.D.", prospek: ["Analis Keuangan Syariah", "Wirausaha"] },
    { id: "prg3", kode: "KPI", nama: "Komunikasi dan Penyiaran Islam", kurikulum: ["Produksi Media", "Public Speaking", "Jurnalisme Digital"], dosen: "Dr. Budi Santoso, M.M.", prospek: ["Jurnalis", "Content Strategist"] },
  ],
  scholarships: [
    { id: "sch1", nama: "Beasiswa Prestasi MASA", kriteria: "IPK unggul dan aktif organisasi", panduan: "Unggah portofolio dan surat rekomendasi." },
    { id: "sch2", nama: "Beasiswa Tahfidz", kriteria: "Hafalan minimal 5 juz", panduan: "Ikuti verifikasi hafalan." },
    { id: "sch3", nama: "Beasiswa Keluarga Berdaya", kriteria: "Membutuhkan dukungan pembiayaan", panduan: "Lampirkan dokumen ekonomi keluarga." },
  ],
  gallery: [
    { id: "gal1", title: "Wisuda Sarjana", category: "Wisuda", description: "Momen pelepasan lulusan STIBADA MASA." },
    { id: "gal2", title: "Seminar Literasi Digital", category: "Seminar", description: "Kuliah umum transformasi pembelajaran digital." },
    { id: "gal3", title: "Liga Futsal Mahasiswa", category: "Olahraga", description: "Kegiatan olahraga antar prodi." },
    { id: "gal4", title: "Ekstrakurikuler Seni Hadrah", category: "Ekskul", description: "Pembinaan minat bakat mahasiswa." },
  ],
  admission: { biaya: "Mulai Rp 3.500.000 per semester", kontak: "pmb@stibadamasa.ac.id", jadwal: "Gelombang 1: Januari–Maret 2026" },
};

const images = {
  hero: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85",
  campus: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=85",
  profile: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=85",
  ],
  programs: [
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  ],
  scholarship: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
  gallery: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85",
  ],
};

function SectionHeader({ badge, title, href, hrefLabel = "Lihat Selengkapnya" }: { badge: string; title: string; href: string; hrefLabel?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <Badge variant="outline" className="rounded-full bg-white/70">{badge}</Badge>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      <Link href={href}>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-primary shrink-0">
          {hrefLabel} <ArrowRight size={14} />
        </Button>
      </Link>
    </div>
  );
}

export default function Beranda() {
  const [data, setData] = useState<LandingData>(fallback);

  useEffect(() => {
    trackEvent("public_beranda_view");
    apiFetch<LandingData>("/public/landing").then(setData).catch(() => undefined);
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}/api/ws`);
    ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload.type === "announcement.created") toast.info("Pengumuman baru tersedia");
    };
    return () => ws.close();
  }, []);

  const profile = useMemo(() => data.content.filter((c) => c.type === "profile"), [data.content]);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(42,107,90,.16),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(153,125,89,.20),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-7">
            <Badge className="rounded-full px-4 py-2">PMB 2026/2027 sedang dibuka</Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel <span className="text-primary">(STIBADA MASA)</span> Surabaya
            </h1>
            <p className="max-w-xl text-lg leading-7 text-muted-foreground">
              Platform akademik terpadu untuk pendaftaran, jadwal kuliah, KRS, nilai, absensi, diskusi, dan statistik pimpinan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pendaftaran"><Button size="lg" className="rounded-2xl gap-2">Daftar Sekarang</Button></Link>
              <Link href="/login"><Button size="lg" variant="outline" className="rounded-2xl border-primary/30 bg-white/70 gap-2"><Login size={18} />Masuk Portal</Button></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[["KRS Interaktif", "Mahasiswa"], ["Diskusi Real-time", "Civitas"], ["Statistik Eksekutif", "Rektor"]].map(([title, label]) => (
                <div key={title} className="rounded-2xl border border-[#ded8ca] bg-white/70 px-4 py-3 text-sm shadow-sm">
                  <p className="font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={images.hero} alt="Kampus STIBADA MASA" className="h-[480px] w-full rounded-[2.4rem] object-cover shadow-2xl" />
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-4 gap-3 rounded-[1.7rem] border border-white/40 bg-white/84 p-4 shadow-xl backdrop-blur">
              {[["Mahasiswa", "Jadwal & KRS"], ["Dosen", "Nilai & Absensi"], ["Admin", "Kelola Sistem"], ["Rektor", "Statistik"]].map(([t, d]) => (
                <div key={t}><p className="font-semibold text-sm">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <Badge variant="outline" className="rounded-full bg-white/70">Profil Kampus</Badge>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Visi, misi, dan keunggulan STIBADA MASA.</h2>
            </div>
            <p className="text-muted-foreground self-end">Kampus berbasis nilai Islam dengan pendekatan modern, menghasilkan lulusan beradab, adaptif, dan berdampak bagi masyarakat.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#ded8ca] bg-white shadow-lg">
              <img src={images.campus} alt="Kampus" className="h-full min-h-[400px] w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] bg-white/86 p-5 shadow-lg backdrop-blur">
                <p className="text-lg font-bold">STIBADA MASA</p>
                <p className="mt-1 text-sm text-muted-foreground">Lingkungan belajar modern untuk akademik, administrasi, dan kolaborasi civitas kampus.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {profile.slice(0, 2).map((item, i) => (
                <Card key={item.id} className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/86 shadow-sm">
                  <img src={images.profile[i % images.profile.length]} alt={item.title} className="h-32 w-full object-cover" loading="lazy" />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      {item.key === "visi" ? <Eye variant="Bulk" size={16} className="text-primary shrink-0" /> : <Routing variant="Bulk" size={16} className="text-primary shrink-0" />}
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs leading-5 text-muted-foreground">{item.content}</CardContent>
                </Card>
              ))}
              <Card className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/86 shadow-sm">
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85" alt="Keamanan" className="h-32 w-full object-cover" loading="lazy" />
                <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><SecuritySafe variant="Bulk" size={16} /> Keamanan Portal</CardTitle></CardHeader>
                <CardContent className="text-xs leading-5 text-muted-foreground">Auth berbasis peran, hash password, rate limiting, dan audit trail.</CardContent>
              </Card>
              <Card className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/86 shadow-sm">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85" alt="Notifikasi" className="h-32 w-full object-cover" loading="lazy" />
                <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><DirectboxNotif variant="Bulk" size={16} /> Notifikasi Instan</CardTitle></CardHeader>
                <CardContent className="text-xs leading-5 text-muted-foreground">Pengumuman dan diskusi real-time via WebSocket.</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* PENDAFTARAN PREVIEW */}
      <section className="bg-[#e8e2d4] px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Penerimaan Mahasiswa Baru" title="Daftar kuliah di STIBADA MASA sekarang." href="/pendaftaran" hrefLabel="Lihat Info Lengkap" />
          <div className="grid gap-5 sm:grid-cols-3">
            {[["Jadwal", data.admission.jadwal], ["Biaya", data.admission.biaya], ["Kontak", data.admission.kontak]].map(([label, val]) => (
              <div key={label} className="rounded-2xl border border-[#d8cfbd] bg-white/80 p-5 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</p>
                <p className="mt-1 font-semibold text-sm">{val}</p>
              </div>
            ))}
          </div>
          <Link href="/pendaftaran"><Button size="lg" className="rounded-2xl gap-2">Daftar Sekarang</Button></Link>
        </div>
      </section>

      {/* PROGRAM STUDI PREVIEW */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Program Studi" title="Kurikulum, dosen, dan prospek karir." href="/program-studi" />
          <div className="grid gap-5 md:grid-cols-3">
            {data.programs.slice(0, 3).map((p, i) => (
              <Card key={p.id} className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/82 shadow-sm">
                <img src={images.programs[i % images.programs.length]} alt={p.nama} className="h-40 w-full object-cover" loading="lazy" />
                <CardHeader className="pb-2"><Badge className="w-fit rounded-full text-xs mb-1">{p.kode}</Badge><CardTitle className="text-base">{p.nama}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Dosen:</span> {p.dosen}</p>
                  <p><span className="font-medium text-foreground">Prospek:</span> {p.prospek.join(", ")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BEASISWA PREVIEW */}
      <section className="bg-[#ebe5d8] px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Beasiswa" title="Program beasiswa untuk mahasiswa berprestasi." href="/beasiswa" />
          <div className="grid gap-5 md:grid-cols-3">
            {data.scholarships.slice(0, 3).map((s) => (
              <div key={s.id} className="rounded-2xl border border-[#d8cfbd] bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3"><MedalStar variant="Bulk" size={18} className="text-primary" /><p className="font-semibold text-sm">{s.nama}</p></div>
                <p className="text-sm text-muted-foreground">{s.kriteria}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERI PREVIEW */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Galeri" title="Dokumentasi kegiatan kampus." href="/galeri" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.gallery.slice(0, 4).map((item, i) => (
              <div key={item.id} className="group overflow-hidden rounded-3xl border border-[#ded8ca] bg-white shadow-sm">
                <div className="overflow-hidden">
                  <img src={images.gallery[i % images.gallery.length]} alt={item.title} className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="rounded-full text-xs">{item.category}</Badge>
                  <p className="mt-2 font-semibold text-sm">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PENGUMUMAN PREVIEW */}
      <section className="bg-primary/5 px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Pengumuman" title="Berita & informasi terbaru kampus." href="/pengumuman" />
          <div className="grid gap-4 max-w-2xl">
            {data.announcements.slice(0, 2).map((item) => (
              <Card key={item.id} className="rounded-3xl border-[#ded8ca] bg-white/84 shadow-sm">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="w-fit rounded-full text-xs">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</Badge>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{item.content}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PORTAL LOGIN CTA */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#ded8ca] bg-white/88 shadow-xl lg:grid lg:grid-cols-[1fr_0.9fr]">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85" alt="Portal" className="h-64 w-full object-cover lg:h-full lg:min-h-[360px]" loading="lazy" />
          <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
            <Badge className="w-fit rounded-full">Login Portal Akademik</Badge>
            <div>
              <h2 className="text-2xl font-bold">Masuk sesuai peran Anda.</h2>
              <p className="mt-2 text-muted-foreground text-sm leading-6">Mahasiswa, dosen, admin, dan rektor menggunakan portal terpisah dengan akses khusus sesuai peran.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Mahasiswa", "Jadwal, KRS, nilai"], ["Dosen", "Nilai & absensi"], ["Admin", "Kelola sistem"], ["Rektor", "Statistik kampus"]].map(([role, desc]) => (
                <div key={role} className="rounded-2xl bg-[#f4f1ea] p-3">
                  <p className="font-semibold text-sm">{role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/login">
              <Button size="lg" className="w-fit rounded-2xl gap-2"><UserOctagon size={20} />Buka Halaman Login</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
