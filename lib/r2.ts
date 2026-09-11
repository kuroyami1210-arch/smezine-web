import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} belum diisi (lihat .env.example)`);
  return v;
}

export function storageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || "smezine";
}

let client: SupabaseClient | null = null;

// Service-role di server agar upload/delete bypass RLS.
// JANGAN dipakai di client component.
export function storageClient(): SupabaseClient {
  if (client) return client;
  client = createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY"),
  );
  return client;
}

// Kompat: nama lama tetap bisa dipakai pemanggil lama.
export const r2Client = storageClient;

export function r2PublicUrl(key: string): string {
  const base = required("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${storageBucket()}/${key}`;
}

/** Upload buffer webp ke Supabase Storage. Dipanggil SETELAH validasi + konversi di image.ts. */
export async function r2PutWebp(key: string, body: Buffer): Promise<void> {
  const { error } = await storageClient()
    .storage.from(storageBucket())
    .upload(key, body, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "31536000",
    });
  if (error) throw new Error(`Upload gambar gagal: ${error.message}`);
}

/** Cermin hapusGambar() Laravel: hapus object lama saat update/delete. Gagal = silent. */
export async function r2Delete(key?: string | null): Promise<void> {
  if (!key) return;
  try {
    await storageClient().storage.from(storageBucket()).remove([key]);
  } catch {
    // object mungkin sudah tidak ada — abaikan agar UX update/delete tetap jalan
  }
}
