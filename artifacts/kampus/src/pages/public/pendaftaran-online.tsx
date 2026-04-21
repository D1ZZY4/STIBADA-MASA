import { Link } from "wouter";
import {
  UserPlus, FileText, CheckCircle, Clock, CreditCard, Users,
  ArrowRight, Sparkle, Lightning, ShieldCheck,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/public-layout";

const steps = [
  { icon: UserPlus, title: "Daftar Akun", desc: "Buat akun calon mahasiswa dengan email aktif sebagai identitas utama." },
  { icon: FileText, title: "Lengkapi Data", desc: "Isi data diri, asal sekolah, dan unggah dokumen persyaratan." },
  { icon: CreditCard, title: "Bayar Pendaftaran", desc: "Pembayaran via virtual account, transfer bank, atau e-wallet." },
  { icon: CheckCircle, title: "Cetak Kartu Ujian", desc: "Kartu ujian dapat diunduh dan dicetak setelah pembayaran terverifikasi." },
];

const benefits = [
  { icon: Clock, title: "Proses Cepat", desc: "Verifikasi dokumen otomatis dalam 1×24 jam." },
  { icon: ShieldCheck, title: "Data Aman", desc: "Enkripsi end-to-end pada seluruh data sensitif." },
  { icon: Users, title: "Bantuan PMB", desc: "Tim PMB siap membantu via WhatsApp dan email." },
];

export default function PendaftaranOnline() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_10%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(ellipse_at_90%_25%,hsl(var(--primary)/0.07),transparent_55%)]" />
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Sparkle size={11} weight="fill" /> PMB Online 2026/2027
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              Pendaftaran Online — Cepat, Mudah, Transparan
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Daftar menjadi mahasiswa STIBADA MASA tanpa perlu datang ke kampus. Seluruh proses dilakukan secara daring melalui sistem PMB online terintegrasi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pendaftaran">
                <Button size="lg" className="rounded-2xl gap-2 px-6 text-sm">
                  <Lightning size={16} weight="duotone" /> Mulai Pendaftaran
                </Button>
              </Link>
              <Link href="/informasi-pmb">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2 px-6 text-sm">
                  Info & FAQ <ArrowRight size={14} weight="bold" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[["100%", "Online"], ["1×24 Jam", "Verifikasi"], ["Gratis", "Konsultasi"]].map(([title, label]) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative space-y-3 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-2xl backdrop-blur-xl">
              {steps.map((s, i) => (
                <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <s.icon size={20} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Langkah {i + 1}</p>
                    <p className="font-bold text-sm leading-tight mt-0.5">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-5">{s.desc}</p>
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
            <Badge variant="outline" className="rounded-full text-xs">Mengapa Daftar Online?</Badge>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">Lebih efisien tanpa antrian.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={24} weight="duotone" />
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
