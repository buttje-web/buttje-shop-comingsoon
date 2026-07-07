"use client";

import { useRef, useState } from "react";

/*
  Hochformat-Video (9:16) als eigenstaendiges Element im Kategorie-Kopf.
  Komplett sichtbar (kein Crop), autoplay stumm, playsinline, Loop nach dem
  ganzen Video. Dezenter Ton-Knopf (an/aus) unten rechts auf dem Video.
*/

export default function CategoryVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play();
  }

  return (
    <div className="relative w-full max-w-[340px] overflow-hidden border border-line-strong shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
      <video
        ref={videoRef}
        className="block aspect-[9/16] h-auto w-full"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Ton einschalten" : "Ton ausschalten"}
        className="absolute bottom-3 right-3 flex min-h-[40px] items-center gap-2 border border-line-strong px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-text transition-colors hover:border-accent hover:text-accent"
        style={{ backgroundColor: "rgba(14,14,18,0.72)" }}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
        {muted ? "Ton an" : "Ton aus"}
      </button>
    </div>
  );
}
