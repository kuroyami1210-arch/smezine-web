import { randomUUID } from "node:crypto";
import sharp from "sharp";

// Aturan port dari Laravel:
// - Berita/Galeri: max 2048KB. Slide1: max 5120KB (lihat TentangSlide1Controller).
// - SVG DITOLAK di Next.js (tidak aman di-sharp ke webp) — perbedaan disengaja vs Laravel.
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/webp",
]);

export const MAX_BERITA_GALERI_ANGGOTA = 2 * 1024 * 1024; // 2MB
export const MAX_SLIDE1 = 5 * 1024 * 1024; // 5MB

export type R2Folder = "berita" | "galeri" | "anggota" | "tentang_slide1";

export function buildKey(folder: R2Folder, sub?: string): string {
  const id = `${randomUUID()}.webp`;
  if (folder === "berita" || folder === "galeri") {
    const ym = new Date().toISOString().slice(0, 7); // 2026-09
    return `${folder}/${ym}/${id}`;
  }
  if (folder === "anggota" && sub) {
    const safe = sub.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
    return `anggota/${safe}/${id}`;
  }
  return `${folder}/${id}`;
}

/** Validasi type + size. Throw Error dengan pesan ramah form bila gagal. */
export function validateImage(file: File, maxBytes: number): void {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("File harus berupa gambar (jpeg, png, jpg, gif, atau webp).");
  }
  if (file.size > maxBytes) {
    const mb = maxBytes / 1024 / 1024;
    throw new Error(`Ukuran gambar maksimal ${mb}MB.`);
  }
}

/** Resize max 1600px → webp q80. Return buffer siap r2PutWebp. */
export async function toWebp(file: File): Promise<Buffer> {
  const input = Buffer.from(await file.arrayBuffer());
  return sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}
