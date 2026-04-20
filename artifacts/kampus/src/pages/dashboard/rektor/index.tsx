import { useGetStatsOverview, useGetStatsMahasiswa } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, Buildings, ChalkboardTeacher, TrendUp, Backpack } from "@phosphor-icons/react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function RektorDashboard() {
  const { data: overview, isLoading: isOverviewLoading } = useGetStatsOverview();
  const { data: mahasiswaStats, isLoading: isMahasiswaLoading } = useGetStatsMahasiswa();

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const kpiCards = [
    { title: "Total Mahasiswa Aktif", value: overview?.mahasiswaAktif ?? overview?.totalMahasiswa ?? 0, sub: "Terdaftar semester ini", icon: Backpack, accent: true },
    { title: "Dosen Aktif", value: overview?.dosenAktif ?? overview?.totalDosen ?? 0, sub: "Pengajar terdaftar", icon: ChalkboardTeacher },
    { title: "Program Studi", value: overview?.totalProdi ?? 0, sub: "Prodi aktif", icon: Buildings },
    { title: "Mata Kuliah", value: overview?.totalMataKuliah ?? 0, sub: "Semester berjalan", icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full text-xs gap-1.5 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          Ringkasan Eksekutif · STIBADA MASA
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((s) => (
          <Card key={s.title} className={s.accent ? "bg-primary text-primary-foreground border-transparent" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
              <CardTitle className={`text-sm font-medium ${s.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.title}</CardTitle>
              <div className={`rounded-lg p-1.5 ${s.accent ? "bg-primary-foreground/15" : "bg-muted"}`}>
                <s.icon size={15} weight="duotone" className={s.accent ? "text-primary-foreground" : "text-muted-foreground"} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              {isOverviewLoading ? <Skeleton className={`h-8 w-16 ${s.accent ? "bg-primary-foreground/20" : ""}`} /> : (
                <div className={`text-3xl font-bold tracking-tight ${s.accent ? "text-primary-foreground" : ""}`}>{s.value}</div>
              )}
              <p className={`mt-1 text-xs ${s.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendUp size={16} weight="duotone" className="text-primary" />
              <CardTitle className="text-base">Distribusi Mahasiswa per Prodi</CardTitle>
            </div>
            <CardDescription>Berdasarkan data pendaftaran aktif</CardDescription>
          </CardHeader>
          <CardContent>
            {isMahasiswaLoading ? (
              <Skeleton className="h-60 w-full rounded-xl" />
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mahasiswaStats?.byProdi || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="prodi" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="total" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users size={16} weight="duotone" className="text-primary" />
              <CardTitle className="text-base">Sebaran Status Mahasiswa</CardTitle>
            </div>
            <CardDescription>Aktif, Cuti, dan Lulus</CardDescription>
          </CardHeader>
          <CardContent>
            {isMahasiswaLoading ? (
              <Skeleton className="h-60 w-full rounded-xl" />
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mahasiswaStats?.byStatus || []} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                    <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="status" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="total" fill="var(--color-chart-2, #10b981)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary note */}
      <Card className="bg-muted/30">
        <CardContent className="flex items-start gap-3 pt-4 pb-4">
          <Buildings size={18} weight="duotone" className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Informasi Lembaga</p>
            <p className="text-xs text-muted-foreground mt-1">STIBADA MASA — Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel, Surabaya. Data diperbarui secara real-time dari sistem akademik terpadu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
