import { useListKrs, useUpdateKrs, getListKrsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardTick, CloseCircle, TickCircle } from "iconsax-react";
import { toast } from "sonner";

const statusClass: Record<string, string> = {
  disetujui: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  ditolak: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function AdminKrs() {
  const queryClient = useQueryClient();
  const { data: krsList, isLoading } = useListKrs();
  const { mutate: updateKrs, isPending } = useUpdateKrs({
    mutation: {
      onSuccess: () => {
        toast.success("Status KRS diperbarui");
        queryClient.invalidateQueries({ queryKey: getListKrsQueryKey() });
      },
      onError: () => toast.error("Gagal memperbarui KRS"),
    },
  });

  const rows = krsList?.data ?? [];
  const pending = rows.filter((item) => item.status === "pending").length;

  const setStatus = (id: string, status: "disetujui" | "ditolak") => {
    updateKrs({ id, data: { status } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kelola KRS</h2>
          <p className="text-muted-foreground">Pantau dan proses pengajuan Kartu Rencana Studi mahasiswa.</p>
        </div>
        <Badge className="w-fit rounded-full">{pending} menunggu persetujuan</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
            <ClipboardTick variant="Bulk" className="text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{rows.length}</div></CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <TickCircle variant="Bulk" className="text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{rows.filter((item) => item.status === "disetujui").length}</div></CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <CloseCircle variant="Bulk" className="text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{rows.filter((item) => item.status === "ditolak").length}</div></CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Daftar KRS Mahasiswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Memuat data KRS...</TableCell></TableRow>
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Belum ada data KRS.</TableCell></TableRow>
                ) : (
                  rows.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.mahasiswaNama ?? "Mahasiswa"}</p>
                        <p className="text-xs text-muted-foreground">{item.mahasiswaNim ?? "-"}</p>
                      </TableCell>
                      <TableCell>{item.mataKuliahNama}</TableCell>
                      <TableCell>{item.kelas}</TableCell>
                      <TableCell>{item.sks}</TableCell>
                      <TableCell><Badge variant="outline" className={`capitalize ${statusClass[item.status] ?? ""}`}>{item.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button disabled={isPending || item.status === "disetujui"} size="sm" className="rounded-xl" onClick={() => setStatus(item.id, "disetujui")}>Setujui</Button>
                          <Button disabled={isPending || item.status === "ditolak"} size="sm" variant="outline" className="rounded-xl" onClick={() => setStatus(item.id, "ditolak")}>Tolak</Button>
                        </div>
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