import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  MessageSquare,
  ClipboardList,
  Users,
  Settings,
  PieChart,
  School
} from "lucide-react";

export function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const role = user.role;

  let links: { name: string; href: string; icon: React.ElementType }[] = [];

  if (role === "mahasiswa") {
    links = [
      { name: "Overview", href: "/dashboard/mahasiswa", icon: LayoutDashboard },
      { name: "Jadwal Kuliah", href: "/dashboard/mahasiswa/jadwal", icon: Calendar },
      { name: "KRS", href: "/dashboard/mahasiswa/krs", icon: BookOpen },
      { name: "Nilai & IPK", href: "/dashboard/mahasiswa/nilai", icon: GraduationCap },
      { name: "Absensi", href: "/dashboard/mahasiswa/absensi", icon: ClipboardList },
      { name: "Ruang Diskusi", href: "/dashboard/mahasiswa/diskusi", icon: MessageSquare },
    ];
  } else if (role === "dosen") {
    links = [
      { name: "Overview", href: "/dashboard/dosen", icon: LayoutDashboard },
      { name: "Jadwal Mengajar", href: "/dashboard/dosen/jadwal", icon: Calendar },
      { name: "Input Nilai", href: "/dashboard/dosen/nilai", icon: GraduationCap },
      { name: "Absensi Mahasiswa", href: "/dashboard/dosen/absensi", icon: ClipboardList },
      { name: "Kehadiran Saya", href: "/dashboard/dosen/absensi-dosen", icon: Settings },
      { name: "Diskusi", href: "/dashboard/dosen/diskusi", icon: MessageSquare },
    ];
  } else if (role === "admin") {
    links = [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Mahasiswa", href: "/dashboard/admin/mahasiswa", icon: Users },
      { name: "Dosen", href: "/dashboard/admin/dosen", icon: Users },
      { name: "Mata Kuliah", href: "/dashboard/admin/mata-kuliah", icon: BookOpen },
      { name: "Jadwal", href: "/dashboard/admin/jadwal", icon: Calendar },
      { name: "Konten Publik", href: "/dashboard/admin/content", icon: School },
      { name: "Persetujuan KRS", href: "/dashboard/admin/krs", icon: ClipboardList },
      { name: "Sistem", href: "/dashboard/admin/sistem", icon: Settings },
    ];
  } else if (role === "rektor") {
    links = [
      { name: "Executive Summary", href: "/dashboard/rektor", icon: PieChart },
      { name: "Laporan Akademik", href: "/dashboard/rektor/akademik", icon: GraduationCap },
    ];
  }

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-primary">
          <School className="h-6 w-6" />
          <span className="text-lg">STIBADA MASA</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4 gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
