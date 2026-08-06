"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });


  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = wedding.event.date.getTime();

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

  }, []);



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
    <div className="mt-10 flex flex-wrap justify-center gap-4">

      {items.map((item) => (

        <div
          key={item.label}
          className="group flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-[#d4b06a]/30 bg-white/10 backdrop-blur-md transition duration-500 hover:border-[#d4b06a] hover:bg-white/15"
        >

          <span className="text-4xl font-semibold text-white">
            {item.value}
          </span>


          <span className="mt-2 text-xs uppercase tracking-[0.35em] text-[#d4b06a]">
            {item.label}
          </span>

        </div>

      ))}

    </div>
  );
}