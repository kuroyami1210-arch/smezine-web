"use client";

import { useState } from "react";

export default function DeleteButton({
  label,
  confirmText,
  action,
}: {
  label: string;
  confirmText: string;
  action: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (!confirm(confirmText)) return;
        setPending(true);
        try {
          await action();
        } finally {
          setPending(false);
        }
      }}
      style={{
        background: "#dc3545",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: 4,
        cursor: pending ? "wait" : "pointer",
        fontWeight: 600,
        fontSize: "0.85rem",
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? "..." : label}
    </button>
  );
}
