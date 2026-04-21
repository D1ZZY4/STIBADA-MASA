import { useState } from "react";
import { useListJadwal, useListMataKuliah, useListDosen, useCreateJadwal, useDeleteJadwal, getListJadwalQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const HARI_OPTIONS = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export default function AdminJadwal() {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ mataKuliahId: "", dosenId: "", hari: "Senin", jamMulai: "07:00", jamSelesai: "09:00", ruangan: "", kelas: "" });
  const queryClient = useQueryClient();

  const { data, isLoading } = useListJadwal({}, { query: { queryKey: getListJadwalQueryKey({}) } });
  const { data: mkData } = useListMataKuliah();
  const { data: dosenData } = useListDosen();

  const { mutate: create, isPending: isCreating } = useCreateJadwal({
    mutation: {
      onSuccess: () => { toast.success("Jadwal ditambahkan"); setOpenDialog(false); queryClient.invalidateQueries({ queryKey: getListJadwalQueryKey() }); },
      onError: () => toast.error("Gagal menambahkan jadwal"),
    }
  });

  const { mutate: remove } = useDeleteJadwal({
    mutation: {
      onSuccess: () => { toast.success("Jadwal dihapus"); queryClient.invalidateQueries({ queryKey: getListJadwalQueryKey() }); },
    }
  });

  const jadwalList = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Jadwal</h2>
          <p className="text-muted-foreground">Atur jadwal kuliah per semester</p>
        </div>
        <Button onClick={() => setOpenDialog(true)} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Tambah Jadwal
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : jadwalList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada jadwal</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jadwalList.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.mataKuliahNama}</TableCell>
                    <TableCell>{j.dosenNama}</TableCell>
                    <TableCell>{j.hari}</TableCell>
                    <TableCell>{j.jamMulai} - {j.jamSelesai}</TableCell>
                    <TableCell>{j.ruangan}</TableCell>
                    <TableCell>{j.kelas}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Hapus jadwal ini?")) remove({ id: j.id }); }}>
                        <Trash2 className="h-4 w-4" />
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
            <DialogTitle>Tambah Jadwal Kuliah</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Mata Kuliah</Label>
              <Select value={form.mataKuliahId} onValueChange={v => setForm(f => ({ ...f, mataKuliahId: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih mata kuliah" /></SelectTrigger>
                <SelectContent>{(mkData?.data ?? []).map(mk => <SelectItem key={mk.id} value={mk.id}>{mk.nama}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dosen Pengampu</Label>
              <Select value={form.dosenId} onValueChange={v => setForm(f => ({ ...f, dosenId: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih dosen" /></SelectTrigger>
                <SelectContent>{(dosenData?.data ?? []).map(d => <SelectItem key={d.id} value={d.id}>{d.nama}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Hari</Label>
                <Select value={form.hari} onValueChange={v => setForm(f => ({ ...f, hari: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{HARI_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Input placeholder="A" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Jam Mulai</Label>
                <Input type="time" value={form.jamMulai} onChange={e => setForm(f => ({ ...f, jamMulai: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Jam Selesai</Label>
                <Input type="time" value={form.jamSelesai} onChange={e => setForm(f => ({ ...f, jamSelesai: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ruangan</Label>
              <Input placeholder="GKB 101" value={form.ruangan} onChange={e => setForm(f => ({ ...f, ruangan: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="rounded-xl">Batal</Button>
            <Button onClick={() => {
              if (!form.mataKuliahId || !form.dosenId || !form.kelas) { toast.error("Lengkapi semua field"); return; }
              create({ data: { mataKuliahId: form.mataKuliahId, dosenId: form.dosenId, hari: form.hari, jamMulai: form.jamMulai, jamSelesai: form.jamSelesai, ruangan: form.ruangan, kelas: form.kelas, semester: "2024/2025 Ganjil" } });
            }} disabled={isCreating} className="rounded-xl">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
