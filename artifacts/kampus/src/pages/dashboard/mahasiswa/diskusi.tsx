import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useListDiskusiRooms, useListDiskusi, useCreateDiskusi, getListDiskusiRoomsQueryKey, getListDiskusiQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function MahasiswaDiskusi() {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");
  const queryClient = useQueryClient();

  const { data: roomsData, isLoading: isRoomsLoading } = useListDiskusiRooms(
    { userId: user?.id },
    { query: { queryKey: getListDiskusiRoomsQueryKey({ userId: user?.id }) } }
  );

  const { data: pesanData, isLoading: isPesanLoading } = useListDiskusi(
    { roomId: selectedRoom ?? "" },
    { query: { enabled: !!selectedRoom, queryKey: getListDiskusiQueryKey({ roomId: selectedRoom ?? "" }) } }
  );

  const { mutate: kirimPesan, isPending } = useCreateDiskusi({
    mutation: {
      onSuccess: () => {
        setPesan("");
        queryClient.invalidateQueries({ queryKey: getListDiskusiQueryKey({ roomId: selectedRoom ?? "" }) });
        queryClient.invalidateQueries({ queryKey: getListDiskusiRoomsQueryKey() });
      },
      onError: () => toast.error("Gagal mengirim pesan"),
    }
  });

  const rooms = roomsData?.data ?? [];
  const messages = pesanData?.data ?? [];

  const handleSend = () => {
    if (!pesan.trim() || !selectedRoom || !user?.id) return;
    kirimPesan({ data: { roomId: selectedRoom, senderId: user.id, pesan } });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Forum Diskusi</h2>
        <p className="text-muted-foreground">Diskusi dengan dosen dan rekan mahasiswa</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 h-[600px]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ruang Diskusi</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto">
            {isRoomsLoading ? (
              <div className="p-4 space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : rooms.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Belum ada ruang diskusi</div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 ${selectedRoom === room.id ? "bg-accent" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{room.nama}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{room.lastMessage || "Belum ada pesan"}</p>
                    </div>
                    {(room.unreadCount ?? 0) > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {!selectedRoom ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Pilih ruang diskusi untuk memulai</p>
            </div>
          ) : (
            <>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base">
                  {rooms.find(r => r.id === selectedRoom)?.nama ?? "Diskusi"}
                </CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isPesanLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-3/4" />)}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">Belum ada pesan</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {!isMe && (
                            <p className="text-xs font-medium mb-1 opacity-70">{msg.senderNama} ({msg.senderRole})</p>
                          )}
                          <p className="text-sm">{msg.pesan}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tulis pesan..."
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} disabled={isPending || !pesan.trim()} size="icon" className="rounded-xl">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
