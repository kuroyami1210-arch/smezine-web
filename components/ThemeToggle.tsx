"use client";

import { useEffect, useState } from "react";

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  // Ngumpet pas scroll ke bawah, nongol lagi pas scroll ke atas / di atas.
  // Mendengar scroll window (semua halaman, termasuk laptop) DAN scroll
  // container dalam halaman Tentang (fullpage-scroll-container) yang
  // scroll-nya tidak lewat window.
  useEffect(() => {
    const HIDE_AFTER = 120;
    let lastWin = window.scrollY || 0;
    let lastInner = 0;
    let ticking = false;
    const innerOf = () =>
      document.querySelector<HTMLElement>(".fullpage-scroll-container");
    const update = () => {
      ticking = false;
      const wy = window.scrollY || 0;
      const iy = innerOf()?.scrollTop ?? 0;
      const deep = wy > HIDE_AFTER || iy > HIDE_AFTER;
      const goingDown = wy > lastWin || iy > lastInner;
      if (!deep) {
        setHidden(false);
      } else if (goingDown) {
        setHidden(true);
      } else if (wy < lastWin || iy < lastInner) {
        setHidden(false);
      }
      lastWin = wy;
      lastInner = iy;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const inner = innerOf();
    inner?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      inner?.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("smezine-theme", next);
    } catch {
      /* biarin kalau gagal */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      className={`theme-toggle-float${hidden ? " theme-toggle-hidden" : ""}`}
      onClick={toggle}
      aria-label="Ganti mode tampilan"
      title="Ganti mode terang / gelap"
      tabIndex={hidden ? -1 : undefined}
    >
      <i className={theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
    </button>
  );
}
