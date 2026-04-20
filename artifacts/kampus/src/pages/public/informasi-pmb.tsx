import { useEffect } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEvent } from "@/lib/api";
import { Calendar, WalletMoney, MessageQuestion, TickCircle, DocumentText, Call, Sms, Location, InfoCircle } from "iconsax-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const biayaData = [
  { label: "Biaya Pendaftaran", nilai: "Rp 250.000", ket: "Dibayarkan saat submit formulir (tidak dapat dikembalikan)" },
  { label: "Uang Pangkal (UP)", nilai: "Rp 3.000.000", ket: "Dibayarkan sekali saat dinyatakan diterima" },
  { label: "SPP per Semester", nilai: "Rp 3.500.000", ket: "Dapat dicicil maksimal 3 kali per semester" },
  { label: "Biaya SKS", nilai: "Rp 150.000/SKS", ket: "Dibayarkan setiap awal semester bersamaan KRS" },
  { label: "Biaya Praktikum", nilai: "Rp 500.000/sem", ket: "Untuk mata kuliah yang memiliki komponen praktikum" },
];

const jadwal = [
  { gelombang: "Gelombang 1", buka: "1 Januari 2026", tutup: "31 Maret 2026", pengumuman: "10 April 2026", mulai: "Agustus 2026" },
  { gelombang: "Gelombang 2", buka: "1 April 2026", tutup: "30 Juni 2026", pengumuman: "10 Juli 2026", mulai: "Agustus 2026" },
  { gelombang: "Gelombang 3", buka: "1 Juli 2026", tutup: "31 Agustus 2026", pengumuman: "5 September 2026", mulai: "September 2026" },
];

const faqs = [
  { q: "Apakah bisa mendaftar tanpa hafalan Al-Qur'an?", a: "Ya, jalur Reguler dan Prestasi tidak mensyaratkan hafalan. Hafalan hanya diperlukan untuk jalur Beasiswa Tahfidz." },
  { q: "Bagaimana jika ijazah belum keluar saat pendaftaran?", a: "Anda dapat menggunakan Surat Keterangan Lulus (SKL) sementara, dan melengkapi ijazah resmi saat registrasi ulang." },
  { q: "Apakah ada tes masuk?", a: "Jalur Reguler tidak mengadakan tes tulis. Seleksi dilakukan berdasarkan nilai rapor dan wawancara singkat via daring." },
  { q: "Bisakah mahasiswa transfer dari PTN/PTS lain?", a: "Ya, tersedia jalur Transfer dengan proses konversi SKS. Silakan hubungi tim PMB untuk informasi lebih lanjut." },
  { q: "Berapa maksimal SKS yang bisa diambil per semester?", a: "Maksimal 24 SKS per semester, dengan syarat IPK semester sebelumnya ≥ 3.00." },
  { q: "Apakah ada asrama mahasiswa?", a: "Saat ini STIBADA MASA sedang mengembangkan fasilitas asrama putra/putri. Informasi lebih lanjut akan diumumkan melalui portal kampus." },
];

export default function InformasiPMB() {
  useEffect(() => { trackEvent("public_info_pmb_view"); }, []);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-[#2f4f46] px-4 py-16 text-white">
        <div className="relative mx-auto max-w-7xl">
          <Badge className="mb-4 rounded-full bg-white/20 text-white hover:bg-white/20">Penerimaan Mahasiswa Baru</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Informasi PMB</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">Detail prosedur, biaya, jadwal, dan kontak resmi Penerimaan Mahasiswa Baru STIBADA MASA 2026/2027.</p>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <div><Badge variant="outline" className="rounded-full bg-white/70">Jadwal</Badge><h2 className="mt-3 text-2xl font-bold">Jadwal Penerimaan per Gelombang</h2></div>
          <div className="overflow-x-auto rounded-3xl border border-[#ded8ca] bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f4f1ea] text-muted-foreground">
                <tr>
                  {["Gelombang", "Pendaftaran Dibuka", "Pendaftaran Ditutup", "Pengumuman", "Mulai Kuliah"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jadwal.map((j, i) => (
                  <tr key={j.gelombang} className={i % 2 === 0 ? "" : "bg-[#f9f8f6]"}>
                    <td className="px-5 py-3.5 font-semibold text-primary">{j.gelombang}</td>
                    <td className="px-5 py-3.5">{j.buka}</td>
                    <td className="px-5 py-3.5">{j.tutup}</td>
                    <td className="px-5 py-3.5">{j.pengumuman}</td>
                    <td className="px-5 py-3.5">{j.mulai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#e8e2d4] px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <div><Badge variant="outline" className="rounded-full bg-white/70">Biaya Kuliah</Badge><h2 className="mt-3 text-2xl font-bold">Rincian Biaya Pendidikan</h2></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {biayaData.map((b) => (
              <div key={b.label} className="rounded-2xl border border-[#d8cfbd] bg-white/80 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 shrink-0"><WalletMoney variant="Bulk" size={18} className="text-primary" /></div>
                  <div>
                    <p className="font-semibold text-sm">{b.label}</p>
                    <p className="text-xl font-bold text-primary mt-0.5">{b.nilai}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-5">{b.ket}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-primary/8 border border-primary/15 p-5">
            <InfoCircle variant="Bulk" size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-sm leading-6 text-muted-foreground">Biaya di atas dapat berubah sewaktu-waktu. Penerima beasiswa mendapat keringanan sesuai jenis beasiswa yang diterima. Pembayaran dapat dilakukan melalui transfer bank atau tunai di loket keuangan kampus.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <div><Badge variant="outline" className="rounded-full bg-white/70">FAQ</Badge><h2 className="mt-3 text-2xl font-bold">Pertanyaan yang Sering Diajukan</h2></div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-[#ded8ca] bg-white/80 shadow-sm overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-semibold text-sm list-none">
                    {faq.q}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform text-lg leading-none">↓</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm leading-6 text-muted-foreground border-t border-[#ded8ca] pt-3">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div><Badge variant="outline" className="rounded-full bg-white/70">Kontak PMB</Badge><h2 className="mt-3 text-2xl font-bold">Hubungi Kami</h2></div>
            <div className="space-y-4">
              {[
                { icon: Sms, label: "Email PMB", val: "pmb@stibadamasa.ac.id" },
                { icon: Call, label: "WhatsApp PMB", val: "+62 812-3456-7890" },
                { icon: Location, label: "Alamat", val: "Jl. Ampel Suci No.1, Ampel, Semampir, Surabaya 60151" },
                { icon: Calendar, label: "Jam Layanan", val: "Senin–Jumat, 08.00–16.00 WIB" },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-[#ded8ca] bg-white/80 p-4 shadow-sm">
                  <div className="rounded-xl bg-primary/10 p-2.5 shrink-0"><Icon variant="Bulk" size={18} className="text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold text-sm mt-0.5">{val}</p></div>
                </div>
              ))}
            </div>
            <Link href="/pendaftaran">
              <Button size="lg" className="w-full rounded-2xl">Daftar Sekarang</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
