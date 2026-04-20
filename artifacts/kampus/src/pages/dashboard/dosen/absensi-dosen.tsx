import { useAuth } from "@/lib/auth";
import { useListAbsensi } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarTick, Clock, TickCircle } from "iconsax-react";

export default function DosenAbsensiDosen() {
  const { user } = useAuth();
  const { data: absensiData } = useListAbsensi({ dosenId: user?.id });
  const absensiList = absensiData?.data ?? [];
  const hadir = absensiList.filter((item) => item.status === "hadir").length;
  const total = absensiList.length;
  const persentase = total ? Math.round((hadir / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Absensi Dosen</h2>
        <p className="text-muted-foreground">Riwayat kehadiran mengajar dan rekap aktivitas dosen.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sesi Tercatat</CardTitle>
            <CalendarTick variant="Bulk" className="text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{total}</div></CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
            <TickCircle variant="Bulk" className="text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{persentase}%</div></CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status Hari Ini</CardTitle>
            <Clock variant="Bulk" className="text-primary" />
          </CardHeader>
          <CardContent><Badge className="rounded-full">Aktif Mengajar</Badge></CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Riwayat Kehadiran Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absensiList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Belum ada riwayat kehadiran dosen.
                    </TableCell>
                  </TableRow>
                ) : (
                  absensiList.slice(0, 12).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.mataKuliahNama ?? "Sesi Perkuliahan"}</TableCell>
                      <TableCell>{item.kelas ?? "-"}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{item.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{item.keterangan || "Tercatat oleh sistem akademik"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}