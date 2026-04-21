import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentTitle, type PublicContentItem, type SiteSettings } from "@/lib/site-content";
import {
  CalendarBlank, Wallet, ChatCircleDots, CheckCircle,
  Phone, Envelope, MapPin, Info, FileText,
  CaretDown, CaretUp,
} from "@phosphor-icons/react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const jadwal = [
  { gelombang: "Gelombang 1", buka: "1 Jan 2026", tutup: "31 Mar 2026", pengumuman: "10 Apr 2026", accent: "from-primary/15 to-primary/5 border-primary/25 dark:from-primary/10 dark:to-transparent" },
  { gelombang: "Gelombang 2", buka: "1 Apr 2026", tutup: "30 Jun 2026", pengumuman: "10 Jul 2026", accent: "from-muted to-muted/30 border-border" },
  { gelombang: "Gelombang 3", buka: "1 Jul 2026", tutup: "31 Ags 2026", pengumuman: "5 Sep 2026", accent: "from-accent to-accent/30 border-border" },
];

const biaya = [
  { label: "Biaya Pendaftaran", nominal: "Rp 250.000", keterangan: "Dibayar saat submit formulir • tidak dapat dikembalikan", icon: FileText },
  { label: "Uang Pangkal", nominal: "Rp 3.000.000", keterangan: "Dibayar sekali saat dinyatakan diterima", icon: Wallet },
  { label: "SPP per Semester", nominal: "Rp 3.500.000", keterangan: "Dapat dicicil maks. 3× per semester", icon: CalendarBlank },
  { label: "Biaya per SKS", nominal: "Rp 150.000", keterangan: "Dibayar setiap awal semester bersamaan KRS", icon: FileText },
  { label: "Biaya Praktikum", nominal: "Rp 500.000", keterangan: "Untuk matkul berkomponon praktikum per semester", icon: Wallet },
];

const faqs = [
  { q: "Apakah bisa mendaftar tanpa hafalan Al-Qur'an?", a: "Ya. Jalur Reguler dan Prestasi tidak mensyaratkan hafalan. Hafalan hanya diperlukan untuk jalur Beasiswa Tahfidz." },
  { q: "Bagaimana jika ijazah belum keluar?", a: "Gunakan Surat Keterangan Lulus (SKL) sementara. Ijazah resmi dilengkapi saat registrasi ulang." },
  { q: "Apakah ada tes tulis masuk?", a: "Tidak. Jalur Reguler tidak ada tes tulis. Seleksi berdasarkan nilai rapor dan wawancara singkat via daring." },
  { q: "Bisakah mahasiswa pindah dari PTN/PTS lain?", a: "Ya, tersedia jalur Transfer dengan konversi SKS. Hubungi tim PMB untuk detailnya." },
  { q: "Berapa maksimal SKS per semester?", a: "Maks. 24 SKS, dengan syarat IPK semester sebelumnya ≥ 3.00." },
  { q: "Apakah tersedia asrama?", a: "Fasilitas asrama putra/putri sedang dikembangkan. Info lebih lanjut akan diumumkan via portal kampus." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${open ? "border-primary/30 bg-primary/5 dark:bg-primary/8" : "border-border/60 bg-card"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-sm leading-snug">{q}</span>
        <span className={`mt-0.5 shrink-0 transition-transform duration-200 ${open ? "text-primary" : "text-muted-foreground"}`}>
          {open ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-border/40 px-5 py-4 text-sm leading-6 text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  );
}

export default function InformasiPMB() {
  const [content, setContent] = useState<PublicContentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    trackEvent("public_info_pmb_view");
    apiFetch<{ content: PublicContentItem[]; settings?: SiteSettings }>("/public/landing").then((data) => {
      setContent(data.content || []);
      setSettings(data.settings || {});
    }).catch(() => undefined);
  }, []);

  const kontakData = [
    { icon: Envelope, label: "Email PMB", nilai: settings.contactEmail || "pmb@stibadamasa.ac.id" },
    { icon: Phone, label: "WhatsApp PMB", nilai: settings.contactPhone || "+62 812-3456-7890" },
    { icon: MapPin, label: "Alamat", nilai: settings.address || "Jl. Ampel Suci No.1, Ampel, Semampir, Surabaya 60151" },
    { icon: CalendarBlank, label: "Jam Layanan", nilai: "Senin–Jumat, 08.00–16.00 WIB" },
  ];

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#2f4f46] dark:bg-[#192e28] px-4 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="relative mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <Badge className="rounded-full border-white/20 bg-white/15 text-white hover:bg-white/15">PMB 2026/2027</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {contentTitle(content, "informasi-pmb.hero", "Informasi PMB")}
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/70">
              {contentBody(content, "informasi-pmb.hero", "Detail lengkap biaya, jadwal penerimaan per gelombang, kontak PMB, dan FAQ calon mahasiswa.")}
            </p>
          </div>
          <div className="grid gap-2 text-sm min-w-[240px]">
            {[
              ["Jadwal", settings.admissionSchedule || "3 gelombang penerimaan"],
              ["Biaya", settings.admissionFee || "Mulai Rp 3,5 jt/semester"],
              ["Kontak", settings.contactEmail || "pmb@stibadamasa.ac.id"],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="w-14 shrink-0 text-white/50 text-xs">{l}</span>
                <span className="font-semibold text-sm">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JADWAL ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <Badge variant="outline" className="rounded-full bg-card/80">Jadwal Penerimaan</Badge>
            <h2 className="mt-3 text-2xl font-bold">Gelombang Pendaftaran 2026</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pilih gelombang yang sesuai rencana studi Anda. Semua gelombang berakhir di tahun akademik yang sama.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {jadwal.map((j, i) => (
              <div key={j.gelombang} className={`rounded-3xl border-2 bg-gradient-to-br p-6 space-y-4 ${j.accent}`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-border/40 bg-card/70 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">{j.gelombang}</span>
                  <span className="text-2xl font-extrabold text-foreground/15">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Pendaftaran</p>
                    <p className="text-sm font-semibold mt-0.5">{j.buka} — {j.tutup}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Pengumuman</p>
                    <p className="text-sm font-semibold mt-0.5">{j.pengumuman}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Mulai Kuliah</p>
                    <p className="text-sm font-semibold mt-0.5">Agustus/September 2026</p>
                  </div>
                </div>
                <Link href="/pendaftaran">
                  <Button size="sm" variant="outline" className="w-full rounded-xl text-xs border-border/50 bg-card/60 hover:bg-card">
                    Daftar {j.gelombang}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIAYA ── */}
      <section className="bg-muted/40 px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <Badge variant="outline" className="rounded-full bg-card/80">Biaya Pendidikan</Badge>
            <h2 className="mt-3 text-2xl font-bold">Rincian Biaya Kuliah</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {biaya.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon size={17} weight="duotone" className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{b.label}</p>
                    <p className="mt-1 text-xl font-extrabold text-primary">{b.nominal}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{b.keterangan}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/60 p-4">
            <Info size={16} weight="duotone" className="text-primary shrink-0 mt-0.5" />
            <p className="text-sm leading-6 text-muted-foreground">Pembayaran via transfer bank atau tunai di loket keuangan kampus. SPP dapat dicicil maks. 3× per semester dengan persetujuan BAK.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ + KONTAK ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <div>
              <Badge variant="outline" className="rounded-full bg-card/80">FAQ</Badge>
              <h2 className="mt-3 text-2xl font-bold">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-24">
            <div>
              <Badge variant="outline" className="rounded-full bg-card/80">Kontak PMB</Badge>
              <h2 className="mt-3 text-2xl font-bold">Hubungi Tim PMB</h2>
            </div>
            <div className="space-y-3">
              {kontakData.map(({ icon: Icon, label, nilai }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon size={16} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-semibold text-sm">{nilai}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-[#2f4f46] dark:bg-[#192e28] p-5 text-white space-y-3">
              <div className="flex items-center gap-2">
                <ChatCircleDots size={18} weight="duotone" className="shrink-0" />
                <p className="font-semibold text-sm">Masih ada pertanyaan?</p>
              </div>
              <p className="text-xs text-white/70 leading-5">Tim PMB siap membantu Anda setiap hari kerja pukul 08.00–16.00 WIB.</p>
              <Link href="/pendaftaran">
                <Button className="w-full rounded-xl bg-white text-[#1f3f37] hover:bg-white/90 mt-1" size="sm">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={15} weight="duotone" className="text-primary" />
                <p className="text-sm font-semibold">Persyaratan Dokumen</p>
              </div>
              <ul className="space-y-1.5">
                {["Fotokopi ijazah/SKL dilegalisir", "Fotokopi transkrip/rapor", "Fotokopi KTP & KK", "Pas foto 3×4 latar biru (4 lembar)", "Surat keterangan sehat"].map((r) => (
                  <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/50 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
