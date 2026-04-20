import { useAuth } from "@/lib/auth";
import { useGetStatsMahasiswa, useGetStatsAkademik, useGetStatsAbsensiSummary, useGetStatsJadwalToday } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, BookOpen, Clock, CalendarCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function MahasiswaDashboard() {
  const { user } = useAuth();
  
  const { data: absensi, isLoading: isAbsensiLoading } = useGetStatsAbsensiSummary();
  const { data: jadwalToday, isLoading: isJadwalLoading } = useGetStatsJadwalToday();
  const { data: akademik, isLoading: isAkademikLoading } = useGetStatsAkademik();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Halo, {user?.nama}</h2>
        <p className="text-muted-foreground">
          Semester Genap 2024/2025 • {user?.prodi}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-transparent shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPK Kumulatif</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            {isAkademikLoading ? (
              <Skeleton className="h-8 w-16 bg-primary-foreground/20" />
            ) : (
              <div className="text-3xl font-bold">3.84</div>
            )}
            <p className="text-xs text-primary-foreground/80 mt-1">
              +0.12 dari semester lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKS</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">112</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari 144 SKS wajib
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isAbsensiLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{absensi?.persentaseKehadiran ?? 95}%</div>
                <Progress value={absensi?.persentaseKehadiran ?? 95} className="h-2 mt-2" />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isJadwalLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{jadwalToday?.totalJadwal ?? 2}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Kelas akan berlangsung
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Jadwal Kelas Hari Ini</CardTitle>
            <CardDescription>
              {jadwalToday?.totalJadwal ? `Anda memiliki ${jadwalToday.totalJadwal} kelas hari ini.` : "Tidak ada jadwal kelas hari ini."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isJadwalLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
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
                        Ruang {j.ruangan} • {j.dosenNama}
                      </p>
                    </div>
                  </div>
                ))}
                {!jadwalToday?.jadwal?.length && (
                  <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
                    Tidak ada jadwal untuk ditampilkan
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Tugas Mendatang</CardTitle>
            <CardDescription>Tugas yang harus dikumpulkan minggu ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
              Semua tugas telah diselesaikan!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
