import { useAuth } from "@/lib/auth";
import { useGetStatsAbsensiSummary, getGetStatsAbsensiSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

function getStatusColor(status: string) {
  if (status === "hadir") return "text-emerald-600 dark:text-emerald-400 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-900/20";
  if (status === "izin") return "text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-900/20";
  if (status === "sakit") return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
  return "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-900/20";
}

export default function MahasiswaAbsensi() {
  const { user } = useAuth();
  const { data, isLoading } = useGetStatsAbsensiSummary(
    { userId: user?.id },
    { query: { queryKey: getGetStatsAbsensiSummaryQueryKey({ userId: user?.id }) } }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Rekap Absensi</h2>
        <p className="text-muted-foreground">Riwayat kehadiran kuliah Anda</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Pertemuan", value: data?.totalPertemuan, color: "text-foreground" },
          { label: "Hadir", value: data?.hadir, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Izin / Sakit", value: (data?.izin ?? 0) + (data?.sakit ?? 0), color: "text-yellow-600" },
          { label: "Alpha", value: data?.alpha, color: "text-red-600" },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className={`text-3xl font-bold ${item.color}`}>{item.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tingkat Kehadiran</CardTitle>
          <CardDescription>Persentase kehadiran keseluruhan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Persentase Kehadiran</span>
                <span className={`text-lg font-bold ${(data?.persentaseKehadiran ?? 0) >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"}`}>
                  {data?.persentaseKehadiran ?? 0}%
                </span>
              </div>
              <Progress value={data?.persentaseKehadiran ?? 0} className="h-3" />
              {(data?.persentaseKehadiran ?? 0) < 75 && (
                <p className="text-sm text-red-600">Peringatan: Kehadiran di bawah 75% minimum</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Absensi per Mata Kuliah</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (data?.byMataKuliah ?? []).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada data absensi</div>
          ) : (
            <div className="space-y-4">
              {data?.byMataKuliah?.map((mk, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mk.mataKuliah}</span>
                    <span className={`text-sm font-semibold ${mk.persentase >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"}`}>
                      {mk.hadir}/{mk.total} ({mk.persentase}%)
                    </span>
                  </div>
                  <Progress value={mk.persentase} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
