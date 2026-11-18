import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { logCadDownload } from "@/lib/cad-leads.functions";

const STORAGE_KEY = "tma-cad-lead";

export interface CadDownloadRequest {
  partCode: string;
  family: string;
  standard?: string;
  size?: string;
  spec?: string;
  facing?: string;
  material?: string;
  format: string;
  /** Runs once the buyer's details are captured and logged. */
  run: () => void | Promise<void>;
}

type Lead = { name: string; company: string; email: string; phone: string };
const EMPTY: Lead = { name: "", company: "", email: "", phone: "" };

const FREE_MAIL = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "aol.com",
  "icloud.com",
  "rediffmail.com",
  "protonmail.com",
];

function readStored(): Lead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = { ...EMPTY, ...(JSON.parse(raw) as Partial<Lead>) };
    return parsed.email && parsed.phone ? parsed : null;
  } catch {
    return null;
  }
}

const GateContext = createContext<((request: CadDownloadRequest) => void) | null>(null);

/** Wrap any page that offers CAD downloads. */
export function CadDownloadGateProvider({ children }: { children: React.ReactNode }) {
  const submit = useServerFn(logCadDownload);
  const [request, setRequest] = useState<CadDownloadRequest | null>(null);
  const [values, setValues] = useState<Lead>(EMPTY);
  const [errors, setErrors] = useState<Partial<Lead>>({});
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState<Lead | null>(null);

  useEffect(() => {
    setUnlocked(readStored());
  }, []);

  const log = useCallback(
    async (lead: Lead, req: CadDownloadRequest) => {
      await submit({
        data: {
          partCode: req.partCode,
          family: req.family,
          standard: req.standard ?? "",
          size: req.size ?? "",
          spec: req.spec ?? "",
          facing: req.facing ?? "",
          material: req.material ?? "",
          format: req.format,
          name: lead.name.trim(),
          company: lead.company.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent.slice(0, 500),
          referrer: typeof document === "undefined" ? "" : document.referrer.slice(0, 500),
        },
      });
    },
    [submit],
  );

  const open = useCallback(
    (req: CadDownloadRequest) => {
      const stored = unlocked ?? readStored();
      if (stored) {
        void (async () => {
          try {
            await log(stored, req);
          } catch {
            /* logging must never block the engineer's download */
          }
          await req.run();
        })();
        return;
      }
      setValues(EMPTY);
      setErrors({});
      setRequest(req);
    },
    [log, unlocked],
  );

  const set = (key: keyof Lead) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const domain = values.email.split("@")[1]?.toLowerCase() ?? "";
  const personalDomain = FREE_MAIL.includes(domain);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!request) return;
    const next: Partial<Lead> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.phone.trim().length < 6) next.phone = "Enter a company phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await log(values, request);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* ignore storage failures */
      }
      setUnlocked(values);
      const req = request;
      setRequest(null);
      await req.run();
      toast.success("Unlocked — your file is downloading.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Download failed. Please email us directly.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <GateContext.Provider value={open}>
      {children}
      <Dialog open={Boolean(request)} onOpenChange={(value) => !value && setRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Unlock engineering files</DialogTitle>
            <DialogDescription>
              {request
                ? `Confirm your details once and ${request.partCode} downloads immediately — all further files this visit are one click.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cad-name">Name</Label>
                <Input id="cad-name" value={values.name} onChange={set("name")} autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cad-company">Company</Label>
                <Input
                  id="cad-company"
                  value={values.company}
                  onChange={set("company")}
                  autoComplete="organization"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cad-email">Work email *</Label>
              <Input
                id="cad-email"
                type="email"
                value={values.email}
                onChange={set("email")}
                autoComplete="email"
                required
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              {!errors.email && personalDomain && (
                <p className="text-xs text-muted-foreground">
                  A work email helps us route the drawing pack to your project desk.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cad-phone">Company phone *</Label>
              <Input
                id="cad-phone"
                type="tel"
                value={values.phone}
                onChange={set("phone")}
                autoComplete="tel"
                required
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your details reach our Mumbai desk only, so we can answer specification questions on this part.
            </p>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Unlocking…" : "Unlock download"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </GateContext.Provider>
  );
}

/** Returns a function that gates a download behind the lead modal. */
export function useCadDownloadGate() {
  const open = useContext(GateContext);
  return useMemo(
    () =>
      (request: CadDownloadRequest) => {
        if (open) open(request);
        else void request.run();
      },
    [open],
  );
}
