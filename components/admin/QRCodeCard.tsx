"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  code: string;
};

export default function QRCodeCard({ code }: Props) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    async function generate() {
      const url = `${window.location.origin}/i/${code}`;

      const image = await QRCode.toDataURL(url, {
        width: 320,
        margin: 1,
      });

      setQr(image);
    }

    generate();
  }, [code]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

      <p className="text-gray-400">
        QR-code
      </p>

      <div className="mt-6 flex justify-center">

        {qr && (
          <img
            src={qr}
            alt="QR Code"
            className="rounded-xl bg-white p-4"
          />
        )}

      </div>

    </div>
  );
}