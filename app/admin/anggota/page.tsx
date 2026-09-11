import Link from "next/link";
import { db } from "../../../lib/db";
import { anggotaFotoUrl } from "../../../lib/fallback";
import DeleteButton from "../../../components/DeleteButton";
import { deleteAnggota } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin - Kelola Anggota" };

export default async function AdminAnggotaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const anggotas = await db.anggota.findMany({
    orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="admin-page" style={{ maxWidth: 1000, margin: "10px auto 40px", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="admin-page-title">Kelola Anggota (Panel Admin)</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/admin/slide1"
            style={{ background: "#6c757d", color: "#fff", padding: "10px 18px", borderRadius: 6, textDecoration: "none", fontWeight: "bold" }}
          >
            Edit Slide 1
          </Link>
          <Link
            href="/admin/anggota/create"
            style={{ background: "#0d6efd", color: "#fff", padding: "10px 18px", borderRadius: 6, textDecoration: "none", fontWeight: "bold" }}
          >
            + Tambah Anggota
          </Link>
        </div>
      </div>

      {ok && (
        <div style={{ background: "#198754", color: "#fff", padding: "12px 20px", borderRadius: 6, marginBottom: 20 }}>
          {ok}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#2a2a2a", textAlign: "left" }}>
            <th style={{ padding: "12px 15px" }}>Foto</th>
            <th style={{ padding: "12px 15px" }}>Nama</th>
            <th style={{ padding: "12px 15px" }}>Jabatan</th>
            <th style={{ padding: "12px 15px" }}>Kategori</th>
            <th style={{ padding: "12px 15px", textAlign: "center" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {anggotas.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 20, color: "#aaa" }}>
                Belum ada anggota. Silakan tambahkan anggota baru.
              </td>
            </tr>
          ) : (
            anggotas.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "12px 15px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.fotoUrl || anggotaFotoUrl(item.nama, item.jabatan, null)}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    alt=""
                  />
                </td>
                <td style={{ padding: "12px 15px", fontWeight: 600 }}>{item.nama}</td>
                <td style={{ padding: "12px 15px", color: "#aaa" }}>{item.jabatan}</td>
                <td style={{ padding: "12px 15px", color: "#aaa" }}>{item.kategori}</td>
                <td style={{ padding: "12px 15px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <Link
                      href={`/admin/anggota/${item.id}/edit`}
                      style={{ background: "#ffc107", color: "#000", padding: "6px 12px", borderRadius: 4, textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      label="Hapus"
                      confirmText="Yakin ingin menghapus anggota ini?"
                      action={deleteAnggota.bind(null, item.id)}
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
