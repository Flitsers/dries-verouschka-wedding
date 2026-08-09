"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: readonly FaqItem[];
};

export default function WeddingFaqAccordion({ items }: Props) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section id="faq" className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute -right-48 top-1/3 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Veelgestelde vragen" title="Goed om te weten" />
            <p className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-white/65">
              Praktische antwoorden voor een zorgeloze dag samen.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 border-y border-white/10">
          {items.map((item, index) => {
            const itemId = `faq-answer-${index}`;
            const isOpen = openQuestion === item.question;

            return (
              <div key={item.question} className="border-b border-white/10 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={itemId}
                  onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                  className="group flex w-full items-center justify-between gap-4 py-7 text-left outline-none transition-colors duration-300 hover:text-[#d4b06a] focus-visible:ring-2 focus-visible:ring-[#d4b06a] focus-visible:ring-inset sm:gap-6 md:py-8"
                >
                  <span className="flex min-w-0 items-baseline gap-3 sm:gap-5 md:gap-7">
                    <span className="shrink-0 text-[10px] font-semibold tracking-[0.3em] text-[#d4b06a]/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl leading-tight sm:text-2xl md:text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`shrink-0 text-[#d4b06a] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={itemId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 pl-8 pr-8 leading-relaxed text-white/65 sm:pl-10 sm:pr-10 md:pl-12 md:text-lg">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
