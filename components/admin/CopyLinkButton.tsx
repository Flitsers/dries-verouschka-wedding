"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  code: string;
};

export default function CopyLinkButton({ code }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/i/${code}`;

    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 rounded-full border border-[#d4b06a] px-8 py-3 transition hover:bg-[#d4b06a] hover:text-[#183328]"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}

      {copied ? "Gekopieerd!" : "Kopieer link"}
    </button>
  );
}