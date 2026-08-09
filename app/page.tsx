import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import InvitationAccess from "@/components/sections/InvitationAccess";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-[#183328]">
        <Hero />
        <InvitationAccess />
      </main>

      <Footer />
    </>
  );
}
