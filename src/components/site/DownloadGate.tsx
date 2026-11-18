import { useEffect, useState } from "react";
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
import { requestDocumentDownload } from "@/lib/documents.functions";

const STORAGE_KEY = "tma-download-lead";

type LeadDetails = { name: string; company: string; email: string; phone: string };

const EMPTY: LeadDetails = { name: "", company: "", email: "", phone: "" };

function readStored(): LeadDetails {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<LeadDetails>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function DownloadGate({
  documentKey,
  title,
  open,
  onOpenChange,
}: {
  documentKey: string;
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const submit = useServerFn(requestDocumentDownload);
  const [values, setValues] = useState<LeadDetails>(EMPTY);
  const [errors, setErrors] = useState<Partial<LeadDetails>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(readStored());
      setErrors({});
    }
  }, [open]);

  const set = (key: keyof LeadDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Partial<LeadDetails> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (values.phone.trim().length < 6) nextErrors.phone = "Enter a contact phone number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      const result = await submit({
        data: {
          documentKey,
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent.slice(0, 500),
          referrer: typeof document === "undefined" ? "" : document.referrer.slice(0, 500),
        },
      });
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* ignore storage failures */
      }
      const anchor = document.createElement("a");
      anchor.href = result.signedUrl;
      anchor.download = result.fileName;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      toast.success("Thanks — your download is starting.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Download failed. Please email us directly.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>
            Enter your contact details and the PDF download will start immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dg-name">Name</Label>
              <Input id="dg-name" value={values.name} onChange={set("name")} autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dg-company">Company</Label>
              <Input
                id="dg-company"
                value={values.company}
                onChange={set("company")}
                autoComplete="organization"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dg-email">Email *</Label>
            <Input
              id="dg-email"
              type="email"
              value={values.email}
              onChange={set("email")}
              autoComplete="email"
              required
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dg-phone">Phone *</Label>
            <Input
              id="dg-phone"
              type="tel"
              value={values.phone}
              onChange={set("phone")}
              autoComplete="tel"
              required
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            By downloading, you agree to be contacted about your enquiry.
          </p>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Preparing download…" : "Download (PDF)"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DownloadLink({
  documentKey,
  title,
  label = "Download certificate (PDF)",
}: {
  documentKey: string;
  title: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] items-center text-xs font-semibold text-primary hover:underline"
      >
        {label} ↓
      </button>
      <DownloadGate documentKey={documentKey} title={title} open={open} onOpenChange={setOpen} />
    </>
  );
}

export function DownloadCard({
  documentKey,
  title,
  description,
}: {
  documentKey: string;
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="surface-panel flex flex-col rounded-md p-6">
      <p className="eyebrow">PDF</p>
      <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Button className="mt-5 w-full sm:w-auto" onClick={() => setOpen(true)}>
        Download (PDF)
      </Button>
      <DownloadGate documentKey={documentKey} title={title} open={open} onOpenChange={setOpen} />
    </article>
  );
}
