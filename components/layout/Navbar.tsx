"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    {
      name: "Onze dag",
      href: "#planning",
    },
    {
      name: "Praktisch",
      href: "#praktisch",
    },
    {
      name: "Hotels",
      href: "#hotels",
    },
    {
      name: "RSVP",
      href: "#rsvp",
    },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-[#10261d]/90 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6 text-white">

        <a
          href="#top"
          className="text-3xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
          onClick={() => setOpen(false)}
        >
          D & V
        </a>


        {/* Desktop menu */}
        <div className="hidden gap-10 md:flex">

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-[#d4b06a]"
            >
              {link.name}
            </a>
          ))}

        </div>



        {/* Mobile button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu openen"
        >

          <span className="h-px w-7 bg-white" />
          <span className="h-px w-7 bg-white" />
          <span className="h-px w-7 bg-white" />

        </button>


      </nav>


      {/* Mobile menu */}

      <div
        className={`fixed right-0 top-0 h-screen w-80 bg-[#10261d] px-10 pt-32 transition-transform duration-500 md:hidden ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex flex-col gap-8">

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl text-white transition hover:text-[#d4b06a]"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              {link.name}
            </a>
          ))}

        </div>

      </div>

    </header>
  );
}