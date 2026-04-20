import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  SignIn, List, X, Envelope,
  Phone, MapPin, ArrowRight,
} from "@phosphor-icons/react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { contentBody, fallbackSiteSettings, type PublicContentItem, type SiteSettings } from "@/lib/site-content";
import { useTheme } from "@/components/theme-provider";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/pendaftaran", label: "Pendaftaran" },
  { href: "/program-studi", label: "Program Studi" },
  { href: "/beasiswa", label: "Beasiswa" },
  { href: "/galeri", label: "Galeri" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/informasi-pmb", label: "Info PMB" },
];

function ThemeToggle({ size = 18 }: { size?: number }) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {theme === "light"
        ? <Moon size={size} weight="duotone" />
        : <Sun size={size} weight="duotone" />}
    </button>
  );
}

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
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-200 ${
        scrolled
          ? "border-border/60 bg-background/95 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-background/80 backdrop-blur-md"
      }`}
    >
      {/* TOP ROW */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="STIBADA MASA Beranda">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <img src="/logo-stibada.png" alt="" className="h-7 w-7 object-contain" />
          </div>
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
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle — desktop */}
          <ThemeToggle size={16} />

          <Link href="/login" className="hidden lg:block">
            <Button size="sm" className="gap-2 rounded-xl">
              <SignIn size={15} weight="bold" />
              Masuk Portal
            </Button>
          </Link>

          {/* Hamburger — mobile/tablet */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors lg:hidden ${
              open
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/60 bg-background/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {/* TABLET NAV BAR — md to lg */}
      <div className="hidden border-t border-border/40 bg-background/60 md:block lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-none">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                location === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="ml-auto shrink-0">
            <Button size="sm" className="gap-1.5 rounded-lg text-xs h-7 px-3">
              <SignIn size={12} weight="bold" />
              Masuk
            </Button>
          </Link>
        </div>
      </div>

      {/* MOBILE DROPDOWN — below md */}
      {open && (
        <div className="border-t border-border/40 bg-background px-4 pb-5 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
                <ArrowRight size={13} className="text-muted-foreground/40" />
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex gap-2">
            <Link href="/login" className="flex-1">
              <Button className="w-full gap-2 rounded-xl" size="sm">
                <SignIn size={15} weight="bold" />
                Masuk Portal Akademik
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function PublicFooter({ settings, content }: { settings: SiteSettings; content: PublicContentItem[] }) {
  return (
    <footer className="border-t border-border/40 bg-[#1e3630] px-4 pt-14 pb-6 text-white dark:bg-[#0f1f1b]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 pb-10 border-b border-white/10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <img src="/logo-stibada.png" alt="Logo STIBADA MASA" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight">{settings.brandName || "STIBADA MASA"}</p>
                <p className="text-xs text-white/55 leading-snug mt-0.5">{settings.tagline || "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah"}<br />Masjid Agung Sunan Ampel</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-white/55 max-w-sm">{contentBody(content, "layout.footer", "Platform akademik modern untuk layanan belajar-mengajar, administrasi, komunikasi, dan penerimaan mahasiswa baru STIBADA MASA Surabaya.")}</p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Kontak</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-white/60"><Envelope size={14} weight="duotone" className="mt-0.5 shrink-0" />{settings.contactEmail || "pmb@stibadamasa.ac.id"}</li>
              <li className="flex items-start gap-2 text-white/60"><Phone size={14} weight="duotone" className="mt-0.5 shrink-0" />{settings.contactPhone || "Senin–Jumat, 08.00–16.00 WIB"}</li>
              <li className="flex items-start gap-2 text-white/60"><MapPin size={14} weight="duotone" className="mt-0.5 shrink-0" />{settings.address || "Jl. Ampel Suci No.1, Ampel, Semampir, Surabaya"}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Navigasi</p>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
              <li><Link href="/login" className="text-white/60 hover:text-white transition-colors">Login Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/30">
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
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar settings={settings} />
      <main>{children}</main>
      <PublicFooter settings={settings} content={content} />
    </div>
  );
}
