import { useAuth } from "@/lib/auth";
import { useGetStatsOverview, useGetStatsMahasiswa, useGetStatsAkademik } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, Building } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function RektorDashboard() {
  const { user } = useAuth();
  const { data: overview, isLoading: isOverviewLoading } = useGetStatsOverview();
  const { data: mahasiswaStats, isLoading: isMahasiswaLoading } = useGetStatsMahasiswa();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
        <p className="text-muted-foreground">
          Ringkasan eksekutif STIBADA MASA.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isOverviewLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{overview?.mahasiswaAktif ?? overview?.totalMahasiswa ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dosen Aktif</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isOverviewLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{overview?.dosenAktif ?? overview?.totalDosen ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Program Studi</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isOverviewLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{overview?.totalProdi ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Mahasiswa per Prodi</CardTitle>
            <CardDescription>Berdasarkan data pendaftaran aktif</CardDescription>
          </CardHeader>
          <CardContent>
            {isMahasiswaLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mahasiswaStats?.byProdi || []}>
                    <XAxis dataKey="prodi" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sebaran Status Mahasiswa</CardTitle>
            <CardDescription>Aktif, Cuti, dan Lulus</CardDescription>
          </CardHeader>
          <CardContent>
            {isMahasiswaLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mahasiswaStats?.byStatus || []} layout="vertical">
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="status" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="total" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
