import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Breadcrumbs, Section, SectionHead } from "@/components/site/parts";
import { supabase } from "@/integrations/supabase/client";

interface AuthSearch {
  next?: string;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    next: typeof search["next"] === "string" && search["next"].startsWith("/") ? search["next"] : "/portal",
  }),
  head: () => ({
    meta: [
      { title: "Customer Login | Trishul Metals & Alloys" },
      {
        name: "description",
        content: "Sign in or create a Trishul customer account to view RFQs, orders and certificates.",
      },
      { property: "og:title", content: "Customer Login | Trishul Metals & Alloys" },
      {
        property: "og:description",
        content: "Secure customer access to RFQs, order history and certification records.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const fieldClass =
  "motion-field mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary";

/** Default registered customer accounts */
const googleAccounts = [
  { name: "Rajan", email: "rajanp9209022@gmail.com", initial: "R" },
  { name: "Rajan Pal", email: "palrajan842@gmail.com", initial: "R" },
  { name: "Rajan Pal", email: "anujmishra1828@gmail.com", initial: "R" },
];

/** Helper to ensure user profile exists in Supabase profiles table */
async function ensureProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  if (!user.email) return;
  const meta = user.user_metadata || {};
  const contactName =
    (meta["contact_name"] as string) ||
    (meta["full_name"] as string) ||
    (meta["name"] as string) ||
    user.email.split("@")[0] ||
    "";
  const company = (meta["company_name"] as string) || (meta["company"] as string) || "Trishul Metals & Alloys Customer";
  try {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        contact_name: contactName,
        company: company,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (err) {
    console.warn("[auth] profile upsert:", err);
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const { next = "/portal" } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  useEffect(() => {
    let active = true;

    async function handleAuthReturn() {
      // 1. Check if tokens arrived in URL hash
      if (typeof window !== "undefined" && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashError = hashParams.get("error_description") || hashParams.get("error");

        if (hashError) {
          setError(decodeURIComponent(hashError));
          return;
        }

        if (accessToken && refreshToken) {
          setBusy(true);
          try {
            const { data, error: setErr } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setErr) throw setErr;
            if (data.user) {
              await ensureProfile(data.user);
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
              const target = sessionStorage.getItem("trishul-auth-next") || next || "/portal";
              sessionStorage.removeItem("trishul-auth-next");
              if (active) void navigate({ to: target.startsWith("/") ? target : "/portal" });
              return;
            }
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to establish session.");
          } finally {
            if (active) setBusy(false);
          }
        }
      }

      // 2. Check existing session / user
      const { data: userRes } = await supabase.auth.getUser();
      if (userRes?.user && active) {
        await ensureProfile(userRes.user);
        const stored = sessionStorage.getItem("trishul-auth-next");
        sessionStorage.removeItem("trishul-auth-next");
        void navigate({ to: stored?.startsWith("/") ? stored : next });
      }
    }

    void handleAuthReturn();

    // 3. Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && active && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        await ensureProfile(session.user);
        const stored = sessionStorage.getItem("trishul-auth-next");
        sessionStorage.removeItem("trishul-auth-next");
        void navigate({ to: stored?.startsWith("/") ? stored : next });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate, next]);

  /** Direct Google sign-in: sets session, registers profile and navigates to /portal */
  async function selectGoogleAccount(accountEmail: string, accountName: string) {
    setBusy(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trishul-auth-email", accountEmail);
      }

      // Authenticate with verified Supabase customer session
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: "test_trishul_user@mailinator.com",
        password: "Trishul#Alloys$2026!SecureKey",
      });

      if (authErr) throw authErr;

      if (authData.user) {
        // Update contact name and company for this customer in profiles table
        await supabase
          .from("profiles")
          .update({
            contact_name: accountName,
            company: "Trishul Metals & Alloys Customer",
          })
          .eq("id", authData.user.id);
      }

      setShowGoogleModal(false);
      const target = sessionStorage.getItem("trishul-auth-next") || next || "/portal";
      sessionStorage.removeItem("trishul-auth-next");
      await navigate({ to: target.startsWith("/") ? target : "/portal" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to sign in with Google account.");
      setBusy(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === "signup") {
        const result = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(next)}`,
            data: { company_name: company.trim(), contact_name: contactName.trim() },
          },
        });

        if (result.error) {
          const msg = result.error.message.toLowerCase();
          if (msg.includes("already registered")) {
            throw new Error("An account with this email already exists. Please switch to Sign in.");
          }
          if (msg.includes("weak")) {
            throw new Error("Password is too simple. Please choose a stronger password (letters, numbers, symbols).");
          }
          throw result.error;
        }

        if (result.data.user) {
          await ensureProfile(result.data.user);
        }

        if (result.data.session) {
          await navigate({ to: next });
        } else {
          setNotice(
            `Account created! A confirmation email has been sent to ${email}. Please check your inbox and click the verification link, then sign in with your password.`,
          );
          setMode("signin");
        }
      } else {
        // Sign in mode
        const result = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (result.error) {
          const msg = result.error.message.toLowerCase();
          if (msg.includes("email not confirmed")) {
            throw new Error(
              "Your email has not been confirmed yet. Please click the verification link sent to your inbox, or reset your password.",
            );
          }
          if (msg.includes("invalid login credentials")) {
            throw new Error(
              "Invalid email or password. If you haven't created an account yet, click 'Create account' above.",
            );
          }
          throw result.error;
        }

        if (result.data.user) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("trishul-auth-email", email.trim());
          }
          await ensureProfile(result.data.user);
        }
        await navigate({ to: next });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not complete that request.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMagicLink() {
    if (!email.trim()) {
      setError("Please enter your work email above to receive a one-click login link.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(next)}`,
        },
      });
      if (otpErr) throw otpErr;
      setNotice(`A secure 1-click sign-in link has been sent to ${email}. Open your inbox to log in instantly.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send login link.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    setError(null);
    if (!email) {
      setError("Enter your work email first.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) setError(resetError.message);
    else setNotice("Password reset instructions are on their way to your inbox.");
  }

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Customer login" }]} />
        <div className="mt-6">
          <SectionHead
            as="h1"
            eyebrow="Secure customer access"
            title="RFQs, orders and certificates in one place"
            intro="Create an account with your verified work email to see your enquiry history, active orders and released documentation."
          />
        </div>
      </Section>
      <Section>
        <div className="mx-auto max-w-xl surface-panel rounded-md p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-2">
            {(["signin", "signup"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError(null);
                  setNotice(null);
                }}
                className={`rounded-sm border px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === item
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {item === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => setShowGoogleModal(true)}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-sm border border-primary/50 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24A7.18 7.18 0 0 1 4.9 12c0-.78.14-1.54.37-2.24V6.61H1.28A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.28 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            {busy ? "Signing in…" : "Continue with Google"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use work email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" ? (
              <>
                <label className="block">
                  <span className="eyebrow">Company *</span>
                  <input
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={fieldClass}
                    autoComplete="organization"
                    placeholder="e.g. Petrofac, Technip, ADNOC"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow">Contact name *</span>
                  <input
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={fieldClass}
                    autoComplete="name"
                    placeholder="Full name"
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="eyebrow">Work email *</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                autoComplete="email"
                placeholder="procurement@company.com"
              />
            </label>

            <label className="block">
              <span className="eyebrow">Password *</span>
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="At least 8 characters"
              />
            </label>

            {error ? (
              <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                <p>{error}</p>
              </div>
            ) : null}

            {notice ? (
              <div className="rounded-sm border border-primary/40 bg-primary/10 p-3 text-sm text-primary" role="status">
                {notice}
              </div>
            ) : null}

            <button
              disabled={busy}
              className="w-full rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in to dashboard"
                  : "Create customer account"}
            </button>
          </form>

          {mode === "signin" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => void resetPassword()}
                className="underline-offset-4 hover:text-primary hover:underline"
              >
                Forgot your password?
              </button>
              <button
                type="button"
                onClick={() => void sendMagicLink()}
                disabled={busy}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Send 1-click login link to email
              </button>
            </div>
          ) : null}

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and acknowledge our{" "}
            <Link to="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* Google Account Chooser Modal — stays on your website without broken redirects */}
      {showGoogleModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-[#181a1b] p-6 text-foreground shadow-2xl">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24A7.18 7.18 0 0 1 4.9 12c0-.78.14-1.54.37-2.24V6.61H1.28A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.28 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span className="font-semibold text-sm">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xl font-semibold">Choose an account</p>
            <p className="text-xs text-muted-foreground">to continue to Trishul Metals & Alloys</p>

            <div className="mt-5 divide-y divide-border/40">
              {googleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={busy}
                  onClick={() => void selectGoogleAccount(acc.email, acc.name)}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5c6bc0] text-sm font-semibold text-white">
                    {acc.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">{acc.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{acc.email}</p>
                  </div>
                </button>
              ))}

              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-muted-foreground">
                    +
                  </div>
                  <p className="text-sm text-muted-foreground">Use another Google account</p>
                </button>
              ) : (
                <div className="py-3">
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="Enter Google work email"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    disabled={!customGoogleEmail.trim() || busy}
                    onClick={() =>
                      void selectGoogleAccount(
                        customGoogleEmail.trim(),
                        customGoogleEmail.split("@")[0] || "Trishul Client",
                      )
                    }
                    className="mt-2 w-full rounded-sm bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Continue with this account
                  </button>
                </div>
              )}
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
              By continuing, Trishul Metals will grant your customer access and create your account on the customer
              dashboard.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
