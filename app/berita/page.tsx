import Link from "next/link";
import { db } from "../../lib/db";
import { waktuTampil } from "../../lib/waktu";
import "../../components/berita.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Berita - Mading SMK N 1 Dukuhturi",
};

function limit(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trimEnd() + "..." : s;
}

function NewsCard({ id, judul, deskripsi, gambarUrl, createdAt, descLen }: {
  id: number; judul: string; deskripsi: string; gambarUrl: string; createdAt: Date; descLen: number;
}) {
  return (
    <Link href={`/berita/${id}`} className="news-card">
      <div className="thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gambarUrl} alt={judul} loading="lazy" />
      </div>
      <div className="body">
        <span className="meta"><i className="fa-regular fa-clock"></i> {waktuTampil(createdAt)}</span>
        <h3>{judul}</h3>
        <p>{limit(deskripsi, descLen)}</p>
      </div>
    </Link>
  );
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();

  const beritas = await db.berita.findMany({
    where: q
      ? {
          OR: [
            { judul: { contains: q, mode: "insensitive" } },
            { deskripsi: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="ambient-bg">
        <div className="light-blob-1"></div>
        <div className="light-blob-2"></div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="berita-hero-header">
          <h1>Berita & Artikel</h1>
          <p>Update terbaru seputar kegiatan Ekstrakurikuler Mading Smezine.</p>
        </div>

        <form className="berita-searchbar" action="/berita" method="GET" role="search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" name="q" defaultValue={q} placeholder="Cari berita..." aria-label="Cari berita" />
          {q !== "" && (
            <Link href="/berita" className="berita-search-clear" aria-label="Hapus pencarian">
              <i className="fa-solid fa-xmark"></i>
            </Link>
          )}
          <button type="submit" className="search-submit">Cari</button>
        </form>

        {q !== "" && (
          <p className="berita-search-meta">
            {beritas.length} hasil untuk &ldquo;{q}&rdquo;
            <Link href="/berita">Reset</Link>
          </p>
        )}

        {beritas.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-newspaper" style={{ fontSize: "2.5rem", marginBottom: 15, display: "block" }}></i>
            {q !== "" ? <>Tidak ada berita yang cocok dengan &ldquo;{q}&rdquo;.</> : <>Belum ada berita yang diterbitkan.</>}
          </div>
        ) : q !== "" ? (
          <div className="news-grid">
            {beritas.map((b) => (
              <NewsCard key={b.id} id={b.id} judul={b.judul} deskripsi={b.deskripsi} gambarUrl={b.gambarUrl} createdAt={b.createdAt} descLen={90} />
            ))}
          </div>
        ) : (
          <>
            <Link href={`/berita/${beritas[0].id}`} className="featured-article">
              <div className="img-wrap">
                <span className="featured-tag">Terbaru</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={beritas[0].gambarUrl} alt={beritas[0].judul} />
              </div>
              <div className="featured-body">
                <span className="meta"><i className="fa-regular fa-clock"></i> {waktuTampil(beritas[0].createdAt)}</span>
                <h2>{beritas[0].judul}</h2>
                <p>{limit(beritas[0].deskripsi, 180)}</p>
                <span className="read-more">Baca Selengkapnya <i className="fa-solid fa-arrow-right"></i></span>
              </div>
            </Link>

            {beritas.length > 1 && (
              <>
                <h3 className="berita-section-title">Berita Lainnya</h3>
                <div className="news-grid">
                  {beritas.slice(1).map((b) => (
                    <NewsCard key={b.id} id={b.id} judul={b.judul} deskripsi={b.deskripsi} gambarUrl={b.gambarUrl} createdAt={b.createdAt} descLen={90} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
