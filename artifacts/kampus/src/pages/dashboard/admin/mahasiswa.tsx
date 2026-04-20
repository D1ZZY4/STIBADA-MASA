import { useState } from "react";
import { useListMahasiswa, useCreateMahasiswa, useDeleteMahasiswa, getListMahasiswaQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export default function AdminMahasiswa() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: mahasiswaList, isLoading } = useListMahasiswa({ search });
  const deleteMutation = useDeleteMahasiswa();
  
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Mahasiswa berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: getListMahasiswaQueryKey() });
      } catch (error) {
        toast.error("Gagal menghapus data");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Mahasiswa</h2>
          <p className="text-muted-foreground">Kelola data mahasiswa aktif dan alumni.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Tambah Mahasiswa
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIM..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Prodi</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : mahasiswaList?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada data ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  mahasiswaList?.data?.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.nim}</TableCell>
                      <TableCell>{m.nama}</TableCell>
                      <TableCell>{m.prodi}</TableCell>
                      <TableCell>{m.semester}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          m.status === 'aktif' ? 'bg-primary/10 text-primary' :
                          m.status === 'lulus' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
