import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import InvitationAccess from "@/components/sections/InvitationAccess";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-[#183328]">
        <Hero />
        <Story />
        <InvitationAccess />
      </main>

      <Footer />
    </>
  );
}
