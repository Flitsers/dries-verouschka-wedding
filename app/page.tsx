import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import WeddingDayTimeline from "@/components/sections/WeddingDayTimeline";
import WeddingLocation from "@/components/sections/WeddingLocation";
import WeddingPractical from "@/components/sections/WeddingPractical";
import WeddingHotels from "@/components/sections/WeddingHotels";
import WeddingDresscode from "@/components/sections/WeddingDresscode";
import WeddingFaq from "@/components/sections/WeddingFaq";
import RSVP from "@/components/sections/RSVP";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-[#183328]">
        <Hero />
        <Story />
        <WeddingDayTimeline />
        <WeddingLocation />
        <WeddingPractical />
        <WeddingHotels />
        <WeddingDresscode />
        <WeddingFaq />
        <RSVP />
      </main>

      <Footer />
    </>
  );
}
