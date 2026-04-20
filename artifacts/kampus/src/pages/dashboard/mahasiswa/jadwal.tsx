import { useAuth } from "@/lib/auth";
import { useListJadwal } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MahasiswaJadwal() {
  const { user } = useAuth();
  const { data: jadwalList, isLoading } = useListJadwal({ mahasiswaId: user?.id, semester: "Genap 2024/2025" });

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Jadwal Kuliah</h2>
        <p className="text-muted-foreground">Semester Genap 2024/2025</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {days.map((day) => {
          const dayJadwal = jadwalList?.data?.filter(j => j.hari === day) || [];
          
          return (
            <Card key={day} className="flex flex-col">
              <CardHeader className="bg-muted/30 py-3 border-b">
                <CardTitle className="text-base text-center">{day}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-3 space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : dayJadwal.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center border-2 border-dashed rounded-lg">
                    <Calendar className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">Kosong</p>
                  </div>
                ) : (
                  dayJadwal.map((j) => (
                    <div key={j.id} className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="text-xs font-semibold text-primary mb-1">
                        {j.jamMulai} - {j.jamSelesai}
                      </div>
                      <h4 className="font-medium text-sm leading-tight mb-1">{j.mataKuliahNama}</h4>
                      <p className="text-xs text-muted-foreground truncate">{j.dosenNama}</p>
                      <div className="mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                        Ruang {j.ruangan}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
