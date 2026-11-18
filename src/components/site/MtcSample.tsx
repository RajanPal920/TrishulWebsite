import { company } from "@/data/company";
import { mtcSpecimen } from "@/data/mtc";
import { downloadMtcSpecimen } from "@/lib/datasheet";

const { chem, mech, tests } = mtcSpecimen;

function Redacted({ w = "5rem" }: { w?: string }) {
  return (
    <span
      aria-label="redacted"
      className="inline-block h-3 translate-y-[1px] rounded-[2px] bg-foreground/70"
      style={{ width: w }}
    />
  );
}

export function MtcSample() {
  return (
    <div className="surface-panel overflow-hidden rounded-md">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <p className="eyebrow">EN 10204 Type 3.1 — sample</p>
          <p className="mt-2 font-display text-lg font-semibold">Inspection Certificate 3.1</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {company.name} · Mumbai, India · Certificate no. TMA/MTC/<Redacted w="3.5rem" />
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span className="rounded-sm border border-primary/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Specimen — customer data redacted
          </span>
          <button
            type="button"
            onClick={() => downloadMtcSpecimen()}
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Download specimen certificate (PDF)
          </button>
        </div>
      </div>

      <dl className="grid gap-x-8 gap-y-3 border-b border-border px-5 py-5 text-sm sm:grid-cols-2">
        {mtcSpecimen.summary.map((row, i) => (
          <div key={i} className="flex gap-3">
            <dt className="w-40 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="text-foreground">
              {row.value ?? <Redacted w={`${row.redactWidth ?? 5}rem`} />}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 px-5 py-5 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Chemical composition (%)</p>
          <table className="spec-table mt-3">
            <thead>
              <tr>
                <th>Element</th>
                <th>Result</th>
                <th>Specified</th>
              </tr>
            </thead>
            <tbody>
              {chem.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td className="text-primary">{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="eyebrow">Mechanical &amp; physical results</p>
          <table className="spec-table mt-3">
            <thead>
              <tr>
                <th>Property</th>
                <th>Result</th>
                <th>Specified</th>
              </tr>
            </thead>
            <tbody>
              {mech.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td className="text-primary">{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-5 pb-5">
        <p className="eyebrow">Testing &amp; inspection</p>
        <table className="spec-table mt-3">
          <thead>
            <tr>
              <th>Test</th>
              <th>Method</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td>{r[1]}</td>
                <td className="text-primary">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6 border-t border-border px-5 py-5 text-xs text-muted-foreground">
        <p className="max-w-xl leading-relaxed">
          We certify that the material described above has been manufactured, tested and inspected in accordance with
          the requirements of the order and the governing specification, and that the results conform. Issued under EN
          10204:2004 Type 3.1 by the manufacturer&apos;s authorised inspection representative.
        </p>
        <div className="text-right">
          <p className="font-mono uppercase tracking-[0.14em]">Authorised signatory</p>
          <p className="mt-3">
            <Redacted w="8rem" />
          </p>
          <p className="mt-2">Quality Assurance · {company.shortName}</p>
        </div>
      </div>
    </div>
  );
}
