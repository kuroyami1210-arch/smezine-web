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

  // Ngumpet pas scroll ke bawah, nongol lagi pas scroll ke atas / di atas
  useEffect(() => {
    const HIDE_AFTER = 120;
    let lastY = window.scrollY || 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY || 0;
      if (y <= HIDE_AFTER) {
        setHidden(false);
      } else if (y > lastY) {
        setHidden(true);
      } else if (y < lastY) {
        setHidden(false);
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
