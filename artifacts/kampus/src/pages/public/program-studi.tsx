import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, trackEvent } from "@/lib/api";
import { contentBody, contentImage, contentTitle, fallbackImages, type PublicContentItem } from "@/lib/site-content";
import { ChalkboardTeacher, MagnifyingGlass, BookOpen, Briefcase, UsersThree } from "@phosphor-icons/react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Program = { id: string; kode: string; nama: string; kurikulum: string[]; dosen: string; prospek: string[]; image?: string };

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
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#2f4f46] dark:bg-[#192e28] px-4 py-20 text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#1a3229]/60 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <Badge className="mb-4 rounded-full border-white/20 bg-white/15 text-white hover:bg-white/15">Akademik</Badge>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {contentTitle(content, "program-studi.hero", "Program Studi")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            {contentBody(content, "program-studi.hero", "Pilih program studi yang sesuai dengan minat, bakat, dan tujuan karir Anda.")}
          </p>
          {/* Search */}
          <div className="mt-7 flex max-w-sm items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <MagnifyingGlass size={16} className="text-white/60 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari program studi..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>
      </section>

      {/* ── PROGRAMS LIST ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Program studi tidak ditemukan.</p>
          ) : (
            <div className="grid gap-7">
              {filtered.map((program, index) => (
                <div key={program.id} className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="grid lg:grid-cols-[380px_1fr]">
                    <div className="relative">
                      <img
                        src={program.image || contentImage(content, `program-studi.card.${index + 1}`, images[index % images.length] || fallbackImages.programs[index % fallbackImages.programs.length])}
                        alt={program.nama}
                        className="h-60 w-full object-cover lg:h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r" />
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm border border-white/20">{program.kode}</span>
                      </div>
                    </div>
                    <div className="p-7 space-y-5">
                      <div>
                        <h2 className="text-xl font-bold leading-tight">{program.nama}</h2>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <UsersThree size={14} weight="duotone" className="text-primary shrink-0" />
                          <span>Dosen Pengampu: <span className="font-medium text-foreground">{program.dosen}</span></span>
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={15} weight="duotone" className="text-primary" />
                            <p className="font-semibold text-xs uppercase tracking-wide">Kurikulum Inti</p>
                          </div>
                          <ul className="space-y-1.5">
                            {program.kurikulum.map((k) => (
                              <li key={k} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />{k}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase size={15} weight="duotone" className="text-primary" />
                            <p className="font-semibold text-xs uppercase tracking-wide">Prospek Karir</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {program.prospek.map((p) => (
                              <Badge key={p} variant="secondary" className="rounded-full text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Link href="/pendaftaran">
                        <Button className="rounded-2xl gap-2" size="sm">
                          <ChalkboardTeacher size={15} weight="duotone" />
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

      {/* ── CTA ── */}
      <section className="bg-[#2f4f46] dark:bg-[#192e28] px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center space-y-5">
          <Badge className="rounded-full border-white/20 bg-white/15 text-white hover:bg-white/15">Bergabung Sekarang</Badge>
          <h2 className="text-2xl font-extrabold tracking-tight">Siap Memulai Perjalanan Akademikmu?</h2>
          <p className="text-white/70 text-sm max-w-lg mx-auto leading-6">
            Daftarkan diri sekarang dan jadilah bagian dari civitas akademika STIBADA MASA Surabaya.
          </p>
          <Link href="/pendaftaran">
            <Button size="lg" className="rounded-2xl bg-white text-[#1f3f37] hover:bg-white/90 gap-2 mt-1">
              <ChalkboardTeacher size={18} weight="duotone" />
              Mulai Pendaftaran
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
