"use client";

import { useEffect, useId, useState } from "react";
import QRCode from "qrcode";

type Props = {
  invitationUrl: string;
};

export default function QRCodeCard({ invitationUrl }: Props) {
  const [qr, setQr] = useState("");
  const headingId = useId();

  useEffect(() => {
    async function generate() {
      const image = await QRCode.toDataURL(invitationUrl, {
        width: 320,
        margin: 1,
      });

      setQr(image);
    }

    generate();
  }, [invitationUrl]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 print:break-inside-avoid print:border-black/15 print:bg-white" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl text-white print:text-black" style={{ fontFamily: "var(--font-cormorant)" }}>QR-code</h2>
      <p className="mt-2 text-sm text-white/50 print:text-black/60">Deze code opent dezelfde persoonlijke uitnodigingslink.</p>
      <div className="mt-5 flex min-h-56 items-center justify-center rounded-2xl bg-white/[0.04] p-4 print:min-h-0 print:bg-white print:p-0">
        {qr && (
          <img
            src={qr}
            alt="QR-code voor de persoonlijke uitnodiging"
            className="h-auto w-full max-w-64 rounded-xl bg-white p-3"
          />
        )}
      </div>
    </section>
  );
}
