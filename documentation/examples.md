# Contoh Implementasi Kunci

## Autentikasi pengguna

Frontend mengirim login ke API:

```ts
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nim: "20210001",
    password: "mahasiswa123",
    role: "mahasiswa",
  }),
});

const { token, user } = await response.json();
localStorage.setItem("kampus_token", token);
```

Backend memvalidasi role, mencari user di collection yang sesuai, memverifikasi password, lalu mengembalikan token.

## Fetch API dengan token

Helper `apiFetch` menambahkan header JSON dan token otomatis:

```ts
const token = localStorage.getItem("kampus_token");
const response = await fetch("/api/mahasiswa", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

## Manajemen data dinamis

Contoh create data mahasiswa:

```ts
await fetch("/api/mahasiswa", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    nim: "20260001",
    nama: "Ahmad Fauzan",
    email: "ahmad@example.com",
    prodi: "Pendidikan Bahasa Arab",
    semester: 1,
  }),
});
```

Di backend, data masuk divalidasi, disimpan ke MongoDB dengan `insertOne`, lalu respons mengembalikan `id` string.

## WebSocket notifikasi realtime

Frontend dapat membuka koneksi:

```ts
const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const ws = new WebSocket(`${wsProtocol}://${window.location.host}/api/ws`);

ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  if (payload.type === "announcement.created") {
    console.log("Pengumuman baru tersedia");
  }
};
```

Backend mem-broadcast event ketika konten tertentu dibuat, misalnya pengumuman publik.

## Pencarian pengumuman di frontend

Halaman Pengumuman melakukan filter lokal untuk respons cepat:

```ts
const filtered = announcements.filter((item) => {
  const text = `${item.title} ${item.content}`.toLowerCase();
  return text.includes(query.toLowerCase());
});
```

Untuk data besar, pencarian sebaiknya dipindahkan ke backend dengan index MongoDB dan query parameter `search`.