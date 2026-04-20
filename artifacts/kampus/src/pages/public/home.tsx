import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Book, Calendar, Gallery, Login, MedalStar, MessageQuestion, SecuritySafe, Teacher, WalletMoney, DirectboxNotif, UserOctagon } from "iconsax-react";
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

const images = {
  hero: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85",
  campus: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=85",
  admission: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=85",
  login: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
  programs: [
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85",
  ],
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
    <div className="min-h-screen bg-[#f4f1ea] text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#ded8ca] bg-[#f4f1ea]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#beranda" className="flex items-center gap-3" aria-label="STIBADA MASA Beranda">
            <div className="rounded-2xl bg-primary p-2.5 text-primary-foreground shadow-sm">
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
            <Link href="/login" className="font-semibold text-primary">Login/Masuk</Link>
          </nav>
          <Link href="/login">
            <Button className="gap-2 rounded-2xl shadow-sm">
              <Login size={18} />
              Login/Masuk
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section id="beranda" className="relative overflow-hidden px-4 py-14 sm:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(42,107,90,.16),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(153,125,89,.20),transparent_28%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-8">
              <Badge className="rounded-full px-4 py-2">PMB 2026/2027 sedang dibuka</Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                  Platform kampus modern untuk STIBADA MASA.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Portal akademik terpadu untuk informasi publik, pendaftaran daring, jadwal kuliah, KRS, nilai, absensi, diskusi, dan panel statistik pimpinan.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#pendaftaran"><Button size="lg" className="w-full rounded-2xl sm:w-auto">Daftar Sekarang</Button></a>
                <Link href="/login"><Button size="lg" variant="outline" className="w-full rounded-2xl border-primary/30 bg-white/70 sm:w-auto">Masuk Portal Akademik</Button></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[["KRS interaktif", "Mahasiswa"], ["Diskusi real-time", "Civitas"], ["Audit & keamanan", "Admin"]].map(([title, label]) => (
                  <div key={title} className="rounded-2xl border border-[#ded8ca] bg-white/70 px-4 py-3 text-sm shadow-sm">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={images.hero} alt="Gedung kampus modern STIBADA MASA" className="h-[520px] w-full rounded-[2.4rem] object-cover shadow-2xl" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-[1.7rem] border border-white/40 bg-white/84 p-4 shadow-xl backdrop-blur md:grid-cols-4">
                {[
                  ["Mahasiswa", "Jadwal, KRS, nilai"],
                  ["Dosen", "Nilai & absensi"],
                  ["Admin", "Kelola sistem"],
                  ["Rektor", "Statistik kampus"],
                ].map(([title, desc]) => (
                  <div key={title}>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <img src={images.campus} alt="Mahasiswa berdiskusi di area kampus" className="h-full min-h-[360px] rounded-[2rem] object-cover shadow-lg" loading="lazy" />
            <div className="grid gap-5 md:grid-cols-2">
              {profile.map((item) => (
                <Card key={item.id} className="rounded-3xl border-[#ded8ca] bg-white/78">
                  <CardHeader><CardTitle>{item.title}</CardTitle></CardHeader>
                  <CardContent className="text-muted-foreground">{item.content}</CardContent>
                </Card>
              ))}
              <Card className="rounded-3xl border-[#ded8ca] bg-white/78">
                <CardHeader><CardTitle className="flex items-center gap-2"><SecuritySafe variant="Bulk" /> Keamanan Portal</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground">Autentikasi berbasis peran, hash password, rate limiting, audit trail, dan opsi 2FA untuk admin/rektor.</CardContent>
              </Card>
              <Card className="rounded-3xl border-[#ded8ca] bg-white/78">
                <CardHeader><CardTitle className="flex items-center gap-2"><DirectboxNotif variant="Bulk" /> Notifikasi Instan</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground">Pengumuman, pesan diskusi, dan pembaruan status disiapkan untuk real-time notification.</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="pendaftaran" className="bg-[#e8e2d4] px-4 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <img src={images.admission} alt="Mahasiswa baru STIBADA MASA" className="h-64 w-full rounded-[2rem] object-cover shadow-lg" loading="lazy" />
              <Badge variant="outline" className="rounded-full bg-white/70">Informasi Pendaftaran</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">Proses PMB ringkas, transparan, dan dapat dipantau daring.</h2>
              <div className="grid gap-4">
                {[["Jadwal", data.admission.jadwal, Calendar], ["Biaya", data.admission.biaya, WalletMoney], ["Kontak PMB", data.admission.kontak, MessageQuestion]].map(([label, value, Icon]) => {
                  const IconComponent = Icon as typeof Calendar;
                  return (
                    <div key={label as string} className="flex gap-4 rounded-3xl bg-white/78 p-5 shadow-sm">
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
            <Card className="rounded-[2rem] border-[#d8cfbd] bg-white/86 shadow-xl">
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
              <div><Badge variant="outline" className="rounded-full bg-white/70">Program Studi</Badge><h2 className="mt-3 text-3xl font-bold">Kurikulum, profil dosen, dan prospek karir.</h2></div>
              <Teacher variant="Bulk" className="text-primary" size={42} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.programs.map((program, index) => (
                <Card key={program.id} className="overflow-hidden rounded-3xl border-[#ded8ca] bg-white/82 shadow-sm">
                  <img src={images.programs[index % images.programs.length]} alt={`Program studi ${program.nama}`} className="h-44 w-full object-cover" loading="lazy" />
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

        <section id="beasiswa" className="bg-[#ebe5d8] px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center gap-3"><MedalStar variant="Bulk" className="text-primary" /><h2 className="text-3xl font-bold">Beasiswa</h2></div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.scholarships.map((item) => (
                <Card key={item.id} className="rounded-3xl border-[#d8cfbd] bg-white/82 shadow-sm"><CardHeader><CardTitle>{item.nama}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>{item.kriteria}</p><p>{item.panduan}</p></CardContent></Card>
              ))}
            </div>
          </div>
        </section>

        <section id="galeri" className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center gap-3"><Gallery variant="Bulk" className="text-primary" /><h2 className="text-3xl font-bold">Dokumentasi & Galeri</h2></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.gallery.map((item, index) => (
                <div key={item.id} className="overflow-hidden rounded-3xl border border-[#ded8ca] bg-white/86 shadow-sm">
                  <img src={images.gallery[index % images.gallery.length]} alt={item.title} className="h-48 w-full object-cover" loading="lazy" />
                  <div className="p-5">
                    <Badge variant="secondary" className="rounded-full">{item.category}</Badge>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pengumuman" className="bg-primary/5 px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center gap-3"><DirectboxNotif variant="Bulk" className="text-primary" /><h2 className="text-3xl font-bold">Pengumuman Umum</h2></div>
            <div className="grid gap-5 md:grid-cols-2">
              {data.announcements.map((item) => (
                <Card key={item.id} className="rounded-3xl border-[#ded8ca] bg-white/84"><CardHeader><CardTitle>{item.title}</CardTitle></CardHeader><CardContent className="text-muted-foreground">{item.content}</CardContent></Card>
              ))}
            </div>
          </div>
        </section>

        <section id="login" className="px-4 py-16">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#ded8ca] bg-white/88 shadow-xl lg:grid-cols-[1fr_0.9fr]">
            <img src={images.login} alt="Portal login akademik STIBADA MASA" className="h-full min-h-[360px] w-full object-cover" loading="lazy" />
            <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
              <Badge className="w-fit rounded-full">Login/Masuk Portal</Badge>
              <div>
                <h2 className="text-3xl font-bold">Masuk sesuai peran Anda.</h2>
                <p className="mt-3 text-muted-foreground">Mahasiswa, dosen, admin, dan rektor menggunakan halaman login khusus sebelum masuk ke dashboard masing-masing.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Mahasiswa", "Dosen", "Admin", "Rektor"].map((role) => <div key={role} className="rounded-2xl bg-[#f4f1ea] p-4 font-semibold">{role}</div>)}
              </div>
              <Link href="/login"><Button size="lg" className="w-fit rounded-2xl gap-2"><UserOctagon size={20} /> Buka Halaman Login</Button></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ded8ca] bg-[#2f4f46] px-4 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold">STIBADA MASA</p>
            <p className="mt-2 text-sm text-white/72">Platform kampus modern untuk layanan akademik, administrasi, komunikasi, dan pendaftaran mahasiswa baru.</p>
          </div>
          <div>
            <p className="font-semibold">Kontak PMB</p>
            <p className="mt-2 text-sm text-white/72">pmb@stibadamasa.ac.id</p>
            <p className="text-sm text-white/72">Senin-Jumat, 08.00-16.00 WIB</p>
          </div>
          <div>
            <p className="font-semibold">Akses Cepat</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/72">
              <a href="#pendaftaran">Pendaftaran</a>
              <a href="#prodi">Program Studi</a>
              <Link href="/login">Login Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
