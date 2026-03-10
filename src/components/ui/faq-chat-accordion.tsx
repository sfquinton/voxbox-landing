"use client";

import * as React from "react";
import { motion } from "motion/react";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

interface FaqAccordionProps {
  data: FAQItem[];
  className?: string;
  timestamp?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  timestamp,
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("p-4", className)}>
      {timestamp && (
        <div className="mb-4 text-sm text-white/30">{timestamp}</div>
      )}

      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
      >
        {data.map((item) => (
          <Accordion.Item
            value={item.id.toString()}
            key={item.id}
            className="mb-2"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-center gap-x-4">
                <div
                  className={cn(
                    "relative flex items-center space-x-2 rounded-xl p-2 px-4 transition-colors",
                    openItem === item.id.toString()
                      ? "bg-sky-500/20 text-sky-400"
                      : "bg-white/[0.06] hover:bg-white/[0.1] text-white/80",
                    questionClassName
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        "absolute bottom-6",
                        item.iconPosition === "right" ? "right-0" : "left-0"
                      )}
                      style={{
                        transform:
                          item.iconPosition === "right"
                            ? "rotate(7deg)"
                            : "rotate(-4deg)",
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium text-sm md:text-base">
                    {item.question}
                  </span>
                </div>

                <span
                  className={cn(
                    "text-white/40",
                    openItem === item.id.toString() && "text-sky-400"
                  )}
                >
                  {openItem === item.id.toString() ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount>
              <motion.div
                initial="collapsed"
                animate={
                  openItem === item.id.toString() ? "open" : "collapsed"
                }
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="ml-7 mt-1 md:ml-16">
                  <div
                    className={cn(
                      "relative max-w-sm rounded-2xl bg-sky-500 px-4 py-2 text-white text-sm md:text-base",
                      answerClassName
                    )}
                  >
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
