import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/api";
import {
  Calendar, WalletMoney, MessageQuestion, TickCircle,
  Call, Sms, Location, InfoCircle, DocumentText,
  ArrowRight, CloseCircle,
} from "iconsax-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const jadwal = [
  { gelombang: "Gelombang 1", buka: "1 Jan 2026", tutup: "31 Mar 2026", pengumuman: "10 Apr 2026", warna: "bg-emerald-50 border-emerald-200" },
  { gelombang: "Gelombang 2", buka: "1 Apr 2026", tutup: "30 Jun 2026", pengumuman: "10 Jul 2026", warna: "bg-sky-50 border-sky-200" },
  { gelombang: "Gelombang 3", buka: "1 Jul 2026", tutup: "31 Ags 2026", pengumuman: "5 Sep 2026", warna: "bg-amber-50 border-amber-200" },
];

const biaya = [
  { label: "Biaya Pendaftaran", nominal: "Rp 250.000", keterangan: "Dibayar saat submit formulir • tidak dapat dikembalikan", icon: DocumentText },
  { label: "Uang Pangkal", nominal: "Rp 3.000.000", keterangan: "Dibayar sekali saat dinyatakan diterima", icon: WalletMoney },
  { label: "SPP per Semester", nominal: "Rp 3.500.000", keterangan: "Dapat dicicil maks. 3× per semester", icon: Calendar },
  { label: "Biaya per SKS", nominal: "Rp 150.000", keterangan: "Dibayar setiap awal semester bersamaan KRS", icon: DocumentText },
  { label: "Biaya Praktikum", nominal: "Rp 500.000", keterangan: "Untuk matkul berkomponon praktikum per semester", icon: WalletMoney },
];

const faqs = [
  { q: "Apakah bisa mendaftar tanpa hafalan Al-Qur'an?", a: "Ya. Jalur Reguler dan Prestasi tidak mensyaratkan hafalan. Hafalan hanya diperlukan untuk jalur Beasiswa Tahfidz." },
  { q: "Bagaimana jika ijazah belum keluar?", a: "Gunakan Surat Keterangan Lulus (SKL) sementara. Ijazah resmi dilengkapi saat registrasi ulang." },
  { q: "Apakah ada tes tulis masuk?", a: "Tidak. Jalur Reguler tidak ada tes tulis. Seleksi berdasarkan nilai rapor dan wawancara singkat via daring." },
  { q: "Bisakah mahasiswa pindah dari PTN/PTS lain?", a: "Ya, tersedia jalur Transfer dengan konversi SKS. Hubungi tim PMB untuk detailnya." },
  { q: "Berapa maksimal SKS per semester?", a: "Maks. 24 SKS, dengan syarat IPK semester sebelumnya ≥ 3.00." },
  { q: "Apakah tersedia asrama?", a: "Fasilitas asrama putra/putri sedang dikembangkan. Info lebih lanjut akan diumumkan via portal kampus." },
];

const kontak = [
  { icon: Sms, label: "Email PMB", nilai: "pmb@stibadamasa.ac.id" },
  { icon: Call, label: "WhatsApp PMB", nilai: "+62 812-3456-7890" },
  { icon: Location, label: "Alamat", nilai: "Jl. Ampel Suci No.1, Ampel, Semampir, Surabaya 60151" },
  { icon: Calendar, label: "Jam Layanan", nilai: "Senin–Jumat, 08.00–16.00 WIB" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors ${open ? "border-primary/30 bg-primary/5" : "border-[#ded8ca] bg-white/80"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-sm leading-snug">{q}</span>
        <span className={`mt-0.5 shrink-0 transition-transform ${open ? "rotate-45 text-primary" : "text-muted-foreground"}`}>
          {open ? <CloseCircle size={18} variant="Bulk" /> : <ArrowRight size={18} />}
        </span>
      </button>
      {open && (
        <div className="border-t border-[#ded8ca] px-5 py-4 text-sm leading-6 text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  );
}

export default function InformasiPMB() {
  useEffect(() => { trackEvent("public_info_pmb_view"); }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="bg-[#2f4f46] px-4 py-14 text-white">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <Badge className="rounded-full bg-white/20 text-white hover:bg-white/20">PMB 2026/2027</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Informasi PMB</h1>
            <p className="max-w-xl text-lg leading-7 text-white/80">
              Detail lengkap biaya pendidikan, jadwal penerimaan per gelombang, kontak PMB, dan pertanyaan umum calon mahasiswa.
            </p>
          </div>
          <div className="grid gap-2 text-sm">
            {[["Jadwal", "3 gelombang penerimaan"], ["Biaya", "Mulai Rp 3,5 jt/semester"], ["Kontak", "pmb@stibadamasa.ac.id"]].map(([l, v]) => (
              <div key={l} className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-2.5">
                <span className="w-14 shrink-0 text-white/60 text-xs">{l}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JADWAL */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <Badge variant="outline" className="rounded-full bg-white/70">Jadwal Penerimaan</Badge>
            <h2 className="mt-3 text-2xl font-bold">Gelombang Pendaftaran 2026</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pilih gelombang yang sesuai rencana studi Anda. Semua gelombang berakhir di tahun akademik yang sama.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {jadwal.map((j, i) => (
              <div key={j.gelombang} className={`rounded-3xl border-2 p-6 space-y-4 ${j.warna}`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide">{j.gelombang}</span>
                  <span className="text-2xl font-extrabold text-foreground/20">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pendaftaran</p>
                    <p className="text-sm font-semibold mt-0.5">{j.buka} — {j.tutup}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pengumuman Hasil</p>
                    <p className="text-sm font-semibold mt-0.5">{j.pengumuman}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Mulai Kuliah</p>
                    <p className="text-sm font-semibold mt-0.5">Agustus/September 2026</p>
                  </div>
                </div>
                <Link href="/pendaftaran">
                  <Button size="sm" variant="outline" className="w-full rounded-xl bg-white/60 text-xs mt-1">
                    Daftar {j.gelombang}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIAYA */}
      <section className="bg-[#e8e2d4] px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <Badge variant="outline" className="rounded-full bg-white/70">Biaya Pendidikan</Badge>
            <h2 className="mt-3 text-2xl font-bold">Rincian Biaya Kuliah</h2>
            <p className="mt-1 text-sm text-muted-foreground">Biaya dapat berubah sewaktu-waktu. Penerima beasiswa mendapat keringanan sesuai jenis beasiswa.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {biaya.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex gap-4 rounded-2xl border border-[#d8cfbd] bg-white p-5 shadow-sm">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon variant="Bulk" size={18} className="text-primary" />
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
          <div className="flex items-start gap-3 rounded-2xl bg-white/60 border border-[#d8cfbd] p-4">
            <InfoCircle variant="Bulk" size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-sm leading-6 text-muted-foreground">
              Pembayaran dapat dilakukan via transfer bank atau tunai di loket keuangan kampus. SPP dapat dicicil maks. 3× per semester dengan persetujuan BAK.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ + KONTAK */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* FAQ */}
          <div className="space-y-5">
            <div>
              <Badge variant="outline" className="rounded-full bg-white/70">FAQ</Badge>
              <h2 className="mt-3 text-2xl font-bold">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>

          {/* KONTAK */}
          <div className="space-y-5 lg:sticky lg:top-24">
            <div>
              <Badge variant="outline" className="rounded-full bg-white/70">Kontak PMB</Badge>
              <h2 className="mt-3 text-2xl font-bold">Hubungi Tim PMB</h2>
            </div>
            <div className="space-y-3">
              {kontak.map(({ icon: Icon, label, nilai }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-[#ded8ca] bg-white/80 p-4 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon variant="Bulk" size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-semibold text-sm">{nilai}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-[#2f4f46] p-5 text-white space-y-3">
              <div className="flex items-center gap-2">
                <MessageQuestion variant="Bulk" size={20} className="shrink-0" />
                <p className="font-semibold">Masih ada pertanyaan?</p>
              </div>
              <p className="text-sm text-white/75 leading-5">Tim PMB siap membantu Anda setiap hari kerja. Jangan ragu untuk menghubungi kami.</p>
              <Link href="/pendaftaran">
                <Button className="w-full rounded-xl bg-white text-[#2f4f46] hover:bg-white/90 mt-1">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-[#ded8ca] bg-white/80 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TickCircle variant="Bulk" size={16} className="text-primary" />
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
