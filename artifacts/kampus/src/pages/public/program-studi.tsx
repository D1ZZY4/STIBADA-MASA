import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentImage, contentTitle, fallbackImages, type PublicContentItem } from "@/lib/site-content";
import { ChalkboardTeacher, MagnifyingGlass, BookOpen, Briefcase, UsersThree } from "@phosphor-icons/react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Program = { id: string; kode: string; nama: string; kurikulum: string[]; dosen: string; prospek: string[] };

const fallbackPrograms: Program[] = [
  { id: "1", kode: "PAI", nama: "Pendidikan Agama Islam", kurikulum: ["Studi Al-Qur'an & Tafsir", "Hadits & Ilmu Hadits", "Fiqh & Ushul Fiqh", "Metodologi Pembelajaran PAI", "Teknologi Pendidikan"], dosen: "Dr. Arif Setiawan, M.T.", prospek: ["Guru PAI", "Konsultan Pendidikan", "Pengembang Kurikulum", "Peneliti Pendidikan Islam"] },
  { id: "2", kode: "ES", nama: "Ekonomi Syariah", kurikulum: ["Fiqh Muamalah Kontemporer", "Keuangan Islam & Perbankan Syariah", "Kewirausahaan & UMKM", "Ekonomi Makro Islam", "Keuangan Digital Syariah"], dosen: "Prof. Siti Rahayu, Ph.D.", prospek: ["Analis Keuangan Syariah", "Wirausahawan Muslim", "Konsultan UMKM", "Staf Perbankan Syariah"] },
  { id: "3", kode: "KPI", nama: "Komunikasi dan Penyiaran Islam", kurikulum: ["Produksi Media Dakwah", "Public Speaking & Retorika", "Jurnalisme Digital", "Desain Komunikasi Visual", "Manajemen Media Islam"], dosen: "Dr. Budi Santoso, M.M.", prospek: ["Jurnalis & Reporter", "Content Creator Islami", "Humas Lembaga", "Penyiar Radio/TV"] },
];

const images = [
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
];

export default function ProgramStudi() {
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);
  const [content, setContent] = useState<PublicContentItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    trackEvent("public_prodi_view");
    apiFetch<{ programs: Program[]; content: PublicContentItem[] }>("/public/landing").then((d) => {
      if (d.programs?.length) setPrograms(d.programs);
      setContent(d.content || []);
    }).catch(() => undefined);
  }, []);

  const filtered = programs.filter((p) => p.nama.toLowerCase().includes(query.toLowerCase()) || p.kode.toLowerCase().includes(query.toLowerCase()));

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-[#2f4f46] px-4 py-16 text-white">
        <div className="relative mx-auto max-w-7xl">
          <Badge className="mb-4 rounded-full bg-white/20 text-white hover:bg-white/20">Akademik</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{contentTitle(content, "program-studi.hero", "Program Studi")}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">{contentBody(content, "program-studi.hero", "Pilih program studi yang sesuai dengan minat, bakat, dan tujuan karir Anda.")}</p>
          <div className="mt-6 flex max-w-md items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <MagnifyingGlass size={18} className="text-white/60 shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari program studi..." className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none" />
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Program studi tidak ditemukan.</p>
          ) : (
            <div className="grid gap-8">
              {filtered.map((program, index) => (
                <div key={program.id} className="overflow-hidden rounded-[2rem] border border-[#ded8ca] bg-white shadow-sm">
                  <div className="grid lg:grid-cols-[380px_1fr]">
                    <div className="relative">
                      <img src={(program as Program & { image?: string }).image || contentImage(content, `program-studi.card.${index + 1}`, images[index % images.length] || fallbackImages.programs[index % fallbackImages.programs.length])} alt={program.nama} className="h-56 w-full object-cover lg:h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className="rounded-full bg-white/90 text-foreground font-bold">{program.kode}</Badge>
                      </div>
                    </div>
                    <div className="p-7 space-y-5">
                      <div>
                        <h2 className="text-2xl font-bold">{program.nama}</h2>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <UsersThree size={16} weight="duotone" className="text-primary" />
                          <span>Dosen Pengampu: <span className="font-medium text-foreground">{program.dosen}</span></span>
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <div className="flex items-center gap-2 mb-3"><BookOpen size={18} weight="duotone" className="text-primary" /><p className="font-semibold text-sm">Kurikulum Inti</p></div>
                          <ul className="space-y-1.5">
                            {program.kurikulum.map((k) => (
                              <li key={k} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />{k}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3"><Briefcase size={18} weight="duotone" className="text-primary" /><p className="font-semibold text-sm">Prospek Karir</p></div>
                          <div className="flex flex-wrap gap-2">
                            {program.prospek.map((p) => (
                              <Badge key={p} variant="secondary" className="rounded-full text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Link href="/pendaftaran">
                        <Button className="rounded-2xl gap-2" size="sm">
                          <ChalkboardTeacher size={16} weight="duotone" />
                          Daftar ke Prodi Ini
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#2f4f46] px-4 py-14 text-white">
        <div className="mx-auto max-w-7xl text-center space-y-4">
          <h2 className="text-2xl font-bold">Siap Bergabung?</h2>
          <p className="text-white/75 max-w-lg mx-auto">Daftarkan diri sekarang dan mulai perjalanan akademikmu di STIBADA MASA Surabaya.</p>
          <Link href="/pendaftaran">
            <Button size="lg" className="rounded-2xl bg-white text-[#2f4f46] hover:bg-white/90 mt-2">Mulai Pendaftaran</Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
