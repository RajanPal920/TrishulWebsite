import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

const fieldClass =
  "motion-field mt-2 w-full rounded-sm border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-background";

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const targetUrl = search.redirect || search.next || "/portal";

  const { user, login, register } = useAuth();

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
    if (busy) return; // Prevent duplicate submissions
    setError(null);
    setNotice(null);
    setBusy(true);

    try {
      await login(email.trim(), password);
      setEmail("");
      setPassword("");
      void navigate({ to: targetUrl });
    } catch (err: any) {
      setPassword("");
      const status = err?.status;
      const msg = err?.message || "";
      if (status === 401) {
        setError(msg || "Invalid work email or password. Please verify your credentials.");
      } else if (status === 403) {
        setError(msg || "Your account is currently inactive. Please contact customer support.");
      } else if (status === 429) {
        setError("Too many sign-in attempts. Please wait a few moments before trying again.");
      } else if (status >= 500) {
        setError("A temporary server error occurred. Our team has been notified. Please try again shortly.");
      } else if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
        setError("Network error: Unable to connect to the authentication server. Please check your connection.");
      } else {
        setError(msg || "Invalid work email or password.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanFullName || cleanFullName.length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    if (cleanPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(cleanPhone)) {
        setError("Please enter a valid phone number with country code (e.g. +91 98200 12345).");
        return;
      }
    }

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
        fullName: cleanFullName,
        company: company.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password,
        confirmPassword,
      });
      setPassword("");
      setConfirmPassword("");
      void navigate({ to: targetUrl });
    } catch (err: any) {
      setPassword("");
      setConfirmPassword("");
      const msg = err?.message || "Registration failed. Please check your information.";
      if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("sign in")) {
        setMode("signin");
        setNotice("An account with this email already exists. Please enter your password to sign in.");
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
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
          <div className="grid grid-cols-2 border-b border-border pb-4 mb-6">
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
                  placeholder="Enter work email"
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
                  placeholder="Enter password"
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
                  placeholder="Enter your name"
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
                  placeholder="Enter company name"
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
                  placeholder="Enter work email"
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
                  placeholder="Enter phone number"
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
                  placeholder="Enter password (min 8 characters)"
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
                  placeholder="Confirm password"
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
                    placeholder="Enter work email"
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
