"use client";

import { useState } from "react";
import { ALLOWED_MIME } from "../lib/upload-limits";

// Input file gambar dengan validasi dini di browser: tipe + ukuran dicek
// SEBELUM submit, agar file kebesaran (yang bikin Server Action crash di
// Vercel) langsung ditolak dengan pesan jelas. File tak valid otomatis
// dibuang dari input sehingga tidak bisa terkirim.
export default function ImageInput({
  id,
  name,
  maxBytes,
  required = false,
}: {
  id: string;
  name: string;
  maxBytes: number;
  required?: boolean;
}) {
  const [err, setErr] = useState<string | null>(null);
  const mb = maxBytes / 1024 / 1024;

  return (
    <>
      <input
        id={id}
        type="file"
        name={name}
        className="form-control"
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        required={required}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) {
            setErr(null);
            return;
          }
          if (!ALLOWED_MIME.includes(f.type)) {
            setErr("File harus berupa gambar (jpeg, png, jpg, gif, atau webp).");
            e.target.value = "";
            return;
          }
          if (f.size > maxBytes) {
            setErr(
              `Kegedean: ${(f.size / 1024 / 1024).toFixed(1)}MB, maksimal ${mb}MB. Kecilkan/kompres dulu fotonya baru upload.`,
            );
            e.target.value = "";
            return;
          }
          setErr(null);
        }}
      />
      {err && (
        <div className="help-text" style={{ color: "#ff4d4d" }}>
          {err}
        </div>
      )}
    </>
  );
}
