import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { MagneticAction } from "@/components/site/InteractionMotion";
import { rfqProcessingOptions, rfqUnits } from "@/data/rfq-options";

interface CutToSizeConfiguratorProps {
  grade: string;
  product: string;
  size?: string;
}

const inputClass =
  "w-full min-w-0 rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-[#EAEAEA] focus:border-primary";

export function CutToSizeConfigurator({ grade, product, size = "" }: CutToSizeConfiguratorProps) {
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [cutLength, setCutLength] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<(typeof rfqUnits)[number]>("pcs");
  const [configuredSize, setConfiguredSize] = useState(size);
  const [processing, setProcessing] = useState<string[]>([]);
  const [tpiWitness, setTpiWitness] = useState(false);

  const toggleProcessing = (option: string) => {
    setProcessing((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  const search = {
    grade,
    product,
    size: configuredSize || size,
    cutLength,
    quantity,
    unit,
    processing: processing.join(","),
    ...(tpiWitness ? { cert: "EN 10204 3.2 with TPI" } : {}),
  };

  const panelMotion = reduceMotion
    ? {}
    : {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="surface-panel min-w-0 overflow-hidden rounded-md border-l-2 border-l-primary/60">
      <div className="flex min-w-0 flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div className="min-w-0 max-w-2xl">
          <h3 className="text-xl font-semibold text-foreground">Value-added processing &amp; cut-to-size</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Order a finished, drop-in component instead of random mill lengths.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className="h-auto min-h-11 shrink-0 whitespace-normal rounded-sm border-primary/50 px-4 py-2.5 text-left text-primary hover:bg-primary/10 hover:text-primary"
        >
          {open ? "Collapse" : "Add cut-to-size & processing"}
          <span aria-hidden>{open ? "−" : "+"}</span>
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div id={panelId} className="min-w-0 overflow-hidden" {...panelMotion}>
            <div className="min-w-0 border-t border-border p-5 md:p-7">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="flex min-w-0 flex-col gap-2">
                  <span className="eyebrow">Exact cut length</span>
                  <input
                    value={cutLength}
                    onChange={(event) => setCutLength(event.target.value)}
                    className={inputClass}
                    placeholder="e.g. 400–500 mm or 1000 mm"
                  />
                </label>
                <label className="flex min-w-0 flex-col gap-2">
                  <span className="eyebrow">Quantity</span>
                  <input
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className={inputClass}
                    inputMode="decimal"
                  />
                </label>
                <label className="flex min-w-0 flex-col gap-2">
                  <span className="eyebrow">Unit</span>
                  <select
                    value={unit}
                    onChange={(event) => setUnit(event.target.value as (typeof rfqUnits)[number])}
                    className={inputClass}
                  >
                    {rfqUnits.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-w-0 flex-col gap-2 sm:col-span-2 lg:col-span-3">
                  <span className="eyebrow">Size / OD × WT</span>
                  <input
                    value={configuredSize}
                    onChange={(event) => setConfiguredSize(event.target.value)}
                    className={inputClass}
                    placeholder='e.g. 6" or 168.3 × 7.11 mm'
                  />
                </label>
              </div>

              <fieldset className="mt-6 min-w-0 border-t border-border pt-5">
                <legend className="eyebrow">Processing required</legend>
                <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                  {rfqProcessingOptions.map((option) => {
                    const active = processing.includes(option);
                    return (
                      <label
                        key={option}
                         className={`selector-chip min-w-0 cursor-pointer rounded-sm border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-[color,border-color,background-color,transform,box-shadow] duration-300 ${
                          active
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleProcessing(option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <label className="interactive-field mt-5 flex min-w-0 cursor-pointer items-start gap-3 rounded-sm border border-border p-4 text-sm text-foreground transition-[border-color,background-color,box-shadow] duration-300 hover:border-primary/50">
                <input
                  type="checkbox"
                  checked={tpiWitness}
                  onChange={(event) => setTpiWitness(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <span>
                  <span className="font-semibold">Third-party inspection (TPI witness)</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    Carries EN 10204 3.2 with TPI into the quotation request.
                  </span>
                </span>
              </label>

              <div className="mt-6 min-w-0">
                <MagneticAction>
                  <Button asChild className="h-auto min-h-11 max-w-full whitespace-normal rounded-sm px-5 py-3 text-center">
                    <Link to="/rfq" search={search} hash="build-enquiry">
                      Request quote for this configuration →
                    </Link>
                  </Button>
                </MagneticAction>
                <p className="mt-2 text-xs text-muted-foreground">Attach your drawing / MTO on the next step.</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}