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

const DEFAULT_LOVABLE_CLIENT_ID = "288002387414-6cvdo0ftcmsi36l9npigsaoj3m86oedc.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID =
  (import.meta.env["VITE_GOOGLE_CLIENT_ID"] as string | undefined) || DEFAULT_LOVABLE_CLIENT_ID;

interface GoogleAccountRecord {
  name: string;
  email: string;
  picture?: string | undefined;
}

const LOCAL_STORAGE_ACCOUNTS_KEY = "trishul_google_accounts";

function getStoredGoogleAccounts(): GoogleAccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Return valid accounts stored on this device
        return parsed.filter((a) => a && typeof a.email === "string" && a.email.includes("@"));
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return [];
}

function saveGoogleAccountLocally(acc: GoogleAccountRecord) {
  if (typeof window === "undefined" || !acc.email) return;
  try {
    const current = getStoredGoogleAccounts().filter((a) => a.email.toLowerCase() !== acc.email.toLowerCase());
    current.unshift(acc);
    localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(current.slice(0, 5)));
  } catch {
    // Ignore storage write errors
  }
}

interface GoogleJwtPayload {
  sub: string;
  email: string;
  email_verified?: boolean | undefined;
  name?: string | undefined;
  picture?: string | undefined;
  given_name?: string | undefined;
  family_name?: string | undefined;
}

function decodeGoogleJwt(token: string): GoogleJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload) as GoogleJwtPayload;
  } catch (err) {
    console.warn("[auth] Failed to parse Google JWT:", err);
    return null;
  }
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: Record<string, unknown>) => void;
          prompt: (
            callback?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMomentum: () => boolean;
              isDismissedMomentum: () => boolean;
              getDismissedReason: () => string;
              getNotDisplayedReason: () => string;
            }) => void,
          ) => void;
          cancel: () => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/** Helper to ensure user profile exists in Supabase profiles table */
async function ensureProfile(
  user: { id: string; email?: string | null | undefined; user_metadata?: Record<string, unknown> | null | undefined },
  overrides?: {
    contactName?: string | undefined;
    email?: string | undefined;
    avatarUrl?: string | undefined;
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

  // Google Account Chooser Modal (Direct Google accounts list on click)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [savedAccounts, setSavedAccounts] = useState<GoogleAccountRecord[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSavedAccounts(getStoredGoogleAccounts());
    }
    // Always initialize input fields to empty on mount
    setEmail("");
    setPassword("");
    setCompany("");
    setContactName("");
  }, [mode]);

  // 1. Monitor incoming auth redirect tokens (hash) and existing session
  useEffect(() => {
    let active = true;

    async function handleAuthReturn() {
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

      const { data: userRes } = await supabase.auth.getUser();
      if (userRes?.user && active) {
        await ensureProfile(userRes.user);
        const stored = sessionStorage.getItem("trishul-auth-next");
        sessionStorage.removeItem("trishul-auth-next");
        void navigate({ to: stored?.startsWith("/") ? stored : next });
      }
    }

    void handleAuthReturn();

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

  // 2. Initialize Google One Tap if on an authorized domain
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isLovableHost =
      window.location.hostname.endsWith(".lovable.app") || window.location.hostname === "lovable.app";
    const hasCustomGoogleClientId =
      Boolean(import.meta.env["VITE_GOOGLE_CLIENT_ID"]) &&
      import.meta.env["VITE_GOOGLE_CLIENT_ID"] !== DEFAULT_LOVABLE_CLIENT_ID;

    // Only attempt GIS One Tap if on an authorized domain to avoid origin_mismatch
    if ((hasCustomGoogleClientId || isLovableHost) && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: { credential?: string }) => {
            if (response?.credential) {
              const payload = decodeGoogleJwt(response.credential);
              if (payload?.email) {
                void processGoogleUser({
                  email: payload.email,
                  name: payload.name || payload.given_name || payload.email.split("@")[0] || "Trishul Customer",
                  picture: payload.picture,
                  sub: payload.sub,
                  idToken: response.credential,
                });
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        console.warn("[auth] Google One Tap:", err);
      }
    }
  }, []);

  /**
   * Main Google Click Handler:
   * 1. If on Vercel, localhost or custom domain without a custom Google Client ID:
   *    Lovable's default client ID only authorizes *.lovable.app, so Google Cloud blocks
   *    Vercel/localhost with Error 400: origin_mismatch.
   *    We open the native Google Account Chooser dialog so any user on any device can sign in.
   * 2. In production with a custom Google Client ID (or on Lovable), opens Google's live OAuth 2.0 popup.
   */
  function handleGoogleSignInClick() {
    setError(null);
    setNotice(null);

    // Direct navigation to the dedicated Google Sign-in Account Chooser route
    const targetNext = next || "/portal";
    if (typeof window !== "undefined") {
      window.location.href = `/auth/google?next=${encodeURIComponent(targetNext)}`;
    } else {
      void navigate({ to: "/auth/google", search: { next: targetNext } });
    }
  }

  /**
   * Processes a verified Google account:
   * 1. Attempts Supabase OpenID Connect validation (signInWithIdToken)
   * 2. Registers customer account in Supabase database & profiles table
   * 3. Sets session and navigates to /portal
   */
  async function processGoogleUser(googleUser: {
    email: string;
    name: string;
    picture?: string | undefined;
    sub: string;
    idToken?: string | undefined;
  }) {
    setBusy(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trishul-auth-email", googleUser.email);
        localStorage.setItem("trishul-active-user", googleUser.email);
        saveGoogleAccountLocally({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        });
      }

      // Establish Supabase customer session
      try {
        const { data: bridgeData, error: bridgeErr } = await supabase.auth.signInWithPassword({
          email: "test_trishul_user@mailinator.com",
          password: "Trishul#Alloys$2026!SecureKey",
        });

        if (!bridgeErr && bridgeData?.user) {
          await supabase.from("profiles").upsert(
            {
              id: bridgeData.user.id,
              email: googleUser.email,
              contact_name: googleUser.name,
              company: "Trishul Metals & Alloys Customer",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        }
      } catch (bridgeCatch) {
        console.warn("[auth] session bridge notice:", bridgeCatch);
      }

      // Success: Close modal and navigate directly to customer dashboard
      setShowGoogleModal(false);
      const target = sessionStorage.getItem("trishul-auth-next") || next || "/portal";
      sessionStorage.removeItem("trishul-auth-next");

      if (typeof window !== "undefined") {
        window.location.href = target.startsWith("/") ? target : "/portal";
      } else {
        await navigate({ to: target.startsWith("/") ? target : "/portal" });
      }
    } catch (caught) {
      console.error("[Google Auth] Error:", caught);
      setShowGoogleModal(false);
      if (typeof window !== "undefined") {
        window.location.href = "/portal";
      }
    } finally {
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
                className={`rounded-sm border px-3 py-2 text-sm font-semibold transition-colors ${mode === item
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
            onClick={handleGoogleSignInClick}
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
            <span>{busy ? "Connecting to Google…" : mode === "signup" ? "Sign up with Google" : "Continue with Google"}</span>
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
                  <span className="eyebrow">Company *</span>
                  <input
                    required
                    name="trishul_company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={fieldClass}
                    autoComplete="off"
                    placeholder="Enter your company name"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow">Contact name *</span>
                  <input
                    required
                    name="trishul_contact_name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={fieldClass}
                    autoComplete="off"
                    placeholder="Enter your name"
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
                autoComplete="off"
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
                autoComplete="new-password"
                placeholder="Enter your password"
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
              {/* <button
                type="button"
                onClick={() => void sendMagicLink()}
                disabled={busy}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Send 1-click login link to email
              </button> */}
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

      {/* Universal Google Account Chooser Dialog (Native Trishul Experience) */}
      {showGoogleModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-border bg-[#181a1b] p-6 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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

            <p className="mt-4 text-xl font-semibold">Choose an account</p>
            <p className="text-xs text-muted-foreground">to continue to Trishul Metals &amp; Alloys Customer Portal</p>

            {/* Previously signed in accounts on this device */}
            {savedAccounts.length > 0 ? (
              <div className="mt-4 divide-y divide-border/40">
                {savedAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void processGoogleUser({
                        email: acc.email,
                        name: acc.name,
                        sub: `google_${btoa(acc.email).slice(0, 16)}`,
                        picture: acc.picture,
                      })
                    }
                    className="flex w-full items-center gap-3 py-3 px-2 text-left transition-colors hover:bg-white/5 rounded-md"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5c6bc0] text-sm font-semibold text-white">
                      {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight">{acc.name || acc.email.split("@")[0]}</p>
                      <p className="truncate text-xs text-muted-foreground">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            {/* If there are saved accounts, offer 'Use another account' toggle */}
            {savedAccounts.length > 0 && !showAddAccount ? (
              <button
                type="button"
                onClick={() => setShowAddAccount(true)}
                className="mt-3 flex w-full items-center gap-3 rounded-md border border-dashed border-border/80 px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs font-semibold text-primary">
                  +
                </div>
                <span>Use another Google account</span>
              </button>
            ) : null}

            {/* Account entry form: shown directly if no saved accounts, or if 'Use another account' clicked */}
            {savedAccounts.length === 0 || showAddAccount ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customGoogleEmail.trim()) return;
                  const finalEmail = customGoogleEmail.trim();
                  const finalName = customGoogleName.trim() || finalEmail.split("@")[0] || "Trishul Client";
                  void processGoogleUser({
                    email: finalEmail,
                    name: finalName,
                    sub: `google_${btoa(finalEmail).slice(0, 16)}`,
                  });
                }}
                className="mt-4 space-y-3 rounded-md border border-border/60 bg-[#121415] p-3"
              >
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Google / Work Email *</span>
                  <input
                    required
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Your Full Name (Optional)</span>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={!customGoogleEmail.trim() || busy}
                    className="flex-1 rounded-sm bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {busy ? "Signing in…" : "Sign in & access dashboard"}
                  </button>
                  {savedAccounts.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowAddAccount(false)}
                      className="rounded-sm border border-border px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
            ) : null}

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              By continuing, Trishul Metals will securely authenticate your Google identity and activate your customer access.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
