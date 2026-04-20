import { useAuth } from "@/lib/auth";
import { useGetStatsOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, BookOpen, GraduationCap, Buildings, ClipboardText, Globe, Gear, ArrowRight, ChalkboardTeacher } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

type PendingKRS = { id: string; mahasiswaNama: string; mataKuliahNama: string; status: string };
type AuditLog = { id: string; actorRole: string; action: string; target: string; createdAt: string };

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useGetStatsOverview();
  const [krs, setKrs] = useState<PendingKRS[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    apiFetch<{ content: unknown[]; applications: unknown[]; auditLogs: AuditLog[] }>("/content")
      .then((d) => setLogs(d.auditLogs?.slice(0, 5) ?? []))
      .catch(() => {});
    apiFetch<PendingKRS[]>("/krs?status=pending")
      .then((d) => setKrs(Array.isArray(d) ? d.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

  const statCards = [
    { title: "Total Mahasiswa", value: stats?.totalMahasiswa ?? 0, sub: "Mahasiswa aktif", icon: Users, accent: true },
    { title: "Total Dosen", value: stats?.totalDosen ?? 0, sub: "Dosen pengajar", icon: ChalkboardTeacher },
    { title: "Mata Kuliah", value: stats?.totalMataKuliah ?? 0, sub: "Semester ini", icon: BookOpen },
    { title: "Program Studi", value: stats?.totalProdi ?? 0, sub: "Prodi aktif", icon: Buildings },
  ];

  const quickLinks = [
    { label: "Mahasiswa", href: "/dashboard/admin/mahasiswa", icon: Users, color: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
    { label: "Dosen", href: "/dashboard/admin/dosen", icon: ChalkboardTeacher, color: "text-emerald-600 dark:text-emerald-400 dark:text-emerald-400 bg-emerald-500/10" },
    { label: "KRS", href: "/dashboard/admin/krs", icon: ClipboardText, color: "text-orange-600 dark:text-orange-400 bg-orange-500/10" },
    { label: "Konten", href: "/dashboard/admin/content", icon: Globe, color: "text-purple-600 dark:text-purple-400 bg-purple-500/10" },
    { label: "Nilai", href: "/dashboard/admin/mata-kuliah", icon: GraduationCap, color: "text-rose-600 bg-rose-50" },
    { label: "Sistem", href: "/dashboard/admin/sistem", icon: Gear, color: "text-gray-600 bg-gray-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Area</h1>
          <p className="text-sm text-muted-foreground">{today} · {user?.nama}</p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full text-xs gap-1.5 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          Administrator
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title} className={s.accent ? "bg-primary text-primary-foreground border-transparent" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
              <CardTitle className={`text-sm font-medium ${s.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.title}</CardTitle>
              <div className={`rounded-lg p-1.5 ${s.accent ? "bg-primary-foreground/15" : "bg-muted"}`}>
                <s.icon size={15} weight="duotone" className={s.accent ? "text-primary-foreground" : "text-muted-foreground"} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              {isLoading ? <Skeleton className={`h-8 w-16 ${s.accent ? "bg-primary-foreground/20" : ""}`} /> : (
                <div className={`text-3xl font-bold tracking-tight ${s.accent ? "text-primary-foreground" : ""}`}>{s.value}</div>
              )}
              <p className={`mt-1 text-xs ${s.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Akses Cepat</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickLinks.map((q) => (
              <Link key={q.href} href={q.href}>
                <div className="flex flex-col items-center gap-2 rounded-2xl border p-3 text-center hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer group">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${q.color}`}>
                    <q.icon size={18} weight="duotone" />
                  </div>
                  <span className="text-xs font-medium">{q.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Pending KRS */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">KRS Menunggu Persetujuan</CardTitle>
              <Link href="/dashboard/admin/krs">
                <Button variant="ghost" size="sm" className="gap-1 text-xs rounded-xl h-7">
                  Lihat semua <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {krs.length > 0 ? krs.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{k.mahasiswaNama}</p>
                  <p className="text-xs text-muted-foreground truncate">{k.mataKuliahNama}</p>
                </div>
                <Badge className="shrink-0 rounded-full text-xs bg-yellow-500/10 text-yellow-700 border-0">{k.status}</Badge>
              </div>
            )) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
                <ClipboardText size={28} weight="duotone" className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Semua KRS telah diproses</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit log */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Log Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {logs.length > 0 ? logs.map((log) => (
              <div key={log.id} className="rounded-xl border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="rounded-full text-[10px] shrink-0">{log.actorRole}</Badge>
                  <span className="text-[10px] text-muted-foreground">{new Date(log.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="mt-1.5 text-xs font-medium">{log.action}</p>
              </div>
            )) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">Tidak ada log hari ini</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
