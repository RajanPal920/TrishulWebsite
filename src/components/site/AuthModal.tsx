import { useState, useCallback } from "react";
import { Shield, X, Mail, Lock, User, Building2, Phone, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export function AuthModal() {
  const { authModalState, closeAuthModal, login, register } = useAuth();
  const { isOpen, options } = authModalState;

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [accountNotFound, setAccountNotFound] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Reset errors when mode changes
  const handleModeChange = (newMode: "signin" | "signup" | "forgot") => {
    setMode(newMode);
    setError(null);
    setNotice(null);
    setAccountNotFound(false);
    setForgotSuccess(false);
    if (newMode === "forgot" && email) {
      setForgotEmail(email);
    }
  };

  const handleCreateAccountAgain = () => {
    setMode("signup");
    setError(null);
    setAccountNotFound(false);
    setNotice("Please complete your account registration below.");
  };

  const onSuccess = useCallback(() => {
    closeAuthModal();
    if (options?.onAuthenticated) {
      options.onAuthenticated();
    }
  }, [closeAuthModal, options]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setAccountNotFound(false);
    setBusy(true);

    const cleanEmail = email.trim();

    try {
      await login(cleanEmail, password);
      setEmail("");
      setPassword("");
      onSuccess();
    } catch (err: any) {
      setPassword("");
      const status = err?.status;
      const code = err?.data?.code;
      const msg = err?.data?.error || err?.message || "";

      if (
        status === 404 ||
        code === "ACCOUNT_NOT_FOUND" ||
        msg.includes("does not exist") ||
        msg.includes("account was not found")
      ) {
        setAccountNotFound(true);
        setError("Your account was not found. It looks like your account does not exist in our database. Would you like to create your account again?");
      } else if (status === 401 || code === "INVALID_CREDENTIALS") {
        setAccountNotFound(false);
        setError("Incorrect email or password. Please check your credentials and try again.");
      } else if (status >= 500 || code === "SERVER_ERROR") {
        setAccountNotFound(false);
        setError("Something went wrong. Please try again later.");
      } else {
        setAccountNotFound(false);
        setError(msg || "Incorrect email or password. Please check your credentials and try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setAccountNotFound(false);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Please enter a valid work email address.");
      return;
    }

    if (phone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(phone.trim())) {
        setError("Please enter a valid phone number with country code (e.g. +91 98200 12345).");
        return;
      }
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        company: company.trim(),
        phone: phone.trim(),
      });
      setPassword("");
      setConfirmPassword("");
      onSuccess();
    } catch (err: any) {
      setPassword("");
      setConfirmPassword("");
      const status = err?.status;
      const code = err?.data?.code;
      const msg = err?.data?.error || err?.message || "Registration failed. Please check your information.";

      if (status === 409 || code === "ACCOUNT_ALREADY_EXISTS" || msg.toLowerCase().includes("already exists")) {
        setMode("signin");
        setError(null);
        setNotice("An account with this email already exists. Please sign in instead.");
      } else if (status >= 500) {
        setError("Something went wrong. Please try again later.");
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = forgotEmail.trim();
    if (!clean) return;

    setForgotBusy(true);
    setError(null);
    try {
      await api.auth.forgotPassword(clean);
      setForgotSuccess(true);
    } catch {
      // Safe generic success to prevent account enumeration
      setForgotSuccess(true);
    } finally {
      setForgotBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/15 text-primary border border-primary/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Trishul Metals & Alloys</h2>
              <p className="text-xs text-muted-foreground">
                {mode === "forgot"
                  ? "Recover access to your account"
                  : (options?.promptMessage || "Sign in or create an account to proceed")}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Cancel and continue browsing"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="leading-relaxed font-medium">{error}</p>
                {accountNotFound && (
                  <div className="mt-2.5 pt-2 border-t border-destructive/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-destructive/80 font-normal">
                      Email: <strong>{email.trim()}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleCreateAccountAgain}
                      className="inline-flex items-center gap-1 rounded-sm bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none"
                    >
                      <span>Create Account Again</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-sm border border-primary/30 bg-primary/10 p-3 text-xs text-primary flex items-start justify-between gap-2">
            <span>{notice}</span>
          </div>
        )}

        {/* Mode Tabs (only when not in forgot mode) */}
        {mode !== "forgot" ? (
          <div className="grid grid-cols-2 gap-1 rounded-sm bg-muted/60 p-1 my-5">
            <button
              type="button"
              onClick={() => handleModeChange("signin")}
              className={`rounded-sm py-1.5 text-xs font-semibold transition-all ${
                mode === "signin"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className={`rounded-sm py-1.5 text-xs font-semibold transition-all ${
                mode === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="my-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <KeyRound className="h-4 w-4" />
              <span>Password Recovery</span>
            </div>
            <button
              type="button"
              onClick={() => handleModeChange("signin")}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Email Sign In Form */}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground">Work Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="email"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-foreground">Password</label>
                <button
                  type="button"
                  onClick={() => handleModeChange("forgot")}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="current-password"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-primary py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {busy ? "Signing in..." : "Sign In with Email"}
            </button>
          </form>
        ) : mode === "signup" ? (
          /* Create Account Form */
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground">Full Name *</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-foreground">Work Email *</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter work email"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground">Company Name</label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-foreground">Password (min 8) *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 8)"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground">Confirm Password *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-primary py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {busy ? "Creating Account..." : "Create Customer Account"}
            </button>
          </form>
        ) : (
          /* Dedicated Forgot Password Form */
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="rounded-sm border border-primary/30 bg-primary/10 p-3.5 text-xs text-primary">
                  <p className="font-semibold text-foreground">Password reset request sent</p>
                  <p className="mt-1 leading-relaxed text-zinc-300">
                    If an account exists with this email address, password reset instructions have been dispatched. Please check your inbox and spam folder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setForgotSuccess(false);
                  }}
                  className="w-full rounded-sm bg-primary py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 transition-opacity"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your registered work email address. We will verify your account in our database and send a secure single-use password reset link valid for 30 minutes.
                </p>

                <div>
                  <label className="block text-xs font-medium text-foreground">Registered Work Email *</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter registered email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleModeChange("signin")}
                    className="flex-1 rounded-sm border border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotBusy}
                    className="flex-1 rounded-sm bg-primary py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {forgotBusy ? "Sending…" : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer: Cancel / Continue Browsing */}
        <div className="mt-5 border-t border-border pt-4 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Cancel / Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
