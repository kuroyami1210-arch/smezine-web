import BeritaForm from "../BeritaForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah Berita - Admin" };

export default function CreateBeritaPage() {
  return (
    <BeritaForm
      title="Tambah Berita"
      icon="fa-solid fa-newspaper"
      submitLabel="Simpan Berita"
    />
  );
}
