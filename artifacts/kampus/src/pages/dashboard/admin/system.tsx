import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { fallbackSiteSettings, type PublicContentItem, type SiteSettings } from "@/lib/site-content";
import { toast } from "sonner";
import { ImageSquare, Newspaper, PaintBrush, PencilSimple, PlusCircle, Trash, FloppyDisk } from "@phosphor-icons/react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  audience?: string;
  category?: string;
  status?: string;
  image?: string;
  createdAt?: string;
};

type ContentResponse = {
  content: PublicContentItem[];
  announcements: Announcement[];
  settings: SiteSettings;
  applications?: { id: string; nama: string; email: string; telepon: string; program: string; status: string; createdAt: string }[];
  auditLogs?: { id: string; actorRole: string; action: string; target: string; createdAt: string }[];
};

const emptyContent = {
  id: "",
  key: "",
  page: "Beranda",
  section: "Hero",
  type: "page",
  title: "",
  content: "",
  image: "",
  status: "published",
  order: 99,
};

const emptyAnnouncement = {
  id: "",
  title: "",
  content: "",
  category: "Akademik",
  audience: "publik",
  status: "published",
  image: "",
};

const pageOptions = ["Beranda", "Pendaftaran", "Program Studi", "Beasiswa", "Galeri", "Pengumuman", "Informasi PMB", "Global"];
const typeOptions = ["page", "profile", "feature", "image", "layout", "admission"];

export default function AdminSystem() {
  const [data, setData] = useState<ContentResponse>({ content: [], announcements: [], settings: fallbackSiteSettings });
  const [contentForm, setContentForm] = useState<PublicContentItem>(emptyContent);
  const [announcementForm, setAnnouncementForm] = useState<Announcement>(emptyAnnouncement);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(fallbackSiteSettings);
  const [activePage, setActivePage] = useState("Semua");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const payload = await apiFetch<ContentResponse>("/content");
      setData({
        content: payload.content || [],
        announcements: payload.announcements || [],
        settings: { ...fallbackSiteSettings, ...(payload.settings || {}) },
        applications: payload.applications || [],
        auditLogs: payload.auditLogs || [],
      });
      setSettingsForm({ ...fallbackSiteSettings, ...(payload.settings || {}) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat pengaturan sistem");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredContent = useMemo(() => {
    const items = [...data.content].sort((a, b) => (a.order || 99) - (b.order || 99));
    if (activePage === "Semua") return items;
    return items.filter((item) => (item.page || "Global") === activePage);
  }, [activePage, data.content]);

  const imageItems = useMemo(() => data.content.filter((item) => item.image || ["page", "image", "profile", "feature"].includes(item.type)), [data.content]);

  const submitContent = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const body = JSON.stringify(contentForm);
      if (contentForm.id) {
        await apiFetch(`/content/${contentForm.id}`, { method: "PUT", body });
        toast.success("Konten berhasil diperbarui");
      } else {
        await apiFetch("/content", { method: "POST", body });
        toast.success("Konten baru berhasil dibuat");
      }
      setContentForm(emptyContent);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan konten");
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (item: PublicContentItem) => {
    if (!window.confirm(`Hapus konten ${item.title}?`)) return;
    try {
      await apiFetch(`/content/${item.id}`, { method: "DELETE" });
      toast.success("Konten dihapus");
      if (contentForm.id === item.id) setContentForm(emptyContent);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus konten");
    }
  };

  const submitAnnouncement = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const body = JSON.stringify(announcementForm);
      if (announcementForm.id) {
        await apiFetch(`/announcements/${announcementForm.id}`, { method: "PUT", body });
        toast.success("Pengumuman diperbarui");
      } else {
        await apiFetch("/announcements", { method: "POST", body });
        toast.success("Pengumuman dipublikasikan");
      }
      setAnnouncementForm(emptyAnnouncement);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan pengumuman");
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (item: Announcement) => {
    if (!window.confirm(`Hapus pengumuman ${item.title}?`)) return;
    try {
      await apiFetch(`/announcements/${item.id}`, { method: "DELETE" });
      toast.success("Pengumuman dihapus");
      if (announcementForm.id === item.id) setAnnouncementForm(emptyAnnouncement);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus pengumuman");
    }
  };

  const submitSettings = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/settings/public-site", { method: "PUT", body: JSON.stringify(settingsForm) });
      toast.success("Pengaturan layout global tersimpan");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan layout global");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Sistem Website</h1>
          <p className="text-muted-foreground">Pusat editor untuk teks, gambar, pengumuman, dan layout semua halaman publik.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full gap-1"><ImageSquare size={14} weight="duotone" /> {imageItems.length} slot gambar</Badge>
          <Badge variant="secondary" className="rounded-full gap-1"><Newspaper size={14} weight="duotone" /> {data.announcements.length} pengumuman</Badge>
          <Badge variant="outline" className="rounded-full gap-1"><PaintBrush size={14} weight="duotone" /> Layout global</Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PencilSimple size={20} weight="duotone" /> Editor Konten & Gambar Page</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitContent} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Halaman</Label>
                  <select value={contentForm.page || "Global"} onChange={(e) => setContentForm({ ...contentForm, page: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {pageOptions.map((page) => <option key={page}>{page}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Tipe</Label>
                  <select value={contentForm.type} onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {typeOptions.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-2"><Label>Key unik</Label><Input value={contentForm.key} onChange={(e) => setContentForm({ ...contentForm, key: e.target.value })} placeholder="contoh: home.hero" required /></div>
                <div className="space-y-2"><Label>Section</Label><Input value={contentForm.section || ""} onChange={(e) => setContentForm({ ...contentForm, section: e.target.value })} placeholder="Hero" /></div>
              </div>
              <div className="space-y-2"><Label>Judul / teks utama</Label><Input value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Isi / deskripsi / layout text</Label><Textarea rows={5} value={contentForm.content} onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })} required /></div>
              <div className="space-y-2"><Label>URL gambar</Label><Input value={contentForm.image || ""} onChange={(e) => setContentForm({ ...contentForm, image: e.target.value })} placeholder="https://..." /></div>
              {contentForm.image && <img src={contentForm.image} alt="Preview konten" className="h-36 w-full rounded-2xl object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2"><Label>Status</Label><select value={contentForm.status || "published"} onChange={(e) => setContentForm({ ...contentForm, status: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none"><option value="published">published</option><option value="draft">draft</option></select></div>
                <div className="space-y-2"><Label>Urutan</Label><Input type="number" value={contentForm.order || 99} onChange={(e) => setContentForm({ ...contentForm, order: Number(e.target.value) })} /></div>
                <div className="flex items-end gap-2">
                  <Button disabled={saving} className="flex-1 rounded-2xl gap-2"><FloppyDisk size={16} weight="duotone" />{contentForm.id ? "Update" : "Tambah"}</Button>
                  {contentForm.id && <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setContentForm(emptyContent)}>Batal</Button>}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Daftar Konten Semua Page</CardTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Semua", ...pageOptions].map((page) => (
                <button key={page} onClick={() => setActivePage(page)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${activePage === page ? "border-primary bg-primary text-white" : "border-[#ded8ca] bg-white text-muted-foreground"}`}>{page}</button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[760px] overflow-auto pr-2">
            {filteredContent.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.title}</p><Badge variant="secondary">{item.page || "Global"}</Badge><Badge variant="outline">{item.key}</Badge></div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
                    {item.image && <p className="mt-2 truncate text-xs text-primary">Gambar: {item.image}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl gap-1" onClick={() => setContentForm({ ...emptyContent, ...item })}><PencilSimple size={14} />Edit</Button>
                    <Button size="sm" variant="destructive" className="rounded-xl gap-1" onClick={() => deleteContent(item)}><Trash size={14} />Hapus</Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredContent.length === 0 && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada konten pada filter ini.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><Newspaper size={20} weight="duotone" /> Pengumuman Publik</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={submitAnnouncement} className="space-y-4 rounded-2xl border bg-muted/20 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Judul</Label><Input value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Kategori</Label><Input value={announcementForm.category || ""} onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })} placeholder="Akademik / PMB / Beasiswa" /></div>
              </div>
              <div className="space-y-2"><Label>Isi pengumuman</Label><Textarea rows={4} value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} required /></div>
              <div className="space-y-2"><Label>URL gambar pengumuman</Label><Input value={announcementForm.image || ""} onChange={(e) => setAnnouncementForm({ ...announcementForm, image: e.target.value })} placeholder="https://..." /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2"><Label>Audience</Label><select value={announcementForm.audience || "publik"} onChange={(e) => setAnnouncementForm({ ...announcementForm, audience: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"><option value="publik">publik</option><option value="semua">semua</option><option value="internal">internal</option></select></div>
                <div className="space-y-2"><Label>Status</Label><select value={announcementForm.status || "published"} onChange={(e) => setAnnouncementForm({ ...announcementForm, status: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"><option value="published">published</option><option value="draft">draft</option></select></div>
                <div className="flex items-end gap-2"><Button disabled={saving} className="flex-1 rounded-2xl gap-2"><PlusCircle size={16} weight="duotone" />{announcementForm.id ? "Update" : "Publish"}</Button>{announcementForm.id && <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setAnnouncementForm(emptyAnnouncement)}>Batal</Button>}</div>
              </div>
            </form>
            <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
              {data.announcements.map((item) => (
                <div key={item.id} className="rounded-2xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.title}</p><Badge>{item.category || "Akademik"}</Badge><Badge variant="outline">{item.status || "published"}</Badge></div><p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.content}</p></div>
                    <div className="flex gap-2"><Button size="sm" variant="outline" className="rounded-xl" onClick={() => setAnnouncementForm({ ...emptyAnnouncement, ...item })}>Edit</Button><Button size="sm" variant="destructive" className="rounded-xl" onClick={() => deleteAnnouncement(item)}>Hapus</Button></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><PaintBrush size={20} weight="duotone" /> Layout Global & Kontak</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitSettings} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Nama brand</Label><Input value={settingsForm.brandName || ""} onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })} /></div>
                <div className="space-y-2"><Label>Tagline navbar</Label><Input value={settingsForm.tagline || ""} onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Email PMB</Label><Input value={settingsForm.contactEmail || ""} onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })} /></div>
              <div className="space-y-2"><Label>Jam/Telepon layanan</Label><Input value={settingsForm.contactPhone || ""} onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Alamat</Label><Textarea rows={2} value={settingsForm.address || ""} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Info biaya PMB</Label><Input value={settingsForm.admissionFee || ""} onChange={(e) => setSettingsForm({ ...settingsForm, admissionFee: e.target.value })} /></div>
                <div className="space-y-2"><Label>Jadwal PMB ringkas</Label><Input value={settingsForm.admissionSchedule || ""} onChange={(e) => setSettingsForm({ ...settingsForm, admissionSchedule: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Catatan footer</Label><Textarea rows={3} value={settingsForm.footerNote || ""} onChange={(e) => setSettingsForm({ ...settingsForm, footerNote: e.target.value })} /></div>
              <Button disabled={saving} className="rounded-2xl gap-2"><FloppyDisk size={16} weight="duotone" /> Simpan Layout Global</Button>
            </form>

            <div className="mt-6 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Cara pakai singkat:</p>
              <p className="mt-1">Edit item dengan key bawaan seperti <span className="font-mono text-primary">home.hero</span>, <span className="font-mono text-primary">pengumuman.hero</span>, atau <span className="font-mono text-primary">pendaftaran.form</span>. Ganti URL gambar untuk mengubah visual di halaman publik.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
