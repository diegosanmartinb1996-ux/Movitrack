"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-white/10 bg-ink py-20 md:py-24">
      <Container className="max-w-3xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display text-base font-medium tracking-tight md:text-lg">
                    {item.question}
                  </span>
                  <Plus
                    size={18}
                    className={cn(
                      "shrink-0 text-signal transition-transform duration-300",
                      open && "rotate-45"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl text-sm leading-relaxed text-white/55">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
