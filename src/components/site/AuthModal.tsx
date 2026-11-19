import { useState, useCallback } from "react";
import { Shield, X, Mail, Lock, User, Building2, Phone, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AuthModal() {
  const { authModalState, closeAuthModal, login, register } = useAuth();
  const { isOpen, options } = authModalState;

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset errors when mode changes
  const handleModeChange = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError(null);
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
    setBusy(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Invalid work email or password.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        fullName,
        email,
        password,
        confirmPassword,
        company,
        phone,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please check your information.");
    } finally {
      setBusy(false);
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
                {options?.promptMessage || "Sign in or create an account to proceed"}
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
          <div className="mt-4 flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Tabs */}
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
                  placeholder="name@company.com"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
        ) : (
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
                  placeholder="e.g. Rajan Pal"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
                    placeholder="name@company.com"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
                    placeholder="+91 98200 12345"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
                  placeholder="e.g. Trishul Engineering Pvt Ltd"
                  className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
                    placeholder="••••••••"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
                    placeholder="••••••••"
                    className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
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
