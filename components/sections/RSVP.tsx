"use client";

import { ArrowRight, CircleAlert, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

export default function RSVP() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setError("Vul de code uit jullie uitnodiging in.");
      return;
    }

    setError("");
    router.push(`/i/${encodeURIComponent(normalizedCode)}`);
  }

  return (
    <section id="rsvp" className="relative isolate overflow-hidden bg-[#183328] py-28 text-white md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#d4b06a]">
              RSVP
            </p>
            <h2
              className="mt-4 text-5xl md:text-7xl"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              We kijken naar jullie uit
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
              Gebruik de persoonlijke code uit jullie uitnodiging om jullie
              aanwezigheid in enkele stappen te bevestigen.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-[#d4b06a]/25 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8 md:mt-14 md:p-10"
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-6 text-[#d4b06a]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4b06a]/35 bg-[#d4b06a]/10">
                <Ticket size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">Persoonlijke uitnodiging</p>
                <p className="mt-1 text-xs text-white/55">Bevestig jullie aanwezigheid in enkele stappen</p>
              </div>
            </div>

            <div className="mt-8 flex items-baseline justify-between gap-4">
              <label htmlFor="invite-code" className="block text-sm font-medium text-white">
                Jullie uitnodigingscode
              </label>
              <span className="text-xs text-[#d4b06a]">Verplicht</span>
            </div>
            <p id="invite-code-hint" className="mt-2 text-sm text-gray-400">
              Deze code staat in jullie persoonlijke uitnodiging.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                id="invite-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onFocus={() => setError("")}
                autoCapitalize="characters"
                autoComplete="off"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "invite-code-hint invite-code-error" : "invite-code-hint"}
                className={`min-w-0 flex-1 rounded-xl border bg-black/20 px-5 py-4 font-mono uppercase tracking-[0.2em] text-white outline-none transition placeholder:normal-case placeholder:tracking-normal focus:border-[#d4b06a] focus:ring-2 focus:ring-[#d4b06a]/20 ${
                  error ? "border-[#e2c17f]" : "border-white/10"
                }`}
                placeholder="BV. A1B2C3D4"
              />
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4b06a] px-6 py-4 font-semibold text-[#183328] shadow-[0_12px_28px_rgba(212,176,106,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e2c17f] hover:shadow-[0_16px_34px_rgba(212,176,106,0.25)] sm:w-auto"
                type="submit"
              >
                Verder naar RSVP <ArrowRight size={18} />
              </button>
            </div>
            {error && (
              <p id="invite-code-error" role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-[#e2c17f]/25 bg-[#e2c17f]/10 px-4 py-3 text-sm text-[#f5d998]">
                <CircleAlert size={16} /> {error}
              </p>
            )}
            <p className="mt-7 border-t border-white/10 pt-6 text-sm leading-relaxed text-gray-400">
              Geen code bij de hand? Open de persoonlijke link in jullie uitnodiging.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
