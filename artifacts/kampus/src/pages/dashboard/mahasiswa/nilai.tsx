import { useAuth } from "@/lib/auth";
import { useListNilai, getListNilaiQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getGradeColor(grade: string) {
  if (grade === "A" || grade === "A-") return "bg-primary/10 text-primary";
  if (grade === "B+" || grade === "B" || grade === "B-") return "bg-muted text-muted-foreground";
  if (grade === "C+" || grade === "C") return "bg-muted text-muted-foreground";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
}

export default function MahasiswaNilai() {
  const { user } = useAuth();
  const { data, isLoading } = useListNilai(
    { mahasiswaId: user?.id },
    { query: { queryKey: getListNilaiQueryKey({ mahasiswaId: user?.id }) } }
  );

  const nilaiList = data?.data ?? [];
  const nilaiAkhirList = nilaiList.map((n) => n.nilaiAkhir ?? 0).filter((n) => n > 0);
  const rataRata = nilaiAkhirList.length > 0 ? (nilaiAkhirList.reduce((a, b) => a + b, 0) / nilaiAkhirList.length).toFixed(2) : "-";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Nilai Akademik</h2>
        <p className="text-muted-foreground">Rekap nilai per mata kuliah</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Mata Kuliah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : nilaiList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata Nilai</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{isLoading ? "-" : rataRata}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total SKS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : nilaiList.reduce((sum, n) => sum + (n.sks ?? 0), 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Nilai</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : nilaiList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada nilai</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead className="text-center">SKS</TableHead>
                  <TableHead className="text-center">Tugas</TableHead>
                  <TableHead className="text-center">UTS</TableHead>
                  <TableHead className="text-center">UAS</TableHead>
                  <TableHead className="text-center">Nilai Akhir</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiList.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.mataKuliahNama}</TableCell>
                    <TableCell className="text-muted-foreground">{n.mataKuliahKode}</TableCell>
                    <TableCell className="text-center">{n.sks}</TableCell>
                    <TableCell className="text-center">{n.nilaiTugas ?? "-"}</TableCell>
                    <TableCell className="text-center">{n.nilaiUts ?? "-"}</TableCell>
                    <TableCell className="text-center">{n.nilaiUas ?? "-"}</TableCell>
                    <TableCell className="text-center font-semibold">{n.nilaiAkhir?.toFixed(1) ?? "-"}</TableCell>
                    <TableCell className="text-center">
                      {n.grade ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(n.grade)}`}>
                          {n.grade}
                        </span>
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
