import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

type ContentResponse = {
  content: { id: string; key: string; type: string; title: string; content: string; status: string }[];
  applications: { id: string; nama: string; email: string; telepon: string; program: string; status: string; createdAt: string }[];
  auditLogs: { id: string; actorRole: string; action: string; target: string; createdAt: string }[];
};

export default function AdminContent() {
  const [data, setData] = useState<ContentResponse>({ content: [], applications: [], auditLogs: [] });
  const [form, setForm] = useState({ key: "", type: "announcement", title: "", content: "", status: "published" });

  const load = () => apiFetch<ContentResponse>("/content").then(setData).catch((error) => toast.error(error.message));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch("/content", { method: "POST", body: JSON.stringify(form) });
      toast.success("Konten publik tersimpan");
      setForm({ key: "", type: "announcement", title: "", content: "", status: "published" });
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Konten Publik</h1>
        <p className="text-muted-foreground">Tambah pengumuman, profil, informasi PMB, dan pantau pendaftar daring.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Tambah Konten</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Key</Label><Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="pengumuman-krs" required /></div>
                <div className="space-y-2"><Label>Tipe</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="announcement" required /></div>
              </div>
              <div className="space-y-2"><Label>Judul</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Isi</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
              <Button className="rounded-2xl">Simpan Konten</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Konten Aktif</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.content.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-semibold">{item.title}</p><Badge>{item.type}</Badge></div>
                <p className="mt-2 text-sm text-muted-foreground">{item.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Pendaftar Terbaru</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.applications.map((item) => (
              <div key={item.id} className="rounded-2xl bg-muted/50 p-4">
                <p className="font-semibold">{item.nama} · {item.program}</p>
                <p className="text-sm text-muted-foreground">{item.email} · {item.telepon}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Audit Trail</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.auditLogs.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3 text-sm">
                <span>{item.actorRole} · {item.action}</span>
                <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}