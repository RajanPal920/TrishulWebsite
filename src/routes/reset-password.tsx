import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs, Section, SectionHead } from "@/components/site/parts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset Password | Trishul Metals & Alloys" },
    { name: "description", content: "Set a new password for your secure Trishul customer account." },
    { property: "og:title", content: "Reset Password | Trishul Metals & Alloys" },
    { property: "og:description", content: "Securely update your Trishul customer account password." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }), component: ResetPassword });

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await supabase.auth.updateUser({ password });
    if (result.error) setError(result.error.message);
    else await navigate({ to: "/portal" });
  }
  return <><Section className="border-b border-border"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Reset password" }]} /><div className="mt-6"><SectionHead as="h1" eyebrow="Customer account" title="Set a new password" intro="Choose a strong password for your customer dashboard." /></div></Section><Section><form onSubmit={submit} className="mx-auto max-w-lg surface-panel rounded-md p-6"><label className="block"><span className="eyebrow">New password</span><input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="motion-field mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm" /></label>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}<button className="mt-5 w-full rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Update password</button><Link to="/auth" className="mt-4 block text-center text-sm text-muted-foreground hover:text-primary">Return to sign in</Link></form></Section></>;
}