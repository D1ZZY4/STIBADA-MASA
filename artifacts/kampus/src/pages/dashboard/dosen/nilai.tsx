import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useListNilai, useListMahasiswa, useListMataKuliah, useCreateNilai, useUpdateNilai, getListNilaiQueryKey, type Nilai } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

function getGradeColor(grade: string = "") {
  if (grade === "A" || grade === "A-") return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (grade.startsWith("B")) return "text-blue-600 font-semibold";
  if (grade.startsWith("C")) return "text-yellow-600 font-semibold";
  return "text-red-600 font-semibold";
}

export default function DosenNilai() {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ mahasiswaId: "", mataKuliahId: "", semester: "2024/2025 Ganjil", nilaiTugas: "", nilaiUts: "", nilaiUas: "" });
  const queryClient = useQueryClient();

  const { data: nilaiData, isLoading } = useListNilai(
    { dosenId: user?.id },
    { query: { queryKey: getListNilaiQueryKey({ dosenId: user?.id }) } }
  );
  const { data: mahasiswaData } = useListMahasiswa();
  const { data: mkData } = useListMataKuliah();

  const { mutate: createNilai, isPending: isCreating } = useCreateNilai({
    mutation: {
      onSuccess: () => {
        toast.success("Nilai berhasil ditambahkan");
        setOpenDialog(false);
        setForm({ mahasiswaId: "", mataKuliahId: "", semester: "2024/2025 Ganjil", nilaiTugas: "", nilaiUts: "", nilaiUas: "" });
        queryClient.invalidateQueries({ queryKey: getListNilaiQueryKey() });
      },
      onError: () => toast.error("Gagal menyimpan nilai"),
    }
  });

  const { mutate: updateNilai, isPending: isUpdating } = useUpdateNilai({
    mutation: {
      onSuccess: () => {
        toast.success("Nilai berhasil diperbarui");
        setOpenDialog(false);
        setEditId(null);
        queryClient.invalidateQueries({ queryKey: getListNilaiQueryKey() });
      },
      onError: () => toast.error("Gagal memperbarui nilai"),
    }
  });

  const handleSubmit = () => {
    if (editId) {
      updateNilai({ id: editId, data: { nilaiTugas: parseFloat(form.nilaiTugas), nilaiUts: parseFloat(form.nilaiUts), nilaiUas: parseFloat(form.nilaiUas) } });
    } else {
      if (!form.mahasiswaId || !form.mataKuliahId) { toast.error("Lengkapi semua field"); return; }
      createNilai({ data: { mahasiswaId: form.mahasiswaId, mataKuliahId: form.mataKuliahId, dosenId: user?.id ?? "", semester: form.semester, nilaiTugas: parseFloat(form.nilaiTugas) || 0, nilaiUts: parseFloat(form.nilaiUts) || 0, nilaiUas: parseFloat(form.nilaiUas) || 0 } });
    }
  };

  const openEdit = (n: Nilai) => {
    setEditId(n.id);
    setForm({ mahasiswaId: n.mahasiswaId, mataKuliahId: n.mataKuliahId, semester: n.semester, nilaiTugas: String(n.nilaiTugas ?? ""), nilaiUts: String(n.nilaiUts ?? ""), nilaiUas: String(n.nilaiUas ?? "") });
    setOpenDialog(true);
  };

  const nilaiList = nilaiData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Input Nilai Mahasiswa</h2>
          <p className="text-muted-foreground">Kelola nilai mahasiswa yang Anda ajar</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ mahasiswaId: "", mataKuliahId: "", semester: "2024/2025 Ganjil", nilaiTugas: "", nilaiUts: "", nilaiUas: "" }); setOpenDialog(true); }} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Input Nilai
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : nilaiList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada data nilai</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead className="text-center">Tugas</TableHead>
                  <TableHead className="text-center">UTS</TableHead>
                  <TableHead className="text-center">UAS</TableHead>
                  <TableHead className="text-center">Akhir</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiList.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.mahasiswaNama}</TableCell>
                    <TableCell className="text-muted-foreground">{n.mahasiswaNim}</TableCell>
                    <TableCell>{n.mataKuliahNama}</TableCell>
                    <TableCell className="text-center">{n.nilaiTugas ?? "-"}</TableCell>
                    <TableCell className="text-center">{n.nilaiUts ?? "-"}</TableCell>
                    <TableCell className="text-center">{n.nilaiUas ?? "-"}</TableCell>
                    <TableCell className="text-center">{n.nilaiAkhir?.toFixed(1) ?? "-"}</TableCell>
                    <TableCell className="text-center">
                      <span className={getGradeColor(n.grade ?? "")}>{n.grade ?? "-"}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(n)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Nilai" : "Input Nilai Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editId && (
              <>
                <div className="space-y-2">
                  <Label>Mahasiswa</Label>
                  <Select value={form.mahasiswaId} onValueChange={(v) => setForm(f => ({ ...f, mahasiswaId: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih mahasiswa" /></SelectTrigger>
                    <SelectContent>{(mahasiswaData?.data ?? []).map(m => <SelectItem key={m.id} value={m.id}>{m.nama} ({m.nim})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mata Kuliah</Label>
                  <Select value={form.mataKuliahId} onValueChange={(v) => setForm(f => ({ ...f, mataKuliahId: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih mata kuliah" /></SelectTrigger>
                    <SelectContent>{(mkData?.data ?? []).map(mk => <SelectItem key={mk.id} value={mk.id}>{mk.nama}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Nilai Tugas</Label>
                <Input type="number" min="0" max="100" placeholder="0-100" value={form.nilaiTugas} onChange={e => setForm(f => ({ ...f, nilaiTugas: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Nilai UTS</Label>
                <Input type="number" min="0" max="100" placeholder="0-100" value={form.nilaiUts} onChange={e => setForm(f => ({ ...f, nilaiUts: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Nilai UAS</Label>
                <Input type="number" min="0" max="100" placeholder="0-100" value={form.nilaiUas} onChange={e => setForm(f => ({ ...f, nilaiUas: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="rounded-xl">Batal</Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating} className="rounded-xl">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
