import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Location from "@/components/sections/Location";
import Practical from "@/components/sections/Practical";
import Hotels from "@/components/sections/Hotels";
import RSVP from "@/components/sections/RSVP";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-[#183328]">
        <Hero />
        <Timeline />
        <Location />
        <Practical />
        <Hotels />
        <RSVP />
      </main>

      <Footer />
    </>
  );
}