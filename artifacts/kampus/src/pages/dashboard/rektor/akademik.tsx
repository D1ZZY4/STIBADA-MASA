import { useGetStatsOverview, useGetStatsAkademik, useGetStatsIpkTrend } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function RektorAkademik() {
  const { data: overview, isLoading: isOverviewLoading } = useGetStatsOverview();
  const { data: akademik, isLoading: isAkademikLoading } = useGetStatsAkademik();
  const { data: ipkTrend, isLoading: isTrendLoading } = useGetStatsIpkTrend();

  const trendData = ipkTrend?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Laporan Akademik</h2>
        <p className="text-muted-foreground">Analisis kinerja akademik universitas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Mahasiswa Aktif", value: overview?.totalMahasiswa, unit: "orang" },
          { label: "Total Dosen", value: overview?.totalDosen, unit: "orang" },
          { label: "Mata Kuliah", value: overview?.totalMataKuliah, unit: "MK" },
          { label: "Tingkat Absensi", value: akademik?.tingkatAbsensi ? `${akademik.tingkatAbsensi}%` : "-", unit: "" },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
            </CardHeader>
            <CardContent>
              {isOverviewLoading || isAkademikLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">{item.value ?? "-"} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren IPK Rata-rata</CardTitle>
            <CardDescription>Perkembangan IPK per semester</CardDescription>
          </CardHeader>
          <CardContent>
            {isTrendLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : trendData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Data belum tersedia</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                  <YAxis domain={[2.5, 4.0]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ipk" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="IPK" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Nilai</CardTitle>
            <CardDescription>Sebaran grade mahasiswa</CardDescription>
          </CardHeader>
          <CardContent>
            {isAkademikLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={akademik?.distribusiNilai ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="hsl(var(--primary))" radius={[4,4,0,0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
