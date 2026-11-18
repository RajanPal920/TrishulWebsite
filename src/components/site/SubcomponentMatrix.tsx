import { subcomponentCategories, subcomponents } from "@/data/subcomponents";

export function SubcomponentMatrix() {
  return (
    <div className="mt-10 space-y-12">
      {subcomponentCategories.map((category) => (
        <div key={category}>
          <h3 className="font-display text-xl font-semibold text-foreground">{category}</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {subcomponents
              .filter((entry) => entry.category === category)
              .map((entry) => (
                <article key={entry.id} className="surface-panel flex min-w-0 flex-col rounded-md p-5 md:p-6">
                  <h4 className="text-base font-semibold text-foreground">{entry.industry}</h4>
                  <div className="mt-4 space-y-4">
                    <div className="min-w-0">
                      <p className="eyebrow">Typical raw stock</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.rawStock}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="eyebrow">Pre-processed component supplied</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{entry.finishedComponent}</p>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
