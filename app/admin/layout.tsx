import Link from "next/link";
import { requireAdmin } from "../../lib/auth";
import { logoutAction } from "../login/actions";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin/berita", label: "Kelola Berita" },
  { href: "/admin/galeri", label: "Kelola Galeri" },
  { href: "/admin/anggota", label: "Kelola Anggota" },
  { href: "/admin/slide1", label: "Slide 1" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="container" style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 60 }}>
      <nav
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          margin: "24px 0 8px",
        }}
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              color: "var(--primary)",
              fontWeight: 700,
              textDecoration: "none",
              padding: "8px 14px",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
            }}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" style={{ color: "#86868b", padding: "8px 14px" }}>
          Lihat Situs
        </Link>
        <form action={logoutAction} style={{ marginLeft: "auto" }}>
          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              color: "#ff4d4d",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
