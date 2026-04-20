import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  SquaresFour, CalendarBlank, BookOpen, GraduationCap, ChatCircle,
  ClipboardText, Users, Gear, ChartPie, Buildings, House, SignOut,
  Backpack, ChalkboardTeacher, UserGear, Crown, Globe,
} from "@phosphor-icons/react";

type NavLink = { name: string; href: string; icon: React.ElementType };

const roleConfig = {
  mahasiswa: {
    label: "Mahasiswa",
    icon: Backpack,
    color: "bg-blue-500/10 text-blue-600",
    links: [
      { name: "Dashboard", href: "/dashboard/mahasiswa", icon: SquaresFour },
      { name: "Jadwal Kuliah", href: "/dashboard/mahasiswa/jadwal", icon: CalendarBlank },
      { name: "KRS", href: "/dashboard/mahasiswa/krs", icon: BookOpen },
      { name: "Nilai & IPK", href: "/dashboard/mahasiswa/nilai", icon: GraduationCap },
      { name: "Absensi", href: "/dashboard/mahasiswa/absensi", icon: ClipboardText },
      { name: "Ruang Diskusi", href: "/dashboard/mahasiswa/diskusi", icon: ChatCircle },
    ] as NavLink[],
  },
  dosen: {
    label: "Dosen",
    icon: ChalkboardTeacher,
    color: "bg-emerald-500/10 text-emerald-600",
    links: [
      { name: "Dashboard", href: "/dashboard/dosen", icon: SquaresFour },
      { name: "Jadwal Mengajar", href: "/dashboard/dosen/jadwal", icon: CalendarBlank },
      { name: "Input Nilai", href: "/dashboard/dosen/nilai", icon: GraduationCap },
      { name: "Absensi Mahasiswa", href: "/dashboard/dosen/absensi", icon: ClipboardText },
      { name: "Kehadiran Saya", href: "/dashboard/dosen/absensi-dosen", icon: CalendarBlank },
      { name: "Diskusi", href: "/dashboard/dosen/diskusi", icon: ChatCircle },
    ] as NavLink[],
  },
  admin: {
    label: "Administrator",
    icon: UserGear,
    color: "bg-orange-500/10 text-orange-600",
    links: [
      { name: "Dashboard", href: "/dashboard/admin", icon: SquaresFour },
      { name: "Mahasiswa", href: "/dashboard/admin/mahasiswa", icon: Users },
      { name: "Dosen", href: "/dashboard/admin/dosen", icon: ChalkboardTeacher },
      { name: "Mata Kuliah", href: "/dashboard/admin/mata-kuliah", icon: BookOpen },
      { name: "Jadwal", href: "/dashboard/admin/jadwal", icon: CalendarBlank },
      { name: "Konten Publik", href: "/dashboard/admin/content", icon: Globe },
      { name: "Persetujuan KRS", href: "/dashboard/admin/krs", icon: ClipboardText },
      { name: "Sistem Website", href: "/dashboard/admin/sistem", icon: Gear },
    ] as NavLink[],
  },
  rektor: {
    label: "Rektor",
    icon: Crown,
    color: "bg-purple-500/10 text-purple-600",
    links: [
      { name: "Executive Summary", href: "/dashboard/rektor", icon: ChartPie },
      { name: "Laporan Akademik", href: "/dashboard/rektor/akademik", icon: GraduationCap },
    ] as NavLink[],
  },
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

  if (!user) return null;

  const config = roleConfig[user.role as keyof typeof roleConfig];
  if (!config) return null;

  const RoleIcon = config.icon;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-full max-h-screen flex-col bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Buildings size={18} weight="duotone" className="text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight tracking-tight text-sidebar-foreground">STIBADA MASA</p>
          <p className="truncate text-[10px] text-sidebar-foreground/50">Portal Akademik</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 pt-4 pb-2">
        <div className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold", config.color)}>
          <RoleIcon size={14} weight="duotone" />
          {config.label}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-auto px-3 py-2 space-y-0.5">
        {config.links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href) && location !== link.href);
          const exactActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                exactActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon
                size={17}
                weight={exactActive ? "duotone" : "regular"}
                className={exactActive ? "text-primary-foreground" : "text-current"}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-4"><div className="border-t border-sidebar-border" /></div>

      {/* Back to Landing */}
      <div className="px-3 py-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-all"
        >
          <House size={17} weight="duotone" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* User Profile + Logout */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {user.nama?.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">{user.nama}</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">{user.email || user.nim}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <SignOut size={15} weight="duotone" />
          </button>
        </div>
      </div>
    </div>
  );
}
