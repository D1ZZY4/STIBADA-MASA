import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  SignIn, Eye, TreeStructure, Certificate, PlugsConnected,
  ArrowRight, UserCircle, Medal, GraduationCap, ChalkboardTeacher,
  UserGear, Crown, Target, MapPin, Phone, Envelope,
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
    { id: "visi", key: "visi", type: "profile", title: "Visi", content: "Menjadi program studi pendidikan Bahasa Arab yang Unggul, Berkarakter Islami berdasarkan nilai-nilai luhur Sunan Ampel." },
    { id: "misi", key: "misi", type: "profile", title: "Misi", content: "1) Menyelenggarakan pendidikan & pengajaran Bahasa Arab yang berkualitas dan berkarakter Islami berdasarkan nilai-nilai luhur Sunan Ampel. 2) Melaksanakan penelitian dalam bidang Pendidikan Bahasa Arab. 3) Mengabdikan ilmu kepada masyarakat melalui dakwah dan pengabdian." },
    { id: "tujuan", key: "tujuan", type: "profile", title: "Tujuan", content: "1) Menghasilkan lulusan kompeten & berakhlak mulia dalam Pendidikan Bahasa Arab. 2) Menjadi rujukan penelitian Pendidikan Bahasa Arab. 3) Memberikan kontribusi nyata melalui dakwah dan pengabdian masyarakat." },
  ],
  announcements: [
    { id: "ann1", title: "Pendaftaran Mahasiswa Baru Dibuka", content: "PMB STIBADA MASA tahun akademik 2026/2027 telah dibuka melalui sistem pendaftaran online terintegrasi.", createdAt: new Date().toISOString() },
    { id: "ann2", title: "Akreditasi BAN-PT 2022–2027", content: "STIBADA MASA telah memperoleh Sertifikat Akreditasi BAN-PT yang berlaku hingga tahun 2027.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  programs: [
    { id: "prg1", kode: "PBA", nama: "Pendidikan Bahasa Arab", kurikulum: ["Nahwu & Sharaf", "Balaghah", "Metodologi Pembelajaran Bahasa Arab"], dosen: "Tim Dosen Linguistik Arab", prospek: ["Guru/Dosen Bahasa Arab", "Penerjemah", "Peneliti Linguistik"] },
  ],
  scholarships: [
    { id: "sch1", nama: "Beasiswa Tahfidz Al-Qur'an", kriteria: "Hafalan minimal 5 juz dengan setoran terverifikasi", panduan: "Ikuti verifikasi hafalan oleh tim penguji." },
    { id: "sch2", nama: "Beasiswa Prestasi Akademik", kriteria: "Nilai rapor unggul & aktif organisasi", panduan: "Unggah transkrip dan surat rekomendasi." },
    { id: "sch3", nama: "Beasiswa Dhuafa Berkah", kriteria: "Mahasiswa yang membutuhkan dukungan pembiayaan", panduan: "Lampirkan dokumen ekonomi keluarga." },
  ],
  gallery: [
    { id: "gal1", title: "Wisuda Sarjana Pendidikan Bahasa Arab", category: "Wisuda", description: "Momen pelepasan lulusan STIBADA MASA." },
    { id: "gal2", title: "Halaqah & Kajian Sunan Ampel", category: "Dakwah", description: "Kajian rutin di lingkungan Masjid Agung Sunan Ampel." },
    { id: "gal3", title: "Lomba Pidato Bahasa Arab", category: "Akademik", description: "Khithobah berbahasa Arab antar mahasiswa." },
    { id: "gal4", title: "Pengabdian Masyarakat", category: "Pengabdian", description: "Kegiatan pengabdian berbasis nilai luhur Sunan Ampel." },
  ],
  admission: { biaya: "Terjangkau, terintegrasi sistem PMB online", kontak: "humas@stibada.ac.id", jadwal: "Gelombang 1: Januari–Maret 2026" },
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

  const profileMap = useMemo(() => {
    const map: Record<string, typeof data.content[number]> = {};
    data.content.filter((c) => c.type === "profile").forEach((c) => { map[c.key] = c; });
    return map;
  }, [data.content]);
  const visi = profileMap["visi"];
  const misi = profileMap["misi"];
  const tujuan = profileMap["tujuan"];
  const heroTitle = contentTitle(data.content, "home.hero", "STIBADA MASA — Pusat Studi Bahasa Arab & Dakwah Sunan Ampel");
  const heroBody = contentBody(data.content, "home.hero", "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel Surabaya. Terakreditasi BAN-PT, terintegrasi sistem PMB & SIAKAD.");
  const profileTitle = contentTitle(data.content, "home.profile", "Visi & Misi STIBADA MASA");
  const profileBody = contentBody(data.content, "home.profile", "Berakar pada nilai-nilai luhur Sunan Ampel, kami menyiapkan ahli Bahasa Arab yang berkarakter Islami, kompeten, dan bermanfaat bagi masyarakat.");
  const portalTitle = contentTitle(data.content, "home.portal", "Portal Akademik Terintegrasi");
  const portalBody = contentBody(data.content, "home.portal", "Satu pintu untuk Mahasiswa, Dosen, Admin, dan Rektor. Terhubung langsung dengan PMB dan SIAKAD STIBADA MASA.");

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
              {[
                ["BAN-PT 2022–2027", "Akreditasi Resmi"],
                ["PMB Online", "Pendaftaran Daring"],
                ["SIAKAD Terpadu", "Layanan Akademik"],
              ].map(([title, label]) => (
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
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 rounded-2xl border border-white/40 bg-white/55 dark:bg-black/50 dark:border-white/10 p-3 shadow-xl backdrop-blur-md">
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

          {/* Visi card — large maroon */}
          <div className="overflow-hidden rounded-3xl border bg-primary text-primary-foreground shadow-lg">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <img
                src={visi?.image || contentImage(data.content, "home.profile", fallbackImages.campus)}
                alt="Visi"
                className="h-56 w-full object-cover lg:h-full"
                loading="lazy"
              />
              <div className="space-y-3 p-7 lg:p-9">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                  <Eye size={12} weight="bold" /> Visi
                </div>
                <p className="text-lg font-semibold leading-7 lg:text-xl">
                  {visi?.content || "Menjadi program studi pendidikan Bahasa Arab yang Unggul, Berkarakter Islami berdasarkan nilai-nilai luhur Sunan Ampel."}
                </p>
              </div>
            </div>
          </div>

          {/* Misi + Tujuan + Akreditasi + Integrasi */}
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              { item: misi, icon: TreeStructure, title: "Misi", fallback: "Pendidikan, penelitian, dan pengabdian Bahasa Arab berbasis nilai luhur Sunan Ampel." },
              { item: tujuan, icon: Target, title: "Tujuan", fallback: "Menghasilkan lulusan kompeten dan menjadi rujukan penelitian Pendidikan Bahasa Arab." },
            ].map(({ item, icon: Icon, title, fallback: fb }) => (
              <Card key={title} className="rounded-3xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={16} weight="duotone" />
                    </span>
                    {item?.title || title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
                  {(item?.content || fb).replace(/(\d\))/g, "\n$1").trim()}
                </CardContent>
              </Card>
            ))}
            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Certificate size={16} weight="duotone" />
                  </span>
                  {contentTitle(data.content, "home.akreditasi", "Terakreditasi BAN-PT")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {contentBody(data.content, "home.akreditasi", "Sertifikat Akreditasi BAN-PT berlaku 2022–2027. Penjaminan mutu pendidikan tinggi yang independen.")}
              </CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PlugsConnected size={16} weight="duotone" />
                  </span>
                  {contentTitle(data.content, "home.integrasi", "Integrasi PMB & SIAKAD")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {contentBody(data.content, "home.integrasi", "Pendaftaran online, KRS, nilai, jadwal, dan administrasi terhubung dalam satu sistem akademik terpadu.")}
              </CardContent>
            </Card>
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
