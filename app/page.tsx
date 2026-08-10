import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import InvitationAccess from "@/components/sections/InvitationAccess";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

type Props = {
  searchParams: Promise<{
    invitation?: string | string[];
  }>;
};

export default async function Home({ searchParams }: Props) {
  const { invitation } = await searchParams;
  const invitationError =
    invitation === "invalid" || invitation === "not-found"
      ? invitation
      : undefined;

  return (
    <>
      <Navbar />

      <main className="bg-[#183328]">
        <Hero />
        <InvitationAccess error={invitationError} />
      </main>

      <Footer />
    </>
  );
}
