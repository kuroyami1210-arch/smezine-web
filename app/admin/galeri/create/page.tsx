import GaleriForm from "../GaleriForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah Foto - Admin" };

export default function CreateGaleriPage() {
  return <GaleriForm title="Tambah Foto" submitLabel="Simpan Foto" />;
}
