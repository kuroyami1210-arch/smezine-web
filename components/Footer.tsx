import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="smezine-footer">
      <svg className="footer-scene" viewBox="0 0 1440 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="footerSkyFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="sky-stop-0" />
            <stop offset="45%" className="sky-stop-mid" />
            <stop offset="100%" className="sky-stop-1" />
          </linearGradient>
          <linearGradient id="footerAuroraGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0" />
            <stop offset="55%" stopColor="#5eead4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="footerAuroraBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="150" fill="url(#footerSkyFade)" />
        <g className="f-stars" fill="#ffffff">
          <circle cx="120" cy="26" r="1.8" /><circle cx="260" cy="48" r="1.4" /><circle cx="420" cy="22" r="1.8" />
          <circle cx="580" cy="40" r="1.4" /><circle cx="740" cy="20" r="1.8" /><circle cx="900" cy="44" r="1.4" />
          <circle cx="60" cy="56" r="1.3" /><circle cx="1330" cy="56" r="1.6" /><circle cx="1010" cy="24" r="1.4" />
        </g>
        <circle className="f-moon" cx="1150" cy="34" r="19" />
        <g className="f-aurora">
          <path d="M-20 84 C 180 34, 340 90, 560 48 C 780 12, 980 82, 1220 38 C 1320 22, 1390 44, 1460 30 L1460 -10 L-20 -10 Z" fill="url(#footerAuroraGreen)" />
          <path d="M-20 98 C 200 56, 400 102, 620 62 C 840 26, 1060 94, 1280 54 C 1360 40, 1410 60, 1460 50 L1460 -10 L-20 -10 Z" fill="url(#footerAuroraBlue)" />
        </g>
        <path className="f-mtn-far" d="M0 106 L120 68 L230 96 L340 62 L470 98 L600 70 L730 100 L860 66 L990 98 L1110 68 L1240 100 L1360 72 L1440 92 L1440 150 L0 150 Z" />
        <path className="f-mtn-near" d="M0 120 L180 94 L360 118 L540 96 L720 120 L900 98 L1080 120 L1260 100 L1440 118 L1440 150 L0 150 Z" />
        <path className="f-ground" d="M0 132 L220 118 L420 131 L640 119 L880 132 L1100 119 L1300 131 L1440 123 L1440 150 L0 150 Z" />
        <g className="f-ice">
          <polygon points="1052,132 1076,104 1100,132" />
          <polygon points="300,133 318,112 336,133" opacity="0.9" />
          <rect x="560" y="124" width="150" height="10" rx="5" opacity="0.85" />
        </g>
        <g>
          <ellipse cx="618" cy="112" rx="11" ry="15" fill="#10233f" />
          <ellipse cx="618" cy="115" rx="6.5" ry="10" fill="#ffffff" />
          <circle cx="614" cy="102" r="1.4" fill="#ffffff" /><circle cx="622" cy="102" r="1.4" fill="#ffffff" />
          <polygon points="618,105 615.5,108 620.5,108" fill="#f59e0b" />
          <ellipse cx="650" cy="116" rx="8" ry="11" fill="#10233f" />
          <ellipse cx="650" cy="118" rx="4.8" ry="7.4" fill="#ffffff" />
          <polygon points="650,109 648.2,111.4 651.8,111.4" fill="#f59e0b" />
        </g>
      </svg>

      <div className="footer-cols">
        <div className="footer-col">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon_2.png" alt="Logo Smezine" />
            <div>
              <strong>Smezine</strong>
              <small>SMK N 1 DUKUHTURI</small>
            </div>
          </div>
          <p className="footer-desc">Wadah literasi, jurnalistik, dan kreativitas digital siswa Ekstrakurikuler Mading.</p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram Smezine" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="TikTok Smezine" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" aria-label="YouTube Smezine" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a href="#" aria-label="Facebook Smezine" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Jelajahi</h4>
          <div className="footer-links">
            <Link href="/">Beranda</Link>
            <Link href="/berita">Berita Terbaru</Link>
            <Link href="/galeri">Galeri Karya</Link>
            <Link href="/tentang">Tentang Kami</Link>
            <Link href="/login">Login Admin</Link>
          </div>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Sekolah</h4>
          <div className="footer-links">
            <Link href="/">SMK N 1 Dukuhturi</Link>
            <Link href="/tentang">Profil Ekskul</Link>
            <Link href="/berita">Kegiatan</Link>
            <Link href="/galeri">Dokumentasi</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Smezine — SMK N 1 Dukuhturi. All rights reserved.</span>
      </div>

      <div className="mezzie">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mezzie_mikir.png" alt="Mezzie" />
      </div>
    </footer>
  );
}
