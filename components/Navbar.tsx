"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "../app/login/actions";

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Navbar ngumpet pas scroll ke bawah, nongol lagi pas scroll ke atas
  useEffect(() => {
    const HIDE_AFTER = 120;
    let lastY = window.scrollY || 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY || 0;
      if (open || y <= HIDE_AFTER) {
        setHidden(false);
      } else if (y > lastY) {
        setHidden(true);
      } else if (y < lastY) {
        setHidden(false);
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open ]);

  // Tutup menu HP tiap pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const active = (p: string) =>
    p === "/"
      ? pathname === "/"
        ? "active"
        : ""
      : pathname.startsWith(p)
        ? "active"
        : "";

  return (
    <nav className={`navbar${hidden ? " navbar-hidden" : ""}`}>
      <div className="container nav-content">
        <Link href="/" className="brand-wrapper" style={{ textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon_2.png" alt="Logo" className="nav-icon" />
          <div className="brand-text">
            <span className="brand-school">SMK N 1 DUKUHTURI</span>
            <span className="brand-name">EKSTRAKULIKULER MADING</span>
          </div>
        </Link>
        <ul className={`nav-links${open ? " active" : ""}`} id="navLinks">
          <li><Link href="/" className={active("/")}>Beranda</Link></li>
          <li><Link href="/berita" className={active("/berita")}>Berita</Link></li>
          <li><Link href="/galeri" className={active("/galeri")}>Galeri</Link></li>
          <li><Link href="/tentang" className={active("/tentang")}>Tentang</Link></li>

          {!isAdmin && (
            <li>
              <Link href="/login" style={{ color: "#86868b" }}>
                <i className="fa-solid fa-right-to-bracket"></i> Login
              </Link>
            </li>
          )}

          {isAdmin && (
            <>
              <li><Link href="/admin/berita" className={active("/admin")} style={{ fontWeight: "bold" }}>Kelola</Link></li>
              <li>
                <form action={logoutAction} style={{ display: "inline" }}>
                  <button
                    type="submit"
                    style={{ background: "none", border: "none", color: "#ff4d4d", fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", transition: "0.2s" }}
                  >
                    Logout
                  </button>
                </form>
              </li>
            </>
          )}
        </ul>
        <div
          className="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}
