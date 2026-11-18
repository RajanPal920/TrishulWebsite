import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ShortlistKind = "material" | "product" | "matrix" | "technical" | "industry";

export interface ShortlistItem {
  id: string;
  kind: ShortlistKind;
  title: string;
  subtitle?: string;
  href: string;
  /** true = compare tray, false = favourite only */
  compare: boolean;
  favourite: boolean;
  materialSlug?: string;
  productSlug?: string;
}

interface ShortlistState {
  items: ShortlistItem[];
  toggleCompare: (item: Omit<ShortlistItem, "compare" | "favourite">) => void;
  toggleFavourite: (item: Omit<ShortlistItem, "compare" | "favourite">) => void;
  remove: (id: string) => void;
  clear: () => void;
  isCompared: (id: string) => boolean;
  isFavourite: (id: string) => boolean;
  compareItems: ShortlistItem[];
  favouriteItems: ShortlistItem[];
}

const STORAGE_KEY = "trishul.shortlist.v1";
const MAX_COMPARE = 4;

const ShortlistContext = createContext<ShortlistState | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as ShortlistItem[]);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable */
    }
  }, [items, hydrated]);

  const upsert = useCallback(
    (base: Omit<ShortlistItem, "compare" | "favourite">, field: "compare" | "favourite") => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === base.id);
        if (existing) {
          const next = prev.map((i) =>
            i.id === base.id ? { ...i, ...base, [field]: !i[field] } : i,
          );
          return next.filter((i) => i.compare || i.favourite);
        }
        if (field === "compare" && prev.filter((i) => i.compare).length >= MAX_COMPARE) {
          return prev;
        }
        return [...prev, { ...base, compare: field === "compare", favourite: field === "favourite" }];
      });
    },
    [],
  );

  const value = useMemo<ShortlistState>(() => {
    return {
      items,
      toggleCompare: (item) => upsert(item, "compare"),
      toggleFavourite: (item) => upsert(item, "favourite"),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
      isCompared: (id) => items.some((i) => i.id === id && i.compare),
      isFavourite: (id) => items.some((i) => i.id === id && i.favourite),
      compareItems: items.filter((i) => i.compare),
      favouriteItems: items.filter((i) => i.favourite),
    };
  }, [items, upsert]);

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist(): ShortlistState {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside ShortlistProvider");
  return ctx;
}

export const maxCompare = MAX_COMPARE;
