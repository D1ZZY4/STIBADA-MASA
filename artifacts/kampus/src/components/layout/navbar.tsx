import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import { List, House, SignOut, User } from "@phosphor-icons/react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/mahasiswa": "Dashboard",
  "/dashboard/mahasiswa/jadwal": "Jadwal Kuliah",
  "/dashboard/mahasiswa/krs": "KRS",
  "/dashboard/mahasiswa/nilai": "Nilai & IPK",
  "/dashboard/mahasiswa/absensi": "Absensi",
  "/dashboard/mahasiswa/diskusi": "Ruang Diskusi",
  "/dashboard/dosen": "Dashboard",
  "/dashboard/dosen/jadwal": "Jadwal Mengajar",
  "/dashboard/dosen/nilai": "Input Nilai",
  "/dashboard/dosen/absensi": "Absensi Mahasiswa",
  "/dashboard/dosen/absensi-dosen": "Kehadiran Saya",
  "/dashboard/dosen/diskusi": "Diskusi",
  "/dashboard/admin": "Dashboard",
  "/dashboard/admin/mahasiswa": "Manajemen Mahasiswa",
  "/dashboard/admin/dosen": "Manajemen Dosen",
  "/dashboard/admin/mata-kuliah": "Mata Kuliah",
  "/dashboard/admin/jadwal": "Jadwal",
  "/dashboard/admin/content": "Konten Publik",
  "/dashboard/admin/krs": "Persetujuan KRS",
  "/dashboard/admin/sistem": "Sistem Website",
  "/dashboard/rektor": "Executive Summary",
  "/dashboard/rektor/akademik": "Laporan Akademik",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false);

  const pageTitle = PAGE_TITLES[location] ?? "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4 md:px-5">
      {/* Mobile: hamburger */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden h-9 w-9 rounded-xl">
            <List size={20} weight="bold" />
            <span className="sr-only">Buka menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 flex flex-col" aria-label="Menu navigasi">
          <Sidebar onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Page title — mobile */}
      <span className="flex-1 truncate text-base font-semibold md:hidden">{pageTitle}</span>

      {/* Right side spacer on desktop */}
      <div className="hidden md:flex flex-1" />

      {/* Back to Landing — desktop only */}
      <Link href="/" className="hidden md:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <House size={13} weight="duotone" />
        Beranda
      </Link>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-9 w-9 rounded-xl"
        title={theme === "light" ? "Mode gelap" : "Mode terang"}
      >
        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      </Button>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-xl px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {user?.nama?.substring(0, 2).toUpperCase() ?? <User size={14} />}
            </div>
            <div className="hidden flex-col items-start md:flex">
              <span className="text-xs font-semibold leading-tight max-w-28 truncate">{user?.nama}</span>
              <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="pb-2">
            <p className="text-sm font-semibold">{user?.nama}</p>
            <p className="text-xs text-muted-foreground">{user?.email || user?.nim}</p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">
              {user?.role}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <House size={14} weight="duotone" />
              Kembali ke Beranda
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive gap-2">
            <SignOut size={14} weight="duotone" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
