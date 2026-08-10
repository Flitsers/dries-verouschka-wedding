"use client";

import { ArrowRight, CircleAlert } from "lucide-react";
import { useState } from "react";
import {
  formatInvitationCodeInput,
  INVITATION_CODE_ALPHABET,
  INVITATION_CODE_LENGTH,
  normalizeInvitationCode,
} from "@/lib/invitations/code";

export type InvitationAccessError = "invalid" | "not-found";

type Props = {
  initialError?: InvitationAccessError;
};

const initialErrorMessages: Record<InvitationAccessError, string> = {
  invalid: "Vul een geldige uitnodigingscode van 7 tekens in.",
  "not-found":
    "Deze uitnodigingscode werd niet gevonden. Controleer de code en probeer opnieuw.",
};

function getLocalValidationMessage(code: string): string {
  if (!code) return "Vul jullie uitnodigingscode in.";

  if (code.length !== INVITATION_CODE_LENGTH) {
    return "De uitnodigingscode bestaat uit precies 7 tekens.";
  }

  return "Gebruik alleen de letters en cijfers uit jullie uitnodigingscode.";
}

export default function InvitationCodeForm({ initialError }: Props) {
  const [error, setError] = useState(
    initialError ? initialErrorMessages[initialError] : "",
  );
  const [code, setCode] = useState("");

  function updateCode(value: string) {
    setCode(formatInvitationCodeInput(value));
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const normalizedCode = normalizeInvitationCode(code);

    if (!normalizedCode) {
      event.preventDefault();
      setError(getLocalValidationMessage(code));
      return;
    }

    event.preventDefault();
    event.currentTarget.submit();
  }

  return (
    <form
      action="/open-invitation"
      className="mx-auto mt-10 max-w-xl text-left"
      method="post"
      noValidate
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="invitation-code"
        className="block text-sm font-medium text-white/90"
      >
        Uitnodigingscode
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="invitation-code"
          name="code"
          value={code}
          onChange={(event) => updateCode(event.currentTarget.value)}
          onPaste={(event) => {
            event.preventDefault();
            updateCode(event.clipboardData.getData("text"));
          }}
          maxLength={INVITATION_CODE_LENGTH}
          pattern={`[${INVITATION_CODE_ALPHABET}]{${INVITATION_CODE_LENGTH}}`}
          inputMode="text"
          enterKeyHint="go"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "invitation-code-helper invitation-code-error"
              : "invitation-code-helper"
          }
          className={`min-h-14 min-w-0 flex-1 rounded-xl border bg-black/20 px-5 py-4 font-mono text-lg font-semibold uppercase tracking-[0.24em] text-white outline-none transition placeholder:text-white/30 focus:border-[#d4b06a] focus:ring-2 focus:ring-[#d4b06a]/25 ${
            error ? "border-[#e2c17f]" : "border-white/15"
          }`}
          placeholder="K7M4QXP"
        />
        <button
          type="submit"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#d4b06a] px-6 py-4 font-semibold text-[#183328] shadow-[0_12px_28px_rgba(212,176,106,0.16)] transition hover:-translate-y-0.5 hover:bg-[#e2c17f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4b06a] sm:w-auto"
        >
          Open uitnodiging
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p
        id="invitation-code-helper"
        className="mt-3 text-sm text-white/45"
      >
        De code bestaat uit 7 tekens.
      </p>
      {error && (
        <p
          id="invitation-code-error"
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-[#e2c17f]/25 bg-[#e2c17f]/10 px-4 py-3 text-sm leading-relaxed text-[#f5d998]"
        >
          <CircleAlert
            size={17}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      )}
    </form>
  );
}
