"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

const faqItems = [
  {
    question: "Hoe laat worden we verwacht?",
    answer: "De ceremonie start om 16:00. We vragen onze gasten tijdig aanwezig te zijn.",
  },
  {
    question: "Waar kunnen we parkeren?",
    answer: "Er is parking voorzien bij de locatie. Meer praktische informatie volgt binnenkort.",
  },
  {
    question: "Is er een dresscode?",
    answer: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
  },
  {
    question: "Zijn kinderen welkom?",
    answer: "Placeholder — voeg hier later duidelijke informatie over kinderen op de huwelijksdag toe.",
  },
  {
    question: "Kunnen dieetwensen doorgegeven worden?",
    answer: "Dieetwensen kunnen jullie meegeven in het berichtveld van jullie persoonlijke RSVP.",
  },
  {
    question: "Is er vervoer voorzien?",
    answer: "Placeholder — voeg hier later informatie over eventueel vervoer of taximogelijkheden toe.",
  },
  {
    question: "Kunnen we blijven overnachten?",
    answer: `${wedding.hotels[0].name} ligt op ongeveer ${wedding.hotels[0].distance} van ${wedding.venue.name}.`,
  },
  {
    question: "Wat kunnen we cadeau doen?",
    answer: wedding.gift,
  },
  {
    question: "Tot wanneer kunnen we RSVP'en?",
    answer: "Placeholder — voeg hier later de RSVP-deadline toe.",
  },
  {
    question: "Met wie nemen we contact op bij vragen?",
    answer: "Placeholder — voeg hier later een contactpersoon en contactgegevens toe.",
  },
];

export default function WeddingFaq() {
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
          {faqItems.map((item, index) => {
            const itemId = `faq-answer-${index}`;
            const isOpen = openQuestion === item.question;

            return (
              <div key={item.question} className="border-b border-white/10 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={itemId}
                  onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left outline-none transition-colors duration-300 hover:text-[#d4b06a] focus-visible:ring-2 focus-visible:ring-[#d4b06a] focus-visible:ring-inset md:py-8"
                >
                  <span className="flex items-baseline gap-5 md:gap-7">
                    <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4b06a]/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-2xl leading-tight md:text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
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
                      <p className="max-w-2xl pb-8 pl-9 pr-10 leading-relaxed text-white/65 md:pl-12 md:text-lg">
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
