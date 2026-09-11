import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "../../../lib/db";
import { waktuTampil } from "../../../lib/waktu";
import "../../../components/berita-show.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const berita = await db.berita.findUnique({ where: { id: Number(id) } });
  return { title: berita ? `${berita.judul} - Mading` : "Berita - Mading" };
}

const fmtTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function BeritaShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const berita = await db.berita.findUnique({ where: { id: Number(id) } });
  if (!berita) notFound();

  const lainnya = await db.berita.findMany({
    where: { id: { not: berita.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="article-wrapper">
      <Link href="/berita" className="back-link">&larr; Kembali ke Berita</Link>

      <h1 className="article-title">{berita.judul}</h1>
      <p className="article-meta">
        <i className="fa-regular fa-clock"></i> {waktuTampil(berita.createdAt)} &middot; {fmtTanggal.format(berita.createdAt)}
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={berita.gambarUrl} alt={berita.judul} className="article-img" />

      <div className="article-body">{berita.deskripsi}</div>

      {lainnya.length > 0 && (
        <div className="related-section">
          <h3 className="related-title">Berita Lainnya</h3>
          <div className="related-grid">
            {lainnya.map((item) => (
              <Link key={item.id} href={`/berita/${item.id}`} className="related-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.gambarUrl} alt={item.judul} />
                <h4>{item.judul}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
