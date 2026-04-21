import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  SignIn, Eye, TreeStructure, ShieldCheck, BellRinging,
  ArrowRight, UserCircle, Medal, GraduationCap, ChalkboardTeacher,
  UserGear, Crown,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/public-layout";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentImage, contentTitle, fallbackImages, type LandingData } from "@/lib/site-content";
import { toast } from "sonner";

const fallback: LandingData = {
  content: [
    { id: "visi", key: "visi", type: "profile", title: "Visi", content: "Menjadi perguruan tinggi yang membentuk insan akademik beradab, adaptif, dan berdampak bagi masyarakat." },
    { id: "misi", key: "misi", type: "profile", title: "Misi", content: "Menguatkan pembelajaran, penelitian, pengabdian, tata kelola, dan jejaring digital yang relevan dengan kebutuhan zaman." },
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

function SectionHeader({ badge, title, href, hrefLabel = "Lihat Selengkapnya" }: {
  badge: string; title: string; href: string; hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <Badge variant="outline" className="rounded-full text-xs">{badge}</Badge>
        <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      <Link href={href}>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-primary shrink-0 text-sm">
          {hrefLabel} <ArrowRight size={13} weight="bold" />
        </Button>
      </Link>
    </div>
  );
}

const portalRoles = [
  { role: "Mahasiswa", desc: "Jadwal, KRS, nilai", icon: GraduationCap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400" },
  { role: "Dosen", desc: "Nilai & absensi", icon: ChalkboardTeacher, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400" },
  { role: "Admin", desc: "Kelola sistem", icon: UserGear, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400" },
  { role: "Rektor", desc: "Statistik kampus", icon: Crown, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400" },
];

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
  const heroTitle = contentTitle(data.content, "home.hero", "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel (STIBADA MASA) Surabaya");
  const heroBody = contentBody(data.content, "home.hero", "Platform akademik terpadu untuk pendaftaran, jadwal kuliah, KRS, nilai, absensi, diskusi, dan statistik pimpinan.");
  const profileTitle = contentTitle(data.content, "home.profile", "Visi, misi, dan keunggulan STIBADA MASA.");
  const profileBody = contentBody(data.content, "home.profile", "Kampus berbasis nilai Islam dengan pendekatan modern, menghasilkan lulusan beradab, adaptif, dan berdampak.");
  const portalTitle = contentTitle(data.content, "home.portal", "Masuk sesuai peran Anda.");
  const portalBody = contentBody(data.content, "home.portal", "Mahasiswa, dosen, admin, dan rektor menggunakan portal terpisah dengan akses khusus sesuai peran.");

  return (
    <PublicLayout>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_12%,hsl(var(--primary)/0.12),transparent_50%),radial-gradient(ellipse_at_88%_18%,hsl(var(--primary)/0.07),transparent_50%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge className="rounded-full px-4 py-1.5 text-xs gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              PMB 2026/2027 sedang dibuka
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {heroTitle}
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              {heroBody}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pendaftaran">
                <Button size="lg" className="rounded-2xl gap-2 text-sm px-6">Daftar Sekarang</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2 text-sm px-6">
                  <SignIn size={16} weight="bold" />Masuk Portal
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[["KRS Interaktif", "Mahasiswa"], ["Diskusi Real-time", "Civitas"], ["Statistik Eksekutif", "Rektor"]].map(([title, label]) => (
                <div key={title} className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm backdrop-blur-sm">
                  <p className="font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-primary/5 blur-3xl" />
            <img
              src={contentImage(data.content, "home.hero", fallbackImages.hero)}
              alt="Kampus STIBADA MASA"
              className="relative h-[440px] w-full rounded-[2rem] object-cover shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 rounded-2xl border border-white/30 bg-card dark:bg-black/60 dark:border-white/10 p-3 shadow-xl backdrop-blur">
              {[["Mahasiswa", "Jadwal & KRS"], ["Dosen", "Nilai & Absensi"], ["Admin", "Kelola Sistem"], ["Rektor", "Statistik"]].map(([t, d]) => (
                <div key={t} className="text-center">
                  <p className="font-bold text-xs">{t}</p>
                  <p className="text-[10px] text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISI MISI ──────────────────────────────────────────── */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="rounded-full text-xs">Profil Kampus</Badge>
              <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">{profileTitle}</h2>
            </div>
            <p className="text-muted-foreground self-end text-sm leading-7">{profileBody}</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
              <img
                src={contentImage(data.content, "home.profile", fallbackImages.campus)}
                alt="Kampus"
                className="h-full min-h-[380px] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background/85 dark:bg-background/90 p-5 shadow-lg backdrop-blur border border-border/30">
                <p className="text-base font-bold">STIBADA MASA</p>
                <p className="mt-1 text-xs text-muted-foreground leading-5">{profileBody}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {profile.slice(0, 2).map((item, i) => (
                <Card key={item.id} className="overflow-hidden rounded-3xl shadow-sm">
                  <img
                    src={item.image || fallbackImages.gallery[i % fallbackImages.gallery.length]}
                    alt={item.title}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                  />
                  <CardHeader className="pb-1.5 pt-3 px-4">
                    <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
                      {item.key === "visi"
                        ? <Eye size={13} weight="duotone" className="text-primary shrink-0" />
                        : <TreeStructure size={13} weight="duotone" className="text-primary shrink-0" />}
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 text-xs leading-5 text-muted-foreground">{item.content}</CardContent>
                </Card>
              ))}
              <Card className="overflow-hidden rounded-3xl shadow-sm">
                <img src={contentImage(data.content, "home.security", fallbackImages.scholarships[2])} alt="Keamanan" className="h-28 w-full object-cover" loading="lazy" />
                <CardHeader className="pb-1.5 pt-3 px-4">
                  <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
                    <ShieldCheck size={13} weight="duotone" className="text-primary shrink-0" />
                    {contentTitle(data.content, "home.security", "Keamanan Portal")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 text-xs leading-5 text-muted-foreground">{contentBody(data.content, "home.security", "Auth berbasis peran, hash password, rate limiting, dan audit trail.")}</CardContent>
              </Card>
              <Card className="overflow-hidden rounded-3xl shadow-sm">
                <img src={contentImage(data.content, "home.notification", fallbackImages.gallery[5])} alt="Notifikasi" className="h-28 w-full object-cover" loading="lazy" />
                <CardHeader className="pb-1.5 pt-3 px-4">
                  <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
                    <BellRinging size={13} weight="duotone" className="text-primary shrink-0" />
                    {contentTitle(data.content, "home.notification", "Notifikasi Instan")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 text-xs leading-5 text-muted-foreground">{contentBody(data.content, "home.notification", "Pengumuman dan diskusi real-time via WebSocket.")}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── PENDAFTARAN ─────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Penerimaan Mahasiswa Baru" title="Daftar kuliah di STIBADA MASA sekarang." href="/pendaftaran" hrefLabel="Info Lengkap" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[["Jadwal", data.admission.jadwal], ["Biaya", data.admission.biaya], ["Kontak PMB", data.admission.kontak]].map(([label, val]) => (
              <div key={label} className="rounded-2xl border bg-muted/40 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="mt-2 font-semibold text-sm">{val}</p>
              </div>
            ))}
          </div>
          <Link href="/pendaftaran">
            <Button size="lg" className="rounded-2xl gap-2 text-sm px-6">Daftar Sekarang</Button>
          </Link>
        </div>
      </section>

      {/* ── PROGRAM STUDI ───────────────────────────────────────── */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Program Studi" title="Kurikulum, dosen, dan prospek karir." href="/program-studi" />
          <div className="grid gap-5 md:grid-cols-3">
            {data.programs.slice(0, 3).map((p, i) => (
              <Card key={p.id} className="overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={p.image || fallbackImages.programs[i % fallbackImages.programs.length]}
                  alt={p.nama}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <CardHeader className="pb-2">
                  <Badge className="w-fit rounded-full text-xs mb-1">{p.kode}</Badge>
                  <CardTitle className="text-base leading-tight">{p.nama}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1.5">
                  <p><span className="font-semibold text-foreground">Dosen: </span>{p.dosen}</p>
                  <p><span className="font-semibold text-foreground">Prospek: </span>{p.prospek.join(", ")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEASISWA ────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Beasiswa" title="Program beasiswa untuk mahasiswa berprestasi." href="/beasiswa" />
          <div className="grid gap-4 md:grid-cols-3">
            {data.scholarships.slice(0, 3).map((s) => (
              <div key={s.id} className="group rounded-2xl border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Medal size={16} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{s.nama}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-5">{s.kriteria}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERI ──────────────────────────────────────────────── */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Galeri" title="Dokumentasi kegiatan kampus." href="/galeri" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.gallery.slice(0, 4).map((item, i) => (
              <div key={item.id} className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-md transition-all">
                <div className="overflow-hidden">
                  <img
                    src={item.image || fallbackImages.gallery[i % fallbackImages.gallery.length]}
                    alt={item.title}
                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="rounded-full text-xs">{item.category}</Badge>
                  <p className="mt-2 font-semibold text-sm leading-tight">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PENGUMUMAN ──────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Pengumuman" title="Berita & informasi terbaru kampus." href="/pengumuman" />
          <div className="grid gap-4 max-w-2xl">
            {data.announcements.slice(0, 2).map((item) => (
              <Card key={item.id} className="rounded-3xl shadow-sm">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="w-fit rounded-full text-xs">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </Badge>
                  <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{item.content}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL CTA ──────────────────────────────────────────── */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border bg-card shadow-lg lg:grid lg:grid-cols-[1fr_1.1fr]">
          <img
            src={contentImage(data.content, "home.portal", fallbackImages.portal)}
            alt="Portal"
            className="h-56 w-full object-cover lg:h-full lg:min-h-[360px]"
            loading="lazy"
          />
          <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
            <Badge className="w-fit rounded-full text-xs">Portal Akademik</Badge>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{portalTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{portalBody}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {portalRoles.map(({ role, desc, icon: Icon, color }) => (
                <div key={role} className="flex items-center gap-3 rounded-2xl border bg-muted/40 p-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={15} weight="duotone" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs">{role}</p>
                    <p className="text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/login">
              <Button size="lg" className="w-fit rounded-2xl gap-2 text-sm px-6">
                <UserCircle size={18} weight="duotone" /> Buka Halaman Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
