"use client";

import { useState } from "react";
import Link from "next/link";

// Eroeffnungs-Opt-in: E-Mail + Pflicht-Checkbox (nicht vorangekreuzt).
// Nach Absenden knochentrockene Bestaetigung. Wird auf der Startseite
// (variant="full") und auf Produktseiten (variant="compact") verwendet.

const CONSENT_TEXT =
  "Ich möchte per E-Mail über Neuigkeiten und Angebote von buttje informiert werden. Abmeldung jederzeit möglich.";

export default function OptInForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "busy") return;
    setStatus("busy");
    setError("");
    try {
      const res = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setError(data.error ?? "Anmeldung derzeit nicht möglich.");
      }
    } catch {
      setStatus("error");
      setError("Anmeldung derzeit nicht möglich. Bitte später erneut versuchen.");
    }
  }

  if (status === "done") {
    return (
      <p className="border border-line px-5 py-4 text-[0.92rem] text-text">
        Fast geschafft. Bitte bestätigen Sie den Link in Ihrer E-Mail.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className={variant === "full" ? "flex max-w-[520px] flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@firma.at"
          aria-label="E-Mail-Adresse"
          className="w-full border border-line-strong bg-transparent px-4 py-3 text-[0.92rem] text-text placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "busy" || !consent || !email}
          className="shrink-0 border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "busy" ? "Wird gesendet..." : "Absenden"}
        </button>
      </div>

      <label className="mt-4 flex max-w-[62ch] cursor-pointer items-start gap-3 text-[0.82rem] leading-relaxed text-text-soft">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span>{CONSENT_TEXT}</span>
      </label>

      {status === "error" && (
        <p className="mt-3 text-[0.82rem] text-[#f0a1a1]" role="alert">
          {error}
        </p>
      )}

      <p className="mt-3 text-[0.72rem] text-muted">
        Hinweise zur Verarbeitung Ihrer Daten finden Sie in der{" "}
        <Link href="/datenschutz" className="underline hover:text-accent">
          Datenschutzerklärung
        </Link>
        .
      </p>
    </form>
  );
}
