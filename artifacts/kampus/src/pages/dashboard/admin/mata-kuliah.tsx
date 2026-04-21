import { useState } from "react";
import { useListMataKuliah, useCreateMataKuliah, useUpdateMataKuliah, useDeleteMataKuliah, getListMataKuliahQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const semesterOptions = ["1","2","3","4","5","6","7","8"];

export default function AdminMataKuliah() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ kode: "", nama: "", sks: "3", semester: "1", prodi: "" });
  const queryClient = useQueryClient();

  const { data, isLoading } = useListMataKuliah(
    {},
    { query: { queryKey: getListMataKuliahQueryKey({}) } }
  );

  const { mutate: create, isPending: isCreating } = useCreateMataKuliah({
    mutation: {
      onSuccess: () => { toast.success("Mata kuliah ditambahkan"); setOpenDialog(false); setForm({ kode: "", nama: "", sks: "3", semester: "1", prodi: "" }); queryClient.invalidateQueries({ queryKey: getListMataKuliahQueryKey() }); },
      onError: () => toast.error("Gagal menambahkan mata kuliah"),
    }
  });

  const { mutate: update, isPending: isUpdating } = useUpdateMataKuliah({
    mutation: {
      onSuccess: () => { toast.success("Mata kuliah diperbarui"); setOpenDialog(false); setEditId(null); queryClient.invalidateQueries({ queryKey: getListMataKuliahQueryKey() }); },
      onError: () => toast.error("Gagal memperbarui"),
    }
  });

  const { mutate: remove } = useDeleteMataKuliah({
    mutation: {
      onSuccess: () => { toast.success("Mata kuliah dihapus"); queryClient.invalidateQueries({ queryKey: getListMataKuliahQueryKey() }); },
      onError: () => toast.error("Gagal menghapus"),
    }
  });

  const mklist = data?.data ?? [];

  const handleSubmit = () => {
    if (!form.kode || !form.nama) { toast.error("Kode dan nama wajib diisi"); return; }
    if (editId) {
      update({ id: editId, data: { nama: form.nama, sks: parseInt(form.sks), semester: parseInt(form.semester), prodi: form.prodi } });
    } else {
      create({ data: { kode: form.kode, nama: form.nama, sks: parseInt(form.sks), semester: parseInt(form.semester), prodi: form.prodi } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Mata Kuliah</h2>
          <p className="text-muted-foreground">Kelola data mata kuliah universitas</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ kode: "", nama: "", sks: "3", semester: "1", prodi: "" }); setOpenDialog(true); }} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Tambah Mata Kuliah
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : mklist.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada mata kuliah</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Program Studi</TableHead>
                  <TableHead className="text-center">SKS</TableHead>
                  <TableHead className="text-center">Semester</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mklist.map((mk) => (
                  <TableRow key={mk.id}>
                    <TableCell><span className="font-mono text-sm font-medium">{mk.kode}</span></TableCell>
                    <TableCell className="font-medium">{mk.nama}</TableCell>
                    <TableCell className="text-muted-foreground">{mk.prodi || "-"}</TableCell>
                    <TableCell className="text-center">{mk.sks}</TableCell>
                    <TableCell className="text-center">{mk.semester}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => { setEditId(mk.id); setForm({ kode: mk.kode, nama: mk.nama, sks: String(mk.sks), semester: String(mk.semester), prodi: mk.prodi ?? "" }); setOpenDialog(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Hapus mata kuliah ini?")) remove({ id: mk.id }); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <DialogTitle>{editId ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editId && (
              <div className="space-y-2">
                <Label>Kode Mata Kuliah</Label>
                <Input placeholder="contoh: CS101" value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value }))} className="rounded-xl" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Nama Mata Kuliah</Label>
              <Input placeholder="Algoritma dan Pemrograman" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Program Studi</Label>
              <Input placeholder="Teknik Informatika" value={form.prodi} onChange={e => setForm(f => ({ ...f, prodi: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>SKS</Label>
                <Select value={form.sks} onValueChange={v => setForm(f => ({ ...f, sks: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{["1","2","3","4","5","6"].map(s => <SelectItem key={s} value={s}>{s} SKS</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={v => setForm(f => ({ ...f, semester: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{semesterOptions.map(s => <SelectItem key={s} value={s}>Semester {s}</SelectItem>)}</SelectContent>
                </Select>
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
