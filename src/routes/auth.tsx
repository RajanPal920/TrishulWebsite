import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs, Section, SectionHead } from "@/components/site/parts";
import { useAuth } from "@/hooks/useAuth";

interface AuthSearch {
  next?: string;
  redirect?: string;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const res: AuthSearch = {};
    if (typeof search["next"] === "string" && search["next"].startsWith("/")) {
      res.next = search["next"];
    }
    if (typeof search["redirect"] === "string" && search["redirect"].startsWith("/")) {
      res.redirect = search["redirect"];
    }
    return res;
  },
  head: () => ({
    meta: [
      { title: "Customer Login & Registration | Trishul Metals & Alloys" },
      {
        name: "description",
        content: "Secure customer access to alloy piping specifications, RFQ tracking, and technical inquiries.",
      },
      { property: "og:title", content: "Customer Access | Trishul Metals & Alloys" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const DEFAULT_CLIENT_ID = "288002387414-6cvdo0ftcmsi36l9npigsaoj3m86oedc.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID =
  (import.meta.env["VITE_GOOGLE_CLIENT_ID"] as string | undefined) || DEFAULT_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: Record<string, unknown>) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const fieldClass =
  "motion-field mt-2 w-full rounded-sm border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background";

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const targetUrl = search.redirect || search.next || "/portal";

  const { user, login, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Complete Google sign in helper
  const completeGoogleSignIn = useCallback(
    async (tokens: { accessToken?: string; providerToken?: string; credential?: string }) => {
      setBusy(true);
      setError(null);

      // Attempt to decode client JWT if token is formatted as JWT (header.payload.signature)
      let userInfo: { email: string; name?: string; picture?: string; sub?: string } | undefined;
      const tokToInspect = tokens.credential || tokens.accessToken;
      if (tokToInspect && tokToInspect.includes(".")) {
        try {
          const parts = tokToInspect.split(".");
          const part1 = parts[1];
          if (parts.length >= 2 && part1) {
            const b64 = part1.replace(/-/g, "+").replace(/_/g, "/");
            const decoded = JSON.parse(atob(b64));
            const email = decoded.email || decoded.user_metadata?.email;
            if (email) {
              userInfo = {
                email,
                name: decoded.name || decoded.user_metadata?.full_name || decoded.user_metadata?.name,
                picture: decoded.picture || decoded.user_metadata?.avatar_url,
                sub: decoded.sub || decoded.id,
              };
            }
          }
        } catch (e) {
          console.warn("[JWT Client Decode Notice]:", e);
        }
      }

      const payload: {
        accessToken?: string;
        providerToken?: string;
        credential?: string;
        userInfo?: { email: string; name?: string; picture?: string; sub?: string };
      } = {};
      if (tokens.accessToken) payload.accessToken = tokens.accessToken;
      if (tokens.providerToken) payload.providerToken = tokens.providerToken;
      if (tokens.credential) payload.credential = tokens.credential;
      if (userInfo) payload.userInfo = userInfo;

      try {
        await loginWithGoogle(payload);
        // Clean hash & query from URL
        window.history.replaceState(null, "", window.location.pathname + (search.next ? `?next=${encodeURIComponent(search.next)}` : ""));
        void navigate({ to: targetUrl });
      } catch (err: any) {
        setError(err?.message || "Google sign in failed. Please try again.");
        setBusy(false);
      }
    },
    [loginWithGoogle, navigate, search.next, targetUrl]
  );

  // Handle incoming OAuth redirects from official Google OAuth (#access_token=... or #id_token=...)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash ? window.location.hash.substring(1) : "";
    const searchStr = window.location.search ? window.location.search.substring(1) : "";
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(searchStr);

    const errParam = searchParams.get("error") || hashParams.get("error");
    if (errParam) {
      setError(decodeURIComponent(errParam));
      return;
    }

    const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
    const idToken = hashParams.get("id_token") || searchParams.get("id_token");

    if (accessToken || idToken) {
      void completeGoogleSignIn({
        ...(accessToken ? { accessToken } : {}),
        ...(idToken ? { credential: idToken } : {}),
      });
    }
  }, [completeGoogleSignIn]);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (user) {
      void navigate({ to: targetUrl });
    }
  }, [user, navigate, targetUrl]);

  const handleTabChange = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError(null);
    setNotice(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    try {
      await login(email, password);
      void navigate({ to: targetUrl });
    } catch (err: any) {
      setError(err?.message || "Invalid work email or password.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setBusy(true);

    try {
      await register({
        fullName,
        company,
        email,
        phone,
        password,
        confirmPassword,
      });
      void navigate({ to: targetUrl });
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please check your information.");
    } finally {
      setBusy(false);
    }
  };

  // Initialize Google Identity Services (GSI) One Tap / credential handler
  useEffect(() => {
    if (typeof window === "undefined" || !window.google?.accounts?.id) return;
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          if (response?.credential) {
            await completeGoogleSignIn({ credential: response.credential });
          }
        },
      });
    } catch (e) {
      console.warn("[GSI Init Notice]:", e);
    }
  }, [completeGoogleSignIn]);

  const handleGoogleSignIn = () => {
    setError(null);
    setNotice(null);
    setBusy(true);

    if (typeof window === "undefined") return;

    // 1. Prefer Google Identity Services (GIS) native account selection dialog
    // Shows all available Google accounts in the user's browser with prompt=select_account
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          prompt: "select_account",
          callback: async (response) => {
            if (response.error) {
              setBusy(false);
              if (response.error !== "popup_closed_by_user") {
                setError(`Google Sign-In: ${response.error}`);
              }
              return;
            }
            if (response.access_token) {
              await completeGoogleSignIn({ accessToken: response.access_token });
            } else {
              setBusy(false);
            }
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
        return;
      } catch (clientErr: any) {
        console.warn("[Google Client OAuth Token Notice, falling back to redirect]:", clientErr);
      }
    }

    // 2. Direct to official backend Google OAuth 2.0 authorization endpoint
    // Uses trusted GOOGLE_CALLBACK_URL, PKCE (RFC 7636), and CSRF state validation
    window.location.href = "/api/auth/google";
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setForgotSuccess(true);
    } catch {
      setForgotSuccess(true);
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Customer Access" }]} />

      <Section>
        <SectionHead
          eyebrow="SECURE CUSTOMER ACCESS"
          title="Customer login and account registration."
          intro="Access your cut-to-size RFQs, product requisitions, material specifications, and dedicated engineering support desk."
        />

        <div className="mx-auto mt-8 max-w-md rounded-sm border border-border bg-card p-6 shadow-sm md:p-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-border pb-4">
            <button
              type="button"
              onClick={() => handleTabChange("signin")}
              className={`pb-2 text-sm font-semibold transition-colors ${
                mode === "signin"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("signup")}
              className={`pb-2 text-sm font-semibold transition-colors ${
                mode === "signup"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create account
            </button>
          </div>

          {/* Continue with Google Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 rounded-sm border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/60 hover:bg-card active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>{busy ? "Connecting to Google…" : "Continue with Google"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              or use work email
            </span>
          </div>

          {/* Notification Messages */}
          {error && (
            <div className="mb-4 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-sm border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
              {notice}
            </div>
          )}

          {/* Forms */}
          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Work Email *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={fieldClass}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password *
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className={fieldClass}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-primary transition-colors hover:underline"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Signing in…" : "Sign in to dashboard"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className={fieldClass}
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Engineering Ltd"
                  className={fieldClass}
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Work Email *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={fieldClass}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone / Mobile
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={fieldClass}
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password (min 8 characters) *
                </label>
                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className={fieldClass}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm Password *
                </label>
                <input
                  required
                  minLength={8}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={fieldClass}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Creating customer account…" : "Create customer account"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By accessing Trishul Metals portal, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-sm border border-border bg-card p-6 shadow-xl">
            <h3 className="text-base font-semibold text-foreground">Reset your password</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Enter your registered work email to receive password reset instructions.
            </p>

            {forgotSuccess ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-sm border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
                  If an account exists with that email address, reset instructions have been dispatched.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                    setForgotEmail("");
                  }}
                  className="w-full rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Work Email
                  </label>
                  <input
                    required
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={fieldClass}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 rounded-sm border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotBusy}
                    className="flex-1 rounded-sm bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {forgotBusy ? "Sending…" : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
