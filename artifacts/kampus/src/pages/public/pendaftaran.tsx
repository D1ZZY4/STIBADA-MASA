import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentImage, contentTitle, fallbackImages, type PublicContentItem, type SiteSettings } from "@/lib/site-content";
import { toast } from "sonner";
import {
  CalendarBlank, Wallet, ChatCircleDots, FileText,
  CheckCircle, Phone,
} from "@phosphor-icons/react";

const steps = [
  { no: "01", title: "Isi Formulir Daring", desc: "Lengkapi data diri, pilih program studi, dan jalur pendaftaran yang diinginkan." },
  { no: "02", title: "Verifikasi Tim PMB", desc: "Tim PMB akan menghubungi Anda dalam 1–2 hari kerja melalui email atau WhatsApp." },
  { no: "03", title: "Seleksi & Dokumen", desc: "Ikuti proses seleksi dan lengkapi berkas dokumen persyaratan yang diminta." },
  { no: "04", title: "Registrasi & Pembayaran", desc: "Selesaikan registrasi, pembayaran biaya awal, dan aktivasi akun portal akademik." },
];

const requirements = [
  "Foto copy ijazah SMA/MA/SMK sederajat (dilegalisir)",
  "Foto copy transkrip/rapor terakhir",
  "Foto copy KTP/KK (2 lembar)",
  "Pas foto 3×4 latar biru (4 lembar)",
  "Surat keterangan sehat dari dokter",
  "Surat rekomendasi dari kepala sekolah (opsional)",
  "Sertifikat prestasi akademik/non-akademik (jika ada)",
];

const jalurOptions = [
  { label: "Reguler", desc: "Jalur umum terbuka untuk semua calon mahasiswa baru." },
  { label: "Prestasi", desc: "Berdasarkan nilai rapor/ujian tinggi atau kejuaraan nasional/internasional." },
  { label: "Tahfidz", desc: "Khusus bagi yang telah menghafal minimal 5 juz Al-Qur'an." },
  { label: "Transfer", desc: "Perpindahan dari perguruan tinggi lain dengan konversi SKS." },
];

const selectClass = [
  "flex h-10 w-full rounded-xl border border-input bg-background/60 px-3 py-1.5 text-sm shadow-sm",
  "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  "dark:bg-background/40 disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export default function Pendaftaran() {
  const [form, setForm] = useState({ nama: "", email: "", telepon: "", program: "Pendidikan Agama Islam", jalur: "Reguler", pesan: "" });
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<PublicContentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    trackEvent("public_pendaftaran_view");
    apiFetch<{ content: PublicContentItem[]; settings?: SiteSettings }>("/public/landing").then((data) => {
      setContent(data.content || []);
      setSettings(data.settings || {});
    }).catch(() => undefined);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/public/applications", { method: "POST", body: JSON.stringify(form) });
      toast.success("Formulir berhasil dikirim. Tim PMB akan segera menghubungi Anda.");
      setForm({ nama: "", email: "", telepon: "", program: form.program, jalur: form.jalur, pesan: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim formulir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-primary px-4 py-16 text-primary-foreground">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl">
          <Badge className="mb-4 rounded-full border-white/20 bg-white/15 text-white hover:bg-white/15">PMB 2026/2027</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {contentTitle(content, "pendaftaran.hero", "Pendaftaran Mahasiswa Baru")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            {contentBody(content, "pendaftaran.hero", "Mulai perjalanan akademikmu di STIBADA MASA. Proses pendaftaran mudah, transparan, dan dapat dipantau secara daring.")}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {([
              ["Jadwal", settings.admissionSchedule || "Jan–Agustus 2026", CalendarBlank],
              ["Biaya", settings.admissionFee || "Mulai Rp 3.500.000/sem", Wallet],
              ["Kontak", settings.contactEmail || "pmb@stibadamasa.ac.id", ChatCircleDots],
            ] as const).map(([label, val, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-sm">
                <Icon size={18} weight="duotone" className="shrink-0 text-white/70" />
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{label}</p>
                  <p className="font-semibold text-sm mt-0.5">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 LANGKAH ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-3">
          <Badge variant="outline" className="rounded-full bg-card/80">Alur Pendaftaran</Badge>
          <h2 className="text-2xl font-bold">4 Langkah Mudah Mendaftar</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.no} className="group relative rounded-3xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-200">
                <span className="text-3xl font-extrabold text-primary/20 group-hover:text-primary/30 transition-colors">{s.no}</span>
                <p className="mt-3 font-semibold text-sm">{s.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JALUR + FORM ── */}
      <section className="bg-muted/40 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

            {/* Left — info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="rounded-full bg-card/80">Jalur Penerimaan</Badge>
                <h2 className="mt-3 text-2xl font-bold">Pilih Jalur yang Sesuai</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {jalurOptions.map((j) => (
                  <div key={j.label} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle size={15} weight="duotone" className="text-primary shrink-0" />
                      <p className="font-semibold text-sm">{j.label}</p>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">{j.desc}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} weight="duotone" className="text-primary" />
                  <p className="font-semibold text-sm">Persyaratan Dokumen</p>
                </div>
                <ul className="space-y-2">
                  {requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-primary/8 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={16} weight="duotone" className="text-primary" />
                  <p className="font-semibold text-sm">Butuh Bantuan?</p>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  {contentBody(content, "pendaftaran.help", `Hubungi tim PMB melalui ${settings.contactEmail || "pmb@stibadamasa.ac.id"} atau datang ke kantor PMB Senin–Jumat 08.00–16.00 WIB.`)}
                </p>
              </div>
            </div>

            {/* Right — form card */}
            <Card id="formulir" className="overflow-hidden rounded-[2rem] border-border/60 bg-card shadow-xl">
              <div className="relative">
                <img
                  src={contentImage(content, "pendaftaran.form", fallbackImages.registrationForm)}
                  alt="Formulir Pendaftaran"
                  className="h-40 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <p className="text-base font-bold">{contentTitle(content, "pendaftaran.form", "Formulir Pendaftaran Daring")}</p>
                  <p className="text-xs text-white/70">{contentBody(content, "pendaftaran.form", "Isi dengan data yang benar dan lengkap")}</p>
                </div>
              </div>
              <CardContent className="pt-6 pb-7">
                <form onSubmit={submit} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-xs font-semibold">Nama Lengkap *</Label>
                      <Input id="nama" placeholder="Nama sesuai KTP" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required className="h-10 rounded-xl bg-background/60 dark:bg-background/40" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon" className="text-xs font-semibold">WhatsApp *</Label>
                      <Input id="telepon" placeholder="08xxxxxxxxxx" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} required className="h-10 rounded-xl bg-background/60 dark:bg-background/40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold">Email Aktif *</Label>
                    <Input id="email" type="email" placeholder="nama@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="h-10 rounded-xl bg-background/60 dark:bg-background/40" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="program" className="text-xs font-semibold">Program Studi *</Label>
                      <select id="program" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className={selectClass}>
                        <option>Pendidikan Agama Islam</option>
                        <option>Ekonomi Syariah</option>
                        <option>Komunikasi dan Penyiaran Islam</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jalur" className="text-xs font-semibold">Jalur Pendaftaran</Label>
                      <select id="jalur" value={form.jalur} onChange={(e) => setForm({ ...form, jalur: e.target.value })} className={selectClass}>
                        <option>Reguler</option>
                        <option>Prestasi</option>
                        <option>Tahfidz</option>
                        <option>Transfer</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pesan" className="text-xs font-semibold">Catatan / Pertanyaan</Label>
                    <Textarea id="pesan" placeholder="Tulis pertanyaan atau catatan jika ada..." rows={3} value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} className="rounded-xl bg-background/60 dark:bg-background/40 resize-none" />
                  </div>
                  <Button disabled={loading} className="w-full rounded-2xl h-11 font-semibold" size="lg">
                    {loading ? "Mengirim..." : "Kirim Formulir Pendaftaran"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">Data Anda aman dan hanya digunakan untuk keperluan pendaftaran.</p>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
