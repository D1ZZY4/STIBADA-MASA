import { useState } from "react";
import { useListDosen, useCreateDosen, useUpdateDosen, getListDosenQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function AdminDosen() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nidn: "", nama: "", email: "", prodi: "", jabatan: "" });
  const queryClient = useQueryClient();

  const { data, isLoading } = useListDosen({}, { query: { queryKey: getListDosenQueryKey({}) } });

  const { mutate: create, isPending: isCreating } = useCreateDosen({
    mutation: {
      onSuccess: () => { toast.success("Dosen ditambahkan"); setOpenDialog(false); setForm({ nidn: "", nama: "", email: "", prodi: "", jabatan: "" }); queryClient.invalidateQueries({ queryKey: getListDosenQueryKey() }); },
      onError: () => toast.error("Gagal menambahkan dosen"),
    }
  });

  const { mutate: update, isPending: isUpdating } = useUpdateDosen({
    mutation: {
      onSuccess: () => { toast.success("Data dosen diperbarui"); setOpenDialog(false); setEditId(null); queryClient.invalidateQueries({ queryKey: getListDosenQueryKey() }); },
      onError: () => toast.error("Gagal memperbarui"),
    }
  });

  const dosenList = data?.data ?? [];

  const handleSubmit = () => {
    if (!form.nama || !form.email) { toast.error("Nama dan email wajib diisi"); return; }
    if (editId) {
      update({ id: editId, data: { nama: form.nama, email: form.email, prodi: form.prodi, jabatan: form.jabatan } });
    } else {
      if (!form.nidn) { toast.error("NIDN wajib diisi"); return; }
      create({ data: { nidn: form.nidn, nama: form.nama, email: form.email, prodi: form.prodi, jabatan: form.jabatan, password: "dosen123" } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Dosen</h2>
          <p className="text-muted-foreground">Kelola data dosen universitas</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ nidn: "", nama: "", email: "", prodi: "", jabatan: "" }); setOpenDialog(true); }} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Tambah Dosen
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : dosenList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada data dosen</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIDN</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program Studi</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenList.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell><span className="font-mono text-sm">{d.nidn}</span></TableCell>
                    <TableCell className="font-medium">{d.nama}</TableCell>
                    <TableCell className="text-muted-foreground">{d.email}</TableCell>
                    <TableCell>{d.prodi || "-"}</TableCell>
                    <TableCell>{d.jabatan || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => { setEditId(d.id); setForm({ nidn: d.nidn, nama: d.nama, email: d.email, prodi: d.prodi ?? "", jabatan: d.jabatan ?? "" }); setOpenDialog(true); }}>
                          <Pencil className="h-4 w-4" />
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
            <DialogTitle>{editId ? "Edit Data Dosen" : "Tambah Dosen Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editId && (
              <div className="space-y-2">
                <Label>NIDN</Label>
                <Input placeholder="0123456789" value={form.nidn} onChange={e => setForm(f => ({ ...f, nidn: e.target.value }))} className="rounded-xl" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input placeholder="Dr. Ahmad Yani, M.Kom" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="dosen@kampus.ac.id" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Program Studi</Label>
              <Input placeholder="Teknik Informatika" value={form.prodi} onChange={e => setForm(f => ({ ...f, prodi: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Jabatan</Label>
              <Input placeholder="Lektor Kepala" value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} className="rounded-xl" />
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
