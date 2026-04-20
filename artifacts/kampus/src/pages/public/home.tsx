import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Book, Calendar, Gallery, Global, Login, MedalStar, MessageQuestion, SecuritySafe, Teacher, WalletMoney } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch, trackEvent } from "@/lib/api";
import { toast } from "sonner";

type LandingData = {
  content: { id: string; key: string; type: string; title: string; content: string }[];
  announcements: { id: string; title: string; content: string; createdAt: string }[];
  programs: { id: string; kode: string; nama: string; kurikulum: string[]; dosen: string; prospek: string[] }[];
  scholarships: { id: string; nama: string; kriteria: string; panduan: string }[];
  gallery: { id: string; title: string; category: string; description: string }[];
  admission: { biaya: string; kontak: string; jadwal: string };
};

const fallback: LandingData = {
  content: [
    { id: "visi", key: "visi", type: "profile", title: "Visi STIBADA MASA", content: "Menjadi kampus yang membentuk insan akademik beradab, adaptif, dan berdampak." },
  ],
  announcements: [],
  programs: [],
  scholarships: [],
  gallery: [],
  admission: { biaya: "Mulai Rp 3.500.000 per semester", kontak: "pmb@stibadamasa.ac.id", jadwal: "Januari-Agustus 2026" },
};

export default function Home() {
  const [data, setData] = useState<LandingData>(fallback);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", telepon: "", program: "Pendidikan Agama Islam", jalur: "reguler", pesan: "" });

  useEffect(() => {
    trackEvent("public_home_view");
    apiFetch<LandingData>("/public/landing").then(setData).catch(() => undefined);
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}/api/ws`);
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "announcement.created") toast.info("Pengumuman baru tersedia");
    };
    return () => ws.close();
  }, []);

  const profile = useMemo(() => data.content.filter((item) => item.type === "profile"), [data.content]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/public/applications", { method: "POST", body: JSON.stringify(form) });
      toast.success("Formulir pendaftaran terkirim. Tim PMB akan menghubungi Anda.");
      setForm({ nama: "", email: "", telepon: "", program: form.program, jalur: "reguler", pesan: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengirim formulir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#beranda" className="flex items-center gap-3" aria-label="STIBADA MASA Beranda">
            <div className="rounded-2xl bg-primary p-2.5 text-primary-foreground">
              <Book size={28} variant="Bulk" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">STIBADA MASA</p>
              <p className="text-xs text-muted-foreground">Sistem Kampus Terpadu</p>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex" aria-label="Navigasi publik">
            <a href="#pendaftaran">Pendaftaran</a>
            <a href="#prodi">Program Studi</a>
            <a href="#beasiswa">Beasiswa</a>
            <a href="#galeri">Galeri</a>
            <a href="#pengumuman">Pengumuman</a>
          </nav>
          <Link href="/login">
            <Button className="gap-2 rounded-2xl">
              <Login size={18} />
              Masuk Portal
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section id="beranda" className="relative overflow-hidden px-4 py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.16),transparent_28%),radial-gradient(circle_at_90%_20%,hsl(28_38%_62%/0.18),transparent_26%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <Badge className="rounded-full px-4 py-2">PMB 2026/2027 sedang dibuka</Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                  Platform kampus modern untuk belajar, administrasi, dan komunikasi STIBADA MASA.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Satu portal untuk informasi publik, pendaftaran daring, pengelolaan akademik, dashboard mahasiswa, dosen, admin, dan rektor.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#pendaftaran">
                  <Button size="lg" className="w-full rounded-2xl sm:w-auto">Daftar Sekarang</Button>
                </a>
                <a href="#prodi">
                  <Button size="lg" variant="outline" className="w-full rounded-2xl sm:w-auto">Lihat Program Studi</Button>
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["KRS interaktif", "Diskusi real-time", "Audit & keamanan"].map((item) => (
                  <div key={item} className="rounded-2xl border bg-card/70 px-4 py-3 text-sm font-medium shadow-sm">{item}</div>
                ))}
              </div>
            </div>
            <Card className="rounded-[2rem] border-primary/10 bg-card/82 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl"><Global variant="Bulk" /> Ekosistem Digital Kampus</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {[
                  ["Mahasiswa", "Jadwal, KRS, nilai, absensi, diskusi"],
                  ["Dosen", "Input nilai, absensi kelas, diskusi akademik"],
                  ["Admin", "Kelola konten, pengguna, prodi, jadwal, izin"],
                  ["Rektor", "Statistik komprehensif dan tren akademik"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-3xl bg-muted/60 p-5">
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {profile.map((item) => (
              <Card key={item.id} className="rounded-3xl">
                <CardHeader><CardTitle>{item.title}</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground">{item.content}</CardContent>
              </Card>
            ))}
            <Card className="rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><SecuritySafe variant="Bulk" /> Keamanan</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">Autentikasi berbasis peran, hash password, CSP, rate limiting, audit trail, dan opsi 2FA untuk admin/rektor.</CardContent>
            </Card>
          </div>
        </section>

        <section id="pendaftaran" className="bg-muted/40 px-4 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <Badge variant="outline" className="rounded-full">Informasi Pendaftaran</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">Proses PMB ringkas, transparan, dan dapat dipantau daring.</h2>
              <div className="grid gap-4">
                {[["Jadwal", data.admission.jadwal, Calendar], ["Biaya", data.admission.biaya, WalletMoney], ["Kontak PMB", data.admission.kontak, MessageQuestion]].map(([label, value, Icon]) => {
                  const IconComponent = Icon as typeof Calendar;
                  return (
                    <div key={label as string} className="flex gap-4 rounded-3xl bg-background p-5">
                      <IconComponent variant="Bulk" className="text-primary" />
                      <div>
                        <p className="font-semibold">{label as string}</p>
                        <p className="text-sm text-muted-foreground">{value as string}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Card className="rounded-[2rem]">
              <CardHeader><CardTitle>Formulir Pendaftaran Daring</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={submit} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="nama">Nama Lengkap</Label><Input id="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
                    <div className="space-y-2"><Label htmlFor="telepon">Telepon</Label><Input id="telepon" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="program">Program Pilihan</Label><Input id="program" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} required /></div>
                    <div className="space-y-2"><Label htmlFor="jalur">Jalur</Label><Input id="jalur" value={form.jalur} onChange={(e) => setForm({ ...form, jalur: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="pesan">Catatan</Label><Textarea id="pesan" value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} /></div>
                  <Button disabled={loading} className="rounded-2xl">{loading ? "Mengirim..." : "Kirim Formulir"}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="prodi" className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><Badge variant="outline" className="rounded-full">Program Studi</Badge><h2 className="mt-3 text-3xl font-bold">Kurikulum, dosen pengampu, dan prospek karir.</h2></div>
              <Teacher variant="Bulk" className="text-primary" size={42} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.programs.map((program) => (
                <Card key={program.id} className="rounded-3xl">
                  <CardHeader><CardTitle>{program.nama}</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">Dosen pengampu: {program.dosen}</p>
                    <div><p className="font-semibold">Kurikulum inti</p><p className="text-muted-foreground">{program.kurikulum.join(", ")}</p></div>
                    <div><p className="font-semibold">Prospek karir</p><p className="text-muted-foreground">{program.prospek.join(", ")}</p></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="beasiswa" className="bg-muted/40 px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center gap-3"><MedalStar variant="Bulk" className="text-primary" /><h2 className="text-3xl font-bold">Beasiswa</h2></div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.scholarships.map((item) => (
                <Card key={item.id} className="rounded-3xl"><CardHeader><CardTitle>{item.nama}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>{item.kriteria}</p><p>{item.panduan}</p></CardContent></Card>
              ))}
            </div>
          </div>
        </section>

        <section id="galeri" className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center gap-3"><Gallery variant="Bulk" className="text-primary" /><h2 className="text-3xl font-bold">Dokumentasi & Galeri</h2></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.gallery.map((item) => (
                <div key={item.id} className="rounded-3xl border bg-card p-5 shadow-sm">
                  <Badge variant="secondary" className="rounded-full">{item.category}</Badge>
                  <h3 className="mt-8 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pengumuman" className="bg-primary/5 px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <h2 className="text-3xl font-bold">Pengumuman Umum</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {data.announcements.map((item) => (
                <Card key={item.id} className="rounded-3xl"><CardHeader><CardTitle>{item.title}</CardTitle></CardHeader><CardContent className="text-muted-foreground">{item.content}</CardContent></Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>STIBADA MASA - Platform kampus full-stack</p>
          <p>API: /api/docs · WebSocket: /api/ws · HTTPS wajib saat publish</p>
        </div>
      </footer>
    </div>
  );
}