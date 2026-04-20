import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/ui/image-uploader";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { PencilSimple, Trash, Plus, Images } from "@phosphor-icons/react";

type ContentItem = {
  id: string;
  key: string;
  page?: string;
  section?: string;
  type: string;
  title: string;
  content: string;
  image?: string;
  status: string;
};

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  createdAt?: string;
};

type ContentResponse = {
  content: ContentItem[];
  applications: { id: string; nama: string; email: string; telepon: string; program: string; status: string; createdAt: string }[];
  auditLogs: { id: string; actorRole: string; action: string; target: string; createdAt: string }[];
};

const emptyGallery: GalleryItem = { id: "", title: "", description: "", category: "umum", image: "" };
const categoryOptions = ["wisuda", "seminar", "olahraga", "ekskul", "pengmas", "akademik", "umum"];

export default function AdminContent() {
  const [data, setData] = useState<ContentResponse>({ content: [], applications: [], auditLogs: [] });
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState({ key: "", page: "Global", section: "Umum", type: "page", title: "", content: "", image: "", status: "published" });
  const [galleryForm, setGalleryForm] = useState<GalleryItem>(emptyGallery);
  const [activeTab, setActiveTab] = useState<"content" | "gallery">("content");

  const load = () => Promise.all([
    apiFetch<ContentResponse>("/content").then(setData).catch((e) => toast.error(e.message)),
    apiFetch<GalleryItem[]>("/gallery").then(setGallery).catch(() => {}),
  ]);

  useEffect(() => { load(); }, []);

  const submitContent = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch("/content", { method: "POST", body: JSON.stringify(form) });
      toast.success("Konten publik tersimpan");
      setForm({ key: "", page: "Global", section: "Umum", type: "page", title: "", content: "", image: "", status: "published" });
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    }
  };

  const submitGallery = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (galleryForm.id) {
        await apiFetch(`/gallery/${galleryForm.id}`, { method: "PUT", body: JSON.stringify(galleryForm) });
        toast.success("Item galeri diperbarui");
      } else {
        await apiFetch("/gallery", { method: "POST", body: JSON.stringify(galleryForm) });
        toast.success("Item galeri ditambahkan");
      }
      setGalleryForm(emptyGallery);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan galeri");
    }
  };

  const deleteGallery = async (item: GalleryItem) => {
    if (!window.confirm(`Hapus "${item.title}" dari galeri?`)) return;
    try {
      await apiFetch(`/gallery/${item.id}`, { method: "DELETE" });
      toast.success("Item galeri dihapus");
      if (galleryForm.id === item.id) setGalleryForm(emptyGallery);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Konten Publik</h1>
        <p className="text-muted-foreground">Tambah konten, kelola galeri kampus, dan pantau pendaftar daring.</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setActiveTab("content")} className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${activeTab === "content" ? "bg-primary text-white border-primary" : "border text-muted-foreground hover:border-primary/50"}`}>
          Konten Page
        </button>
        <button onClick={() => setActiveTab("gallery")} className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "gallery" ? "bg-primary text-white border-primary" : "border text-muted-foreground hover:border-primary/50"}`}>
          <Images size={14} weight="duotone" /> Galeri Kampus
        </button>
      </div>

      {activeTab === "content" && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl">
            <CardHeader><CardTitle>Tambah Konten</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitContent} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Key</Label><Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="pengumuman-krs" required /></div>
                  <div className="space-y-2"><Label>Tipe</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="announcement" required /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Halaman</Label><Input value={form.page} onChange={(e) => setForm({ ...form, page: e.target.value })} placeholder="Beranda" /></div>
                  <div className="space-y-2"><Label>Section</Label><Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="Hero" /></div>
                </div>
                <div className="space-y-2"><Label>Judul</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Isi</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
                <ImageUploader
                  label="Gambar konten"
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  hint="card"
                />
                <Button className="rounded-2xl">Simpan Konten</Button>
              </form>
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader><CardTitle>Konten Aktif</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-h-[700px] overflow-auto pr-2">
              {data.content.map((item) => (
                <div key={item.id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.title}</p>
                    <div className="flex gap-2"><Badge>{item.type}</Badge>{item.page && <Badge variant="outline">{item.page}</Badge>}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                  {item.image && <img src={item.image} alt={item.title} className="mt-3 h-24 w-full rounded-2xl object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus size={18} weight="duotone" /> {galleryForm.id ? "Edit Item Galeri" : "Tambah ke Galeri"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitGallery} className="space-y-4">
                <div className="space-y-2"><Label>Judul foto / kegiatan</Label><Input value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Deskripsi singkat</Label><Textarea rows={2} value={galleryForm.description || ""} onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <select value={galleryForm.category || "umum"} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none">
                    {categoryOptions.map((cat) => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <ImageUploader
                  label="Foto kegiatan"
                  value={galleryForm.image || ""}
                  onChange={(url) => setGalleryForm({ ...galleryForm, image: url })}
                  hint="gallery"
                />
                <div className="flex gap-2">
                  <Button className="rounded-2xl flex-1">{galleryForm.id ? "Update" : "Tambah ke Galeri"}</Button>
                  {galleryForm.id && <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setGalleryForm(emptyGallery)}>Batal</Button>}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Images size={20} weight="duotone" /> Galeri Kampus ({gallery.length} foto)</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-h-[700px] overflow-auto pr-2">
              {gallery.map((item) => (
                <div key={item.id} className="rounded-2xl border p-4">
                  <div className="flex gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="h-20 w-28 rounded-xl object-cover shrink-0" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold truncate">{item.title}</p>
                        <Badge variant="outline" className="shrink-0 capitalize">{item.category}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-xl gap-1" onClick={() => setGalleryForm({ ...emptyGallery, ...item })}>
                          <PencilSimple size={13} /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="rounded-xl gap-1" onClick={() => deleteGallery(item)}>
                          <Trash size={13} /> Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && (
                <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada foto di galeri.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Pendaftar Terbaru</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.applications.length === 0 && <p className="text-sm text-muted-foreground">Belum ada pendaftar.</p>}
            {data.applications.map((item) => (
              <div key={item.id} className="rounded-2xl bg-muted/50 p-4">
                <p className="font-semibold">{item.nama} · {item.program}</p>
                <p className="text-sm text-muted-foreground">{item.email} · {item.telepon}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleString("id-ID")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Audit Trail</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-auto">
            {data.auditLogs.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3 text-sm">
                <span className="font-medium">{item.actorRole} · {item.action}</span>
                <span className="text-muted-foreground text-xs">{new Date(item.createdAt).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
