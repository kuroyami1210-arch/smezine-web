import Link from "next/link";
import { db } from "../../../lib/db";
import DeleteButton from "../../../components/DeleteButton";
import { deleteBerita } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin - Kelola Berita" };

function limit(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trimEnd() + "..." : s;
}

export default async function AdminBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const beritas = await db.berita.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="admin-page" style={{ maxWidth: 1000, margin: "10px auto 40px", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="admin-page-title">Kelola Berita (Panel Admin)</h2>
        <Link
          href="/admin/berita/create"
          style={{ background: "#0d6efd", color: "#fff", padding: "10px 18px", borderRadius: 6, textDecoration: "none", fontWeight: "bold" }}
        >
          + Tambah Berita
        </Link>
      </div>

      {ok && (
        <div style={{ background: "#198754", color: "#fff", padding: "12px 20px", borderRadius: 6, marginBottom: 20 }}>
          {ok}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#2a2a2a", textAlign: "left" }}>
            <th style={{ padding: "12px 15px" }}>Gambar</th>
            <th style={{ padding: "12px 15px" }}>Judul Berita</th>
            <th style={{ padding: "12px 15px" }}>Deskripsi Singkat</th>
            <th style={{ padding: "12px 15px", textAlign: "center" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {beritas.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 20, color: "#aaa" }}>
                Belum ada berita. Silakan tambahkan berita baru.
              </td>
            </tr>
          ) : (
            beritas.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "12px 15px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.gambarUrl} width={80} height={50} style={{ objectFit: "cover", borderRadius: 4 }} alt="" />
                </td>
                <td style={{ padding: "12px 15px", fontWeight: 600 }}>{item.judul}</td>
                <td style={{ padding: "12px 15px", color: "#aaa" }}>{limit(item.deskripsi, 60)}</td>
                <td style={{ padding: "12px 15px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <Link
                      href={`/admin/berita/${item.id}/edit`}
                      style={{ background: "#ffc107", color: "#000", padding: "6px 12px", borderRadius: 4, textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      label="Hapus"
                      confirmText="Yakin ingin menghapus berita ini?"
                      action={deleteBerita.bind(null, item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
