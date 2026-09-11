import { notFound } from "next/navigation";
import { db } from "../../../../../lib/db";
import AnggotaForm from "../../AnggotaForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Anggota - Admin" };

export default async function EditAnggotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anggota = await db.anggota.findUnique({ where: { id: Number(id) } });
  if (!anggota) notFound();

  return (
    <AnggotaForm
      title="Edit Anggota"
      submitLabel="Perbarui Anggota"
      initial={{
        id: anggota.id,
        nama: anggota.nama,
        jabatan: anggota.jabatan,
        kategori: anggota.kategori,
        urutan: anggota.urutan,
        fotoUrl: anggota.fotoUrl,
      }}
    />
  );
}

