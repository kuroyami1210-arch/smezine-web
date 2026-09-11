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

export async function updateSlide1(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const judul = str(fd, "judul");
  const deskripsi = str(fd, "deskripsi");
  if (!judul) return { error: "Judul wajib diisi." };
  if (judul.length > 255) return { error: "Judul maksimal 255 karakter." };
  if (!deskripsi) return { error: "Deskripsi wajib diisi." };
  if (deskripsi.length > 5000) return { error: "Deskripsi maksimal 5000 karakter." };

  const slide1 = await db.tentangSlide1.findFirst();
  const data: { judul: string; deskripsi: string; fotoKey?: string | null; fotoUrl?: string | null } = {
    judul,
    deskripsi,
  };

  const f = fd.get("foto");
  const file = f instanceof File && f.size > 0 ? f : null;
  try {
    if (file) {
      if (slide1?.fotoKey) await deleteImage(slide1.fotoKey);
      const up = await storeImage(file, "tentang_slide1");
      data.fotoKey = up.key;
      data.fotoUrl = up.url;
    }
    if (slide1) {
      await db.tentangSlide1.update({ where: { id: slide1.id }, data });
    } else {
      await db.tentangSlide1.create({ data });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan Slide 1." };
  }
  revalidatePath("/tentang");
  revalidatePath("/admin/slide1");
  redirect("/admin/anggota?ok=Slide 1 berhasil diperbarui!");
}
