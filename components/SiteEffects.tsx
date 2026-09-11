"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Efek global port dari resources/js/app.js:
// - cegah klik kanan & shortcut intip sumber
// - transisi fade body tiap pindah halaman
export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "C", "J"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener("contextmenu", onContext);
    document.onkeydown = onKey as unknown as typeof document.onkeydown;
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.onkeydown = null;
    };
  }, []);

  // Tiap ganti route: tandai loaded (ganti fade ala Blade)
  useEffect(() => {
    document.body.classList.remove("fade-out");
    const t = setTimeout(() => document.body.classList.add("loaded"), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
