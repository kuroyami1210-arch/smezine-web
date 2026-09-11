import { notFound } from "next/navigation";
import { db } from "../../../../../lib/db";
import BeritaForm from "../../BeritaForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Berita - Admin" };

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const berita = await db.berita.findUnique({ where: { id: Number(id) } });
  if (!berita) notFound();

  return (
    <BeritaForm
      title="Edit Berita"
      icon="fa-solid fa-pen-to-square"
      submitLabel="Perbarui Berita"
      initial={{
        id: berita.id,
        judul: berita.judul,
        deskripsi: berita.deskripsi,
        gambarUrl: berita.gambarUrl,
      }}
    />
  );
}

