import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Breadcrumbs, Section, SectionHead } from "@/components/site/parts";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

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

/** Helper to ensure user profile exists in Supabase profiles table */
async function ensureProfile(
  user: { id: string; email?: string | null | undefined; user_metadata?: Record<string, unknown> | null | undefined },
  overrides?: {
    contactName?: string | undefined;
    email?: string | undefined;
    company?: string | undefined;
  },
) {
  const email = overrides?.email || user.email;
  if (!email) return;
  const meta = user.user_metadata || {};
  const contactName =
    overrides?.contactName ||
    (meta["contact_name"] as string) ||
    (meta["full_name"] as string) ||
    (meta["name"] as string) ||
    email.split("@")[0] ||
    "";
  const company =
    overrides?.company ||
    (meta["company_name"] as string) ||
    (meta["company"] as string) ||
    "Trishul Metals & Alloys Customer";

  // Keep client storage in sync for header / portal display
  if (typeof window !== "undefined") {
    sessionStorage.setItem("trishul-auth-email", email);
    localStorage.setItem("trishul-active-user", email);
  }

  try {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email,
        contact_name: contactName,
        company,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (err) {
    console.warn("[auth] profile upsert notice:", err);
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const { next = "/portal" } = Route.useSearch();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Always initialize input fields to empty on mount or mode switch
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setCompany("");
  }, [mode]);

  // Handle incoming OAuth redirects (both PKCE query code and implicit hash) + session listeners
  useEffect(() => {
    let active = true;

    async function handleAuthReturn() {
      if (typeof window === "undefined") return;

      // 1. Check for OAuth errors in search or hash
      const url = new URL(window.location.href);
      const urlError =
        url.searchParams.get("error_description") ||
        url.searchParams.get("error");
      if (urlError) {
        if (active) setError(decodeURIComponent(urlError));
        return;
      }

      // 2. PKCE Authorization Code flow (?code=...)
      const code = url.searchParams.get("code");
      if (code) {
        if (active) setBusy(true);
        try {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) throw exchangeErr;
          if (data?.user && active) {
            await ensureProfile(data.user);
            url.searchParams.delete("code");
            window.history.replaceState({}, document.title, url.pathname + url.search);
            const target = sessionStorage.getItem("trishul-auth-next") || next || "/portal";
            sessionStorage.removeItem("trishul-auth-next");
            void navigate({ to: target.startsWith("/") ? target : "/portal" });
            return;
          }
        } catch (e) {
          if (active) setError(e instanceof Error ? e.message : "Failed to complete Google authentication.");
        } finally {
          if (active) setBusy(false);
        }
      }

      // 3. Implicit OAuth token flow (#access_token=...&refresh_token=...)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashError = hashParams.get("error_description") || hashParams.get("error");

        if (hashError) {
          if (active) setError(decodeURIComponent(hashError));
          return;
        }

        if (accessToken && refreshToken) {
          if (active) setBusy(true);
          try {
            const { data, error: setErr } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setErr) throw setErr;
            if (data?.user && active) {
              await ensureProfile(data.user);
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
              const target = sessionStorage.getItem("trishul-auth-next") || next || "/portal";
              sessionStorage.removeItem("trishul-auth-next");
              void navigate({ to: target.startsWith("/") ? target : "/portal" });
              return;
            }
          } catch (e) {
            if (active) setError(e instanceof Error ? e.message : "Failed to establish session.");
          } finally {
            if (active) setBusy(false);
          }
        }
      }

      // 4. Verify existing Supabase session on page load
      const { data: userRes } = await supabase.auth.getUser();
      if (userRes?.user && active) {
        await ensureProfile(userRes.user);
        const stored = sessionStorage.getItem("trishul-auth-next");
        sessionStorage.removeItem("trishul-auth-next");
        void navigate({ to: stored?.startsWith("/") ? stored : next });
      }
    }

    void handleAuthReturn();

    // Listen for auth state changes (e.g. user logs in or out)
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

  /**
   * Main Google Login Click Handler:
   * Uses native Supabase Google OAuth with `prompt: 'select_account'`
   * with seamless fallback to Lovable Cloud Auth Broker if Supabase dashboard credentials are not yet saved.
   */
  async function handleGoogleSignInClick() {
    setError(null);
    setNotice(null);
    setBusy(true);

    try {
      const targetNext = next || "/portal";
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trishul-auth-next", targetNext);
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth?next=${encodeURIComponent(targetNext)}`
          : undefined;

      // 1. Attempt Supabase Native Google OAuth
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
          },
          ...(redirectTo ? { redirectTo } : {}),
        },
      });

      if (oauthError) {
        // If Supabase Google provider has not yet been enabled in Dashboard with Client ID/Secret,
        // fall back smoothly to Lovable Cloud Auth Broker (which powers trishulmetal.lovable.app)
        const isMissingConfig =
          oauthError.message?.toLowerCase().includes("missing oauth client id") ||
          oauthError.message?.toLowerCase().includes("unsupported provider") ||
          (oauthError as { status?: number }).status === 400;

        if (isMissingConfig) {
          console.info("[auth] Supabase Google provider unconfigured in dashboard; using Lovable Cloud OAuth broker...");
          const result = await lovable.auth.signInWithOAuth("google", {
            ...(redirectTo ? { redirect_uri: redirectTo } : {}),
            extraParams: { prompt: "select_account" },
          });

          if (result && "redirected" in result && result.redirected) {
            return;
          }

          if (result && "error" in result && result.error) {
            throw result.error;
          }
          return;
        }

        throw oauthError;
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("[Google OAuth] Error starting sign-in:", err);
      setError(err instanceof Error ? err.message : "Failed to start Google sign-in.");
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
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match. Please re-enter your password.");
        }

        const result = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(next)}`,
            data: {
              full_name: fullName.trim(),
              contact_name: fullName.trim(),
              company_name: company.trim() || "Trishul Metals & Alloys Customer",
            },
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
          await ensureProfile(result.data.user, {
            contactName: fullName.trim(),
            company: company.trim() || "Trishul Metals & Alloys Customer",
          });
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

  async function resetPassword() {
    setError(null);
    if (!email.trim()) {
      setError("Please enter your work email above to receive password reset instructions.");
      return;
    }
    setBusy(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setNotice(`Password reset instructions have been sent to ${email.trim()}. Please check your inbox.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset instructions.");
    } finally {
      setBusy(false);
    }
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

          {/* EXACTLY ONE Google Sign-In Button (Sleek Luxury Dark Theme) */}
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleGoogleSignInClick()}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-sm border border-primary/50 bg-[#141618] px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/10 disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
            <span>
              {busy
                ? "Connecting to Google…"
                : mode === "signup"
                  ? "Sign up with Google"
                  : "Continue with Google"}
            </span>
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use work email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4" autoComplete="off" noValidate>
            {/* Browser autofill absorber to prevent browser password managers from pre-filling fields on reload */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="fake_email_sink" tabIndex={-1} autoComplete="off" defaultValue="" />
              <input type="password" name="fake_password_sink" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {mode === "signup" ? (
              <>
                <label className="block">
                  <span className="eyebrow">Full name *</span>
                  <input
                    required
                    name="trishul_full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={fieldClass}
                    autoComplete="name"
                    placeholder="Enter your full name"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow">Company name (Optional)</span>
                  <input
                    name="trishul_company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={fieldClass}
                    autoComplete="organization"
                    placeholder="Enter your company name"
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="eyebrow">Work email *</span>
              <input
                required
                type="email"
                name="trishul_cust_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                autoComplete="email"
                placeholder="Enter your email"
              />
            </label>

            <label className="block">
              <span className="eyebrow">Password *</span>
              <input
                required
                minLength={8}
                type="password"
                name="trishul_cust_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "Create a password (min. 8 characters)" : "Enter your password"}
              />
            </label>

            {mode === "signup" ? (
              <label className="block">
                <span className="eyebrow">Confirm password *</span>
                <input
                  required
                  minLength={8}
                  type="password"
                  name="trishul_confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldClass}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                />
              </label>
            ) : null}

            {error ? (
              <p className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {notice ? (
              <p className="rounded-sm border border-primary/30 bg-primary/10 p-3 text-xs text-primary" role="status">
                {notice}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy
                ? mode === "signin"
                  ? "Signing in to dashboard…"
                  : "Creating customer account…"
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
    </>
  );
}
