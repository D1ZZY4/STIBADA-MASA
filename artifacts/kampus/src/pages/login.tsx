import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap, BookOpen, UserGear, Crown,
  Buildings, Eye, EyeSlash, ArrowLeft,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { LoginBodyRole } from "@workspace/api-client-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: setAuthUser, user } = useAuth();
  const loginMutation = useLogin();

  useEffect(() => {
    if (user) setLocation(`/dashboard/${user.role}`);
  }, [user, setLocation]);

  const [role, setRole] = useState<LoginBodyRole>("mahasiswa");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const roles = [
    { id: "mahasiswa", label: "Mahasiswa", icon: GraduationCap, color: "text-blue-600 dark:text-blue-400" },
    { id: "dosen",     label: "Dosen",     icon: BookOpen,       color: "text-emerald-600 dark:text-emerald-400" },
    { id: "admin",     label: "Admin",     icon: UserGear,       color: "text-orange-600 dark:text-orange-400" },
    { id: "rektor",    label: "Rektor",    icon: Crown,          color: "text-purple-600 dark:text-purple-400" },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !password) { toast.error("Silakan isi ID dan password"); return; }
    try {
      const response = await loginMutation.mutateAsync({ data: { nim, password, role } });
      setAuthUser(response.user, response.token);
      toast.success("Login berhasil");
      setLocation(`/dashboard/${role}`);
    } catch {
      toast.error("Login gagal. Periksa kembali ID dan password Anda.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Subtle radial glow — theme-aware */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_15%,hsl(var(--primary)/0.13),transparent_35%),radial-gradient(ellipse_at_88%_80%,hsl(var(--primary)/0.07),transparent_35%)]" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:items-center">

          {/* ── LEFT: campus photo panel ── */}
          <div className="hidden lg:block relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-border/40">
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1100&q=85"
              alt="Kampus STIBADA MASA"
              className="h-[580px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111f1c]/92 via-[#111f1c]/20 to-transparent" />

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 space-y-5 p-9 text-white">
              <div className="inline-flex items-center gap-3">
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm border border-white/10">
                  <Buildings weight="duotone" className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">STIBADA MASA</p>
                  <p className="text-xs text-white/60">Sistem Informasi Akademik Terpadu</p>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
                  Portal aman untuk civitas akademika.
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                  Mahasiswa, dosen, admin, dan rektor — setiap peran memiliki dashboard dan akses tersendiri.
                </p>
              </div>

              {/* Role chips */}
              <div className="flex flex-wrap gap-2">
                {roles.map(({ id, label }) => (
                  <div key={id} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {label}
                  </div>
                ))}
              </div>

              <Link href="/">
                <Button size="sm" variant="ghost" className="gap-2 rounded-2xl text-white/70 hover:text-white hover:bg-white/10 px-0">
                  <ArrowLeft size={15} weight="bold" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: form card ── */}
          <div className="mx-auto w-full max-w-md">
            {/* Mobile back link */}
            <Link href="/" className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden">
              <ArrowLeft size={14} weight="bold" />
              Kembali ke Beranda
            </Link>

            <div className="rounded-[2rem] border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur-xl dark:bg-card/80">
              {/* Header */}
              <div className="mb-7">
                <div className="mb-4 flex items-center gap-3 lg:hidden">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Buildings size={18} weight="duotone" className="text-primary" />
                  </div>
                  <p className="text-sm font-bold">STIBADA MASA</p>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Masuk ke Portal</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Pilih peran dan masukkan kredensial Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role selector */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pilih Peran</Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const active = role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
                            active
                              ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                              : "border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon weight={active ? "bold" : "regular"} size={18} className={active ? "text-primary-foreground" : r.color} />
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Credentials */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nim" className="text-sm font-medium">
                      {role === "mahasiswa" ? "NIM" : role === "dosen" ? "NIDN" : "ID Pengguna"}
                    </Label>
                    <Input
                      id="nim"
                      name="username"
                      autoComplete="username"
                      placeholder={`Masukkan ${role === "mahasiswa" ? "NIM" : "ID"} Anda`}
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      className="h-11 rounded-xl bg-background/60 dark:bg-background/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-xl bg-background/60 pr-10 dark:bg-background/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showPass ? <EyeSlash size={17} weight="duotone" /> : <Eye size={17} weight="duotone" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-11 w-full rounded-2xl text-sm font-semibold"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Memproses..." : "Masuk ke Portal"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Kesulitan masuk?{" "}
                  <Link href="/informasi-pmb" className="text-primary hover:underline">Hubungi tim PMB</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
