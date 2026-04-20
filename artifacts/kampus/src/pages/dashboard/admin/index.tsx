import { useAuth } from "@/lib/auth";
import { useGetStatsOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useGetStatsOverview();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Area</h2>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.nama}. Berikut adalah ringkasan sistem hari ini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.totalMahasiswa ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Mahasiswa terdaftar aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.totalDosen ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Dosen pengajar aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.totalMataKuliah ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Kurikulum semester ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Studi</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.totalProdi ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Program studi aktif
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Persetujuan KRS Tertunda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
              Semua KRS telah diproses.
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Log Aktivitas Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
              Tidak ada log hari ini.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
