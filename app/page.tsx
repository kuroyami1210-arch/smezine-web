import Link from "next/link";
import { db } from "../lib/db";
import { waktuTampil } from "../lib/waktu";
import HeroSlider, { type Slide } from "../components/HeroSlider";
import "../components/home.css";

export const dynamic = "force-dynamic";

function limit(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trimEnd() + "..." : s;
}

export default async function Home() {
  const [slider, latestBerita, latestGaleri] = await Promise.all([
    db.berita.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    db.berita.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.galeri.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const slides: Slide[] = slider.map((b) => ({
    id: b.id,
    judul: b.judul,
    deskripsi: b.deskripsi,
    gambar: b.gambarUrl,
  }));

  return (
    <>
      <HeroSlider slides={slides} />

      <div className="container">
        {/* berita terbaru */}
        <div className="section-header-row">
          <div className="section-title" style={{ marginBottom: 0 }}>
            <h2>Berita Terbaru</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Informasi terbaru seputar kegiatan sekolah.
            </p>
          </div>
          <Link href="/berita" style={{ color: "var(--primary)", fontWeight: 600, whiteSpace: "nowrap" }}>
            Lihat Semua <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {latestBerita.length > 0 ? (
          <div className="home-latest-grid">
            {latestBerita.map((berita) => (
              <Link key={berita.id} href={`/berita/${berita.id}`} className="home-news-card">
                <div className="thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={berita.gambarUrl} alt={berita.judul} loading="lazy" />
                </div>
                <div className="body">
                  <span className="meta">
                    <i className="fa-regular fa-clock"></i> {waktuTampil(berita.createdAt)}
                  </span>
                  <h3>{limit(berita.judul, 55)}</h3>
                  <p>{limit(berita.deskripsi, 80)}</p>
                  <div className="foot">
                    <span style={{ color: "#aaa", fontSize: "0.75rem" }}>Berita</span>
                    <span className="read">Baca <i className="fa-solid fa-arrow-right"></i></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "#aaa", textAlign: "center", padding: "40px 0" }}>
            Belum ada berita yang diterbitkan.
          </p>
        )}

        {/* karya terbaru */}
        <div className="section-header-row" style={{ marginTop: 48 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <h2>Karya Terbaru</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Kumpulan karya dan dokumentasi terbaru dari galeri.
            </p>
          </div>
          <Link href="/galeri" style={{ color: "var(--primary)", fontWeight: 600, whiteSpace: "nowrap" }}>
            Lihat Semua <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {latestGaleri.length > 0 ? (
          <div className="home-karya-grid">
            {latestGaleri.map((foto) => (
              <Link key={foto.id} href="/galeri" className="home-karya-card" title={foto.judul}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.gambarUrl} alt={foto.judul} loading="lazy" />
                <div className="home-karya-text">
                  <h5>{foto.judul}</h5>
                  {foto.deskripsi ? <p>{limit(foto.deskripsi, 80)}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "#aaa", textAlign: "center", padding: "30px 0 50px" }}>
            Belum ada karya di galeri.
          </p>
        )}
      </div>
    </>
  );
}
