import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { House, MagnifyingGlass, ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,hsl(var(--primary)/0.10),transparent_60%)]" />

      <div className="relative space-y-6 max-w-md">
        {/* Big number */}
        <div className="relative select-none">
          <p className="text-[9rem] font-black leading-none tracking-tighter text-primary/8 dark:text-primary/10">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-card/80 shadow-xl backdrop-blur-sm">
              <MagnifyingGlass size={36} weight="duotone" className="text-primary" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Halaman Tidak Ditemukan</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan. Coba kembali ke beranda.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2 rounded-2xl w-full sm:w-auto">
              <House size={16} weight="duotone" />
              Ke Beranda
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 rounded-2xl w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} weight="bold" />
            Kembali
          </Button>
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground/60">
          STIBADA MASA · Sistem Informasi Akademik Terpadu
        </p>
      </div>
    </div>
  );
}
