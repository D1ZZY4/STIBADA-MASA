import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  SignIn, Eye, TreeStructure, Certificate, PlugsConnected,
  ArrowRight, UserCircle, Medal, GraduationCap, ChalkboardTeacher,
  UserGear, Crown, Target,
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
  admission: { biaya: "Terjangkau, terintegrasi sistem PMB online", kontak: "pmb@stibada.ac.id", jadwal: "Gelombang 1: Januari–Maret 2026" },
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
  { role: "Mahasiswa", desc: "Jadwal & KRS", icon: GraduationCap },
  { role: "Dosen", desc: "Nilai & Absensi", icon: ChalkboardTeacher },
  { role: "Admin", desc: "Kelola Sistem", icon: UserGear },
  { role: "Rektor", desc: "Statistik", icon: Crown },
];

function ProfileTile({ icon: Icon, title, content }: { icon: typeof Eye; title: string; content: string }) {
  const cleaned = content.replace(/\s*(\d\))\s*/g, "\n$1 ").trim();
  const lines = cleaned.split("\n").filter(Boolean);
  return (
    <Card className="group rounded-2xl border-border/60 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={18} weight="duotone" />
          </div>
          <CardTitle className="text-base font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-muted-foreground">
        {lines.length > 1 ? (
          <ul className="space-y-1.5">
            {lines.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary font-semibold shrink-0">{l.match(/^(\d\))/)?.[1] || "•"}</span>
                <span>{l.replace(/^\d\)\s*/, "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>{cleaned}</p>
        )}
      </CardContent>
    </Card>
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
  const profileTitle = contentTitle(data.content, "home.profile", "Visi · Misi · Tujuan");
  const profileBody = contentBody(data.content, "home.profile", "Berakar pada nilai-nilai luhur Sunan Ampel, kami menyiapkan ahli Bahasa Arab yang berkarakter Islami, kompeten, dan bermanfaat bagi masyarakat.");
  const portalTitle = contentTitle(data.content, "home.portal", "Portal Akademik Terintegrasi");
  const portalBody = contentBody(data.content, "home.portal", "Satu pintu untuk Mahasiswa, Dosen, Admin, dan Rektor. Terhubung langsung dengan PMB dan SIAKAD STIBADA MASA.");

  return (
    <PublicLayout>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_12%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(ellipse_at_88%_18%,hsl(var(--primary)/0.06),transparent_55%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
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
                <div key={title} className="rounded-2xl border bg-card/60 px-4 py-3 text-sm">
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
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 rounded-2xl border border-white/40 bg-white/70 p-3 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-black/55">
              {portalRoles.map(({ role, desc, icon: Icon }) => (
                <div key={role} className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={14} weight="duotone" />
                  </div>
                  <p className="font-bold text-[11px] leading-tight">{role}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISI · MISI · TUJUAN ──────────────────────────────── */}
      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
            <div>
              <Badge variant="outline" className="rounded-full text-xs">Profil Kampus</Badge>
              <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">{profileTitle}</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-7 lg:text-right">{profileBody}</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <ProfileTile icon={Eye} title={visi?.title || "Visi"} content={visi?.content || ""} />
            <ProfileTile icon={TreeStructure} title={misi?.title || "Misi"} content={misi?.content || ""} />
            <ProfileTile icon={Target} title={tujuan?.title || "Tujuan"} content={tujuan?.content || ""} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Certificate size={18} weight="duotone" />
                  </div>
                  <CardTitle className="text-base font-bold">
                    {contentTitle(data.content, "home.akreditasi", "Terakreditasi BAN-PT")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {contentBody(data.content, "home.akreditasi", "Sertifikat Akreditasi BAN-PT berlaku 2022–2027. Penjaminan mutu pendidikan tinggi yang independen.")}
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PlugsConnected size={18} weight="duotone" />
                  </div>
                  <CardTitle className="text-base font-bold">
                    {contentTitle(data.content, "home.integrasi", "Integrasi PMB & SIAKAD")}
                  </CardTitle>
                </div>
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
              <div key={label} className="rounded-2xl border border-border/60 bg-card/60 p-5">
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
      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Program Studi" title="Kurikulum, dosen, dan prospek karir." href="/program-studi" />
          <div className="grid gap-5 md:grid-cols-3">
            {data.programs.slice(0, 3).map((p, i) => (
              <Card key={p.id} className="overflow-hidden rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow">
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
              <div key={s.id} className="group rounded-2xl border border-border/60 bg-card/60 p-5 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Medal size={18} weight="duotone" className="text-primary" />
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
      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader badge="Galeri" title="Dokumentasi kegiatan kampus." href="/galeri" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.gallery.slice(0, 4).map((item, i) => (
              <div key={item.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-all">
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
              <Card key={item.id} className="rounded-2xl border-border/60 shadow-sm">
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
      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg lg:grid lg:grid-cols-[1fr_1.1fr]">
          <img
            src={contentImage(data.content, "home.portal", fallbackImages.portal)}
            alt="Portal"
            className="h-56 w-full object-cover lg:h-full lg:min-h-[360px]"
            loading="lazy"
          />
          <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
            <Badge variant="outline" className="w-fit rounded-full text-xs">Portal Akademik</Badge>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{portalTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{portalBody}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {portalRoles.map(({ role, desc, icon: Icon }) => (
                <div key={role} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={16} weight="duotone" />
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
