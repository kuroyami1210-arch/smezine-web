import {
  MAX_BERITA_GALERI_ANGGOTA,
  MAX_SLIDE1,
  buildKey,
  toWebp,
  validateImage,
  type R2Folder,
} from "./image";
import { r2Delete, r2PublicUrl, r2PutWebp } from "./r2";

export const MAX_UPLOAD = {
  berita: MAX_BERITA_GALERI_ANGGOTA,
  galeri: MAX_BERITA_GALERI_ANGGOTA,
  anggota: MAX_BERITA_GALERI_ANGGOTA,
  tentang_slide1: MAX_SLIDE1,
} satisfies Record<R2Folder, number>;

// Validasi + konversi webp + upload ke Storage.
// Return { key, url } untuk disimpan ke kolom gambarKey/gambarUrl (atau fotoKey/fotoUrl).
export async function storeImage(
  file: File,
  folder: R2Folder,
  sub?: string,
): Promise<{ key: string; url: string }> {
  validateImage(file, MAX_UPLOAD[folder]);
  const buffer = await toWebp(file);
  const key = buildKey(folder, sub);
  await r2PutWebp(key, buffer);
  return { key, url: r2PublicUrl(key) };
}

export async function deleteImage(key?: string | null): Promise<void> {
  await r2Delete(key);
}
