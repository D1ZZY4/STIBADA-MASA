import { useAuth } from "@/lib/auth";
import { useGetStatsAbsensiSummary, useGetStatsJadwalToday, useGetStatsAkademik } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap, CalendarBlank, ClipboardText, BookOpen,
  TrendUp, Clock, CheckCircle, Warning,
} from "@phosphor-icons/react";

function StatCard({ title, value, sub, icon: Icon, accent = false, loading = false }: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; accent?: boolean; loading?: boolean;
}) {
  return (
    <Card className={accent ? "bg-primary text-primary-foreground border-transparent" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
        <CardTitle className={`text-sm font-medium ${accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{title}</CardTitle>
        <div className={`rounded-lg p-1.5 ${accent ? "bg-primary-foreground/15" : "bg-muted"}`}>
          <Icon size={15} weight="duotone" className={accent ? "text-primary-foreground" : "text-muted-foreground"} />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        {loading ? <Skeleton className={`h-8 w-16 ${accent ? "bg-primary-foreground/20" : ""}`} /> : (
          <div className={`text-3xl font-bold tracking-tight ${accent ? "text-primary-foreground" : ""}`}>{value}</div>
        )}
        {sub && <p className={`mt-1 text-xs ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function MahasiswaDashboard() {
  const { user } = useAuth();
  const { data: absensi, isLoading: loadAbsensi } = useGetStatsAbsensiSummary();
  const { data: jadwalToday, isLoading: loadJadwal } = useGetStatsJadwalToday();
  const { data: akademik, isLoading: loadAkademik } = useGetStatsAkademik();

  const kehadiran = absensi?.persentaseKehadiran ?? 95;
  const hadirCount = absensi?.totalHadir ?? 0;
  const totalCount = absensi?.totalPertemuan ?? 0;
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Halo, {user?.nama?.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">{today} · {user?.prodi}</p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full text-xs gap-1.5 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Aktif — Semester Genap 2024/2025
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="IPK Kumulatif" value={akademik?.ipk ?? "3.84"} sub="+0.12 dari semester lalu" icon={GraduationCap} accent loading={loadAkademik} />
        <StatCard title="Total SKS" value={akademik?.totalSks ?? 112} sub="Dari 144 SKS wajib" icon={BookOpen} loading={loadAkademik} />
        <StatCard title="Kehadiran" value={`${kehadiran}%`} sub={`${hadirCount}/${totalCount || "–"} pertemuan`} icon={ClipboardText} loading={loadAbsensi} />
        <StatCard title="Kelas Hari Ini" value={jadwalToday?.totalJadwal ?? 0} sub="Jadwal aktif hari ini" icon={CalendarBlank} loading={loadJadwal} />
      </div>

      {/* Kehadiran progress */}
      <Card>
        <CardContent className="pt-4 pb-4 px-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendUp size={16} weight="duotone" className="text-primary" />
              Persentase Kehadiran
            </div>
            <span className={`text-sm font-bold ${kehadiran >= 75 ? "text-green-600" : "text-red-500"}`}>{kehadiran}%</span>
          </div>
          <Progress value={kehadiran} className="h-2.5 rounded-full" />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Min. kehadiran: 75%</p>
            {kehadiran < 75 && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <Warning size={12} weight="duotone" />
                Kehadiran di bawah batas!
              </div>
            )}
            {kehadiran >= 75 && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle size={12} weight="duotone" />
                Memenuhi syarat
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Jadwal hari ini */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Jadwal Hari Ini</CardTitle>
              <Badge variant="secondary" className="rounded-full text-xs">{jadwalToday?.totalJadwal ?? 0} kelas</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {loadJadwal ? (
              <div className="space-y-3"><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-16 w-full rounded-xl" /></div>
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
                    <p className="text-xs text-muted-foreground mt-0.5">Ruang {j.ruangan} · {j.dosenNama}</p>
                  </div>
                  <Badge variant="outline" className="hidden sm:flex shrink-0 text-xs rounded-full">{j.mataKuliahKode}</Badge>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
                <CalendarBlank size={32} weight="duotone" className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Tidak ada jadwal kuliah hari ini</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick info */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Info Akademik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">NIM</span>
                <span className="font-mono font-semibold">{user?.nim ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Program Studi</span>
                <span className="font-semibold text-right max-w-32 truncate">{user?.prodi ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Angkatan</span>
                <span className="font-semibold">{user?.angkatan ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Semester</span>
                <span className="font-semibold">{user?.semester ?? "–"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="rounded-full text-xs bg-green-500/10 text-green-600 border-0">Aktif</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm">
              <Clock size={14} weight="duotone" className="text-primary shrink-0" />
              <span className="text-muted-foreground">Batas pengisian KRS: <strong className="text-foreground">Jumat, 23:59 WIB</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
