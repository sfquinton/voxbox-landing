"use client";

import React, { useRef } from "react";
import { motion, Variants, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface WordPullUpProps {
  children: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  startOnView?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.08,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 120,
    },
  },
};

export function WordPullUp({
  children,
  className,
  wordClassName,
  delay = 0,
  as: Tag = "p",
  startOnView = false,
}: WordPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const MotionTag = motion.create(Tag);
  const words = children.split(/(\s+)/);

  const shouldAnimate = startOnView ? inView : true;

  return (
    <MotionTag
      ref={ref as React.RefObject<never>}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "show" : "hidden"}
      custom={delay}
      className={cn("flex flex-wrap items-center justify-center", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className={cn("inline-block", wordClassName)}
        >
          {word === " " ? "\u00A0" : word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
