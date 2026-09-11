"use client";

import { useEffect, useRef } from "react";

export type Slide1 = { judul: string | null; deskripsi: string | null; foto: string };
export type Member = { nama: string; jabatan: string; foto: string };

const DEFAULT_JUDUL = "LITERASI & KREATIFITAS DIGITAL TINGGI HANYA DI SMEZINE.";
const DEFAULT_DESKRIPSI =
  "Smezine (Ekstrakurikuler Majalah Dinding SMK N 1 Dukuhturi) adalah wadah eksplorasi jurnalistik modern, seni grafis, dan multimedia sekolah. Kami memadukan budaya literasi dengan estetika visual digital terkini untuk melahirkan karya berdaya cipta tinggi.";

function Judul({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf("smezine");
  if (idx >= 0) {
    return (
      <>
        {text.slice(0, idx)}
        <span>{text.slice(idx, idx + 7)}</span>
        {text.slice(idx + 7)}
      </>
    );
  }
  const parts = text.split(" ");
  if (parts.length > 1) {
    const last = parts.pop();
    return (
      <>
        {parts.join(" ")} <span>{last}</span>
      </>
    );
  }
  return <span>{text}</span>;
}

export default function TentangClient({
  slide1,
  ketua,
  members,
}: {
  slide1: Slide1;
  ketua: Member | null;
  members: Member[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // kunci scroll badan ala Blade (overflow hidden), lepas saat keluar halaman
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(".fullpage-slide-section"),
    );
    const dots = Array.from(document.querySelectorAll<HTMLElement>(".v-dot-item"));
    const cardsTrack = trackRef.current;

    const jump = (index: number) => {
      sections[index]?.scrollIntoView({ behavior: "smooth" });
    };
    (window as unknown as { jumpToSlide: (i: number) => void }).jumpToSlide = jump;

    const scrollCards = (amount: number) => {
      cardsTrack?.scrollBy({ left: amount, behavior: "smooth" });
    };
    (window as unknown as { scrollMemberCards: (a: number) => void }).scrollMemberCards = scrollCards;

    // scroll di atas kartu jadi geser samping
    const onWheel = (e: WheelEvent) => {
      if (!cardsTrack) return;
      const atEnd =
        cardsTrack.scrollLeft + cardsTrack.clientWidth >= cardsTrack.scrollWidth - 10;
      const atStart = cardsTrack.scrollLeft <= 10;
      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
        e.preventDefault();
        cardsTrack.scrollBy({ left: e.deltaY * 2.5, behavior: "auto" });
      }
    };
    cardsTrack?.addEventListener("wheel", onWheel, { passive: false });

    // geser kartu pakai mouse (grab-to-scroll)
    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: PointerEvent) => {
      if (!cardsTrack || e.pointerType !== "mouse" || e.button !== 0) return;
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScroll = cardsTrack.scrollLeft;
      cardsTrack.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown || !cardsTrack) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) dragged = true;
      if (dragged) cardsTrack.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      isDown = false;
      cardsTrack?.classList.remove("is-dragging");
      setTimeout(() => {
        dragged = false;
      }, 50);
    };
    const onClickCap = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    cardsTrack?.querySelectorAll("img").forEach((img) => {
      img.setAttribute("draggable", "false");
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });
    cardsTrack?.setAttribute("tabindex", "0");
    cardsTrack?.addEventListener("pointerdown", onDown);
    cardsTrack?.addEventListener("pointermove", onMove);
    ["pointerup", "pointercancel", "pointerleave"].forEach((evt) =>
      cardsTrack?.addEventListener(evt, onUp),
    );
    cardsTrack?.addEventListener("click", onClickCap, true);

    // tandain slide aktif
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sections.forEach((s) => s.classList.remove("active"));
            entry.target.classList.add("active");
            const id = (entry.target as HTMLElement).id;
            const index = parseInt(id.replace("sec-slide-", ""), 10);
            dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
          }
        });
      },
      { root: container, threshold: 0.5 },
    );
    sections.forEach((sec) => observer.observe(sec));

    // titik di hp
    let throttled = false;
    const onScroll = () => {
      if (window.innerWidth > 992 || throttled) return;
      throttled = true;
      requestAnimationFrame(() => {
        throttled = false;
        let best = 0;
        let bestDist = Infinity;
        sections.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs((r.top + r.bottom) / 2 - window.innerHeight / 2);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        dots.forEach((dot, i) => dot.classList.toggle("active", i === best));
      });
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    // keyboard atas-bawah
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "Space"].includes(e.key)) {
        e.preventDefault();
        container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        container.scrollBy({ top: -container.clientHeight, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      cardsTrack?.removeEventListener("wheel", onWheel);
      cardsTrack?.removeEventListener("pointerdown", onDown);
      cardsTrack?.removeEventListener("pointermove", onMove);
      ["pointerup", "pointercancel", "pointerleave"].forEach((evt) =>
        cardsTrack?.removeEventListener(evt, onUp),
      );
      cardsTrack?.removeEventListener("click", onClickCap, true);
    };
  }, []);

  const judul = slide1.judul || DEFAULT_JUDUL;
  const deskripsi = slide1.deskripsi || DEFAULT_DESKRIPSI;

  return (
    <div className="tentang-root">
      <div className="manga-panel-pattern"></div>

      <div className="vertical-dots-nav">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`v-dot-item${i === 0 ? " active" : ""}`}
            onClick={() =>
              (window as unknown as { jumpToSlide: (n: number) => void }).jumpToSlide(i)
            }
          ></div>
        ))}
      </div>

      <div className="fullpage-scroll-container" ref={containerRef}>
        {/* slide 1 intro */}
        <section className="fullpage-slide-section active" id="sec-slide-0">
          <div className="slide-1-grid">
            <div className="slide-1-img-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide1.foto} alt="Slide 1" className="hero-team-img" />
            </div>
            <div className="slide-1-text-col">
              <h1><Judul text={judul} /></h1>
              <p>{deskripsi}</p>
              <div>
                <button
                  className="btn-blue-action"
                  onClick={() =>
                    (window as unknown as { jumpToSlide: (n: number) => void }).jumpToSlide(1)
                  }
                >
                  Pelajari Pimpinan <i className="fa-solid fa-arrow-down"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* slide 2 ketua */}
        <section className="fullpage-slide-section" id="sec-slide-1">
          <div className="slide-2-grid">
            <div className="slide-2-card-col">
              <div className="glass-intro-card">
                <h2>
                  {ketua ? ketua.nama : "Ketua Umum"}
                  <span>{ketua ? `${ketua.jabatan} - ` : ""}Badan Pengurus Harian 2025 / 2026</span>
                </h2>
                <p>
                  {ketua
                    ? `"${ketua.nama} - ${ketua.jabatan} memimpin tim kreatif Smezine untuk terus berinovasi dalam mengemas informasi sekolah yang mendidik, segar, dan berwawasan digital tanpa menghilangkan nilai estetika karya."`
                    : `"Memimpin tim kreatif Smezine untuk terus berinovasi dalam mengemas informasi sekolah yang mendidik, segar, dan berwawasan digital tanpa menghilangkan nilai estetika karya."`}
                </p>
                <button
                  className="btn-blue-action"
                  onClick={() =>
                    (window as unknown as { jumpToSlide: (n: number) => void }).jumpToSlide(2)
                  }
                >
                  Lihat Divisi & Pengurus <i className="fa-solid fa-arrow-down"></i>
                </button>
                <div className="circular-bph-badge">
                  #01
                  <span>BPH</span>
                </div>
              </div>
            </div>
            <div className="slide-2-img-col">
              <div className="curved-blue-bg"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ketua ? ketua.foto : "https://www.pngmart.com/files/13/Aesthetic-Anime-Boy-PNG-Photo.png"}
                alt={ketua ? ketua.nama : "Ketua Umum"}
                className="lead-big-img"
              />
            </div>
          </div>
        </section>

        {/* slide 3 divisi */}
        <section className="fullpage-slide-section" id="sec-slide-2">
          <div className="slide-3-grid">
            <div className="slide-3-blue-col">
              <div>
                <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 2, color: "#bfdbfe", fontWeight: 700 }}>
                  Struktur Lengkap
                </span>
                <h2>DIVISI & PENGURUS HARIAN</h2>
                <p style={{ marginTop: 15 }}>
                  Keluarga inti penggerak literasi, ilustrasi, tata kelola, dan media digital mading Smezine.
                </p>
              </div>
              <div className="cards-scroll-controls">
                <button
                  type="button"
                  className="btn-card-nav"
                  onClick={() =>
                    (window as unknown as { scrollMemberCards: (a: number) => void }).scrollMemberCards(-280)
                  }
                  aria-label="Geser kartu ke kiri"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  type="button"
                  className="btn-card-nav"
                  onClick={() =>
                    (window as unknown as { scrollMemberCards: (a: number) => void }).scrollMemberCards(280)
                  }
                  aria-label="Geser kartu ke kanan"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <div className="slide-3-cards-col" ref={trackRef}>
              {members.length > 0 ? (
                members.map((a, i) => (
                  <div className="division-card-box" key={`${a.nama}-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.foto} alt={a.nama} className="char-img-inner" />
                    <div className="division-caption">
                      <div className="d-tag">{a.jabatan}</div>
                      <h3>{a.nama}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ flex: "0 0 340px", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.14)", borderRadius: 18, padding: 28, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <i className="fa-solid fa-users" style={{ fontSize: "2rem", color: "var(--blue-primary)" }}></i>
                  <p style={{ color: "#cbd5e1", fontWeight: 700 }}>Belum ada anggota di slide ini</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    Foto & nama anggota diambil dari database.<br />Silakan kelola melalui <strong>Panel Kelola Anggota</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
