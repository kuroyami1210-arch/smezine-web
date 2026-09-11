"use client";

import { useEffect, useState } from "react";

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setTheme(currentTheme());
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
      className="theme-toggle-float"
      onClick={toggle}
      aria-label="Ganti mode tampilan"
      title="Ganti mode terang / gelap"
    >
      <i className={theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
    </button>
  );
}
