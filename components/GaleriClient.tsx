"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type GaleriItem = {
  id: number;
  judul: string;
  deskripsi: string | null;
  src: string;
};

const GAP = 26;

export default function GaleriClient({ items }: { items: GaleriItem[] }) {
  const total = items.length;
  const repeat = useMemo(
    () => (total > 0 ? Math.max(1, Math.ceil(Math.max(18, total * 3) / total)) : 1),
    [total],
  );

  // digandain biar bisa muter terus
  const display = useMemo(() => {
    const out: { item: GaleriItem; orig: number }[] = [];
    for (let r = 0; r < repeat; r++)
      items.forEach((item, idx) => out.push({ item, orig: idx }));
    return out;
  }, [items, repeat]);

  const [grid, setGrid] = useState(false);
  const [light, setLight] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ down: false, dragged: false, x: 0, scroll: 0 });
  const glideRef = useRef({ holding: 0, vel: 0, raf: 0 as number | null });
  const rafCurve = useRef(false);
  const lightRef = useRef<number | null>(null);
  lightRef.current = light;

  // pilihan mode tersimpan
  useEffect(() => {
    try {
      if (localStorage.getItem("smezine-gallery-view") === "grid") setGrid(true);
    } catch { /* abaikan */ }
  }, []);

  const setMode = (m: "display" | "grid") => {
    setGrid(m === "grid");
    try {
      localStorage.setItem("smezine-gallery-view", m);
    } catch { /* abaikan */ }
  };

  // efek lengkung 3D
  const applyCurve = useCallback(() => {
    rafCurve.current = false;
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>(".g-slide"));
    if (!slides.length) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const w = slides[0].offsetWidth || 270;
    slides.forEach((slide) => {
      const card = slide.querySelector<HTMLElement>(".slide-card");
      if (!card) return;
      const progress = (center - (slide.offsetLeft + slide.offsetWidth / 2)) / w;
      const abs = Math.min(Math.abs(progress), 4);
      const rotateY = Math.max(-45, Math.min(45, progress * 13.5));
      const translateZ = Math.min(120, Math.pow(abs, 1.2) * 35);
      const scale = 1 + Math.pow(abs, 1.15) * 0.022;
      const translateY = Math.pow(abs, 1.25) * 3;
      card.style.transform = `perspective(1300px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      slide.style.zIndex = String(Math.round(50 + abs * 10));
    });
  }, []);

  const requestCurve = useCallback(() => {
    if (!rafCurve.current) {
      rafCurve.current = true;
      requestAnimationFrame(applyCurve);
    }
  }, [applyCurve]);

  // biar muter terus
  const wrapAround = useCallback(() => {
    const track = trackRef.current;
    if (!track || repeat < 2) return;
    const unit = track.scrollWidth / repeat;
    if (!unit) return;
    const mid = Math.floor(repeat / 2);
    const midStart = unit * mid;
    const midEnd = midStart + unit;
    const center = track.scrollLeft + track.clientWidth / 2;
    if (center < midStart) track.scrollLeft += unit;
    else if (center > midEnd) track.scrollLeft -= unit;
  }, [repeat]);

  // mulai dari tengah biar bisa geser dua arah
  useEffect(() => {
    const track = trackRef.current;
    if (!track || total === 0) return;
    const jump = () => {
      if (repeat < 2) {
        applyCurve();
        return;
      }
      const unit = track.scrollWidth / repeat;
      const mid = Math.floor(repeat / 2);
      track.scrollLeft = unit * mid + unit / 2 - track.clientWidth / 2;
      applyCurve();
    };
    jump();
    window.addEventListener("load", jump);
    window.addEventListener("resize", requestCurve);
    return () => {
      window.removeEventListener("load", jump);
      window.removeEventListener("resize", requestCurve);
    };
  }, [total, repeat, applyCurve, requestCurve]);

  // momentum tombol tahan
  const stopGlide = useCallback(() => {
    const g = glideRef.current;
    g.holding = 0;
    g.vel = 0;
    if (g.raf !== null) {
      cancelAnimationFrame(g.raf);
      g.raf = null;
    }
  }, []);

  const tick = useCallback(() => {
    const track = trackRef.current;
    const g = glideRef.current;
    if (!track) {
      g.raf = null;
      return;
    }
    if (g.holding !== 0) {
      g.vel += (g.holding * 15 - g.vel) * 0.12;
    } else {
      g.vel *= 0.94;
      if (Math.abs(g.vel) < 0.3) {
        g.vel = 0;
        g.raf = null;
        return;
      }
    }
    track.scrollLeft += g.vel;
    g.raf = requestAnimationFrame(tick);
  }, []);

  const ensureTick = useCallback(() => {
    if (glideRef.current.raf === null)
      glideRef.current.raf = requestAnimationFrame(tick);
  }, [tick]);

  const flick = useCallback((dir: number) => {
    glideRef.current.holding = 0;
    glideRef.current.vel = dir * 17;
    ensureTick();
  }, [ensureTick]);

  const stepOnce = useCallback((dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector<HTMLElement>(".g-slide");
    track.scrollBy({ left: dir * ((first?.offsetWidth ?? 270) + GAP), behavior: "smooth" });
  }, []);

  // lepas tombol: tahan lama = biarin momentum, ketuk = geser 1 kartu
  const tapRelease = useCallback((d: number, tap: boolean) => {
    glideRef.current.holding = 0;
    if (tap) {
      stopGlide();
      stepOnce(d);
    }
  }, [stopGlide, stepOnce]);

  // tekan tombol = mulai ngalir
  const press = useCallback((dir: number) => {
    glideRef.current.holding = dir;
    ensureTick();
  }, [ensureTick]);

  useEffect(() => () => stopGlide(), [stopGlide]);

  // keyboard global kiri-kanan (nonaktif saat lightbox / grid)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightRef.current !== null || grid) return;
      if (document.activeElement === trackRef.current) return;
      if (e.key === "ArrowLeft") flick(-1);
      else if (e.key === "ArrowRight") flick(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [grid, flick]);

  // kunci scroll badan saat lightbox
  useEffect(() => {
    document.body.style.overflow = light !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [light]);

  if (total === 0) {
    return (
      <div className="gallery-fullscreen-wrapper">
        <div className="curved-header">
          <span className="badge-tag">Kumpulan Karya</span>
          <h1>Galeri Smezine</h1>
          <p>Jelajahi karya karya terbaru dari anggota kami</p>
        </div>
        <div style={{ textAlign: "center", color: "#6c757d", padding: "48px 0", width: "100%" }}>
          <p>Belum ada foto di galeri.</p>
        </div>
      </div>
    );
  }

  const cur = light !== null ? items[light] : null;

  return (
    <>
      <div className={`gallery-fullscreen-wrapper${grid ? " grid-mode" : ""}`}>
        <div className="curved-header">
          <span className="badge-tag">Kumpulan Karya</span>
          <h1>Galeri Smezine</h1>
          <p>Jelajahi karya karya terbaru dari anggota kami</p>
          <div>
            <div className="gallery-view-switch" role="tablist" aria-label="Mode tampilan galeri">
              <button
                type="button"
                className={`gallery-view-btn${!grid ? " active" : ""}`}
                onClick={() => setMode("display")}
                role="tab"
                aria-selected={!grid}
              >
                <i className="fa-solid fa-clone"></i> Display
              </button>
              <button
                type="button"
                className={`gallery-view-btn${grid ? " active" : ""}`}
                onClick={() => setMode("grid")}
                role="tab"
                aria-selected={grid}
              >
                <i className="fa-solid fa-grip"></i> Grid
              </button>
            </div>
          </div>
        </div>

        <div className="curved-gallery-wrapper">
          <div
            className="gallery-track"
            ref={trackRef}
            tabIndex={0}
            aria-label="Galeri karya, geser atau gunakan panah kiri kanan"
            onScroll={() => {
              wrapAround();
              requestCurve();
            }}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse" || e.button !== 0) return;
              stopGlide();
              dragRef.current = { down: true, dragged: false, x: e.clientX, scroll: trackRef.current?.scrollLeft ?? 0 };
              trackRef.current?.classList.add("is-dragging");
            }}
            onPointerMove={(e) => {
              const d = dragRef.current;
              if (!d.down || !trackRef.current) return;
              const dx = e.clientX - d.x;
              if (Math.abs(dx) > 6) d.dragged = true;
              if (d.dragged) trackRef.current.scrollLeft = d.scroll - dx;
            }}
            onPointerUp={() => {
              dragRef.current.down = false;
              trackRef.current?.classList.remove("is-dragging");
              setTimeout(() => {
                dragRef.current.dragged = false;
              }, 50);
            }}
            onPointerCancel={() => {
              dragRef.current.down = false;
              trackRef.current?.classList.remove("is-dragging");
            }}
            onPointerLeave={() => {
              dragRef.current.down = false;
              trackRef.current?.classList.remove("is-dragging");
            }}
            onClickCapture={(e) => {
              if (dragRef.current.dragged) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            onWheel={(e) => {
              const track = trackRef.current;
              if (!track) return;
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
              const maxLeft = track.scrollWidth - track.clientWidth - 10;
              const atEnd = track.scrollLeft >= maxLeft;
              const atStart = track.scrollLeft <= 10;
              if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
                e.preventDefault();
                track.scrollBy({ left: e.deltaY * 2.5, behavior: "auto" });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                flick(-1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                flick(1);
              }
            }}
          >
            {display.map(({ item, orig }, i) => (
              <div className="g-slide" key={`${item.id}-${i}`}>
                <div className="slide-card" onClick={() => !dragRef.current.dragged && setLight(orig)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.judul} loading="lazy" draggable={false} />
                  <div className="slide-info">
                    <h5>{item.judul}</h5>
                    <p>{item.deskripsi ?? ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <HoldButton dir={-1} label="Previous Slide" onPress={press} onTapRelease={tapRelease} onKey={flick} />
          <HoldButton dir={1} label="Next Slide" onPress={press} onTapRelease={tapRelease} onKey={flick} />
        </div>

        <div className="gallery-masonry">
          {items.map((foto, i) => (
            <div className="masonry-card" key={foto.id} onClick={() => setLight(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.src} alt={foto.judul} loading="lazy" />
              <div className="masonry-info">
                <h5>{foto.judul}</h5>
                {foto.deskripsi ? <p>{foto.deskripsi}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        items={items}
        index={light}
        onClose={() => setLight(null)}
        onNav={(d) => setLight((v) => (v === null ? v : (v + d + items.length) % items.length))}
        onSelect={setLight}
      />
      {cur && <span style={{ display: "none" }}>{cur.judul}</span>}
    </>
  );
}

function HoldButton({ dir, label, onPress, onTapRelease, onKey }: {
  dir: number;
  label: string;
  onPress: (d: number) => void;
  onTapRelease: (d: number, tap: boolean) => void;
  onKey: (d: number) => void;
}) {
  const pressedAt = useRef(0);
  const active = useRef(false);

  const release = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    onTapRelease(dir, performance.now() - pressedAt.current < 220);
  }, [dir, onTapRelease]);

  // lepas di mana pun tetap ketangkap (ala window pointerup di Blade)
  useEffect(() => {
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [release]);
  return (
    <div
      className={`slider-btn ${dir < 0 ? "prev-btn" : "next-btn"}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        active.current = true;
        pressedAt.current = performance.now();
        onPress(dir);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={() => {
        // geser keluar = lepas (samakan dengan Blade)
        release();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onKey(dir);
        }
      }}
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={dir < 0 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}></path>
      </svg>
    </div>
  );
}

function Lightbox({ items, index, onClose, onNav, onSelect }: {
  items: GaleriItem[];
  index: number | null;
  onClose: () => void;
  onNav: (d: number) => void;
  onSelect: (i: number) => void;
}) {
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);
  const [shown, setShown] = useState<GaleriItem | null>(null);

  useEffect(() => {
    if (index === null) {
      setShown(null);
      return;
    }
    const t = setTimeout(() => setShown(items[index]), 120);
    return () => clearTimeout(t);
  }, [index, items]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onClose, onNav]);

  useEffect(() => {
    if (index === null) return;
    thumbsRef.current
      ?.querySelector(`[data-index="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  if (index === null) return null;
  const active = items[index];

  return (
    <div className="gallery-modal active" role="dialog" aria-modal="true">
      <button className="modal-btn-close" onClick={onClose} aria-label="Tutup Galeri">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <button className="modal-nav-btn prev" onClick={() => onNav(-1)} aria-label="Gambar Sebelumnya">
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button className="modal-nav-btn next" onClick={() => onNav(1)} aria-label="Gambar Selanjutnya">
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div
        className="modal-stage"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0].screenX;
        }}
        onTouchEnd={(e) => {
          const dx = touchX.current - e.changedTouches[0].screenX;
          if (dx > 45) onNav(1);
          if (dx < -45) onNav(-1);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shown?.src ?? active.src}
          alt={shown?.judul ?? active.judul}
          style={{ opacity: shown ? 1 : 0, transform: shown ? "scale(1)" : "scale(0.97)" }}
        />
      </div>

      <div className="modal-bottom-bar">
        <div className="modal-artwork-info">
          <h3>{active.judul}</h3>
          <p>{active.deskripsi ?? ""}</p>
        </div>
        <div className="modal-thumbs-container">
          <div className="modal-thumbs-track" ref={thumbsRef}>
            {items.map((t, i) => (
              <div
                key={t.id}
                className={`thumb-box${i === index ? " active" : ""}`}
                onClick={() => onSelect(i)}
                data-index={i}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt={t.judul} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
