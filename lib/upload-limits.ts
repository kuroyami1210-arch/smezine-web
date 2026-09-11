// Batas upload gambar — BOLEH diimpor komponen client maupun kode server.
// (Jangan taruh dependensi Node/sharp di sini.)
// - SVG DITOLAK (tidak aman di-sharp ke webp).
// - MAX_SLIDE1 4MB (bukan 5MB ala Laravel) karena request body Vercel max ~4,5MB.
export const ALLOWED_MIME: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/webp",
];

export const MAX_BERITA_GALERI_ANGGOTA = 2 * 1024 * 1024; // 2MB
export const MAX_SLIDE1 = 4 * 1024 * 1024; // 4MB
