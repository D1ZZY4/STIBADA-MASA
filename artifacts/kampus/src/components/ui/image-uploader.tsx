import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { CloudArrowUp, Link, Image, X, SpinnerGap } from "@phosphor-icons/react";

type Tab = "url" | "upload";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  recommendedSize?: string;
  maxSizeMB?: number;
}

const GUIDELINES: Record<string, { size: string; ratio: string; formats: string; max: string }> = {
  hero: {
    size: "1400 × 600 px",
    ratio: "7:3 (landscape lebar)",
    formats: "JPEG, WebP",
    max: "2 MB",
  },
  card: {
    size: "800 × 500 px",
    ratio: "16:10",
    formats: "JPEG, PNG, WebP",
    max: "1 MB",
  },
  gallery: {
    size: "800 × 600 px",
    ratio: "4:3",
    formats: "JPEG, PNG, WebP",
    max: "2 MB",
  },
  default: {
    size: "800 × 500 px",
    ratio: "bebas",
    formats: "JPEG, PNG, WebP, GIF",
    max: "5 MB",
  },
};

export function ImageUploader({
  value,
  onChange,
  label = "Gambar",
  hint = "default",
  recommendedSize,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [tab, setTab] = useState<Tab>(value && value.startsWith("http") ? "url" : value ? "upload" : "url");
  const [urlInput, setUrlInput] = useState(value && !value.startsWith("/api/") ? value : "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const guide = GUIDELINES[hint] ?? GUIDELINES.default;
  const displaySize = recommendedSize || guide.size;

  const handleUrl = () => {
    onChange(urlInput.trim());
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diizinkan");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file maks ${maxSizeMB} MB. File ini ${(file.size / 1024 / 1024).toFixed(1)} MB.`);
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/upload/image", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload gagal" }));
        throw new Error(err.error || "Upload gagal");
      }
      const data = await res.json();
      onChange(data.url as string);
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    onChange("");
    setUrlInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div className="rounded-2xl border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground flex items-center gap-1"><Image size={13} weight="duotone" /> Panduan gambar</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <span>Ukuran ideal: <strong>{displaySize}</strong></span>
          <span>Rasio: <strong>{guide.ratio}</strong></span>
          <span>Format: <strong>{guide.formats}</strong></span>
          <span>Maks: <strong>{guide.max}</strong></span>
        </div>
      </div>

      <div className="flex rounded-xl border overflow-hidden">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${tab === "url" ? "bg-primary text-white" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
        >
          <Link size={14} /> URL gambar
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${tab === "upload" ? "bg-primary text-white" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
        >
          <CloudArrowUp size={14} /> Upload file
        </button>
      </div>

      {tab === "url" && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/gambar.jpg"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrl())}
          />
          <Button type="button" variant="outline" className="rounded-xl shrink-0" onClick={handleUrl}>
            Pakai
          </Button>
        </div>
      )}

      {tab === "upload" && (
        <div
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {uploading ? (
            <SpinnerGap size={32} className="animate-spin text-primary" />
          ) : (
            <CloudArrowUp size={32} weight="duotone" className="text-primary" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">{uploading ? "Mengupload..." : "Klik atau drag & drop gambar"}</p>
            <p className="text-xs text-muted-foreground mt-1">{guide.formats} · maks {guide.max}</p>
          </div>
        </div>
      )}

      {value && (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="h-36 w-full rounded-2xl object-cover border"
            onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
          />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
          <p className="mt-1 text-xs text-muted-foreground truncate">{value}</p>
        </div>
      )}
    </div>
  );
}
