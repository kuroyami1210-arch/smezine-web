"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteImage, storeImage } from "../../../lib/upload";

export type FormState = { error?: string };

const KATEGORI: readonly string[] = [
  "divisi",
  "pdd",
  "sekretaris_bendahara",
  "ketua",
  "ketua_umum",
];

function str(fd: FormData, name: string): string {
  return String(fd.get(name) ?? "").trim();
}

function fileOf(fd: FormData): File | null {
  const f = fd.get("foto");
  return f instanceof File && f.size > 0 ? f : null;
}

function refresh() {
  revalidatePath("/tentang");
  revalidatePath("/admin/anggota");
}

export async function createAnggota(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const nama = str(fd, "nama");
  const jabatan = str(fd, "jabatan");
  const kategori = str(fd, "kategori");
  const urutan = Math.max(0, Number(str(fd, "urutan") || 0) || 0);
  if (!nama) return { error: "Nama wajib diisi." };
  if (nama.length > 255) return { error: "Nama maksimal 255 karakter." };
  if (!jabatan) return { error: "Jabatan wajib diisi." };
  if (jabatan.length > 255) return { error: "Jabatan maksimal 255 karakter." };
  if (!KATEGORI.includes(kategori))
    return { error: "Kategori tidak valid." };

  let fotoKey: string | null = null;
  let fotoUrl: string | null = null;
  const file = fileOf(fd);
  try {
    if (file) {
      const up = await storeImage(file, "anggota", kategori);
      fotoKey = up.key;
      fotoUrl = up.url;
    }
    await db.anggota.create({ data: { nama, jabatan, kategori, urutan, fotoKey, fotoUrl } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan anggota." };
  }
  refresh();
  redirect("/admin/anggota?ok=Anggota berhasil ditambahkan!");
}

export async function updateAnggota(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id"));
  const nama = str(fd, "nama");
  const jabatan = str(fd, "jabatan");
  const kategori = str(fd, "kategori");
  const urutan = Math.max(0, Number(str(fd, "urutan") || 0) || 0);
  if (!nama) return { error: "Nama wajib diisi." };
  if (nama.length > 255) return { error: "Nama maksimal 255 karakter." };
  if (!jabatan) return { error: "Jabatan wajib diisi." };
  if (jabatan.length > 255) return { error: "Jabatan maksimal 255 karakter." };
  if (!KATEGORI.includes(kategori))
    return { error: "Kategori tidak valid." };

  const anggota = await db.anggota.findUnique({ where: { id } });
  if (!anggota) return { error: "Anggota tidak ditemukan." };

  const data: {
    nama: string;
    jabatan: string;
    kategori: string;
    urutan: number;
    fotoKey?: string | null;
    fotoUrl?: string | null;
  } = { nama, jabatan, kategori, urutan };
  const file = fileOf(fd);
  try {
    if (file) {
      await deleteImage(anggota.fotoKey);
      const up = await storeImage(file, "anggota", kategori);
      data.fotoKey = up.key;
      data.fotoUrl = up.url;
    }
    await db.anggota.update({ where: { id }, data });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memperbarui anggota." };
  }
  refresh();
  redirect("/admin/anggota?ok=Anggota berhasil diperbarui!");
}

export async function deleteAnggota(id: number): Promise<void> {
  await requireAdmin();
  const anggota = await db.anggota.findUnique({ where: { id } });
  if (!anggota) return;
  await deleteImage(anggota.fotoKey);
  await db.anggota.delete({ where: { id } });
  refresh();
  redirect("/admin/anggota?ok=Anggota berhasil dihapus!");
}
