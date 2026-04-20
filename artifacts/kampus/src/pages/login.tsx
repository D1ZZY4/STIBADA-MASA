import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Buildings2, Profile2User, Teacher, UserOctagon } from "iconsax-react";
import { toast } from "sonner";
import { LoginBodyRole } from "@workspace/api-client-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: setAuthUser } = useAuth();
  const loginMutation = useLogin();
  
  const [role, setRole] = useState<LoginBodyRole>("mahasiswa");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");

  const roles = [
    { id: "mahasiswa", label: "Mahasiswa", icon: Teacher },
    { id: "dosen", label: "Dosen", icon: Book },
    { id: "admin", label: "Admin", icon: Profile2User },
    { id: "rektor", label: "Rektor", icon: UserOctagon },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !password) {
      toast.error("Silakan isi ID dan password");
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        data: { nim, password, role }
      });
      
      setAuthUser(response.user, response.token);
      toast.success("Login berhasil");
      setLocation(`/dashboard/${role}`);
    } catch (error) {
      toast.error("Login gagal. Periksa kembali ID dan password Anda.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f1ea] p-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(42,107,90,.16),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(151,124,87,.20),transparent_28%)]" />
      
      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="overflow-hidden rounded-[2.2rem] border border-[#ded8ca] bg-white/74 shadow-xl">
          <div className="relative h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1100&q=85"
              alt="Mahasiswa STIBADA MASA di lingkungan kampus"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3933]/88 via-[#1e3933]/18 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 space-y-5 p-8 text-white">
              <div className="inline-flex items-center gap-3">
                <div className="rounded-2xl bg-white/16 p-3 backdrop-blur">
                  <Buildings2 variant="Bulk" className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">STIBADA MASA</p>
                  <p className="text-sm text-white/74">Sistem Informasi Akademik Terpadu</p>
                </div>
              </div>
              <div>
                <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight">Portal aman untuk civitas akademika.</h1>
                <p className="mt-3 max-w-xl text-white/76">Masuk sebagai mahasiswa, dosen, admin, atau rektor untuk mengakses dashboard sesuai hak akses.</p>
              </div>
              <Link href="/">
                <Button variant="secondary" className="rounded-2xl bg-white text-[#1f3f37] hover:bg-white/90">Kembali ke Beranda</Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md self-center rounded-[2rem] border-[#ded8ca] bg-white/86 shadow-xl backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Masuk ke Portal</CardTitle>
            <CardDescription>
              Pilih peran Anda dan masukkan kredensial untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label>Pilih Peran</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${
                          role === r.id
                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                            : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon variant={role === r.id ? "Bold" : "Linear"} className="h-5 w-5" />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="nim">
                    {role === "mahasiswa" ? "NIM" : role === "dosen" ? "NIDN" : "ID Pengguna"}
                  </Label>
                  <Input
                    id="nim"
                    name="username"
                    autoComplete="username"
                    placeholder={`Masukkan ${role === "mahasiswa" ? "NIM" : "ID"} Anda`}
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="h-12 bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-muted/50"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="h-12 w-full rounded-2xl text-base font-semibold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
