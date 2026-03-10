"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioCompareProps {
  rawSrc: string;
  presetSrc: string;
  title?: string;
  className?: string;
}

export function AudioCompare({
  rawSrc,
  presetSrc,
  title,
  className,
}: AudioCompareProps) {
  const rawRef = useRef<HTMLAudioElement>(null);
  const presetRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mix, setMix] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number>(0);

  const updateVolumes = useCallback((value: number) => {
    if (rawRef.current) rawRef.current.volume = 1 - value;
    if (presetRef.current) presetRef.current.volume = value;
  }, []);

  const handleMixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMix(val);
    updateVolumes(val);
  };

  const tick = useCallback(() => {
    const raw = rawRef.current;
    if (raw && duration > 0) {
      setProgress(raw.currentTime / duration);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [duration]);

  const togglePlay = () => {
    const raw = rawRef.current;
    const preset = presetRef.current;
    if (!raw || !preset) return;

    if (playing) {
      raw.pause();
      preset.pause();
      cancelAnimationFrame(rafRef.current);
    } else {
      updateVolumes(mix);
      raw.play().catch(() => {});
      preset.play().catch(() => {});
      rafRef.current = requestAnimationFrame(tick);
    }
    setPlaying(!playing);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const raw = rawRef.current;
    const preset = presetRef.current;
    if (raw && preset && duration > 0) {
      const time = pct * duration;
      raw.currentTime = time;
      preset.currentTime = time;
      setProgress(pct);
    }
  };

  useEffect(() => {
    const raw = rawRef.current;
    if (!raw) return;
    const onLoaded = () => setDuration(raw.duration);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      cancelAnimationFrame(rafRef.current);
      if (presetRef.current) {
        presetRef.current.pause();
        presetRef.current.currentTime = 0;
      }
      raw.currentTime = 0;
    };
    raw.addEventListener("loadedmetadata", onLoaded);
    raw.addEventListener("ended", onEnded);
    return () => {
      raw.removeEventListener("loadedmetadata", onLoaded);
      raw.removeEventListener("ended", onEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const mixPct = Math.round(mix * 100);

  return (
    <div className={className}>
      <audio ref={rawRef} src={rawSrc} preload="metadata" />
      <audio ref={presetRef} src={presetSrc} preload="metadata" />

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 md:p-10">
        {/* Glow effect behind play button */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${mix > 0.5 ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.15)"} 0%, transparent 70%)`,
            transition: "background 0.6s ease",
          }}
        />

        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-[3px] mb-8">
          {Array.from({ length: 40 }).map((_, i) => {
            const h = Math.sin((i / 40) * Math.PI) * 0.7 + 0.3;
            const isActive = i / 40 <= progress;
            return (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                animate={{
                  height: playing
                    ? `${h * 36 + Math.random() * 8}px`
                    : `${h * 28}px`,
                  backgroundColor: isActive
                    ? mix > 0.5 ? "#0ea5e9" : "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.15 }}
              />
            );
          })}
        </div>

        {/* Play button + time */}
        <div className="flex flex-col items-center mb-8">
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white backdrop-blur-sm transition-colors hover:border-sky-500/40 hover:bg-sky-500/10"
          >
            <AnimatePresence mode="wait">
              {playing ? (
                <motion.div key="pause" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Pause className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Play className="h-6 w-6 ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <div className="flex items-center gap-2 mt-3 text-xs text-white/30 font-mono">
            <span>{formatTime(progress * duration)}</span>
            <span className="text-white/15">/</span>
            <span>{duration > 0 ? formatTime(duration) : "0:00"}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="relative h-1 w-full cursor-pointer rounded-full bg-white/[0.08] mb-10 group"
          onClick={handleProgressClick}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: mix > 0.5
                ? "linear-gradient(90deg, rgba(14,165,233,0.4), #0ea5e9)"
                : "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5))",
              transition: "background 0.4s ease",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>

        {/* Mix slider section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${mix < 0.3 ? "bg-white/60" : "bg-white/20"}`} />
              <span className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${mix < 0.3 ? "text-white/70" : "text-white/30"}`}>
                Raw
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-white/20" />
              <span className="text-xs font-mono text-white/30">{mixPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${mix > 0.7 ? "text-sky-400" : "text-white/30"}`}>
                Preset
              </span>
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${mix > 0.7 ? "bg-sky-400" : "bg-white/20"}`} />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${mixPct}%`,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.15), #0ea5e9)",
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={mix}
              onChange={handleMixChange}
              className="audio-compare-slider w-full relative z-10"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={mix < 0.3 ? "raw" : mix > 0.7 ? "preset" : "blend"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-center mt-4 text-sm font-medium"
              style={{
                color: mix > 0.7 ? "#0ea5e9" : mix < 0.3 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)",
              }}
            >
              {mix < 0.3 ? "Hearing raw vocals" : mix > 0.7 ? "Hearing the preset" : "Blending both signals"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
