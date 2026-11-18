import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useShortlist, type ShortlistItem, maxCompare } from "@/lib/shortlist";

type Base = Omit<ShortlistItem, "compare" | "favourite">;

function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export function ShortlistButtons({
  item,
  onDownload,
  downloadLabel = "Download datasheet (PDF)",
}: {
  item: Base;
  onDownload?: () => void;
  downloadLabel?: string;
}) {
  const { toggleCompare, toggleFavourite, isCompared, isFavourite } = useShortlist();
  const hydrated = useHydrated();
  const compared = hydrated && isCompared(item.id);
  const fav = hydrated && isFavourite(item.id);

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {onDownload ? (
        <button
          type="button"
          onClick={onDownload}
          className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {downloadLabel}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => toggleCompare(item)}
        aria-pressed={compared}
        className={`rounded-sm border px-5 py-2.5 text-sm font-semibold transition-colors ${
          compared
            ? "border-primary bg-primary/15 text-primary"
            : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
        }`}
      >
        {compared ? "In compare" : "Add to compare"}
      </button>
      <button
        type="button"
        onClick={() => toggleFavourite(item)}
        aria-pressed={fav}
        className={`rounded-sm border px-5 py-2.5 text-sm font-semibold transition-colors ${
          fav
            ? "border-primary bg-primary/15 text-primary"
            : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
        }`}
      >
        {fav ? "★ Saved" : "☆ Save to shortlist"}
      </button>
    </div>
  );
}

export function CompareTray() {
  const { compareItems, favouriteItems, remove } = useShortlist();
  const hydrated = useHydrated();
  if (!hydrated || (compareItems.length === 0 && favouriteItems.length === 0)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-5 py-3 backdrop-blur md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Shortlist · {compareItems.length}/{maxCompare} compare · {favouriteItems.length} saved
        </span>
        <div className="flex flex-1 flex-wrap gap-2">
          {compareItems.map((i) => (
            <span
              key={i.id}
              className="flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary"
            >
              {i.title}
              <button type="button" aria-label={`Remove ${i.title}`} onClick={() => remove(i.id)}>
                ×
              </button>
            </span>
          ))}
        </div>
        <Link
          to="/shortlist"
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          Open shortlist
        </Link>
      </div>
    </div>
  );
}

export function ShortlistCount() {
  const { items } = useShortlist();
  const hydrated = useHydrated();
  if (!hydrated || items.length === 0) return null;
  return (
    <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-primary">
      {items.length}
    </span>
  );
}
