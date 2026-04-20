import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, GraduationCap, Users, BookOpen, User } from "lucide-react";
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
    { id: "mahasiswa", label: "Mahasiswa", icon: GraduationCap },
    { id: "dosen", label: "Dosen", icon: BookOpen },
    { id: "admin", label: "Admin", icon: Users },
    { id: "rektor", label: "Rektor", icon: User },
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">
        <div className="flex flex-col justify-center space-y-6 max-w-md mx-auto lg:max-w-none text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start gap-3">
            <div className="p-3 bg-primary rounded-xl text-primary-foreground shadow-lg">
              <School className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">STIBADA MASA</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Sistem Informasi <br/>
              <span className="text-primary">Akademik Terpadu</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Portal akademik terpadu untuk mahasiswa, dosen, rektor, dan admin STIBADA MASA.
            </p>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-background/80 backdrop-blur-xl">
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
                        <Icon className="w-5 h-5" />
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
                className="w-full h-12 text-base font-semibold"
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
