"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateSlide1 } from "./actions";
import "../../../components/admin.css";

export default function Slide1Form({ initial }: {
  initial: { judul: string; deskripsi: string; fotoUrl: string | null };
}) {
  const [state, action, pending] = useActionState(updateSlide1, {});

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2 className="admin-title"><i className="fa-solid fa-panorama"></i> Edit Slide 1 (Tentang)</h2>

        {state.error && (
          <div style={{ background: "#dc3545", padding: 12, borderRadius: 6, marginBottom: 15, color: "#fff" }}>
            {state.error}
          </div>
        )}

        <form action={action} encType="multipart/form-data">
          <div className="form-group">
            <label className="form-label" htmlFor="judul">Judul</label>
            <input
              id="judul"
              type="text"
              name="judul"
              className="form-control"
              defaultValue={initial.judul}
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="deskripsi">Deskripsi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              className="form-control"
              defaultValue={initial.deskripsi}
              maxLength={5000}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="foto">Foto (kosongkan kalau tidak diganti)</label>
            {initial.fotoUrl && (
              <div style={{ marginBottom: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={initial.fotoUrl} alt="Foto saat ini" style={{ maxWidth: "100%", borderRadius: 8 }} />
              </div>
            )}
            <input
              id="foto"
              type="file"
              name="foto"
              className="form-control"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
            />
            <div className="help-text">jpeg, png, jpg, gif, atau webp. Max 5MB (otomatis jadi webp).</div>
          </div>

          <div className="btn-group">
            <Link href="/admin/anggota" className="btn-cancel">Batal</Link>
            <button type="submit" className="btn-submit" disabled={pending}>
              {pending ? "Menyimpan..." : "Simpan Slide 1"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
