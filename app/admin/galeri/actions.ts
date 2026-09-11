"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteImage, storeImage } from "../../../lib/upload";

export type FormState = { error?: string };

function str(fd: FormData, name: string): string {
  return String(fd.get(name) ?? "").trim();
}

function fileOf(fd: FormData): File | null {
  const f = fd.get("gambar");
  return f instanceof File && f.size > 0 ? f : null;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function createGaleri(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const judul = str(fd, "judul");
  const deskripsi = str(fd, "deskripsi");
  if (!judul) return { error: "Judul wajib diisi." };
  if (judul.length > 255) return { error: "Judul maksimal 255 karakter." };
  const file = fileOf(fd);
  if (!file) return { error: "Gambar wajib diisi." };
  try {
    const { key, url } = await storeImage(file, "galeri");
    await db.galeri.create({
      data: { judul, deskripsi: deskripsi || null, gambarKey: key, gambarUrl: url },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan foto." };
  }
  refresh();
  redirect("/admin/galeri?ok=Foto berhasil ditambahkan!");
}

export async function updateGaleri(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id"));
  const judul = str(fd, "judul");
  const deskripsi = str(fd, "deskripsi");
  if (!judul) return { error: "Judul wajib diisi." };
  if (judul.length > 255) return { error: "Judul maksimal 255 karakter." };
  const galeri = await db.galeri.findUnique({ where: { id } });
  if (!galeri) return { error: "Foto tidak ditemukan." };

  const data: { judul: string; deskripsi: string | null; gambarKey?: string; gambarUrl?: string } = {
    judul,
    deskripsi: deskripsi || null,
  };
  const file = fileOf(fd);
  try {
    if (file) {
      await deleteImage(galeri.gambarKey);
      const { key, url } = await storeImage(file, "galeri");
      data.gambarKey = key;
      data.gambarUrl = url;
    }
    await db.galeri.update({ where: { id }, data });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memperbarui foto." };
  }
  refresh();
  redirect("/admin/galeri?ok=Foto berhasil diperbarui!");
}

export async function deleteGaleri(id: number): Promise<void> {
  await requireAdmin();
  const galeri = await db.galeri.findUnique({ where: { id } });
  if (!galeri) return;
  await deleteImage(galeri.gambarKey);
  await db.galeri.delete({ where: { id } });
  refresh();
  redirect("/admin/galeri?ok=Foto berhasil dihapus!");
}
