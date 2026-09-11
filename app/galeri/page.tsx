import { db } from "../../lib/db";
import GaleriClient, { type GaleriItem } from "../../components/GaleriClient";
import "../../components/galeri.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeri Smezine - Curved 3D",
};

export default async function GaleriPage() {
  const galeris = await db.galeri.findMany({ orderBy: { createdAt: "desc" } });

  const items: GaleriItem[] = galeris.map((g) => ({
    id: g.id,
    judul: g.judul,
    deskripsi: g.deskripsi,
    src: g.gambarUrl,
  }));

  return <GaleriClient items={items} />;
}
