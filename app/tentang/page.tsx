import { db } from "../../lib/db";
import { anggotaFotoUrl, slide1FotoUrl } from "../../lib/fallback";
import TentangClient, { type Member, type Slide1 } from "../../components/TentangClient";
import "../../components/tentang.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profil Smezine - SMK N 1 Dukuhturi",
};

export default async function TentangPage() {
  const [anggotas, slide1Row] = await Promise.all([
    db.anggota.findMany({ orderBy: [{ urutan: "asc" }, { createdAt: "asc" }] }),
    db.tentangSlide1.findFirst(),
  ]);

  const fotoAnggota = (a: { nama: string; jabatan: string; fotoUrl: string | null }) =>
    a.fotoUrl || anggotaFotoUrl(a.nama, a.jabatan, null);

  // ketua umum: by kategori dulu, kalau gak ketemu tebak dari nama jabatan
  let ketua = anggotas.find((a) => a.kategori === "ketua_umum");
  if (!ketua)
    ketua = anggotas.find(
      (a) => a.jabatan.trim().toLowerCase() === "ketua umum",
    );

  const ketuaSingle: Member | null = ketua
    ? { nama: ketua.nama, jabatan: ketua.jabatan, foto: fotoAnggota(ketua) }
    : null;

  // slide 3 = semua kecuali ketua umum, urut
  const members: Member[] = anggotas
    .filter((a) => !ketua || a.id !== ketua.id)
    .sort((x, y) => x.urutan - y.urutan)
    .map((a) => ({ nama: a.nama, jabatan: a.jabatan, foto: fotoAnggota(a) }));

  const slide1: Slide1 = {
    judul: slide1Row?.judul ?? null,
    deskripsi: slide1Row?.deskripsi ?? null,
    foto: slide1Row?.fotoUrl || slide1FotoUrl(null),
  };

  return <TentangClient slide1={slide1} ketua={ketuaSingle} members={members} />;
}
