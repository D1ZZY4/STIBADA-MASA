import { useAuth } from "@/lib/auth";
import { useGetStatsJadwalToday } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DosenDashboard() {
  const { user } = useAuth();
  const { data: jadwalToday, isLoading: isJadwalLoading } = useGetStatsJadwalToday();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Halo, {user?.nama}</h2>
        <p className="text-muted-foreground">
          Dosen Program Studi {user?.prodi}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isJadwalLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{jadwalToday?.totalJadwal ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Jadwal mengajar terjadwal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">
              Di 4 kelas berbeda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Tertunda</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Semua nilai telah diisi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Jadwal Mengajar Hari Ini</CardTitle>
            <CardDescription>
              Jadwal dan ruang kelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isJadwalLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {jadwalToday?.jadwal?.map((j) => (
                  <div key={j.id} className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/50 transition-colors">
                    <div className="w-16 text-center">
                      <div className="text-sm font-bold text-primary">{j.jamMulai}</div>
                      <div className="text-xs text-muted-foreground">{j.jamSelesai}</div>
                    </div>
                    <div className="w-px h-10 bg-border"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{j.mataKuliahNama}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ruang {j.ruangan} • Kelas {j.kelas}
                      </p>
                    </div>
                  </div>
                ))}
                {!jadwalToday?.jadwal?.length && (
                  <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
                    Tidak ada jadwal mengajar hari ini
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
