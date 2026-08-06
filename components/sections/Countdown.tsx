"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const weddingDate = new Date("2026-12-19T16:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
      <TimeCard value={timeLeft.days} label="Dagen" />
      <TimeCard value={timeLeft.hours} label="Uur" />
      <TimeCard value={timeLeft.minutes} label="Minuten" />
      <TimeCard value={timeLeft.seconds} label="Seconden" />
    </div>
  );
}

function TimeCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 backdrop-blur-md">
      <p className="text-5xl font-bold">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-200">
        {label}
      </p>
    </div>
  );
}