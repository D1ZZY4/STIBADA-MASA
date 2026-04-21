import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  SignIn, List, X, Envelope, Phone, MapPin, ArrowRight,
  SquaresFour, SignOut, InstagramLogo, YoutubeLogo, FacebookLogo, WhatsappLogo,
  BookOpen, FileText, Books, Newspaper, CaretDown,
} from "@phosphor-icons/react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/lib/api";
import { contentBody, fallbackSiteSettings, type PublicContentItem, type SiteSettings } from "@/lib/site-content";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/pendaftaran", label: "Pendaftaran" },
  { href: "/program-studi", label: "Program Studi" },
  { href: "/beasiswa", label: "Beasiswa" },
  { href: "/galeri", label: "Galeri" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/informasi-pmb", label: "Info PMB" },
];

const layananLinks = [
  { label: "SIAKAD", href: "/siakad", icon: BookOpen },
  { label: "Pendaftaran Online", href: "/pendaftaran-online", icon: FileText },
  { label: "Perpustakaan Online", href: "/perpustakaan", icon: Books },
  { label: "E-Journal", href: "/e-journal", icon: Newspaper },
];

const contactEmails = [
  { label: "Humas", value: "humas@stibada-masa.id" },
  { label: "PMB", value: "pmb@stibada-masa.id" },
  { label: "Humas (alt)", value: "humas@stibada.ac.id" },
  { label: "PMB (alt)", value: "pmb@stibasa.ac.id" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/stibada.masa/", icon: InstagramLogo },
  { label: "YouTube", href: "https://www.youtube.com/@stibadamasa8935", icon: YoutubeLogo },
  { label: "Facebook", href: "https://facebook.com/stibadamasa", icon: FacebookLogo },
  { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=6281234502771&text&type=phone_number&app_absent=0", icon: WhatsappLogo },
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
        ? <Moon size={size} />
        : <Sun size={size} />}
    </button>
  );
}

function AuthAction({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  if (!user) {
    return (
      <Link href="/login">
        <Button size="sm" className={compact ? "gap-1.5 rounded-lg text-xs h-7 px-3" : "gap-2 rounded-xl"}>
          <SignIn size={compact ? 12 : 15} weight="bold" />
          {compact ? "Masuk" : "Masuk Portal"}
        </Button>
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className={compact ? "gap-1.5 rounded-lg text-xs h-7 px-3" : "gap-2 rounded-xl"}>
          <SquaresFour size={compact ? 12 : 15} weight="bold" />
          {compact ? "Dashboard" : `Halo, ${user.nama?.split(" ")[0] || "Civitas"}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-semibold">{user.nama}</p>
          <p className="text-xs text-muted-foreground">{user.email || user.nim}</p>
          <span className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">{user.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${user.role}`} className="flex items-center gap-2 cursor-pointer">
            <SquaresFour size={14} weight="duotone" /> Buka Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { logout(); navigate("/"); }} className="text-destructive focus:text-destructive gap-2">
          <SignOut size={14} weight="duotone" /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PublicNavbar({ settings }: { settings: SiteSettings }) {
  const [location] = useLocation();
  const { user } = useAuth();
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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="STIBADA MASA Beranda">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <img src="/logo-stibada.png" alt="" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight tracking-tight">{settings.brandName || "STIBADA MASA"}</p>
            <p className="hidden text-[10px] leading-tight text-muted-foreground sm:block">{settings.tagline || "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah"}</p>
          </div>
        </Link>

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  layananLinks.some((l) => l.href === location)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Layanan
                <CaretDown size={11} weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 rounded-2xl">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Layanan Online</DropdownMenuLabel>
              {layananLinks.map((l) => (
                <DropdownMenuItem key={l.href} asChild>
                  <Link href={l.href} className="flex items-center gap-3 cursor-pointer rounded-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <l.icon size={16} weight="duotone" />
                    </div>
                    <span className="text-sm font-medium">{l.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle size={16} />
          <div className="hidden lg:block">
            <AuthAction />
          </div>
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
          <div className="ml-auto shrink-0">
            <AuthAction compact />
          </div>
        </div>
      </div>

      {open && (
        <div className="mx-3 mb-3 mt-1 rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl px-4 pb-5 pt-1 shadow-lg md:hidden">
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
            <p className="mt-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Layanan Online</p>
            {layananLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  location === l.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <l.icon size={16} weight="duotone" className="text-primary" />
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex gap-2">
            {user ? (
              <Link href={`/dashboard/${user.role}`} className="flex-1">
                <Button className="w-full gap-2 rounded-xl" size="sm">
                  <SquaresFour size={15} weight="bold" />
                  Buka Dashboard {user.role}
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="flex-1">
                <Button className="w-full gap-2 rounded-xl" size="sm">
                  <SignIn size={15} weight="bold" />
                  Masuk Portal Akademik
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function PublicFooter({ settings, content }: { settings: SiteSettings; content: PublicContentItem[] }) {
  return (
    <footer className="border-t border-border/60 bg-secondary/60 px-4 pt-12 pb-6 text-foreground sm:pt-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-border/60 pb-8 sm:gap-10 sm:pb-10 md:grid-cols-12">
          {/* Brand + contact */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <img src="/logo-stibada.png" alt="Logo STIBADA MASA" className="h-8 w-8 object-contain" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-bold leading-tight">{settings.brandName || "STIBADA MASA"}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{settings.tagline || "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah"}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {contentBody(content, "layout.footer", "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel Surabaya — pusat studi Bahasa Arab berbasis nilai luhur Sunan Ampel.")}
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={14} weight="duotone" className="mt-0.5 shrink-0 text-primary" />
                <span className="leading-6">{settings.address || "Jl. Ampel Masjid No.53, Ampel, Semampir, Surabaya"}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={14} weight="duotone" className="shrink-0 text-primary" />
                <span>081234502771</span>
              </li>
            </ul>
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Email Resmi</p>
              <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
                {contactEmails.map((e) => (
                  <li key={e.value} className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <Envelope size={13} weight="duotone" className="shrink-0 text-primary" />
                    <a href={`mailto:${e.value}`} className="truncate transition-colors hover:text-primary" title={`${e.label}: ${e.value}`}>
                      {e.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-8 md:col-span-7 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Layanan</p>
              <ul className="space-y-2.5 text-sm">
                {layananLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                      <l.icon size={14} weight="duotone" className="shrink-0 text-primary/70 group-hover:text-primary" />
                      <span className="truncate">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Navigasi</p>
              <ul className="space-y-2 text-sm">
                {navLinks.slice(0, 5).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Sosial Media</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <s.icon size={18} weight="duotone" />
                  </a>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground/70">@stibada.masa</p>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col gap-2 pt-5 text-xs text-muted-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} STIBADA MASA. Hak Cipta Dilindungi.</p>
          <p className="leading-relaxed">{settings.footerNote || "Terakreditasi BAN-PT (2022–2027) · Terintegrasi PMB & SIAKAD"}</p>
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
