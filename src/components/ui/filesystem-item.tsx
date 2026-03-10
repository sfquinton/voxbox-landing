"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Folder, File } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Node = {
  name: string;
  href?: string;
  nodes?: Node[];
};

interface FilesystemItemProps {
  node: Node;
  animated?: boolean;
  depth?: number;
  defaultOpen?: boolean;
  openOnScroll?: boolean;
}

const sizeConfig = [
  { text: "text-2xl", icon: "size-9", chevron: "size-7", pad: "py-2.5", gap: "gap-3", indent: "pl-10", fileML: "ml-[34px]", emptyML: "ml-[34px]" },
  { text: "text-lg", icon: "size-7", chevron: "size-6", pad: "py-2", gap: "gap-2.5", indent: "pl-8", fileML: "ml-[30px]", emptyML: "ml-[30px]" },
  { text: "text-sm", icon: "size-5", chevron: "size-4", pad: "py-1", gap: "gap-1.5", indent: "pl-6", fileML: "ml-[22px]", emptyML: "ml-[22px]" },
];

export function FilesystemItem({
  node,
  animated = false,
  depth = 0,
  defaultOpen = false,
  openOnScroll = false,
}: FilesystemItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!openOnScroll || isOpen || !node.nodes?.length) return;
    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [openOnScroll, isOpen, node.nodes?.length]);
  const sizes = sizeConfig[Math.min(depth, sizeConfig.length - 1)];

  const ChevronIcon = () =>
    animated ? (
      <motion.span
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="flex"
      >
        <ChevronRight className={`${sizes.chevron} text-white/40`} />
      </motion.span>
    ) : (
      <ChevronRight
        className={`${sizes.chevron} text-white/40 ${isOpen ? "rotate-90" : ""}`}
      />
    );

  const ChildrenList = () => {
    const children = node.nodes?.map((child) => (
      <FilesystemItem node={child} key={child.name} animated={animated} depth={depth + 1} />
    ));

    if (animated) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`${sizes.indent} overflow-hidden flex flex-col justify-end`}
            >
              {children}
            </motion.ul>
          )}
        </AnimatePresence>
      );
    }

    return isOpen && <ul className={sizes.indent}>{children}</ul>;
  };

  const label = node.href ? (
    <a
      href={node.href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-sky-400 hover:underline transition-colors"
    >
      {node.name}
    </a>
  ) : (
    node.name
  );

  return (
    <li ref={itemRef} key={node.name}>
      <span className={`flex items-center md:whitespace-nowrap ${sizes.gap} ${sizes.pad} text-white/80 ${sizes.text} transition-transform duration-200 hover:scale-[1.03] origin-left`}>
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 -m-1">
            <ChevronIcon />
          </button>
        )}

        {node.nodes ? (
          <button
            onClick={() => node.nodes!.length > 0 && setIsOpen(!isOpen)}
            className={`shrink-0 ${node.nodes.length === 0 ? sizes.emptyML : ""}`}
          >
            <Folder className={`${sizes.icon} text-sky-400 fill-sky-400`} />
          </button>
        ) : (
          <File className={`${sizes.fileML} ${sizes.icon} text-white/50 shrink-0`} />
        )}
        {node.nodes && node.nodes.length > 0 ? (
          <button onClick={() => setIsOpen(!isOpen)} className="text-left font-medium">
            {node.name}
          </button>
        ) : (
          label
        )}
      </span>

      <ChildrenList />
    </li>
  );
}

export type { Node };
