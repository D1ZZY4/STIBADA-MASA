import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useListDiskusiRooms, useListDiskusi, useCreateDiskusi, getListDiskusiRoomsQueryKey, getListDiskusiQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatCircleText, PaperPlaneRight } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function DosenDiskusi() {
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
        queryClient.invalidateQueries({ queryKey: getListDiskusiRoomsQueryKey({ userId: user?.id }) });
      },
      onError: () => toast.error("Gagal mengirim pesan"),
    },
  });

  const rooms = roomsData?.data ?? [];
  const messages = pesanData?.data ?? [];

  const handleSend = () => {
    if (!pesan.trim() || !selectedRoom || !user?.id) return;
    kirimPesan({ data: { roomId: selectedRoom, senderId: user.id, pesan } });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
            <ChatCircleText weight="duotone" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Diskusi Dosen</h2>
            <p className="text-muted-foreground">Ruang komunikasi dosen dengan mahasiswa, dosen lain, admin, dan pimpinan kampus.</p>
          </div>
        </div>
      </div>

      <div className="grid h-[620px] gap-4 md:grid-cols-3">
        <Card className="overflow-hidden rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ruang Diskusi</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto p-0">
            {isRoomsLoading ? (
              <div className="space-y-3 p-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : rooms.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Belum ada ruang diskusi</div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-accent ${selectedRoom === room.id ? "bg-accent" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{room.nama}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{room.lastMessage || "Belum ada pesan"}</p>
                    </div>
                    {(room.unreadCount ?? 0) > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden rounded-3xl md:col-span-2">
          {!selectedRoom ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p>Pilih ruang diskusi untuk memulai percakapan</p>
            </div>
          ) : (
            <>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-base">{rooms.find((r) => r.id === selectedRoom)?.nama ?? "Diskusi"}</CardTitle>
              </CardHeader>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {isPesanLoading ? (
                  <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-3/4" />)}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">Belum ada pesan</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[72%] rounded-2xl px-4 py-2 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {!isMe && <p className="mb-1 text-xs font-medium opacity-70">{msg.senderNama} ({msg.senderRole})</p>}
                          <p className="text-sm">{msg.pesan}</p>
                          <p className={`mt-1 text-xs ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tulis pesan diskusi..."
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="flex-1 rounded-xl"
                  />
                  <Button onClick={handleSend} disabled={isPending || !pesan.trim()} size="icon" className="rounded-xl">
                    <PaperPlaneRight weight="bold" size={18} />
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