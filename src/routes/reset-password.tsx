import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Breadcrumbs, Section, SectionHead } from "@/components/site/parts";
import { api } from "@/lib/api";
import { KeyRound, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";

interface ResetPasswordSearch {
  token?: string;
}

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    ...(typeof search["token"] === "string" ? { token: search["token"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Reset Password | Trishul Metals & Alloys" },
      { name: "description", content: "Create a new secure password for your Trishul Metals & Alloys account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

const fieldClass =
  "motion-field mt-2 w-full rounded-sm border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-background pr-10";

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "None", color: "bg-muted" };
  let points = 0;
  if (pwd.length >= 8) points += 1;
  if (pwd.length >= 12) points += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) points += 1;
  if (/\d/.test(pwd)) points += 1;
  if (/[^a-zA-Z0-9]/.test(pwd)) points += 1;

  if (points <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (points === 2 || points === 3) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (points === 4) return { score: 3, label: "Good", color: "bg-yellow-400" };
  return { score: 4, label: "Strong", color: "bg-emerald-500" };
}

function ResetPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const token = (search.token || "").trim();

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setTokenError("No reset token provided. Please request a new password reset link.");
      return;
    }

    let isMounted = true;
    api.auth
      .verifyResetToken(token)
      .then((res) => {
        if (!isMounted) return;
        if (res.valid) {
          setTokenValid(true);
          setCustomerEmail(res.email || null);
          setTokenError(null);
        } else {
          setTokenValid(false);
          setTokenError(res.error || "This password reset link is invalid or has expired.");
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setTokenValid(false);
        setTokenError(err?.message || "This password reset link has expired or has already been used.");
      })
      .finally(() => {
        if (isMounted) setVerifying(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !tokenValid) return;
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify your new password.");
      return;
    }

    setBusy(true);
    try {
      await api.auth.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Customer Access", to: "/auth" }, { label: "Reset Password" }]} />

      <Section>
        <SectionHead
          eyebrow="ACCOUNT RECOVERY"
          title="Create a new password."
          intro="Establish a new secure password for your Trishul Metals & Alloys account to resume access to RFQs, specifications, and quotations."
        />

        <div className="mx-auto mt-8 max-w-md rounded-sm border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Secure Password Reset
            </h2>
          </div>

          {verifying ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Verifying security token…
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Password Reset Successfully!</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-emerald-300">
                  Your password has been updated in the database. You can now log in using your newly established credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void navigate({ to: "/auth" })}
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 transition-opacity"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : !tokenValid ? (
            <div className="space-y-4">
              <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
                <div className="flex items-start gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Reset Link Invalid or Expired</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-destructive/90">
                  {tokenError || "This password reset token is invalid, has expired (valid for 30 minutes), or has already been used."}
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                For security reasons, password recovery tokens expire automatically after 30 minutes and can only be used once. You can request a fresh reset link anytime from the sign-in page.
              </p>

              <Link
                to="/auth"
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <span>Back to Sign In / Request Reset</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {customerEmail && (
                <div className="rounded-sm border border-border bg-background/50 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Registered Account:</span>
                  <strong className="font-mono text-foreground">{customerEmail}</strong>
                </div>
              )}

              {error && (
                <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Password (min 8 characters) *
                </label>
                <div className="relative">
                  <input
                    required
                    minLength={8}
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className={fieldClass}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Strength:</span>
                      <span className="font-semibold text-foreground">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 rounded-full transition-colors ${
                            step <= strength.score ? strength.color : "bg-muted/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    required
                    minLength={8}
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className={fieldClass}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                    {newPassword === confirmPassword ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-sm border border-border bg-background/40 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>
                  All active browser sessions will be securely invalidated upon password change for your protection.
                </span>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Updating Password…" : "Update Password"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Remember your credentials?{" "}
            <Link to="/auth" className="text-primary hover:underline font-semibold">
              Sign in to account
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
