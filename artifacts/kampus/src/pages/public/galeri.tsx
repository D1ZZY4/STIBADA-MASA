import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentTitle, fallbackImages, type PublicContentItem } from "@/lib/site-content";
import { Images, MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";

type GalleryItem = { id: string; title: string; category: string; description: string; image?: string };

const fallback: GalleryItem[] = [
  { id: "1", title: "Wisuda Sarjana 2025", category: "Wisuda", description: "Momen pelepasan lulusan STIBADA MASA angkatan 2025." },
  { id: "2", title: "Seminar Literasi Digital", category: "Seminar", description: "Kuliah umum transformasi digital dalam dunia pendidikan Islam." },
  { id: "3", title: "Liga Futsal Mahasiswa", category: "Olahraga", description: "Kompetisi futsal tahunan antar prodi mahasiswa STIBADA MASA." },
  { id: "4", title: "Ekstrakurikuler Seni Hadrah", category: "Ekskul", description: "Pembinaan minat dan bakat mahasiswa di bidang seni Islami." },
  { id: "5", title: "Workshop Kewirausahaan", category: "Seminar", description: "Pelatihan wirausaha berbasis ekonomi syariah untuk mahasiswa." },
  { id: "6", title: "Studi Banding Nasional", category: "Akademik", description: "Kunjungan ke kampus-kampus Islam ternama di Jawa Timur." },
  { id: "7", title: "Perlombaan Kaligrafi", category: "Ekskul", description: "Festival seni kaligrafi Arab antar mahasiswa se-Surabaya." },
  { id: "8", title: "Pengenalan Kampus Baru", category: "Akademik", description: "Orientasi mahasiswa baru tahun akademik 2025/2026." },
];

const photos = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=85",
];

const allCategories = ["Semua", "Wisuda", "Seminar", "Olahraga", "Ekskul", "Akademik"];

export default function Galeri() {
  const [items, setItems] = useState<GalleryItem[]>(fallback);
  const [content, setContent] = useState<PublicContentItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    trackEvent("public_galeri_view");
    apiFetch<{ gallery: GalleryItem[]; content: PublicContentItem[] }>("/public/landing").then((d) => {
      if (d.gallery?.length) setItems([...d.gallery, ...fallback.slice(d.gallery.length)]);
      setContent(d.content || []);
    }).catch(() => undefined);
  }, []);

  const filtered = items.filter((item) => {
    const matchQ = item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase());
    const matchC = category === "Semua" || item.category === category;
    return matchQ && matchC;
  });

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#2f4f46] dark:bg-[#192e28] px-4 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#203d37]/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <Badge className="mb-4 rounded-full bg-white/15 text-white border-white/20 hover:bg-white/15">Galeri Kampus</Badge>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {contentTitle(content, "galeri.hero", "Dokumentasi & Kegiatan Kampus")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            {contentBody(content, "galeri.hero", "Rekam jejak kegiatan akademik, non-akademik, dan momen berharga civitas STIBADA MASA.")}
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[["8+", "Kategori Kegiatan"], ["100+", "Foto Dokumentasi"], ["5+", "Tahun Rekam Jejak"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-lg font-extrabold">{n}</p>
                <p className="text-xs text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER + GRID ── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-2.5 w-full sm:max-w-xs shadow-sm">
              <MagnifyingGlass size={15} className="text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kegiatan..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FunnelSimple size={15} className="text-muted-foreground shrink-0" />
              {allCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                    category === c
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/60 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-xs text-muted-foreground">{filtered.length} item ditemukan</p>

          {filtered.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              <Images size={44} weight="duotone" className="mx-auto mb-3 opacity-25" />
              <p className="font-medium">Tidak ada item yang ditemukan.</p>
              <p className="text-xs mt-1">Coba ubah kata kunci atau filter kategori.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((item, index) => (
                <div key={item.id} className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
                  <div className="overflow-hidden">
                    <img
                      src={item.image || photos[index % photos.length] || fallbackImages.gallery[index % fallbackImages.gallery.length]}
                      alt={item.title}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="rounded-full text-xs">{item.category}</Badge>
                    <h3 className="mt-2.5 font-semibold leading-tight text-sm">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
