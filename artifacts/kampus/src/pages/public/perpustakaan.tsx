import { Link } from "wouter";
import {
  Books, MagnifyingGlass, BookmarkSimple, DownloadSimple,
  ClockCounterClockwise, ChatCircleText, ArrowRight, Sparkle, Lightning, BookBookmark,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/public-layout";

const features = [
  { icon: MagnifyingGlass, title: "Pencarian Cepat", desc: "Cari koleksi buku, jurnal, dan referensi dengan filter judul, penulis, atau kategori." },
  { icon: BookmarkSimple, title: "Pinjam Online", desc: "Reservasi dan perpanjangan peminjaman buku tanpa perlu datang ke perpustakaan." },
  { icon: DownloadSimple, title: "E-Book & Materi", desc: "Akses puluhan ribu e-book dan materi digital langsung dari portal." },
  { icon: ClockCounterClockwise, title: "Riwayat Peminjaman", desc: "Pantau status pinjaman, jatuh tempo, dan riwayat baca Anda." },
  { icon: ChatCircleText, title: "Bantuan Pustakawan", desc: "Konsultasi dengan pustakawan untuk referensi penelitian dan tugas akhir." },
  { icon: BookBookmark, title: "Koleksi Khusus", desc: "Koleksi naskah klasik Bahasa Arab, kitab kuning, dan literatur dakwah." },
];

const stats = [
  { num: "12.000+", label: "Koleksi Buku" },
  { num: "5.000+", label: "E-Journal" },
  { num: "850+", label: "Naskah Klasik" },
  { num: "24/7", label: "Akses Online" },
];

export default function Perpustakaan() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_12%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(ellipse_at_82%_28%,hsl(var(--primary)/0.07),transparent_55%)]" />
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Sparkle size={11} weight="fill" /> Digital Library
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              Perpustakaan Online STIBADA MASA
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Akses ribuan koleksi buku, jurnal, dan e-book Bahasa Arab dan Studi Islam langsung dari mana saja. Pinjam, baca, dan kembalikan secara digital.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg" className="rounded-2xl gap-2 px-6 text-sm">
                  <Lightning size={16} weight="duotone" /> Buka Perpustakaan
                </Button>
              </Link>
              <Link href="/galeri">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2 px-6 text-sm">
                  Galeri Kampus <ArrowRight size={14} weight="bold" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/60 bg-card/60 px-3 py-3 text-center backdrop-blur-sm">
                  <p className="font-extrabold text-base text-primary">{s.num}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 backdrop-blur-sm">
                <MagnifyingGlass size={18} weight="duotone" className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Cari judul, penulis, atau ISBN…</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Nahwu Wadhih", cat: "Tata Bahasa Arab" },
                  { title: "Al-Balaghah", cat: "Sastra Arab" },
                  { title: "Kitab Sirah Nabawiyyah", cat: "Sejarah Islam" },
                  { title: "Tafsir Al-Misbah", cat: "Tafsir" },
                ].map((b) => (
                  <div key={b.title} className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Books size={18} weight="duotone" />
                    </div>
                    <p className="mt-3 text-sm font-bold leading-tight">{b.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{b.cat}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-2xl">
            <Badge variant="outline" className="rounded-full text-xs">Layanan</Badge>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">Pengalaman membaca tanpa batas.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={22} weight="duotone" />
                </div>
                <p className="mt-4 font-bold text-base">{title}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
