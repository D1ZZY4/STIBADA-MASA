import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentTitle, fallbackImages, type PublicContentItem } from "@/lib/site-content";
import { Medal, CheckCircle, FileText, Info } from "@phosphor-icons/react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Scholarship = { id: string; nama: string; kriteria: string; panduan: string; image?: string };

const fallback: Scholarship[] = [
  { id: "1", nama: "Beasiswa Prestasi MASA", kriteria: "IPK/rapor unggul (≥ 3.50) dan aktif berorganisasi selama SMA/MA.", panduan: "Unggah portofolio, transkrip nilai, dan surat rekomendasi kepala sekolah." },
  { id: "2", nama: "Beasiswa Tahfidz", kriteria: "Hafalan minimal 5 juz Al-Qur'an yang dapat diverifikasi oleh tim penguji.", panduan: "Ikuti sesi verifikasi hafalan dan wawancara akademik dengan dewan penguji." },
  { id: "3", nama: "Beasiswa Keluarga Berdaya", kriteria: "Berasal dari keluarga kurang mampu secara ekonomi (dibuktikan dengan SKTM).", panduan: "Lampirkan dokumen ekonomi keluarga (SKTM, KK) dan esai motivasi." },
];

const images = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
];

const benefits = ["Bebas biaya SPP selama 1–4 semester", "Tunjangan biaya hidup bulanan", "Akses perpustakaan digital premium", "Bimbingan akademik intensif", "Prioritas program pertukaran mahasiswa"];

const timeline = [
  { tahap: "Pendaftaran Online", waktu: "1–31 Januari 2026" },
  { tahap: "Seleksi Berkas", waktu: "1–15 Februari 2026" },
  { tahap: "Verifikasi & Wawancara", waktu: "16–28 Februari 2026" },
  { tahap: "Pengumuman", waktu: "5 Maret 2026" },
  { tahap: "Aktivasi Beasiswa", waktu: "1 April 2026" },
];

export default function Beasiswa() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(fallback);
  const [content, setContent] = useState<PublicContentItem[]>([]);
  useEffect(() => {
    trackEvent("public_beasiswa_view");
    apiFetch<{ scholarships: Scholarship[]; content: PublicContentItem[] }>("/public/landing").then((d) => {
      if (d.scholarships?.length) setScholarships(d.scholarships);
      setContent(d.content || []);
    }).catch(() => undefined);
  }, []);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-[#2f4f46] dark:bg-[#192e28] px-4 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="relative mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-5">
            <Badge className="rounded-full border-white/20 bg-white/15 text-white hover:bg-white/15">Program Beasiswa</Badge>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">{contentTitle(content, "beasiswa.hero", "Raih Masa Depan dengan Beasiswa STIBADA MASA")}</h1>
            <p className="max-w-xl text-base leading-7 text-white/70">{contentBody(content, "beasiswa.hero", "Tersedia berbagai jalur beasiswa untuk mendukung mahasiswa berprestasi dan yang membutuhkan bantuan pembiayaan.")}</p>
            <Link href="/pendaftaran">
              <Button size="lg" className="rounded-2xl gap-2 bg-white text-[#1f3f37] hover:bg-white/90">
                <Medal size={18} weight="duotone" />Daftar Beasiswa Sekarang
              </Button>
            </Link>
          </div>
          <div className="hidden lg:flex flex-col gap-3 min-w-[240px]">
            {benefits.slice(0, 3).map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <CheckCircle size={16} weight="duotone" className="text-white/80 shrink-0" />
                <p className="text-sm font-medium text-white/90">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <div><Badge variant="outline" className="rounded-full bg-card/80">Jenis Beasiswa</Badge><h2 className="mt-3 text-2xl font-bold">Program Beasiswa Tersedia</h2></div>
          <div className="grid gap-6 md:grid-cols-3">
            {scholarships.map((item, index) => (
              <Card key={item.id} className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <div className="relative">
                  <img src={item.image || images[index % images.length] || fallbackImages.scholarships[index % fallbackImages.scholarships.length]} alt={item.nama} className="h-44 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <Medal size={22} weight="duotone" className="text-primary-foreground" />
                  </div>
                </div>
                <CardHeader className="pb-2"><CardTitle className="text-base">{item.nama}</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div><p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Kriteria</p><p>{item.kriteria}</p></div>
                  <div><p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Cara Daftar</p><p>{item.panduan}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <div><Badge variant="outline" className="rounded-full bg-card/80">Timeline</Badge><h2 className="mt-3 text-2xl font-bold">Jadwal Seleksi Beasiswa 2026</h2></div>
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={t.tahap} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold">{i + 1}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{t.tahap}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div><Badge variant="outline" className="rounded-full bg-card/80">Manfaat</Badge><h2 className="mt-3 text-2xl font-bold">Apa yang Kamu Dapatkan?</h2></div>
            <div className="grid gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm">
                  <CheckCircle size={20} weight="duotone" className="text-primary shrink-0" />
                  <p className="text-sm font-medium">{b}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-primary/10 border border-primary/15 p-5">
              <div className="flex items-start gap-3">
                <Info size={20} weight="duotone" className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-6 text-muted-foreground">Beasiswa dapat dicabut jika IPK turun di bawah syarat minimum atau terbukti melanggar peraturan akademik kampus.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
