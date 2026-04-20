import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, trackEvent } from "@/lib/api";
import { MedalStar, TickCircle, DocumentText, InfoCircle } from "iconsax-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Scholarship = { id: string; nama: string; kriteria: string; panduan: string };

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
  useEffect(() => {
    trackEvent("public_beasiswa_view");
    apiFetch<{ scholarships: Scholarship[] }>("/public/landing").then((d) => { if (d.scholarships?.length) setScholarships(d.scholarships); }).catch(() => undefined);
  }, []);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(47,79,70,.12),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(153,125,89,.10),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="rounded-full bg-white/70">Program Beasiswa</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Raih Masa Depan dengan Beasiswa STIBADA MASA</h1>
            <p className="max-w-xl text-lg leading-7 text-muted-foreground">Tersedia berbagai jalur beasiswa untuk mendukung mahasiswa berprestasi dan yang membutuhkan bantuan pembiayaan.</p>
            <Link href="/pendaftaran">
              <Button size="lg" className="rounded-2xl gap-2"><MedalStar size={18} />Daftar Beasiswa Sekarang</Button>
            </Link>
          </div>
          <div className="hidden lg:flex flex-col gap-3 min-w-[220px]">
            {benefits.slice(0, 3).map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-2xl border border-[#ded8ca] bg-white/80 px-4 py-3 shadow-sm">
                <TickCircle variant="Bulk" size={18} className="text-primary shrink-0" />
                <p className="text-sm font-medium">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e8e2d4] px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <div><Badge variant="outline" className="rounded-full bg-white/70">Jenis Beasiswa</Badge><h2 className="mt-3 text-2xl font-bold">Program Beasiswa Tersedia</h2></div>
          <div className="grid gap-6 md:grid-cols-3">
            {scholarships.map((item, index) => (
              <Card key={item.id} className="overflow-hidden rounded-3xl border-[#d8cfbd] bg-white/86 shadow-sm">
                <div className="relative">
                  <img src={images[index % images.length]} alt={item.nama} className="h-44 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <MedalStar variant="Bulk" size={22} className="text-yellow-300" />
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
            <div><Badge variant="outline" className="rounded-full bg-white/70">Timeline</Badge><h2 className="mt-3 text-2xl font-bold">Jadwal Seleksi Beasiswa 2026</h2></div>
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={t.tahap} className="flex items-center gap-4 rounded-2xl border border-[#ded8ca] bg-white/80 p-4 shadow-sm">
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
            <div><Badge variant="outline" className="rounded-full bg-white/70">Manfaat</Badge><h2 className="mt-3 text-2xl font-bold">Apa yang Kamu Dapatkan?</h2></div>
            <div className="grid gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3 rounded-2xl border border-[#ded8ca] bg-white/80 px-4 py-3 shadow-sm">
                  <TickCircle variant="Bulk" size={20} className="text-primary shrink-0" />
                  <p className="text-sm font-medium">{b}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-primary/8 border border-primary/15 p-5">
              <div className="flex items-start gap-3">
                <InfoCircle variant="Bulk" size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-6 text-muted-foreground">Beasiswa dapat dicabut jika IPK turun di bawah syarat minimum atau terbukti melanggar peraturan akademik kampus.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
