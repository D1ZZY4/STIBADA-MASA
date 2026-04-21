import { useAuth } from "@/lib/auth";
import { useListKrs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MahasiswaKrs() {
  const { user } = useAuth();
  const { data: krsList, isLoading } = useListKrs({ mahasiswaId: user?.id, semester: "Genap 2024/2025" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kartu Rencana Studi</h2>
          <p className="text-muted-foreground">Semester Genap 2024/2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Cetak KRS
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Mata Kuliah
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total SKS Diambil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{krsList?.totalSks ?? 0} SKS</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Batas Maksimal SKS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24 SKS</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status Persetujuan</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-lg py-1 bg-primary/10 text-primary border-primary/20">
              DISETUJUI DOSEN WALI
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mata Kuliah</CardTitle>
          <CardDescription>Mata kuliah yang Anda ambil pada semester ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="text-center">SKS</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Skeleton className="h-8 w-full max-w-sm mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : krsList?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada mata kuliah yang diambil
                    </TableCell>
                  </TableRow>
                ) : (
                  krsList?.data?.map((krs) => (
                    <TableRow key={krs.id}>
                      <TableCell className="font-medium">{krs.mataKuliahKode}</TableCell>
                      <TableCell>{krs.mataKuliahNama}</TableCell>
                      <TableCell>{krs.kelas}</TableCell>
                      <TableCell className="text-center">{krs.sks}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          krs.status === 'disetujui' ? 'bg-primary/10 text-primary' :
                          krs.status === 'pending' ? 'bg-muted text-muted-foreground' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {krs.status.toUpperCase()}
                        </span>
                      </TableCell>
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
