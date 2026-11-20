import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  FileText,
  User as UserIcon,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Repeat,
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  Calendar,
  X,
  ExternalLink,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Breadcrumbs, Section } from "@/components/site/parts";
import { useAuth } from "@/hooks/useAuth";
import { api, type RfqInquiryItem } from "@/lib/api";

type PortalTab = "queries" | "profile";

interface PortalSearch {
  tab?: PortalTab;
}

export const Route = createFileRoute("/portal")({
  validateSearch: (search: Record<string, unknown>): PortalSearch => ({
    ...(typeof search["tab"] === "string" && (search["tab"] === "profile" || search["tab"] === "queries")
      ? { tab: search["tab"] as PortalTab }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Customer Portal | Trishul Metals & Alloys" },
      {
        name: "description",
        content: "View your submitted inquiries, repeat previous orders, and manage your account details.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CustomerPortalPage,
});

function formatKolkataTime(isoString?: string | null) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return (
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(d) + " IST"
    );
  } catch {
    return isoString;
  }
}

function getStatusBadge(status?: string | null) {
  const s = (status || "submitted").toLowerCase();
  if (s.includes("responded") || s.includes("quoted") || s.includes("approved") || s.includes("resolved")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        {status || "Responded"}
      </span>
    );
  }
  if (s.includes("progress") || s.includes("review")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
        <Clock className="h-3 w-3" />
        {status || "In Progress"}
      </span>
    );
  }
  if (s.includes("closed") || s.includes("cancelled")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
        <AlertCircle className="h-3 w-3" />
        {status || "Closed"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-400">
      <Clock className="h-3 w-3" />
      {status || "New"}
    </span>
  );
}

const fieldClass =
  "w-full rounded-sm border border-border bg-card/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:bg-background";

function CustomerPortalPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, loading: authLoading, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<PortalTab>(search.tab || "queries");
  const [rfqs, setRfqs] = useState<RfqInquiryItem[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (search.tab && (search.tab === "queries" || search.tab === "profile")) {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  useEffect(() => {
    if (user) {
      setProfileName(user.fullName || user.full_name || "");
      setProfileCompany(user.company || "");
      setProfilePhone(user.phone || "");
      void loadRfqs();
    }
  }, [user]);

  const loadRfqs = async () => {
    setLoadingQueries(true);
    try {
      const res = await api.customer.getRfqs();
      setRfqs(res.rfqs || []);
    } catch (err) {
      console.error("[Customer Portal Error loading RFQs]:", err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleRepeatQuery = (rfq: RfqInquiryItem) => {
    const primaryItem = rfq.items?.[0] || {};
    const repeatNote = rfq.message
      ? `Repeat enquiry based on ${rfq.reference}: ${rfq.message}`
      : `Repeat enquiry based on reference ${rfq.reference}`;

    void navigate({
      to: "/rfq",
      search: {
        product: primaryItem.product || "",
        grade: primaryItem.material || "",
        size: primaryItem.size || "",
        rating: primaryItem.rating || "",
        facing: primaryItem.facing || "",
        quantity: primaryItem.quantity ? String(primaryItem.quantity) : "",
        unit: primaryItem.unit || "pcs",
        note: repeatNote,
      },
      hash: "build-enquiry",
    });
  };

  const handleDeleteRfq = async (rfqId: string, reference: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry ${reference}? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(rfqId);
    try {
      await api.customer.deleteRfq(rfqId);
      setRfqs((prev) => prev.filter((r) => r.id !== rfqId && r.reference !== rfqId));
      if (selectedRfq && (selectedRfq.id === rfqId || selectedRfq.reference === rfqId)) {
        setSelectedRfq(null);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);

    if (!profileName.trim() || profileName.trim().length < 2) {
      setProfileError("Full Name is required (minimum 2 characters).");
      return;
    }

    if (profilePhone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(profilePhone.trim())) {
        setProfileError("Please enter a valid phone number with country code (e.g. +91 98200 12345).");
        return;
      }
    }

    setProfileSaving(true);
    try {
      await updateProfile({
        fullName: profileName.trim(),
        company: profileCompany.trim() || null,
        phone: profilePhone.trim() || null,
      });
      setProfileMessage("Your profile information was updated successfully.");
      setTimeout(() => setProfileMessage(null), 5000);
    } catch (err: any) {
      setProfileError(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/" });
  };

  const filteredRfqs = useMemo(() => {
    if (!searchFilter.trim()) return rfqs;
    const term = searchFilter.trim().toLowerCase();
    return rfqs.filter((r) => {
      const refMatch = r.reference?.toLowerCase().includes(term);
      const msgMatch = r.message?.toLowerCase().includes(term);
      const itemsMatch = r.items?.some(
        (it) =>
          it.product?.toLowerCase().includes(term) ||
          it.material?.toLowerCase().includes(term) ||
          it.size?.toLowerCase().includes(term)
      );
      return refMatch || msgMatch || itemsMatch;
    });
  }, [rfqs, searchFilter]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Verifying Customer Session…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Section className="py-20">
        <div className="mx-auto max-w-md rounded-md border border-border bg-card/80 p-8 text-center shadow-lg backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <UserIcon className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Sign In to Your Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to view your past RFQ inquiries, track quotations, and repeat previous orders.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/auth"
              className="inline-flex w-full items-center justify-center rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
            >
              Sign In / Register
            </Link>
            <Link
              to="/rfq"
              className="inline-flex w-full items-center justify-center rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/50"
            >
              Request a New Quote (Guest RFQ)
            </Link>
          </div>
        </div>
      </Section>
    );
  }

  const displayName = user.fullName || user.full_name || user.email.split("@")[0];

  return (
    <div className="min-h-screen pb-20">
      {/* Top Banner / Customer Identity */}
      <section className="border-b border-border bg-card/40 py-8">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Customer Portal", to: "/portal" }]} />

          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15 font-serif text-xl font-bold text-primary shadow-inner">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                    Welcome, {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Customer
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-primary/70" />
                    {user.email}
                  </span>
                  {user.phone ? (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-primary/70" />
                      {user.phone}
                    </span>
                  ) : null}
                  {user.company ? (
                    <span className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-primary/70" />
                      {user.company}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/rfq"
                hash="build-enquiry"
                className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                New RFQ Inquiry
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-red-500/50 hover:text-red-400"
                title="Sign out of your customer account"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Simple Navigation Tabs */}
          <div className="mt-8 flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("queries")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "queries"
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <FileText className="h-4 w-4" />
              My Queries / My RFQs
              {rfqs.length > 0 ? (
                <span className="ml-1.5 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                  {rfqs.length}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "profile"
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <UserIcon className="h-4 w-4" />
              My Profile
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="site-container pt-8">
        {/* ======================================================== */}
        {/* TAB 1: MY QUERIES / MY RFQS                              */}
        {/* ======================================================== */}
        {activeTab === "queries" ? (
          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Submitted RFQs & Inquiries</h2>
                <p className="text-xs text-muted-foreground">
                  Review your past RFQs, inspect specifications, or click &ldquo;Repeat Query&rdquo; to re-order instantly.
                </p>
              </div>

              {rfqs.length > 0 ? (
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by reference, product, grade…"
                    className="w-full rounded-sm border border-border bg-card/60 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                  {searchFilter ? (
                    <button
                      type="button"
                      onClick={() => setSearchFilter("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            {loadingQueries ? (
              <div className="mt-8 flex items-center justify-center rounded-md border border-border bg-card/30 py-16">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-xs text-muted-foreground">Loading your inquiry history…</span>
                </div>
              </div>
            ) : filteredRfqs.length === 0 ? (
              <div className="mt-6 rounded-md border border-border bg-card/40 p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {rfqs.length === 0 ? "No inquiries submitted yet" : "No matching inquiries found"}
                </h3>
                <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground">
                  {rfqs.length === 0
                    ? "Your submitted requests for quotation, cut-to-size pipe, fittings, and flanges will be catalogued here."
                    : "Try adjusting your search keywords to locate your previous inquiry."}
                </p>
                {rfqs.length === 0 ? (
                  <Link
                    to="/rfq"
                    hash="build-enquiry"
                    className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Submit Your First RFQ
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-md border border-border bg-card/50 shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Reference #</th>
                      <th className="px-4 py-3 font-semibold">Product & Grade</th>
                      <th className="px-4 py-3 font-semibold">Quantity</th>
                      <th className="px-4 py-3 font-semibold">Submission Date (IST)</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRfqs.map((rfq) => {
                      const firstItem = rfq.items?.[0] || {};
                      const extraItemsCount = (rfq.items?.length || 1) - 1;

                      return (
                        <tr key={rfq.id} className="transition-colors hover:bg-muted/20">
                          {/* Reference Number */}
                          <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-primary">
                            {rfq.reference}
                          </td>

                          {/* Product & Grade */}
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-foreground">
                              {firstItem.product || "Custom Metal Inquiry"}
                              {extraItemsCount > 0 ? (
                                <span className="ml-2 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                  +{extraItemsCount} more
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {firstItem.material ? (
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary">
                                  {firstItem.material}
                                </span>
                              ) : null}
                              {firstItem.size ? <span>Size: {firstItem.size}</span> : null}
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="whitespace-nowrap px-4 py-3.5 text-xs text-foreground">
                            {firstItem.quantity ? (
                              <span className="font-semibold text-foreground">
                                {firstItem.quantity} {firstItem.unit || "pcs"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">As specified in MTO</span>
                            )}
                          </td>

                          {/* Submission Date (IST) */}
                          <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-muted-foreground">
                            {formatKolkataTime(rfq.created_at)}
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-4 py-3.5">{getStatusBadge(rfq.status)}</td>

                          {/* Actions */}
                          <td className="whitespace-nowrap px-4 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRfq(rfq)}
                                className="inline-flex items-center gap-1 rounded-sm border border-border bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                                title="View full inquiry specifications"
                              >
                                <Eye className="h-3 w-3" />
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRepeatQuery(rfq)}
                                className="inline-flex items-center gap-1 rounded-sm bg-primary/15 border border-primary/40 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground shadow-sm"
                                title="Open this inquiry in RFQ form to re-order"
                              >
                                <Repeat className="h-3 w-3" />
                                Repeat Query
                              </button>
                              <button
                                type="button"
                                disabled={deletingId === rfq.id}
                                onClick={() => handleDeleteRfq(rfq.id, rfq.reference)}
                                className="inline-flex items-center gap-1 rounded-sm border border-border bg-card/60 px-2 py-1 text-xs font-medium text-muted-foreground transition hover:border-red-500/50 hover:text-red-400"
                                title="Delete inquiry"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {/* ======================================================== */}
        {/* TAB 2: MY PROFILE                                        */}
        {/* ======================================================== */}
        {activeTab === "profile" ? (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-md border border-border bg-card/50 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Basic Profile Information</h2>
                  <p className="text-xs text-muted-foreground">
                    Update your contact details so your quotations and commercial documents carry accurate credentials.
                  </p>
                </div>
              </div>

              {profileMessage ? (
                <div className="mt-4 flex items-center gap-2 rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{profileMessage}</span>
                </div>
              ) : null}

              {profileError ? (
                <div className="mt-4 flex items-center gap-2 rounded-sm border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              ) : null}

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Customer Full Name / Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your full name"
                    className={fieldClass}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className={`${fieldClass} cursor-not-allowed opacity-75`}
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Primary login email is verified and cannot be changed directly. Contact support if needed.
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={(e) => setProfileCompany(e.target.value)}
                    placeholder="Enter company name"
                    className={fieldClass}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Phone / Mobile Number (with country code)
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="Enter phone number with country code"
                    className={fieldClass}
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Used for critical despatch updates, Mill Test Certificate sharing, and quotation alerts.
                  </p>
                </div>

                {/* Account Details Summary */}
                <div className="rounded-sm border border-border/70 bg-muted/20 p-4 text-xs text-muted-foreground">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block font-mono uppercase text-[10px]">Account Role:</span>
                      <span className="font-medium capitalize text-foreground">{user.role}</span>
                    </div>
                    <div>
                      <span className="block font-mono uppercase text-[10px]">Member Since:</span>
                      <span className="font-medium text-foreground">{formatKolkataTime(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-50"
                  >
                    {profileSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Saving Changes…
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </main>

      {/* ======================================================== */}
      {/* QUERY DETAILS MODAL                                      */}
      {/* ======================================================== */}
      {selectedRfq ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-border bg-card p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">{selectedRfq.reference}</span>
                  {getStatusBadge(selectedRfq.status)}
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Submitted: {formatKolkataTime(selectedRfq.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRfq(null)}
                className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Line items */}
            <div className="mt-5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Inquiry Line Items</h4>
              <div className="mt-2 divide-y divide-border rounded-sm border border-border bg-muted/10">
                {selectedRfq.items && selectedRfq.items.length > 0 ? (
                  selectedRfq.items.map((item, idx) => (
                    <div key={idx} className="p-3 text-xs">
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-foreground">
                          {idx + 1}. {item.product || "Custom Metal Product"}
                        </span>
                        <span className="font-mono font-bold text-primary">
                          {item.quantity ? `${item.quantity} ${item.unit || "pcs"}` : "Per MTO"}
                        </span>
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-muted-foreground sm:grid-cols-4">
                        {item.material ? <div>Grade: <span className="text-foreground">{item.material}</span></div> : null}
                        {item.size ? <div>Size: <span className="text-foreground">{item.size}</span></div> : null}
                        {item.rating ? <div>Rating: <span className="text-foreground">{item.rating}</span></div> : null}
                        {item.facing ? <div>Facing: <span className="text-foreground">{item.facing}</span></div> : null}
                        {item.cutLength ? <div>Cut: <span className="text-foreground">{item.cutLength}</span></div> : null}
                      </div>
                      {item.processing && item.processing.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.processing.map((proc, pIdx) => (
                            <span key={pIdx} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                              {proc}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-muted-foreground">Line item details logged in attached MTO.</div>
                )}
              </div>
            </div>

            {/* Logistics & Project Specs */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm border border-border/60 bg-muted/10 p-3 text-xs">
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Contact Name:</span>
                <span className="font-medium text-foreground">{selectedRfq.contact_name || displayName}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">{selectedRfq.company || "—"}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">{selectedRfq.email}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Phone:</span>
                <span className="font-medium text-foreground">{selectedRfq.phone || "—"}</span>
              </div>
              {selectedRfq.incoterm ? (
                <div>
                  <span className="block font-mono text-[10px] uppercase text-muted-foreground">Incoterm:</span>
                  <span className="font-medium text-foreground">{selectedRfq.incoterm}</span>
                </div>
              ) : null}
              {selectedRfq.delivery_port ? (
                <div>
                  <span className="block font-mono text-[10px] uppercase text-muted-foreground">Destination Port:</span>
                  <span className="font-medium text-foreground">{selectedRfq.delivery_port}</span>
                </div>
              ) : null}
              {selectedRfq.target_lead_time ? (
                <div>
                  <span className="block font-mono text-[10px] uppercase text-muted-foreground">Required Delivery:</span>
                  <span className="font-medium text-foreground">{selectedRfq.target_lead_time}</span>
                </div>
              ) : null}
              {selectedRfq.certification ? (
                <div>
                  <span className="block font-mono text-[10px] uppercase text-muted-foreground">Certification:</span>
                  <span className="font-medium text-foreground">{selectedRfq.certification}</span>
                </div>
              ) : null}
            </div>

            {/* Special Instructions / Message */}
            {selectedRfq.message ? (
              <div className="mt-4">
                <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Inquiry Notes & Specifications
                </span>
                <p className="mt-1 rounded-sm border border-border bg-card/70 p-3 text-xs text-foreground whitespace-pre-wrap">
                  {selectedRfq.message}
                </p>
              </div>
            ) : null}

            {/* Testing */}
            {selectedRfq.testing && selectedRfq.testing.length > 0 ? (
              <div className="mt-4">
                <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Testing Requirements
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedRfq.testing.map((test, tIdx) => (
                    <span key={tIdx} className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRfq(null)}
                  className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={deletingId === selectedRfq.id}
                  onClick={() => handleDeleteRfq(selectedRfq.id, selectedRfq.reference)}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Inquiry
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const target = selectedRfq;
                  setSelectedRfq(null);
                  handleRepeatQuery(target);
                }}
                className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90"
              >
                <Repeat className="h-3.5 w-3.5" />
                Repeat This Query
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default CustomerPortalPage;
