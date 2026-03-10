"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { GripVertical, Square } from "lucide-react";

interface VideoCompareProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function VideoCompare({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: VideoCompareProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(50);
  const draggingRef = useRef(false);
  const [, forceRender] = useState(0);
  const [playing, setPlaying] = useState(false);
  const hasStartedRef = useRef(false);

  const updateAudio = useCallback((pos: number) => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    if (pos < 50) {
      before.muted = true;
      after.muted = false;
    } else {
      before.muted = false;
      after.muted = true;
    }
  }, []);

  const syncVideos = useCallback(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;
    if (Math.abs(before.currentTime - after.currentTime) > 0.15) {
      after.currentTime = before.currentTime;
    }
  }, []);

  const startPlayback = useCallback(() => {
    if (hasStartedRef.current) return;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    hasStartedRef.current = true;
    setPlaying(true);
    syncVideos();
    updateAudio(sliderRef.current);
    before.play().catch(() => {});
    after.play().catch(() => {});
  }, [syncVideos, updateAudio]);

  const stopPlayback = useCallback(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    before.pause();
    after.pause();
    before.currentTime = 0;
    after.currentTime = 0;
    before.muted = true;
    after.muted = true;
    hasStartedRef.current = false;
    setPlaying(false);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(2, Math.min(98, pct));
      sliderRef.current = clamped;
      setSliderPos(clamped);
      if (hasStartedRef.current) {
        updateAudio(clamped);
      }
    },
    [updateAudio]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-stop-btn]")) return;
      e.preventDefault();
      draggingRef.current = true;
      forceRender((n) => n + 1);
      handleMove(e.clientX);
      startPlayback();
      try { container.setPointerCapture(e.pointerId); } catch {}
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      handleMove(e.clientX);
    };

    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      forceRender((n) => n + 1);
    };

    container.addEventListener("pointerdown", onDown, { passive: false });
    container.addEventListener("pointermove", onMove, { passive: false });
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);

    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
    };
  }, [handleMove, startPlayback]);

  useEffect(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    const onEnded = () => {
      hasStartedRef.current = false;
      setPlaying(false);
      before.currentTime = 0;
      after.currentTime = 0;
      before.muted = true;
      after.muted = true;
    };
    before.addEventListener("ended", onEnded);
    return () => before.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (!hasStartedRef.current) return;
    const id = setInterval(syncVideos, 500);
    return () => clearInterval(id);
  }, [syncVideos]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] select-none aspect-[9/16] max-h-[75vh] mx-auto cursor-col-resize touch-none"
        style={{ maxWidth: 380 }}
      >
        {/* After video — full layer underneath */}
        <video
          ref={afterRef}
          src={afterSrc}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />

        {/* Before video — clipped to slider position */}
        <video
          ref={beforeRef}
          src={beforeSrc}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-[2px] h-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.25)]" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-white/70 bg-black/50 backdrop-blur-md flex items-center justify-center">
            <GripVertical className="h-5 w-5 text-white/80" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/70 uppercase tracking-wider">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-sm border border-sky-500/30 text-xs font-semibold text-sky-400 uppercase tracking-wider">
          {afterLabel}
        </div>

        {/* Stop button */}
        {playing && (
          <button
            data-stop-btn
            onClick={stopPlayback}
            className="absolute bottom-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors hover:bg-black/80 hover:border-white/40"
          >
            <Square className="h-3.5 w-3.5 text-white fill-white" />
          </button>
        )}

        {/* Edge gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent z-[5]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-[5]" />
      </div>
    </div>
  );
}
