import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, trackEvent } from "@/lib/api";
import { Notification, SearchNormal, Calendar, DirectboxNotif } from "iconsax-react";

type Announcement = { id: string; title: string; content: string; createdAt: string };

const fallback: Announcement[] = [
  { id: "1", title: "Pendaftaran Mahasiswa Baru Dibuka", content: "PMB STIBADA MASA tahun akademik 2026/2027 resmi dibuka mulai 1 Januari 2026. Tersedia jalur reguler, prestasi, tahfidz, dan transfer. Daftarkan diri Anda sekarang melalui formulir pendaftaran daring di website resmi kampus.", createdAt: new Date().toISOString() },
  { id: "2", title: "Pengingat Batas Waktu KRS", content: "Kepada seluruh mahasiswa aktif, pengisian Kartu Rencana Studi (KRS) semester Genap 2025/2026 akan ditutup pada Jumat, 17 Januari 2026 pukul 23.59 WIB. Segera hubungi dosen wali jika ada kendala.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", title: "Seminar Nasional Pendidikan Islam", content: "STIBADA MASA menyelenggarakan Seminar Nasional bertema 'Transformasi Pendidikan Islam di Era Digital' pada 25 Januari 2026 di Aula Utama kampus. Terbuka untuk mahasiswa, dosen, dan umum. Pendaftaran gratis.", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "4", title: "Pengumuman Hasil Seleksi Beasiswa", content: "Pengumuman hasil seleksi Beasiswa Prestasi MASA dan Beasiswa Tahfidz semester Genap 2025/2026 dapat dilihat di papan pengumuman akademik dan portal mahasiswa mulai 10 Januari 2026.", createdAt: new Date(Date.now() - 259200000).toISOString() },
];

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallback);
  const [query, setQuery] = useState("");

  useEffect(() => {
    trackEvent("public_pengumuman_view");
    apiFetch<{ announcements: Announcement[] }>("/public/landing").then((d) => {
      if (d.announcements?.length) setAnnouncements([...d.announcements, ...fallback.slice(d.announcements.length)]);
    }).catch(() => undefined);
  }, []);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PublicLayout>
      <section className="relative overflow-hidden px-4 py-16">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#1a2e28]/88" />
        </div>
        <div className="relative mx-auto max-w-7xl text-white">
          <Badge className="mb-4 rounded-full bg-white/20 text-white hover:bg-white/20">Informasi Terkini</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Pengumuman Umum</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">Berita terbaru, agenda kampus, dan notifikasi penting untuk civitas dan calon mahasiswa STIBADA MASA.</p>
          <div className="mt-6 flex max-w-md items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <SearchNormal size={18} className="text-white/60 shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari pengumuman..." className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none" />
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <DirectboxNotif size={40} className="mx-auto mb-3 opacity-30" />
              <p>Tidak ada pengumuman yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-4 max-w-3xl mx-auto">
              {filtered.map((item) => (
                <Card key={item.id} className="rounded-3xl border-[#ded8ca] bg-white/84 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="rounded-full bg-white/70 text-xs flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full text-xs">Publik</Badge>
                    </div>
                    <CardTitle className="text-base mt-1">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">{item.content}</CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
