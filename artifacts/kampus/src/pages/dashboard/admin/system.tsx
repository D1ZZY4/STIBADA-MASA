import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AdminSystem() {
  const items = [
    ["Hak akses granular", "Role dasar dapat diperluas menjadi permission per modul."],
    ["2FA admin/rektor", "Siap diaktifkan untuk akun sensitif sebelum akses penuh."],
    ["Payment gateway", "Stripe tersedia sebagai koneksi resmi ketika akun disambungkan."],
    ["Perpustakaan digital", "Katalog e-book dan jurnal disiapkan untuk integrasi API."],
    ["E-learning", "Sinkronisasi materi, tugas, forum, dan pengingat otomatis."],
    ["Backup database", "Gunakan MONGODB_URI production dan job backup berkala."],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">Konfigurasi global, keamanan, integrasi, dan parameter operasional.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map(([title, desc], index) => (
          <Card key={title} className="rounded-3xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-lg">{title}</CardTitle>
              <Switch defaultChecked={index < 2} aria-label={`Aktifkan ${title}`} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{desc}</p>
              <Badge variant={index < 2 ? "default" : "secondary"}>{index < 2 ? "Aktif" : "Siap dikonfigurasi"}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}