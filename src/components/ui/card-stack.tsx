"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SquareArrowOutUpRight, Volume2, VolumeOff, Play, Pause } from "lucide-react";
import Link from "next/link";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  videoSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean; muted: boolean; onToggleMute: () => void }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);
  const [muted, setMuted] = React.useState(true);

  const toggleMute = React.useCallback(() => setMuted((m) => !m), []);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;
  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="relative w-full"
        style={{ height: Math.max(380, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/30 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;
              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragSnapToOrigin: true,
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: unknown,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-2xl border-4 border-white/10 overflow-hidden shadow-xl",
                    "will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => { if (!isActive) setActive(i); }}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive, muted, onToggleMute: toggleMute })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} muted={muted} onToggleMute={toggleMute} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {showDots && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    on
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>

          {activeItem.href && (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="text-white/40 hover:text-white transition"
              aria-label="Open link"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function DefaultFanCard({
  item,
  active,
  muted,
  onToggleMute,
}: {
  item: CardStackItem;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(true);

  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (active) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
      setPaused(false);
      setShowOverlay(true);
    } else {
      vid.pause();
      setPaused(true);
      setShowOverlay(true);
    }
  }, [active]);

  // Load first frame on mount so background cards show a preview
  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid || active) return;
    vid.currentTime = 0.1;
  }, []);

  React.useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
  }, [muted]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (muted) {
      // First click: unmute and hide overlay
      onToggleMute();
      setShowOverlay(false);
      return;
    }

    if (paused) {
      // Was paused, resume and hide overlay
      vid.play().catch(() => {});
      setPaused(false);
      setShowOverlay(false);
    } else {
      // Playing, pause it
      vid.pause();
      setPaused(true);
    }
  };

  // Clicking the video area when overlay is hidden -> pause and show overlay
  const handleVideoAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    setPaused(true);
    setShowOverlay(true);
  };

  const iconToShow = muted
    ? <VolumeOff className="h-6 w-6" />
    : paused
      ? <Play className="h-6 w-6 ml-0.5" />
      : <Pause className="h-6 w-6" />;

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        {item.videoSrc ? (
          <video
            ref={videoRef}
            src={item.videoSrc}
            className="h-full w-full object-cover"
            draggable={false}
            muted={muted}
            loop
            playsInline
            preload="auto"
          />
        ) : item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">
            No media
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {active && item.videoSrc && showOverlay && (
        <button
          onClick={handleOverlayClick}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/70">
            {iconToShow}
          </div>
        </button>
      )}

      {active && item.videoSrc && !showOverlay && (
        <button
          onClick={handleVideoAreaClick}
          className="absolute inset-0 z-20"
        />
      )}

      <div className="relative z-10 flex h-full flex-col justify-end p-5 pointer-events-none">
        <div className="truncate text-lg font-semibold text-white">
          {item.title}
        </div>
        {item.description && (
          <div className="mt-1 line-clamp-2 text-sm text-white/80">
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
}
