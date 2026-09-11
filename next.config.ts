import type { NextConfig } from "next";

// Storage: Supabase Storage publik (<project>.supabase.co/storage/v1/object/public/...).
// Hostname diambil dari NEXT_PUBLIC_SUPABASE_URL agar next/image mengizinkannya.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
let supabaseHostname: string | null = null;
try {
  if (supabaseUrl) supabaseHostname = new URL(supabaseUrl).hostname;
} catch {
  supabaseHostname = null;
}

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
  // Fallback eksternal Laravel lama (ui-avatars + pngmart) — dihapus setelah migrasi bersih.
  { protocol: "https", hostname: "ui-avatars.com" },
  { protocol: "https", hostname: "www.pngmart.com" },
];

if (supabaseHostname) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHostname });
} else {
  // Default longgar tahap awal: izinkan semua project Supabase.
  remotePatterns.push({ protocol: "https", hostname: "*.supabase.co" });
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  // Upload gambar via Server Actions: default Next cuma 1MB (error 413
  // "Body exceeded 1 MB limit"). Naikkan ke 4MB agar sesuai batas form
  // (berita/galeri/anggota 2MB, slide1 4MB). Batas mutlak platform Vercel
  // ~4,5MB — jangan set di atas itu.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default nextConfig;
