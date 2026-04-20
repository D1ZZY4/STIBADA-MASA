import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { apiFetch, trackEvent } from "@/lib/api";
import { Images, MagnifyingGlass } from "@phosphor-icons/react";

type GalleryItem = { id: string; title: string; category: string; description: string };

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    trackEvent("public_galeri_view");
    apiFetch<{ gallery: GalleryItem[] }>("/public/landing").then((d) => {
      if (d.gallery?.length) setItems([...d.gallery, ...fallback.slice(d.gallery.length)]);
    }).catch(() => undefined);
  }, []);

  const filtered = items.filter((item) => {
    const matchQ = item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase());
    const matchC = category === "Semua" || item.category === category;
    return matchQ && matchC;
  });

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-[#2f4f46] px-4 py-16 text-white">
        <div className="relative mx-auto max-w-7xl">
          <Badge className="mb-4 rounded-full bg-white/20 text-white hover:bg-white/20">Galeri</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Dokumentasi & Kegiatan Kampus</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">Rekam jejak kegiatan akademik, non-akademik, dan momen berharga civitas STIBADA MASA.</p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-[#ded8ca] bg-white/80 px-4 py-2 w-full sm:max-w-xs">
              <MagnifyingGlass size={16} className="text-muted-foreground shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari kegiatan..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === c ? "bg-primary text-white" : "bg-white/80 border border-[#ded8ca] text-muted-foreground hover:bg-white"}`}>{c}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Images size={40} weight="duotone" className="mx-auto mb-3 opacity-30" />
              <p>Tidak ada item yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((item, index) => (
                <div key={item.id} className="group overflow-hidden rounded-3xl border border-[#ded8ca] bg-white shadow-sm">
                  <div className="overflow-hidden">
                    <img src={photos[index % photos.length]} alt={item.title} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="rounded-full text-xs">{item.category}</Badge>
                    <h3 className="mt-3 font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-5">{item.description}</p>
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
