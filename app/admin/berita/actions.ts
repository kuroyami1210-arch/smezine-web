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
  revalidatePath("/berita");
  revalidatePath("/admin/berita");
}

export async function createBerita(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const judul = str(fd, "judul");
  const deskripsi = str(fd, "deskripsi");
  if (!judul) return { error: "Judul wajib diisi." };
  if (judul.length > 255) return { error: "Judul maksimal 255 karakter." };
  if (!deskripsi) return { error: "Deskripsi wajib diisi." };
  const file = fileOf(fd);
  if (!file) return { error: "Gambar wajib diisi." };
  try {
    const { key, url } = await storeImage(file, "berita");
    await db.berita.create({ data: { judul, deskripsi, gambarKey: key, gambarUrl: url } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan berita." };
  }
  refresh();
  redirect("/admin/berita?ok=Berita berhasil ditambahkan!");
}

export async function updateBerita(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id"));
  const judul = str(fd, "judul");
  const deskripsi = str(fd, "deskripsi");
  if (!judul) return { error: "Judul wajib diisi." };
  if (judul.length > 255) return { error: "Judul maksimal 255 karakter." };
  if (!deskripsi) return { error: "Deskripsi wajib diisi." };
  const berita = await db.berita.findUnique({ where: { id } });
  if (!berita) return { error: "Berita tidak ditemukan." };

  const data: { judul: string; deskripsi: string; gambarKey?: string; gambarUrl?: string } = {
    judul,
    deskripsi,
  };
  const file = fileOf(fd);
  try {
    if (file) {
      await deleteImage(berita.gambarKey);
      const { key, url } = await storeImage(file, "berita");
      data.gambarKey = key;
      data.gambarUrl = url;
    }
    await db.berita.update({ where: { id }, data });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memperbarui berita." };
  }
  refresh();
  redirect("/admin/berita?ok=Berita berhasil diperbarui!");
}

export async function deleteBerita(id: number): Promise<void> {
  await requireAdmin();
  const berita = await db.berita.findUnique({ where: { id } });
  if (!berita) return;
  await deleteImage(berita.gambarKey);
  await db.berita.delete({ where: { id } });
  refresh();
  redirect("/admin/berita?ok=Berita berhasil dihapus!");
}
