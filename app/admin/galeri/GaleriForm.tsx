"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createGaleri, updateGaleri } from "./actions";
import "../../../components/admin.css";

export type GaleriInitial = {
  id?: number;
  judul?: string;
  deskripsi?: string | null;
  gambarUrl?: string;
};

export default function GaleriForm({
  initial,
  submitLabel,
  title,
}: {
  initial?: GaleriInitial;
  submitLabel: string;
  title: string;
}) {
  const editing = initial?.id !== undefined;
  const [state, action, pending] = useActionState(
    editing ? updateGaleri : createGaleri,
    {},
  );

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2 className="admin-title"><i className="fa-solid fa-image"></i> {title}</h2>

        {state.error && (
          <div style={{ background: "#dc3545", padding: 12, borderRadius: 6, marginBottom: 15, color: "#fff" }}>
            {state.error}
          </div>
        )}

        <form action={action} encType="multipart/form-data">
          {editing && <input type="hidden" name="id" value={initial!.id} />}

          <div className="form-group">
            <label className="form-label" htmlFor="judul">Judul</label>
            <input
              id="judul"
              type="text"
              name="judul"
              className="form-control"
              defaultValue={initial?.judul ?? ""}
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="deskripsi">Deskripsi (opsional)</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              className="form-control"
              defaultValue={initial?.deskripsi ?? ""}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gambar">
              Gambar{editing ? " (kosongkan kalau tidak diganti)" : ""}
            </label>
            {editing && initial?.gambarUrl && (
              <div style={{ marginBottom: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={initial.gambarUrl} alt="Gambar saat ini" style={{ maxWidth: "100%", borderRadius: 8 }} />
              </div>
            )}
            <input
              id="gambar"
              type="file"
              name="gambar"
              className="form-control"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              required={!editing}
            />
            <div className="help-text">jpeg, png, jpg, gif, atau webp. Max 2MB (otomatis jadi webp).</div>
          </div>

          <div className="btn-group">
            <Link href="/admin/galeri" className="btn-cancel">Batal</Link>
            <button type="submit" className="btn-submit" disabled={pending}>
              {pending ? "Menyimpan..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
