import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  SignIn, List, XCircle, Envelope,
  Phone, MapPin, ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { contentBody, fallbackSiteSettings, type PublicContentItem, type SiteSettings } from "@/lib/site-content";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/pendaftaran", label: "Pendaftaran" },
  { href: "/program-studi", label: "Program Studi" },
  { href: "/beasiswa", label: "Beasiswa" },
  { href: "/galeri", label: "Galeri" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/informasi-pmb", label: "Info PMB" },
];

function PublicNavbar({ settings }: { settings: SiteSettings }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header className={`sticky top-0 z-40 border-b transition-all duration-200 ${scrolled ? "border-[#ded8ca] bg-[#f4f1ea]/96 backdrop-blur-xl shadow-sm" : "border-transparent bg-[#f4f1ea]/90 backdrop-blur-md"}`}>
      {/* TOP ROW */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="STIBADA MASA Beranda">
          <img src="/logo-stibada.png" alt="Logo STIBADA MASA" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-sm font-bold leading-tight tracking-tight">{settings.brandName || "STIBADA MASA"}</p>
            <p className="hidden text-[10px] leading-tight text-muted-foreground sm:block">{settings.tagline || "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah"}</p>
          </div>
        </Link>

        {/* DESKTOP NAV — lg+ */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                location === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/login" className="hidden lg:block">
            <Button size="sm" className="gap-2 rounded-xl">
              <SignIn size={16} weight="bold" />
              Masuk Portal
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors lg:hidden ${
              open
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-[#ded8ca] bg-white/70 text-muted-foreground hover:bg-white hover:text-foreground"
            }`}
          >
            {open ? <XCircle size={20} weight="duotone" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* TABLET NAV BAR — md to lg */}
      <div className="hidden border-t border-[#ded8ca] bg-[#f4f1ea]/80 md:block lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-none">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                location === link.href
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="ml-auto shrink-0">
            <Button size="sm" className="gap-1.5 rounded-lg text-xs h-7 px-3">
              <SignIn size={13} weight="bold" />
              Masuk
            </Button>
          </Link>
        </div>
      </div>

      {/* MOBILE DROPDOWN — below md */}
      {open && (
        <div className="border-t border-[#ded8ca] bg-[#f4f1ea] px-4 pb-5 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
                {link.label}
                <ArrowRight size={14} className="text-muted-foreground/40" />
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/login">
                <Button className="w-full gap-2 rounded-xl" size="sm">
                  <SignIn size={16} weight="bold" />
                  Masuk Portal Akademik
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function PublicFooter({ settings, content }: { settings: SiteSettings; content: PublicContentItem[] }) {
  return (
    <footer className="border-t border-[#ded8ca] bg-[#2f4f46] px-4 pt-12 pb-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 pb-10 border-b border-white/15 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo-stibada.png" alt="Logo STIBADA MASA" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-lg font-bold leading-tight">{settings.brandName || "STIBADA MASA"}</p>
                <p className="text-xs text-white/60 leading-snug">{settings.tagline || "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah"}<br />Masjid Agung Sunan Ampel</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-white/65 max-w-sm">{contentBody(content, "layout.footer", "Platform akademik modern untuk layanan belajar-mengajar, administrasi, komunikasi, dan penerimaan mahasiswa baru STIBADA MASA Surabaya.")}</p>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-white/90">Kontak & Informasi</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-white/65"><Envelope size={15} weight="duotone" className="mt-0.5 shrink-0" />{settings.contactEmail || "pmb@stibadamasa.ac.id"}</li>
              <li className="flex items-start gap-2 text-white/65"><Phone size={15} weight="duotone" className="mt-0.5 shrink-0" />{settings.contactPhone || "Senin–Jumat, 08.00–16.00 WIB"}</li>
              <li className="flex items-start gap-2 text-white/65"><MapPin size={15} weight="duotone" className="mt-0.5 shrink-0" />{settings.address || "Jl. Ampel Suci No.1, Ampel, Semampir, Surabaya"}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-white/90">Tautan Cepat</p>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
              <li><Link href="/login" className="text-white/65 hover:text-white transition-colors">Login Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} STIBADA MASA. Hak Cipta Dilindungi.</p>
          <p>{settings.footerNote || "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah — Masjid Agung Sunan Ampel, Surabaya"}</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings);
  const [content, setContent] = useState<PublicContentItem[]>([]);

  useEffect(() => {
    apiFetch<{ settings?: SiteSettings; content?: PublicContentItem[] }>("/public/landing").then((data) => {
      setSettings({ ...fallbackSiteSettings, ...(data.settings || {}) });
      setContent(data.content || []);
    }).catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-foreground">
      <PublicNavbar settings={settings} />
      <main>{children}</main>
      <PublicFooter settings={settings} content={content} />
    </div>
  );
}
