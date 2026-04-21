import { Link } from "wouter";
import {
  GraduationCap, BookOpen, ChartLineUp, ClipboardText, CalendarBlank,
  ChalkboardTeacher, ArrowRight, ShieldCheck, Lightning, Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/public-layout";

const features = [
  { icon: ClipboardText, title: "Kartu Rencana Studi", desc: "Susun KRS tiap semester dengan validasi otomatis dan persetujuan dosen wali." },
  { icon: ChartLineUp, title: "Transkrip & IPK", desc: "Pantau nilai per mata kuliah, IPS tiap semester, dan IPK kumulatif secara real-time." },
  { icon: CalendarBlank, title: "Jadwal Kuliah", desc: "Jadwal mingguan, lokasi ruang, dan pengingat perkuliahan terintegrasi." },
  { icon: BookOpen, title: "Absensi Digital", desc: "Riwayat kehadiran lengkap per mata kuliah dengan presentase otomatis." },
  { icon: ChalkboardTeacher, title: "Forum Akademik", desc: "Diskusi dengan dosen dan teman sekelas dalam ruang khusus mata kuliah." },
  { icon: ShieldCheck, title: "Aman & Terpercaya", desc: "Otentikasi berbasis peran, audit trail, dan enkripsi data pengguna." },
];

export default function Siakad() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_10%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(ellipse_at_85%_30%,hsl(var(--primary)/0.07),transparent_55%)]" />
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Sparkle size={11} weight="fill" /> Sistem Akademik Terpadu
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              SIAKAD — Sistem Informasi Akademik STIBADA MASA
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Satu portal terpadu untuk seluruh aktivitas akademik mahasiswa dan dosen — KRS, jadwal, nilai, absensi, hingga forum diskusi. Diakses kapan saja, di mana saja.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg" className="rounded-2xl gap-2 px-6 text-sm">
                  <Lightning size={16} weight="duotone" /> Masuk SIAKAD
                </Button>
              </Link>
              <Link href="/informasi-pmb">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2 px-6 text-sm">
                  Panduan Akses <ArrowRight size={14} weight="bold" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[["24/7", "Akses Online"], ["Real-time", "Sinkron Data"], ["Aman", "Audit Trail"]].map(([title, label]) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative grid gap-3 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-2xl backdrop-blur-xl sm:grid-cols-2">
              {features.slice(0, 4).map(({ icon: Icon, title }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} weight="duotone" />
                  </div>
                  <p className="mt-3 text-sm font-bold leading-tight">{title}</p>
                </div>
              ))}
              <div className="col-span-full rounded-2xl bg-primary p-5 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <GraduationCap size={28} weight="duotone" />
                  <div>
                    <p className="text-sm font-bold">Login Mahasiswa & Dosen</p>
                    <p className="text-xs text-primary-foreground/80 mt-0.5">Gunakan NIM atau NIDN dan password masing-masing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-2xl">
            <Badge variant="outline" className="rounded-full text-xs">Fitur Lengkap</Badge>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">Semua kebutuhan akademik dalam satu portal.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md">
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
