import { useAuth } from "@/lib/auth";
import { useListJadwal, getListJadwalQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Users } from "lucide-react";

const HARI_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_COLORS: Record<string, string> = {
  Senin: "bg-muted text-muted-foreground",
  Selasa: "bg-primary/10 text-primary",
  Rabu: "bg-secondary text-secondary-foreground",
  Kamis: "bg-accent text-accent-foreground",
  Jumat: "bg-destructive/10 text-destructive",
  Sabtu: "bg-muted text-muted-foreground",
};

export default function DosenJadwal() {
  const { user } = useAuth();
  const { data, isLoading } = useListJadwal(
    { dosenId: user?.id },
    { query: { queryKey: getListJadwalQueryKey({ dosenId: user?.id }) } }
  );

  const jadwalList = data?.data ?? [];
  const jadwalByHari = HARI_ORDER.map(hari => ({
    hari,
    items: jadwalList.filter(j => j.hari === hari).sort((a, b) => (a.jamMulai ?? "").localeCompare(b.jamMulai ?? "")),
  })).filter(h => h.items.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Jadwal Mengajar</h2>
        <p className="text-muted-foreground">Jadwal kelas Anda semester ini</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          [1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)
        ) : jadwalByHari.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">Belum ada jadwal mengajar</div>
        ) : (
          jadwalByHari.map(({ hari, items }) => (
            <div key={hari} className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{hari}</h3>
              {items.map(j => (
                <Card key={j.id} className="border-l-4" style={{ borderLeftColor: hari === "Senin" ? "#3b82f6" : hari === "Selasa" ? "#10b981" : hari === "Rabu" ? "#8b5cf6" : hari === "Kamis" ? "#f97316" : hari === "Jumat" ? "#f43f5e" : "#eab308" }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{j.mataKuliahNama}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{j.mataKuliahKode} • {j.sks} SKS</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${HARI_COLORS[hari]}`}>{j.kelas}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.jamMulai} - {j.jamSelesai}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.ruangan}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
