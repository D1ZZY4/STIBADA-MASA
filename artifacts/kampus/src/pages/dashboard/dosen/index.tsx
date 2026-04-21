import { useAuth } from "@/lib/auth";
import { useGetStatsJadwalToday, useGetStatsOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarBlank, Users, GraduationCap, CheckCircle, Clock, ChalkboardTeacher } from "@phosphor-icons/react";

export default function DosenDashboard() {
  const { user } = useAuth();
  const { data: jadwalToday, isLoading: loadJadwal } = useGetStatsJadwalToday();
  const { data: stats, isLoading: loadStats } = useGetStatsOverview();

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Halo, {user?.nama?.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">{today} · {user?.jabatan ?? "Dosen"}</p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full text-xs gap-1.5 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Semester Genap 2024/2025
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Kelas Hari Ini", value: jadwalToday?.totalJadwal ?? 0, sub: "Jadwal mengajar aktif", icon: CalendarBlank, loading: loadJadwal, accent: true },
          { title: "Total Mahasiswa", value: stats?.totalMahasiswa ?? 0, sub: "Mahasiswa terdaftar", icon: Users, loading: loadStats },
          { title: "Nilai Diinput", value: 4, sub: "Dari 4 mata kuliah", icon: GraduationCap, loading: false },
          { title: "Kehadiran Saya", value: "96%", sub: "Bulan ini", icon: CheckCircle, loading: false },
        ].map((s) => (
          <Card key={s.title} className={s.accent ? "bg-primary text-primary-foreground border-transparent" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
              <CardTitle className={`text-sm font-medium ${s.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.title}</CardTitle>
              <div className={`rounded-lg p-1.5 ${s.accent ? "bg-primary-foreground/15" : "bg-muted"}`}>
                <s.icon size={15} weight="duotone" className={s.accent ? "text-primary-foreground" : "text-muted-foreground"} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              {s.loading ? <Skeleton className={`h-8 w-16 ${s.accent ? "bg-primary-foreground/20" : ""}`} /> : (
                <div className={`text-3xl font-bold tracking-tight ${s.accent ? "text-primary-foreground" : ""}`}>{s.value}</div>
              )}
              <p className={`mt-1 text-xs ${s.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Jadwal mengajar */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Jadwal Mengajar Hari Ini</CardTitle>
              <Badge variant="secondary" className="rounded-full text-xs">{jadwalToday?.totalJadwal ?? 0} kelas</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {loadJadwal ? (
              <div className="space-y-3"><Skeleton className="h-16 w-full rounded-xl" /></div>
            ) : jadwalToday?.jadwal?.length ? (
              jadwalToday.jadwal.map((j) => (
                <div key={j.id} className="flex items-center gap-4 rounded-xl border bg-muted/30 px-4 py-3 hover:bg-muted/60 transition-colors">
                  <div className="text-center shrink-0 w-14">
                    <div className="text-sm font-bold text-primary">{j.jamMulai}</div>
                    <div className="text-xs text-muted-foreground">{j.jamSelesai}</div>
                  </div>
                  <div className="w-px h-10 bg-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{j.mataKuliahNama}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ruang {j.ruangan} · Kelas {j.kelas}</p>
                  </div>
                  <Badge variant="outline" className="hidden sm:flex shrink-0 text-xs rounded-full">{j.mataKuliahKode}</Badge>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
                <CalendarBlank size={32} weight="duotone" className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Tidak ada jadwal mengajar hari ini</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info dosen */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profil Pengajar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ChalkboardTeacher size={22} weight="duotone" className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{user?.nama}</p>
                <p className="text-xs text-muted-foreground">{user?.jabatan ?? "Dosen"}</p>
              </div>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">NIDN</span>
                <span className="font-mono font-semibold">{user?.nidn ?? user?.nim ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Program Studi</span>
                <span className="font-semibold text-right max-w-32 truncate">{user?.prodi ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Golongan</span>
                <span className="font-semibold">{user?.golongan ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="rounded-full text-xs bg-green-500/10 text-green-600 border-0">Aktif</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm">
              <Clock size={14} weight="duotone" className="text-primary shrink-0" />
              <span className="text-muted-foreground">Batas input nilai: <strong className="text-foreground">Minggu ini</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
