import { useState } from "react";
import { findHeat, heatRecords, type HeatRecord } from "@/data/docs";

export function HeatVerify() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<HeatRecord | null | undefined>(undefined);

  const check = (v: string) => {
    setValue(v);
    setResult(findHeat(v) ?? null);
  };

  const rows: [string, string][] = result
    ? [
        ["Grade", `${result.grade} (UNS ${result.uns})`],
        ["Product form", result.form],
        ["Specification", result.spec],
        ["Heat treatment", result.heatTreatment],
        ["Certificate no.", result.certNo],
        ["Certification type", result.tpi],
        ["Certificate issued", result.issued],
        ["Batch status", result.status === "released" ? "Released for despatch" : "Reserved against order"],
      ]
    : [];

  return (
    <div className="rounded-md border border-border bg-card/40 p-5 md:p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check(value);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="heat-input">
          Heat or certificate number
        </label>
        <input
          id="heat-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter heat number, e.g. H-22053P"
          className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Verify batch
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Sample heats
        </span>
        {heatRecords.map((r) => (
          <button
            key={r.heat}
            type="button"
            onClick={() => check(r.heat)}
            className="rounded-sm border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {r.heat}
          </button>
        ))}
      </div>

      {result === null ? (
        <p className="mt-5 rounded-sm border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          No demonstration record matches that reference. Live client heats are verified through the client portal
          dossier vault or by contacting the quality desk with the purchase order number.
        </p>
      ) : null}

      {result ? (
        <div className="mt-5 overflow-hidden rounded-sm border border-primary/40">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-primary/10 px-4 py-3">
            <p className="font-display text-sm font-semibold text-foreground">Heat {result.heat} verified</p>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              EN 10204 record on file
            </span>
          </div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <th
                    scope="row"
                    className="w-1/3 border-t border-border bg-secondary/30 px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {k}
                  </th>
                  <td className="border-t border-border px-4 py-2 text-muted-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Demonstration dataset · project heats are released only to the buying entity named on the order
      </p>
    </div>
  );
}
