import { pmiSpecimen, tpiSpecimen, type SpecimenRow } from "@/data/docs";
import { downloadPmiSpecimen, downloadTpiSpecimen } from "@/lib/datasheet";

function Redacted({ width = 6 }: { width?: number }) {
  return (
    <span
      aria-label="Redacted"
      className="inline-block h-3 translate-y-[1px] rounded-[2px] bg-muted-foreground/60"
      style={{ width: `${width * 10}px` }}
    />
  );
}

function Summary({ rows }: { rows: SpecimenRow[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col gap-1">
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{r.label}</dt>
          <dd className="text-sm text-foreground">
            {r.value ?? <Redacted width={r.redactWidth ?? 6} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border border-border bg-secondary/50 px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.join("|")}>
              {r.map((c, i) => (
                <td
                  key={i}
                  className={`border border-border px-3 py-2 ${
                    i === 0 ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Shell({
  title,
  ref_,
  children,
  onDownload,
  cta,
}: {
  title: string;
  ref_: string;
  children: React.ReactNode;
  onDownload: () => void;
  cta: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-md border border-border bg-card/60 p-5 md:p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-5xl font-semibold uppercase tracking-[0.3em] text-primary/[0.06]"
      >
        Specimen
      </span>
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{ref_}</p>
            <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
          </div>
          <span className="rounded-sm border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Redacted specimen
          </span>
        </div>
        <div className="mt-5 space-y-6">{children}</div>
        <button
          type="button"
          onClick={onDownload}
          className="mt-6 rounded-sm border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {cta}
        </button>
      </div>
    </article>
  );
}

export function PmiSample() {
  return (
    <Shell
      title="Positive Material Identification report"
      ref_={`Report ${pmiSpecimen.reportNo}`}
      onDownload={downloadPmiSpecimen}
      cta="Download specimen PMI report (PDF)"
    >
      <Summary rows={pmiSpecimen.summary} />
      <div>
        <p className="eyebrow">Measured alloying content (%)</p>
        <div className="mt-3">
          <Table head={["Element", "Measured", "Specified", "Result"]} rows={pmiSpecimen.readings} />
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{pmiSpecimen.declaration}</p>
    </Shell>
  );
}

export function TpiSample() {
  return (
    <Shell
      title="Third-party inspection release note"
      ref_={`Report ${tpiSpecimen.reportNo}`}
      onDownload={downloadTpiSpecimen}
      cta="Download specimen TPI release note (PDF)"
    >
      <Summary rows={tpiSpecimen.summary} />
      <div>
        <p className="eyebrow">Witnessed activities</p>
        <div className="mt-3">
          <Table head={["Activity", "Reference", "Result"]} rows={tpiSpecimen.activities} />
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{tpiSpecimen.declaration}</p>
    </Shell>
  );
}
