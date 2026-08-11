"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  invitationUrl: string;
};

export default function CopyLinkButton({ invitationUrl }: Props) {
  const [copied, setCopied] = useState(false);

  function copyWithTemporaryTextarea() {
    const textarea = document.createElement("textarea");
    textarea.value = invitationUrl;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const succeeded = document.execCommand("copy");
    textarea.remove();

    return succeeded;
  }

  async function copy() {
    let succeeded = false;

    if (window.isSecureContext && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(invitationUrl);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    if (!succeeded) {
      succeeded = copyWithTemporaryTextarea();
    }

    if (!succeeded) return;

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
