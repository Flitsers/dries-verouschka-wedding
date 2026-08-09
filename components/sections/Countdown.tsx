"use client";

import { useEffect, useState } from "react";

type Props = {
  targetDate: string;
};

export default function Countdown({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });


  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();

      const difference = target - now;


      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }


      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      });
    };


    updateCountdown();

    const interval = setInterval(
      updateCountdown,
      1000
    );


    return () => clearInterval(interval);

  }, [targetDate]);



  const items = [
    {
      value: timeLeft.days,
      label: "dagen",
    },
    {
      value: timeLeft.hours,
      label: "uur",
    },
    {
      value: timeLeft.minutes,
      label: "minuten",
    },
    {
      value: timeLeft.seconds,
      label: "seconden",
    },
  ];


  return (
    <div className="mx-auto grid w-full max-w-[34rem] grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="group relative isolate flex min-h-[6.75rem] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#10261d]/35 px-3 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors duration-300 hover:border-[#d4b06a]/45 hover:bg-white/[0.08] sm:min-h-[7.5rem] sm:px-4 sm:py-5"
        >
          <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-100 sm:inset-x-5" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-white/5" />

          <span className="relative tabular-nums text-4xl font-medium leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-[2.75rem]">
            {item.value}
          </span>

          <span className="relative mt-2.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d4b06a] sm:mt-3 sm:text-[10px] sm:tracking-[0.2em]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
