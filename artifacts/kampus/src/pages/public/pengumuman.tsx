import { useEffect, useMemo, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, trackEvent } from "@/lib/api";
import {
  ArchiveBook,
  ArrowRight2,
  Calendar2,
  DirectboxNotif,
  FilterSearch,
  NotificationBing,
  SearchNormal1,
  TickCircle,
  TrendUp,
} from "iconsax-react";

type Announcement = { id: string; title: string; content: string; createdAt: string };

const categories = ["Semua", "Pendaftaran", "Akademik", "Kegiatan", "Beasiswa"];

const fallback: Announcement[] = [
  { id: "1", title: "Pendaftaran Mahasiswa Baru Dibuka", content: "PMB STIBADA MASA tahun akademik 2026/2027 resmi dibuka mulai 1 Januari 2026. Tersedia jalur reguler, prestasi, tahfidz, dan transfer. Daftarkan diri Anda sekarang melalui formulir pendaftaran daring.", createdAt: new Date().toISOString() },
  { id: "2", title: "Pengingat Batas Waktu KRS", content: "Kepada seluruh mahasiswa aktif, pengisian Kartu Rencana Studi (KRS) semester Genap 2025/2026 akan ditutup pada Jumat, 17 Januari 2026 pukul 23.59 WIB. Segera hubungi dosen wali jika ada kendala.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", title: "Seminar Nasional Pendidikan Islam", content: "STIBADA MASA menyelenggarakan Seminar Nasional bertema 'Transformasi Pendidikan Islam di Era Digital' pada 25 Januari 2026 di Aula Utama kampus. Terbuka untuk mahasiswa, dosen, dan umum. Pendaftaran gratis.", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "4", title: "Pengumuman Hasil Seleksi Beasiswa", content: "Pengumuman hasil seleksi Beasiswa Prestasi MASA dan Beasiswa Tahfidz semester Genap 2025/2026 dapat dilihat di papan pengumuman akademik dan portal mahasiswa mulai 10 Januari 2026.", createdAt: new Date(Date.now() - 259200000).toISOString() },
];

function getCategory(item: Announcement) {
  const text = `${item.title} ${item.content}`.toLowerCase();
  if (text.includes("beasiswa")) return "Beasiswa";
  if (text.includes("pmb") || text.includes("pendaftaran") || text.includes("seleksi")) return "Pendaftaran";
  if (text.includes("krs") || text.includes("akademik") || text.includes("semester")) return "Akademik";
  if (text.includes("seminar") || text.includes("agenda") || text.includes("kegiatan")) return "Kegiatan";
  return "Akademik";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallback);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    trackEvent("public_pengumuman_view");
    apiFetch<{ announcements: Announcement[] }>("/public/landing").then((d) => {
      if (d.announcements?.length) setAnnouncements([...d.announcements, ...fallback.slice(d.announcements.length)]);
    }).catch(() => undefined);
  }, []);

  const sortedAnnouncements = useMemo(
    () => [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [announcements],
  );

  const filtered = sortedAnnouncements.filter((item) => {
    const matchesQuery = `${item.title} ${item.content}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || getCategory(item) === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden bg-[#203d37] px-4 py-14 text-white sm:py-18">
        <div className="absolute left-[-12%] top-[-18%] -z-10 h-72 w-72 rounded-full bg-[#b8a16d]/28 blur-3xl" />
        <div className="absolute bottom-[-24%] right-[-10%] -z-10 h-96 w-96 rounded-full bg-[#6fa089]/24 blur-3xl" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_68%_18%,rgba(216,192,138,0.16),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div className="text-white">
            <Badge className="mb-4 rounded-full border border-white/15 bg-white/12 px-3 py-1 text-white hover:bg-white/12">
              Informasi Resmi Kampus
            </Badge>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Pengumuman yang rapi, mudah dicari, dan selalu terbaru.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Temukan berita akademik, PMB, beasiswa, dan agenda penting STIBADA MASA dalam satu halaman yang terstruktur.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { label: "Update cepat", value: `${announcements.length} info`, icon: NotificationBing },
                { label: "Kategori", value: "5 kanal", icon: ArchiveBook },
                { label: "Pencarian", value: "Instan", icon: FilterSearch },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                    <Icon size={22} variant="Bulk" className="mb-3 text-[#d8c08a]" />
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-xs text-white/58">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/14 bg-[#f4f1ea]/96 p-4 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2a6b5a]/10 text-[#2a6b5a]">
                <SearchNormal1 size={20} variant="TwoTone" />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="announcement-search" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7854]">
                  Cari pengumuman
                </label>
                <input
                  id="announcement-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ketik judul atau isi..."
                  className="mt-1 w-full bg-transparent text-sm font-medium text-[#243b35] outline-none placeholder:text-[#243b35]/35"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeCategory === category
                      ? "border-[#2a6b5a] bg-[#2a6b5a] text-white"
                      : "border-[#ded8ca] bg-white/70 text-[#52645f] hover:border-[#b8a16d] hover:text-[#203d37]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_320px]">
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-[#ded8ca] bg-white/82 px-6 py-20 text-center text-muted-foreground shadow-sm lg:col-span-2">
              <DirectboxNotif size={44} variant="Bulk" className="mx-auto mb-4 text-[#b8a16d]" />
              <p className="font-semibold text-foreground">Tidak ada pengumuman yang ditemukan.</p>
              <p className="mt-1 text-sm">Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {featured && (
                  <Card className="overflow-hidden rounded-[2rem] border-[#ded8ca] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#eee7d7] bg-[#fbfaf6] p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full bg-[#8a7854] text-white hover:bg-[#8a7854]">Sorotan</Badge>
                        <Badge variant="outline" className="rounded-full border-[#ded8ca] bg-white text-xs">
                          {getCategory(featured)}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3 text-2xl leading-tight text-[#203d37] sm:text-3xl">{featured.title}</CardTitle>
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar2 size={16} variant="TwoTone" className="text-[#2a6b5a]" />
                        {formatDate(featured.createdAt)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6">
                      <p className="text-sm leading-7 text-[#52645f] sm:text-base">{featured.content}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#2a6b5a]">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2a6b5a]/8 px-3 py-1.5">
                          <TickCircle size={15} variant="Bulk" />
                          Terverifikasi publik
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b8a16d]/14 px-3 py-1.5 text-[#8a7854]">
                          <TrendUp size={15} variant="Bulk" />
                          Prioritas informasi
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {rest.map((item) => (
                    <Card key={item.id} className="group rounded-[1.75rem] border-[#ded8ca] bg-white/86 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start">
                        <div>
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="rounded-full border-[#ded8ca] bg-[#f8f5ec] text-xs text-[#8a7854]">
                              {getCategory(item)}
                            </Badge>
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar2 size={14} variant="TwoTone" />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          <h2 className="text-lg font-bold leading-snug text-[#203d37]">{item.title}</h2>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#52645f]">{item.content}</p>
                        </div>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2a6b5a]/8 text-[#2a6b5a] transition-colors group-hover:bg-[#2a6b5a] group-hover:text-white">
                          <ArrowRight2 size={18} variant="Linear" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <aside className="space-y-4">
                <Card className="rounded-[2rem] border-[#ded8ca] bg-[#203d37] text-white shadow-sm">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <NotificationBing size={24} variant="Bulk" className="text-[#d8c08a]" />
                    </div>
                    <CardTitle className="text-xl">Pusat Informasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-white/68">
                    <p>Pengumuman dipublikasikan untuk calon mahasiswa, mahasiswa aktif, dosen, dan masyarakat umum.</p>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <p className="text-2xl font-extrabold text-white">{filtered.length}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/42">hasil aktif</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-[#ded8ca] bg-white/82 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base text-[#203d37]">Kategori tersedia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.slice(1).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className="flex w-full items-center justify-between rounded-2xl border border-[#eee7d7] bg-white px-4 py-3 text-left text-sm font-semibold text-[#52645f] transition-colors hover:border-[#b8a16d] hover:text-[#203d37]"
                      >
                        {category}
                        <ArrowRight2 size={15} variant="Linear" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
