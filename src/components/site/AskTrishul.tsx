import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { askAssistant } from "@/lib/assistant.functions";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Can you supply UNS N08825 fittings certified to NACE with impact testing at −46 °C?",
  "What is the PREN of 2507 versus 2205, and where does 2205 stop being safe?",
  "Do you have NPS 6 Class 300 316L weld neck flanges in ready stock?",
  "Which grade should I use for 12 % chloride at 90 °C in a heat exchanger?",
];

/** Render assistant text: bullets, bold and inline site links. */
function renderLine(line: string, key: number) {
  const clean = line.replace(/^[-*]\s+/, "");
  const isBullet = /^[-*]\s+/.test(line);
  const parts = clean.split(/(\/(?:rfq|stock|cad|landed-cost|technical|materials|products|clients|quality|contact|tools)[a-z0-9/-]*)/g);
  const body = parts.map((p, i) =>
    p.startsWith("/") ? (
      <Link key={i} to={p} className="text-primary underline underline-offset-2">
        {p}
      </Link>
    ) : (
      <span key={i}>{p.replace(/\*\*/g, "")}</span>
    ),
  );
  return isBullet ? (
    <li key={key} className="ml-4 list-disc">
      {body}
    </li>
  ) : (
    <p key={key} className={clean ? "" : "h-2"}>
      {body}
    </p>
  );
}

export function AskTrishul() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Metallurgical desk assistant. Ask about grade selection, corrosion limits, ASTM/ASME/NACE requirements, ready stock or lead times — I answer against our live inventory and catalogue.",
    },
  ]);
  const ask = useServerFn(askAssistant);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await ask({ data: { messages: next.filter((m, i) => !(i === 0 && m.role === "assistant")) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "That request did not reach our desk. Please retry, or send the question through the RFQ form at /rfq.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90"
          aria-label="Open the metallurgical assistant"
        >
          <span aria-hidden className="font-mono">◈</span>
          Ask a metallurgist
        </button>
      ) : (
        <div className="fixed bottom-0 right-0 z-40 flex h-[min(78vh,640px)] w-full flex-col border border-border bg-card shadow-xl sm:bottom-5 sm:right-5 sm:w-[420px] sm:rounded-md">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold">Metallurgical assistant</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Standards · corrosion · live stock
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-md px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-8 border border-primary/40 bg-primary/10 text-foreground"
                    : "mr-4 border border-border bg-background text-muted-foreground"
                }`}
              >
                {m.content.split("\n").map((l, j) => renderLine(l, j))}
              </div>
            ))}
            {busy ? (
              <p className="mr-4 rounded-md border border-border bg-background px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Checking standards and stock…
              </p>
            ) : null}
            {messages.length === 1 ? (
              <div className="space-y-2 pt-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="block w-full rounded-sm border border-border px-3 py-2 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-t border-border p-3"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Grade, standard, size or service condition…"
                className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Ask
              </button>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Guidance only — binding compliance is confirmed on the quotation
            </p>
          </form>
        </div>
      )}
    </>
  );
}
