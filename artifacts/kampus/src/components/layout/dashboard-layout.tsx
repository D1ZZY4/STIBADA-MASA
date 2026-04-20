import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { cn } from "@/lib/utils";
import {
  SquaresFour, CalendarBlank, BookOpen, GraduationCap, ChatCircle,
  ClipboardText, Users, Gear, ChartPie, Globe, House,
} from "@phosphor-icons/react";

type BottomNavItem = { name: string; href: string; icon: React.ElementType };

const bottomNavConfig: Record<string, BottomNavItem[]> = {
  mahasiswa: [
    { name: "Dashboard", href: "/dashboard/mahasiswa", icon: SquaresFour },
    { name: "Jadwal", href: "/dashboard/mahasiswa/jadwal", icon: CalendarBlank },
    { name: "KRS", href: "/dashboard/mahasiswa/krs", icon: BookOpen },
    { name: "Nilai", href: "/dashboard/mahasiswa/nilai", icon: GraduationCap },
    { name: "Diskusi", href: "/dashboard/mahasiswa/diskusi", icon: ChatCircle },
  ],
  dosen: [
    { name: "Dashboard", href: "/dashboard/dosen", icon: SquaresFour },
    { name: "Jadwal", href: "/dashboard/dosen/jadwal", icon: CalendarBlank },
    { name: "Nilai", href: "/dashboard/dosen/nilai", icon: GraduationCap },
    { name: "Absensi", href: "/dashboard/dosen/absensi", icon: ClipboardText },
    { name: "Diskusi", href: "/dashboard/dosen/diskusi", icon: ChatCircle },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: SquaresFour },
    { name: "Mahasiswa", href: "/dashboard/admin/mahasiswa", icon: Users },
    { name: "Konten", href: "/dashboard/admin/content", icon: Globe },
    { name: "KRS", href: "/dashboard/admin/krs", icon: ClipboardText },
    { name: "Sistem", href: "/dashboard/admin/sistem", icon: Gear },
  ],
  rektor: [
    { name: "Beranda", href: "/", icon: House },
    { name: "Executive", href: "/dashboard/rektor", icon: ChartPie },
    { name: "Akademik", href: "/dashboard/rektor/akademik", icon: GraduationCap },
  ],
};

function MobileBottomNav() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;
  const items = bottomNavConfig[user.role];
  if (!items) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex border-t bg-background/95 backdrop-blur-md md:hidden safe-area-pb">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex h-7 w-10 items-center justify-center rounded-xl transition-all",
              isActive ? "bg-primary/10" : ""
            )}>
              <Icon size={19} weight={isActive ? "duotone" : "regular"} />
            </div>
            <span className={isActive ? "text-primary font-semibold" : ""}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col border-r bg-sidebar">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 pb-20 md:pb-6 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
