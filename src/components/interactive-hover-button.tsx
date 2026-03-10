"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-sm p-3 px-8 text-center font-semibold text-white",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-white transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-14 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-black opacity-0 translate-x-12 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="h-5 w-5" />
      </div>
    </button>
  );
}
