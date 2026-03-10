"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";

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
  const draggingRef = useRef(false);
  const [, forceRender] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const readyCount = useRef(0);

  const updateAudio = useCallback((pos: number) => {
    const t = pos / 100;
    if (beforeRef.current) beforeRef.current.volume = Math.max(0, Math.min(1, 1 - t));
    if (afterRef.current) afterRef.current.volume = Math.max(0, Math.min(1, t));
  }, []);

  const syncVideos = useCallback(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;
    if (Math.abs(before.currentTime - after.currentTime) > 0.15) {
      after.currentTime = before.currentTime;
    }
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(2, Math.min(98, pct));
      setSliderPos(clamped);
      updateAudio(clamped);
    },
    [updateAudio]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-play-btn]")) return;
      e.preventDefault();
      draggingRef.current = true;
      forceRender((n) => n + 1);
      handleMove(e.clientX);
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
  }, [handleMove]);

  const togglePlay = useCallback(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    if (playing) {
      before.pause();
      after.pause();
    } else {
      before.muted = false;
      after.muted = false;
      syncVideos();
      updateAudio(sliderPos);
      before.play().catch(() => {});
      after.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }, [playing, sliderPos, syncVideos, updateAudio]);

  const onVideoReady = useCallback(() => {
    readyCount.current += 1;
    if (readyCount.current >= 2) setReady(true);
  }, []);

  useEffect(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    const onEnded = () => {
      setPlaying(false);
      before.currentTime = 0;
      after.currentTime = 0;
    };
    before.addEventListener("ended", onEnded);
    return () => before.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(syncVideos, 500);
    return () => clearInterval(id);
  }, [playing, syncVideos]);

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
          playsInline
          preload="auto"
          onCanPlay={onVideoReady}
        />

        {/* Before video — clipped to slider position */}
        <video
          ref={beforeRef}
          src={beforeSrc}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          muted
          playsInline
          preload="auto"
          onCanPlay={onVideoReady}
        />

        {/* Slider handle + play/pause button */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          {/* Vertical line */}
          <div className="w-[2px] h-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.25)]" />

          {/* Center play/pause handle */}
          <motion.button
            data-play-btn
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-white/70 bg-black/50 backdrop-blur-md flex items-center justify-center pointer-events-auto transition-colors hover:bg-black/70 hover:border-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              {playing ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  <Pause className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  <Play className="h-6 w-6 text-white ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/70 uppercase tracking-wider">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-sm border border-sky-500/30 text-xs font-semibold text-sky-400 uppercase tracking-wider">
          {afterLabel}
        </div>

        {/* Edge gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent z-[5]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-[5]" />
      </div>
    </div>
  );
}
