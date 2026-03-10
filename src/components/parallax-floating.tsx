"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useAnimationFrame } from "motion/react";

import { cn } from "@/lib/utils";
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = createContext<FloatingContextType | null>(null);

interface FloatingProps {
  children: ReactNode;
  className?: string;
  sensitivity?: number;
  easingFactor?: number;
}

const Floating = ({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
  ...props
}: FloatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement;
        depth: number;
        currentPosition: { x: number; y: number };
        phaseX: number;
        phaseY: number;
        speedX: number;
        speedY: number;
      }
    >()
  );
  const mousePositionRef = useMousePositionRef(containerRef);

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      elementsMap.current.set(id, {
        element,
        depth,
        currentPosition: { x: 0, y: 0 },
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.3 + Math.random() * 0.4,
        speedY: 0.3 + Math.random() * 0.4,
      });
    },
    []
  );

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id);
  }, []);

  const timeRef = useRef(0);

  useAnimationFrame((_t, delta) => {
    if (!containerRef.current) return;

    timeRef.current += delta / 1000;
    const t = timeRef.current;

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20;
      const driftRadius = 6 + data.depth * 3;

      const driftX = Math.sin(t * data.speedX + data.phaseX) * driftRadius;
      const driftY = Math.cos(t * data.speedY + data.phaseY) * driftRadius;

      const newTargetX = mousePositionRef.current.x * strength + driftX;
      const newTargetY = mousePositionRef.current.y * strength + driftY;

      const dx = newTargetX - data.currentPosition.x;
      const dy = newTargetY - data.currentPosition.y;

      data.currentPosition.x += dx * easingFactor;
      data.currentPosition.y += dy * easingFactor;

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`;
    });
  });

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </FloatingContext.Provider>
  );
};

export default Floating;

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export const FloatingElement = ({
  children,
  className,
  depth = 1,
}: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(FloatingContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;

    const nonNullDepth = depth ?? 0.01;

    context.registerElement(idRef.current, elementRef.current, nonNullDepth);
    return () => context.unregisterElement(idRef.current);
  }, [depth, context]);

  return (
    <div ref={elementRef} className={cn("absolute will-change-transform", className)}>
      {children}
    </div>
  );
};
