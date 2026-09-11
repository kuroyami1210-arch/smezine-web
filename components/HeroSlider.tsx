"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
};

function limit(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trimEnd() + "..." : s;
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const show = useCallback(
    (index: number) => {
      const total = slides.length;
      if (total === 0) return;
      setCurrent(((index % total) + total) % total);
    },
    [slides.length],
  );

  const startAuto = useCallback(() => {
    stopAuto();
    if (slides.length <= 1) return;
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
  }, [slides.length]);

  function stopAuto() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAuto]);

  // belum ada berita → kosongkan dulu (tidak ada hero pengganti)
  if (slides.length === 0) {
    return null;
  }

  return (
    <header
      className="hero"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {slides.map((item, index) => (
        <div key={item.id} className={`slide${index === current ? " active" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.gambar} alt={item.judul} />
          <div className="hero-content">
            <span className="badge">{index === 0 ? "Terbaru" : "Berita"}</span>
            <h1>{limit(item.judul, 65)}</h1>
            <p>{limit(item.deskripsi, 110)}</p>
            <Link href={`/berita/${item.id}`} className="btn-join">
              Baca Selengkapnya
            </Link>
          </div>
        </div>
      ))}
      <div className="dots">
        {slides.map((item, index) => (
          <div
            key={item.id}
            className={`dot${index === current ? " active" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              show(index);
              startAuto();
            }}
          ></div>
        ))}
      </div>
    </header>
  );
}
