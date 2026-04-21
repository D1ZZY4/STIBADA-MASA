export type PublicContentItem = {
  id: string;
  key: string;
  page?: string;
  section?: string;
  type: string;
  title: string;
  content: string;
  image?: string;
  status?: string;
  order?: number;
};

export type SiteSettings = {
  id?: string;
  brandName?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  admissionFee?: string;
  admissionSchedule?: string;
  footerNote?: string;
  layoutMode?: string;
};

export type LandingData = {
  content: PublicContentItem[];
  announcements: { id: string; title: string; content: string; createdAt: string; category?: string; image?: string }[];
  programs: { id: string; kode: string; nama: string; kurikulum: string[]; dosen: string; prospek: string[]; image?: string }[];
  scholarships: { id: string; nama: string; kriteria: string; panduan: string; image?: string }[];
  gallery: { id: string; title: string; category: string; description: string; image?: string }[];
  admission: { biaya: string; kontak: string; jadwal: string };
  settings?: SiteSettings;
};

export const fallbackSiteSettings: SiteSettings = {
  brandName: "STIBADA MASA",
  tagline: "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel",
  contactEmail: "humas@stibada.ac.id",
  contactPhone: "081234502771 · Senin–Kamis 08.00–16.00",
  address: "Jl. Ampel Masjid No.53, Ampel, Kec. Semampir, Kota Surabaya, Jawa Timur 60151",
  admissionFee: "Terjangkau, terintegrasi sistem PMB online",
  admissionSchedule: "Gelombang 1: Januari–Maret · Gelombang 2: April–Juni · Gelombang 3: Juli–Agustus",
  footerNote: "Terakreditasi BAN-PT (Sertifikat 2022–2027) · Terintegrasi PMB & SIAKAD",
  layoutMode: "modern",
};

export const fallbackImages = {
  hero: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85",
  campus: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=85",
  portal: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
  announcement: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  registrationForm: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=85",
  programs: [
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  ],
  scholarships: [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=85",
  ],
};

export function findContent(content: PublicContentItem[] = [], key: string) {
  return content.find((item) => item.key === key && item.status !== "draft");
}

export function contentTitle(content: PublicContentItem[] = [], key: string, fallback: string) {
  return findContent(content, key)?.title || fallback;
}

export function contentBody(content: PublicContentItem[] = [], key: string, fallback: string) {
  return findContent(content, key)?.content || fallback;
}

export function contentImage(content: PublicContentItem[] = [], key: string, fallback: string) {
  return findContent(content, key)?.image || fallback;
}
