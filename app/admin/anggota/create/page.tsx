import AnggotaForm from "../AnggotaForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah Anggota - Admin" };

export default function CreateAnggotaPage() {
  return <AnggotaForm title="Tambah Anggota" submitLabel="Simpan Anggota" />;
}
