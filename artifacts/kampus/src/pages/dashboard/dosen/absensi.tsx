import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useListAbsensi, useListMahasiswa, useListJadwal, useCreateAbsensi, useUpdateAbsensi, getListAbsensiQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  hadir: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  izin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  sakit: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  alpha: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function DosenAbsensi() {
  const { user } = useAuth();
  const [selectedJadwal, setSelectedJadwal] = useState<string>("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const queryClient = useQueryClient();

  const { data: jadwalData } = useListJadwal({ dosenId: user?.id });
  const { data: absensiData, isLoading } = useListAbsensi(
    { dosenId: user?.id, jadwalId: selectedJadwal || undefined, tanggal },
    { query: { queryKey: getListAbsensiQueryKey({ dosenId: user?.id, jadwalId: selectedJadwal || undefined, tanggal }) } }
  );
  const { data: mahasiswaData } = useListMahasiswa();

  const { mutate: createAbsensi } = useCreateAbsensi({
    mutation: {
      onSuccess: () => {
        toast.success("Absensi dicatat");
        queryClient.invalidateQueries({ queryKey: getListAbsensiQueryKey() });
      },
      onError: () => toast.error("Gagal mencatat absensi"),
    }
  });

  const { mutate: updateAbsensi } = useUpdateAbsensi({
    mutation: {
      onSuccess: () => {
        toast.success("Status absensi diperbarui");
        queryClient.invalidateQueries({ queryKey: getListAbsensiQueryKey() });
      },
    }
  });

  const absensiList = absensiData?.data ?? [];
  const jadwalList = jadwalData?.data ?? [];

  const handleUpdateStatus = (id: string, status: string) => {
    updateAbsensi({ id, data: { status: status as "hadir" | "izin" | "sakit" | "alpha" } });
  };

  const handleCreateAbsensi = (mahasiswaId: string, status: string) => {
    if (!selectedJadwal) { toast.error("Pilih jadwal terlebih dahulu"); return; }
    createAbsensi({ data: { mahasiswaId, jadwalId: selectedJadwal, dosenId: user?.id ?? "", tanggal, status: status as "hadir" | "izin" | "sakit" | "alpha" } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Kelola Absensi Mahasiswa</h2>
        <p className="text-muted-foreground">Catat kehadiran mahasiswa per sesi kuliah</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedJadwal} onValueChange={setSelectedJadwal}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Pilih jadwal kuliah" />
            </SelectTrigger>
            <SelectContent>
              {jadwalList.map(j => (
                <SelectItem key={j.id} value={j.id}>{j.mataKuliahNama} - {j.hari} {j.jamMulai}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <input
          type="date"
          value={tanggal}
          onChange={e => setTanggal(e.target.value)}
          className="px-3 py-2 rounded-xl border border-input bg-background text-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Absensi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : absensiList.length === 0 && selectedJadwal ? (
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Belum ada absensi untuk sesi ini. Catat absensi mahasiswa:</p>
              <div className="space-y-2">
                {(mahasiswaData?.data ?? []).slice(0, 10).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border">
                    <div>
                      <p className="font-medium text-sm">{m.nama}</p>
                      <p className="text-xs text-muted-foreground">{m.nim}</p>
                    </div>
                    <div className="flex gap-2">
                      {["hadir", "izin", "sakit", "alpha"].map(status => (
                        <Button key={status} variant="outline" size="sm" className="rounded-lg capitalize text-xs"
                          onClick={() => handleCreateAbsensi(m.id, status)}>
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : absensiList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Pilih jadwal untuk melihat absensi</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-center">Ubah Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absensiList.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.mahasiswaNama}</TableCell>
                    <TableCell className="text-muted-foreground">{a.mahasiswaNim}</TableCell>
                    <TableCell>{a.tanggal}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status] ?? ""}`}>
                        {a.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{a.keterangan || "-"}</TableCell>
                    <TableCell>
                      <Select value={a.status} onValueChange={(v) => handleUpdateStatus(a.id, v)}>
                        <SelectTrigger className="h-8 rounded-lg w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["hadir", "izin", "sakit", "alpha"].map(s => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
