import { notFound } from "next/navigation";
import { db } from "../../../../../lib/db";
import GaleriForm from "../../GaleriForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Foto - Admin" };

export default async function EditGaleriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const galeri = await db.galeri.findUnique({ where: { id: Number(id) } });
  if (!galeri) notFound();

  return (
    <GaleriForm
      title="Edit Foto"
      submitLabel="Perbarui Foto"
      initial={{
        id: galeri.id,
        judul: galeri.judul,
        deskripsi: galeri.deskripsi,
        gambarUrl: galeri.gambarUrl,
      }}
    />
  );
}

