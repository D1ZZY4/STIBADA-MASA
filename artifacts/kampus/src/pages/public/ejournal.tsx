import { Link } from "wouter";
import {
  Newspaper, FileText, MagnifyingGlass, DownloadSimple, Quotes,
  GlobeHemisphereWest, ArrowRight, Sparkle, Lightning, BookOpenText,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/public-layout";

const features = [
  { icon: MagnifyingGlass, title: "Pencarian Jurnal", desc: "Telusuri ribuan artikel berdasarkan kata kunci, penulis, atau bidang penelitian." },
  { icon: DownloadSimple, title: "Open Access", desc: "Unduh artikel berformat PDF tanpa biaya untuk seluruh civitas akademika." },
  { icon: Quotes, title: "Sitasi Otomatis", desc: "Format sitasi APA, MLA, Chicago, dan IEEE tersedia untuk setiap artikel." },
  { icon: GlobeHemisphereWest, title: "Indeks Internasional", desc: "Terindeks Google Scholar, DOAJ, Sinta, dan Garuda untuk visibilitas global." },
  { icon: BookOpenText, title: "Submission Author", desc: "Kirim naskah penelitian Anda untuk direview dan dipublikasikan." },
  { icon: FileText, title: "Arsip Lengkap", desc: "Akses arsip jurnal sejak terbitan perdana hingga edisi terbaru." },
];

const journals = [
  { name: "Jurnal Pendidikan Bahasa Arab", issn: "ISSN 2580-XXXX", focus: "Linguistik & Pengajaran" },
  { name: "Jurnal Studi Islam Sunan Ampel", issn: "ISSN 2615-XXXX", focus: "Kajian Islam Klasik & Kontemporer" },
  { name: "Jurnal Dakwah & Komunikasi", issn: "ISSN 2723-XXXX", focus: "Dakwah, Komunikasi, dan Media" },
];

export default function EJournal() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_12%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(ellipse_at_82%_28%,hsl(var(--primary)/0.07),transparent_55%)]" />
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Sparkle size={11} weight="fill" /> Open Journal System
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              E-Journal STIBADA MASA
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Portal publikasi ilmiah resmi STIBADA MASA. Kumpulan jurnal peer-reviewed bidang Bahasa Arab, Studi Islam, dan Dakwah yang terbuka untuk diakses dan dirujuk secara akademik.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg" className="rounded-2xl gap-2 px-6 text-sm">
                  <Lightning size={16} weight="duotone" /> Akses Jurnal
                </Button>
              </Link>
              <Link href="/program-studi">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2 px-6 text-sm">
                  Program Studi <ArrowRight size={14} weight="bold" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[["3", "Jurnal Aktif"], ["Sinta", "Terakreditasi"], ["Open Access", "100% Gratis"]].map(([title, label]) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-2xl backdrop-blur-xl space-y-3">
              {journals.map((j) => (
                <div key={j.name} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Newspaper size={20} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-tight">{j.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{j.issn}</p>
                    <p className="text-xs text-primary/80 mt-1.5 font-medium">{j.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-2xl">
            <Badge variant="outline" className="rounded-full text-xs">Fitur</Badge>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">Publikasi ilmiah modern, transparan, terbuka.</h2>
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
