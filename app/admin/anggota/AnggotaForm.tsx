"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAnggota, updateAnggota } from "./actions";
import "../../../components/admin.css";
import ImageInput from "../../../components/ImageInput";
import { MAX_BERITA_GALERI_ANGGOTA } from "../../../lib/upload-limits";

const KATEGORI = [
  "divisi",
  "pdd",
  "sekretaris_bendahara",
  "ketua",
  "ketua_umum",
];

export type AnggotaInitial = {
  id?: number;
  nama?: string;
  jabatan?: string;
  kategori?: string;
  urutan?: number;
  fotoUrl?: string | null;
};

const KATEGORI_LABEL: Record<string, string> = {
  divisi: "divisi — Slide 3",
  pdd: "pdd — Slide 3",
  sekretaris_bendahara: "sekretaris_bendahara — Slide 3",
  ketua: "ketua — Slide 3",
  ketua_umum: "ketua_umum — Slide 2",
};

export default function AnggotaForm({
  initial,
  submitLabel,
  title,
}: {
  initial?: AnggotaInitial;
  submitLabel: string;
  title: string;
}) {
  const editing = initial?.id !== undefined;
  const [state, action, pending] = useActionState(
    editing ? updateAnggota : createAnggota,
    {},
  );

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2 className="admin-title"><i className="fa-solid fa-user-plus"></i> {title}</h2>

        {state.error && (
          <div style={{ background: "#dc3545", padding: 12, borderRadius: 6, marginBottom: 15, color: "#fff" }}>
            {state.error}
          </div>
        )}

        <form action={action} encType="multipart/form-data">
          {editing && <input type="hidden" name="id" value={initial!.id} />}

          <div className="form-group">
            <label className="form-label" htmlFor="nama">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              name="nama"
              className="form-control"
              placeholder="Contoh: Akhmad Kasifatul Fikri"
              defaultValue={initial?.nama ?? ""}
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="jabatan">Jabatan / Divisi</label>
            <input
              id="jabatan"
              type="text"
              name="jabatan"
              className="form-control"
              placeholder="Contoh: Divisi Jurnalistik, Sekretaris, Tim PDD, Ketua Umum"
              defaultValue={initial?.jabatan ?? ""}
              maxLength={255}
              required
            />
          </div>

          <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 14 }}>
            <div>
              <label className="form-label" htmlFor="kategori">Kategori</label>
              <select
                id="kategori"
                name="kategori"
                className="form-select"
                defaultValue={initial?.kategori ?? "divisi"}
                required
              >
                {KATEGORI.map((k) => (
                  <option key={k} value={k}>{KATEGORI_LABEL[k] ?? k}</option>
                ))}
              </select>
              <div className="help-text">
                Slide 1 sekarang diatur terpisah (judul, deskripsi, foto) — bukan dari sini. Selain ketua_umum → otomatis Slide 3
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="urutan">Urutan</label>
              <input
                id="urutan"
                type="number"
                name="urutan"
                className="form-control"
                placeholder="0"
                defaultValue={initial?.urutan ?? 0}
                min={0}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="foto">Foto</label>
            {editing && initial?.fotoUrl && (
              <div style={{ marginBottom: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={initial.fotoUrl} alt="Foto saat ini" style={{ maxWidth: 220, borderRadius: 8 }} />
              </div>
            )}
            <ImageInput
              id="foto"
              name="foto"
              maxBytes={MAX_BERITA_GALERI_ANGGOTA}
            />
            <div className="help-text">Opsional. Kosong = avatar inisial. Max 2MB.</div>
          </div>

          <div className="btn-group">
            <Link href="/admin/anggota" className="btn-cancel">Batal</Link>
            <button type="submit" className="btn-submit" disabled={pending}>
              {pending ? "Menyimpan..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
