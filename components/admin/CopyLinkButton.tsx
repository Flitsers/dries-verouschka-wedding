"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  invitationUrl: string;
};

export default function CopyLinkButton({ invitationUrl }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(invitationUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      onClick={copy}
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a] px-5 py-3 text-sm transition hover:bg-[#d4b06a] hover:text-[#183328]"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}

      {copied ? "Gekopieerd!" : "Kopieer link"}
    </button>
  );
}
