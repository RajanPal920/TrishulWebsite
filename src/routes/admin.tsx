import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  LogOut,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Edit2,
  Phone,
  Mail,
  Building2,
  X,
  ExternalLink,
  Lock,
  KeyRound,
  Filter,
  Check,
  ChevronRight,
  Database,
  Trash2,
  MessageSquare,
  Send,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api, type AdminCustomerItem, type RfqInquiryItem } from "@/lib/api";
import { BrandLogo } from "@/components/site/BrandLogo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner Admin Console | Trishul Metals & Alloys" },
      { name: "description", content: "Owner administration console for Trishul Metals & Alloys." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminConsolePage,
});

type AdminSectionKey = "overview" | "rfqs" | "customers" | "settings";

function formatKolkataTime(isoString?: string | null) {
  if (!isoString) return "Never";
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

function getRfqStatusBadge(status?: string | null) {
  const s = (status || "Pending").toLowerCase();
  if (s === "resolved" || s.includes("responded") || s.includes("quoted") || s.includes("approved")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        {status || "Resolved"}
      </span>
    );
  }
  if (s === "in progress" || s.includes("progress") || s.includes("review")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
        <Clock className="h-3 w-3" />
        {status || "In Progress"}
      </span>
    );
  }
  if (s === "awaiting customer response" || s.includes("awaiting")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
        <Mail className="h-3 w-3" />
        {status || "Awaiting Customer Response"}
      </span>
    );
  }
  if (s === "rejected" || s.includes("closed") || s.includes("cancelled")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-400">
        <AlertCircle className="h-3 w-3" />
        {status || "Rejected"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400">
      <Clock className="h-3 w-3" />
      {status || "Pending"}
    </span>
  );
}

function AdminConsolePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminSectionKey>("overview");
  const [loadingData, setLoadingData] = useState(false);

  // Admin login credentials (for non-authenticated state)
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Overview stats & recent items
  const [overviewStats, setOverviewStats] = useState<{
    totalCustomers: number;
    totalRfqs: number;
    pendingRfqs: number;
  }>({ totalCustomers: 0, totalRfqs: 0, pendingRfqs: 0 });
  const [recentRfqs, setRecentRfqs] = useState<any[]>([]);

  // RFQ Queries Management
  const [rfqs, setRfqs] = useState<RfqInquiryItem[]>([]);
  const [rfqSearch, setRfqSearch] = useState("");
  const [rfqStatusFilter, setRfqStatusFilter] = useState("all");
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiryItem | null>(null);
  const [updatingRfqId, setUpdatingRfqId] = useState<string | null>(null);
  const [deletingRfqId, setDeletingRfqId] = useState<string | null>(null);

  // RFQ Detail Modal & Action State
  const [rfqHistory, setRfqHistory] = useState<any[]>([]);
  const [loadingRfqHistory, setLoadingRfqHistory] = useState(false);
  const [adminStatusDraft, setAdminStatusDraft] = useState("Pending");
  const [adminResponseDraft, setAdminResponseDraft] = useState("");
  const [adminNotesDraft, setAdminNotesDraft] = useState("");
  const [notifyCustomerDraft, setNotifyCustomerDraft] = useState(true);
  const [savingRfqAction, setSavingRfqAction] = useState(false);
  const [rfqActionMessage, setRfqActionMessage] = useState<string | null>(null);
  const [rfqActionError, setRfqActionError] = useState<string | null>(null);
  const [retryingNotification, setRetryingNotification] = useState(false);

  // Customers Management
  const [customers, setCustomers] = useState<AdminCustomerItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("all");
  const [customerMethodFilter, setCustomerMethodFilter] = useState("all");
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Customer Details modal
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerItem | null>(null);
  const [customerHistory, setCustomerHistory] = useState<RfqInquiryItem[]>([]);
  const [loadingCustomerHistory, setLoadingCustomerHistory] = useState(false);

  // Edit Customer Contact modal
  const [editingCustomer, setEditingCustomer] = useState<AdminCustomerItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Security / Settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!user || user.role !== "admin") return;
    setLoadingData(true);
    try {
      const [ovRes, rfqsRes, custRes] = await Promise.all([
        api.admin.getOverview().catch(() => null),
        api.admin.getRfqs().catch(() => ({ rfqs: [] })),
        api.admin.getCustomers({ limit: 100 }).catch(() => ({ customers: [] })),
      ]);

      if (ovRes) {
        setOverviewStats({
          totalCustomers: ovRes.stats?.totalCustomers || 0,
          totalRfqs: ovRes.stats?.totalRfqs || 0,
          pendingRfqs: ovRes.stats?.pendingRfqs || 0,
        });
        setRecentRfqs(ovRes.recentRfqs || []);
      }
      setRfqs(rfqsRes.rfqs || []);
      setCustomers(custRes.customers || []);
    } catch (err) {
      console.error("[Admin Data Fetch Error]:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      void fetchAdminData();
    }
  }, [user]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginBusy(true);
    try {
      const loggedUser = await login(adminUsername, adminPassword);
      setAdminPassword("");
      if (loggedUser.role !== "admin") {
        setLoginError("This account does not have Owner Administrator privileges.");
      }
    } catch (err: any) {
      setAdminPassword("");
      setLoginError(err?.message || "Invalid administrator credentials.");
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/" });
  };

  const handleDeleteRfq = async (rfqId: string, reference: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry ${reference}? This action cannot be undone.`)) {
      return;
    }
    setDeletingRfqId(rfqId);
    try {
      await api.admin.deleteRfq(rfqId);
      setRfqs((prev) => prev.filter((r) => r.id !== rfqId && r.reference !== rfqId));
      setRecentRfqs((prev) => prev.filter((r) => r.id !== rfqId && r.reference !== rfqId));
      setCustomerHistory((prev) => prev.filter((r) => r.id !== rfqId && r.reference !== rfqId));
      setOverviewStats((prev) => ({
        ...prev,
        totalRfqs: Math.max(0, prev.totalRfqs - 1),
      }));
      if (selectedRfq && (selectedRfq.id === rfqId || selectedRfq.reference === rfqId)) {
        setSelectedRfq(null);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete inquiry.");
    } finally {
      setDeletingRfqId(null);
    }
  };

  const handleDeleteCustomer = async (customerId: string, customerEmail?: string, customerName?: string) => {
    const label = customerName ? `${customerName} (${customerEmail || ""})` : (customerEmail || "this customer");
    if (
      !window.confirm(
        `Are you sure you want to permanently delete customer "${label}"?\n\nThis will permanently delete the customer account and related inquiry history. This action cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingCustomerId(customerId);
    try {
      await api.admin.deleteCustomer(customerId);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(null);
      }
      if (editingCustomer && editingCustomer.id === customerId) {
        setEditingCustomer(null);
      }
      setOverviewStats((prev) => ({
        ...prev,
        totalCustomers: Math.max(0, prev.totalCustomers - 1),
      }));
    } catch (err: any) {
      alert(err?.message || "Failed to delete customer account.");
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const handleUpdateRfqStatus = async (rfqId: string, newStatus: string) => {
    setUpdatingRfqId(rfqId);
    try {
      await api.admin.updateRfqStatus(rfqId, { status: newStatus });
      setRfqs((prev) => prev.map((r) => (r.id === rfqId ? { ...r, status: newStatus } : r)));
      if (selectedRfq && selectedRfq.id === rfqId) {
        setSelectedRfq((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setRecentRfqs((prev) => prev.map((r) => (r.id === rfqId ? { ...r, status: newStatus } : r)));
    } catch (err) {
      console.error("[Failed to update RFQ status]:", err);
    } finally {
      setUpdatingRfqId(null);
    }
  };

  useEffect(() => {
    if (selectedRfq) {
      setAdminStatusDraft(selectedRfq.status || "Pending");
      setAdminResponseDraft(selectedRfq.admin_response || "");
      setAdminNotesDraft(selectedRfq.admin_notes || "");
      setNotifyCustomerDraft(true);
      setRfqActionMessage(null);
      setRfqActionError(null);
      setLoadingRfqHistory(true);
      api.admin
        .getRfqHistory(selectedRfq.id)
        .then((res) => setRfqHistory(res.history || []))
        .catch(() => setRfqHistory([]))
        .finally(() => setLoadingRfqHistory(false));
    } else {
      setRfqHistory([]);
      setRfqActionMessage(null);
      setRfqActionError(null);
    }
  }, [selectedRfq?.id]);

  const handleSaveRfqDetails = async () => {
    if (!selectedRfq) return;
    setSavingRfqAction(true);
    setRfqActionMessage(null);
    setRfqActionError(null);
    try {
      const res = await api.admin.updateRfqStatus(selectedRfq.id, {
        status: adminStatusDraft,
        admin_response: adminResponseDraft,
        admin_notes: adminNotesDraft,
        notify_customer: notifyCustomerDraft,
      });

      const updatedRfq: RfqInquiryItem = {
        ...selectedRfq,
        status: adminStatusDraft,
        admin_response: adminResponseDraft,
        admin_notes: adminNotesDraft,
      };

      setSelectedRfq(updatedRfq);
      setRfqs((prev) => prev.map((r) => (r.id === selectedRfq.id ? updatedRfq : r)));
      setRecentRfqs((prev) => prev.map((r) => (r.id === selectedRfq.id ? updatedRfq : r)));

      // Reload audit history
      const hist = await api.admin.getRfqHistory(selectedRfq.id);
      setRfqHistory(hist.history || []);

      if (res.emailSent) {
        setRfqActionMessage("Status and response updated. Customer notified via email.");
      } else if (notifyCustomerDraft) {
        setRfqActionMessage("Status and response saved. Email logged/dispatched.");
      } else {
        setRfqActionMessage("Status and response saved (customer email notification skipped).");
      }
    } catch (err: any) {
      setRfqActionError(err?.message || "Failed to update inquiry.");
    } finally {
      setSavingRfqAction(false);
    }
  };

  const handleRetryNotification = async () => {
    if (!selectedRfq) return;
    setRetryingNotification(true);
    setRfqActionMessage(null);
    setRfqActionError(null);
    try {
      const res = await api.admin.retryRfqNotification(selectedRfq.id);
      const hist = await api.admin.getRfqHistory(selectedRfq.id);
      setRfqHistory(hist.history || []);
      setRfqActionMessage(res.message || "Notification email re-sent successfully.");
    } catch (err: any) {
      setRfqActionError(err?.message || "Failed to re-send notification email.");
    } finally {
      setRetryingNotification(false);
    }
  };

  const openCustomerDetails = async (customer: AdminCustomerItem) => {
    setSelectedCustomer(customer);
    setLoadingCustomerHistory(true);
    try {
      const res = await api.admin.getCustomer(customer.id);
      setCustomerHistory(res.rfqs || []);
    } catch (err) {
      console.error("[Failed to load customer inquiry history]:", err);
      setCustomerHistory([]);
    } finally {
      setLoadingCustomerHistory(false);
    }
  };

  const openEditCustomer = (customer: AdminCustomerItem) => {
    setEditingCustomer(customer);
    setEditName(customer.full_name || "");
    setEditEmail(customer.email || "");
    setEditPhone(customer.phone || "");
    setEditCompany(customer.company || "");
    setEditStatus(customer.status || "active");
    setEditError(null);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setEditError(null);
    setEditBusy(true);
    try {
      const res = await api.admin.updateCustomer(editingCustomer.id, {
        full_name: editName,
        email: editEmail,
        phone: editPhone || null,
        company: editCompany || null,
        status: editStatus,
      });
      // Update local state
      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...res.customer } : c)));
      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        setSelectedCustomer((prev) => (prev ? { ...prev, ...res.customer } : null));
      }
      setEditingCustomer(null);
    } catch (err: any) {
      setEditError(err?.message || "Failed to update customer details.");
    } finally {
      setEditBusy(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordBusy(true);
    try {
      await api.admin.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordMessage("Administrator password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(null), 5000);
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to update password. Verify current password.");
    } finally {
      setPasswordBusy(false);
    }
  };

  // Filtered RFQs
  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      const matchesSearch =
        !rfqSearch.trim() ||
        r.reference?.toLowerCase().includes(rfqSearch.toLowerCase()) ||
        r.contact_name?.toLowerCase().includes(rfqSearch.toLowerCase()) ||
        r.company?.toLowerCase().includes(rfqSearch.toLowerCase()) ||
        r.email?.toLowerCase().includes(rfqSearch.toLowerCase()) ||
        r.phone?.toLowerCase().includes(rfqSearch.toLowerCase()) ||
        r.items?.some((i) => i.product?.toLowerCase().includes(rfqSearch.toLowerCase()));

      const rStatus = (r.status || "").toLowerCase();
      const filterLower = rfqStatusFilter.toLowerCase();
      const matchesStatus =
        rfqStatusFilter === "all" ||
        (filterLower === "pending" &&
          (rStatus === "pending" ||
            rStatus === "new" ||
            rStatus === "submitted" ||
            rStatus === "pending review")) ||
        rStatus === filterLower;

      return matchesSearch && matchesStatus;
    });
  }, [rfqs, rfqSearch, rfqStatusFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const term = customerSearch.trim().toLowerCase();
      const matchesSearch =
        !term ||
        c.full_name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.company?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term);

      const matchesStatus =
        customerStatusFilter === "all" || c.status?.toLowerCase() === customerStatusFilter.toLowerCase();

      const matchesMethod =
        customerMethodFilter === "all" || c.login_method?.toLowerCase() === customerMethodFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [customers, customerSearch, customerStatusFilter, customerMethodFilter]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Verifying Administrator Access…
          </p>
        </div>
      </div>
    );
  }

  // Not logged in or not admin -> Admin Login Form
  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-md border border-border bg-card/90 p-8 shadow-2xl backdrop-blur">
          <div className="mx-auto mb-5 flex h-12 items-center justify-center overflow-hidden">
            <BrandLogo
              priority
              className="h-10 max-h-10 w-auto max-w-[200px] object-contain drop-shadow-sm"
              style={{ maxHeight: "42px", height: "42px", width: "auto" }}
            />
          </div>

          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">Owner Administrator Portal</h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Sign in with your administrator credentials to access the owner console.
            </p>
          </div>

          {loginError ? (
            <div className="mt-5 flex items-center gap-2 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          ) : null}

          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Administrator Username
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-zinc-400 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-zinc-400 outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loginBusy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-50"
            >
              {loginBusy ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Authenticating…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign In as Administrator
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
              &larr; Return to Trishul Metals Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Owner Admin Console
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-3 sm:px-6 md:px-8 backdrop-blur">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group" title="Return to Trishul Metals Home">
            <div className="flex h-9 max-h-9 items-center overflow-hidden shrink-0">
              <BrandLogo
                priority
                className="h-8 sm:h-9 max-h-9 w-auto max-w-[150px] sm:max-w-[175px] object-contain drop-shadow-sm select-none transition-opacity group-hover:opacity-90 block"
                style={{ maxHeight: "36px", height: "36px", width: "auto", display: "block" }}
              />
            </div>
            <span className="shrink-0 rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30">
              Owner Console
            </span>
          </Link>
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400 sm:flex shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MySQL: trishul_db
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/portal"
            className="hidden items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary sm:flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Customer Portal View
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 sm:px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-red-500/50 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Responsive Sidebar & Content */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
        {/* Mobile Navigation Tab Bar */}
        <div className="flex md:hidden overflow-x-auto border-b border-border bg-card/60 px-3 py-2 gap-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rfqs")}
            className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "rfqs"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Queries / RFQs
            {overviewStats.totalRfqs > 0 ? (
              <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                {overviewStats.totalRfqs}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "customers"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Customers
            {overviewStats.totalCustomers > 0 ? (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-bold text-foreground">
                {overviewStats.totalCustomers}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Settings
          </button>
        </div>

        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-border bg-card/40 p-4">
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rfqs")}
              className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "rfqs"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                Queries / RFQs
              </div>
              {overviewStats.totalRfqs > 0 ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    activeTab === "rfqs"
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {overviewStats.totalRfqs}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("customers")}
              className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "customers"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4" />
                Customers
              </div>
              {overviewStats.totalCustomers > 0 ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    activeTab === "customers"
                      ? "bg-primary-foreground text-primary"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {overviewStats.totalCustomers}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              Security / Settings
            </button>
          </nav>
        </aside>

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {/* ======================================================== */}
          {/* 1. OVERVIEW SECTION                                      */}
          {/* ======================================================== */}
          {activeTab === "overview" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-foreground">Console Overview</h1>
                <p className="text-xs text-muted-foreground">
                  Essential business activity metrics and recent customer queries.
                </p>
              </div>

              {/* Top Metric Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Total Customers</span>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-foreground">
                    {overviewStats.totalCustomers}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Registered customer accounts</p>
                </div>

                <div className="rounded-md border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Total Queries / RFQs</span>
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-foreground">
                    {overviewStats.totalRfqs}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Customer RFQs submitted</p>
                </div>

                <div className="rounded-md border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">New / Pending Queries</span>
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-amber-400">
                    {overviewStats.pendingRfqs}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Awaiting quotation or response</p>
                </div>
              </div>

              {/* Recent Customer Queries */}
              <div className="rounded-md border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Recent Customer Queries</h2>
                    <p className="text-xs text-muted-foreground">Latest inquiries requiring review and quotation</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("rfqs")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View All Queries &rarr;
                  </button>
                </div>

                {recentRfqs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No customer queries logged yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                          <th className="px-4 py-2.5">Reference #</th>
                          <th className="px-4 py-2.5">Customer & Company</th>
                          <th className="px-4 py-2.5">Product & Grade</th>
                          <th className="px-4 py-2.5">Quantity</th>
                          <th className="px-4 py-2.5">Date (IST)</th>
                          <th className="px-4 py-2.5">Status</th>
                          <th className="px-4 py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentRfqs.map((r) => {
                          const firstItem = r.items?.[0] || {};
                          return (
                            <tr key={r.id} className="hover:bg-muted/20">
                              <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-primary">
                                {r.reference}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-foreground">{r.contact_name || "Customer"}</div>
                                <div className="text-muted-foreground">{r.company || r.email}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-foreground">
                                  {firstItem.product || "Custom Order"}
                                </div>
                                <div className="text-muted-foreground">{firstItem.material || "Standard"}</div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3">
                                {firstItem.quantity ? `${firstItem.quantity} ${firstItem.unit || "pcs"}` : "—"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 font-mono text-muted-foreground">
                                {formatKolkataTime(r.created_at)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3">{getRfqStatusBadge(r.status)}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRfq(r)}
                                  className="rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* ======================================================== */}
          {/* 2. QUERIES / RFQS MANAGEMENT                             */}
          {/* ======================================================== */}
          {activeTab === "rfqs" ? (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Query / RFQ Management</h1>
                  <p className="text-xs text-muted-foreground">
                    Directly manage customer inquiries, update status, and review technical specifications.
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={rfqSearch}
                      onChange={(e) => setRfqSearch(e.target.value)}
                      placeholder="Search ref, customer, product…"
                      className="w-56 rounded-sm border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <select
                    value={rfqStatusFilter}
                    onChange={(e) => setRfqStatusFilter(e.target.value)}
                    className="rounded-sm border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending / New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Customer Response">Awaiting Customer Response</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {filteredRfqs.length === 0 ? (
                <div className="rounded-md border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                  No inquiries found matching your filters.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border border-border bg-card shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                        <th className="px-4 py-3">Reference #</th>
                        <th className="px-4 py-3">Customer Details</th>
                        <th className="px-4 py-3">Product & Grade</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Submission Date (IST)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRfqs.map((rfq) => {
                        const firstItem = rfq.items?.[0] || {};
                        const extraItemsCount = (rfq.items?.length || 1) - 1;

                        return (
                          <tr key={rfq.id} className="hover:bg-muted/20">
                            {/* Ref */}
                            <td className="whitespace-nowrap px-4 py-3.5 font-mono font-bold text-primary">
                              {rfq.reference}
                            </td>

                            {/* Customer */}
                            <td className="px-4 py-3.5">
                              <div className="font-medium text-foreground">{rfq.contact_name || "Customer"}</div>
                              <div className="text-[11px] text-muted-foreground">{rfq.company || "Individual"}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {rfq.email} {rfq.phone ? `• ${rfq.phone}` : ""}
                              </div>
                            </td>

                            {/* Product & Grade */}
                            <td className="px-4 py-3.5">
                              <div className="font-medium text-foreground">
                                {firstItem.product || "Custom Metal Product"}
                                {extraItemsCount > 0 ? (
                                  <span className="ml-1.5 rounded-full border border-border bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                                    +{extraItemsCount}
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                {firstItem.material ? (
                                  <span className="rounded bg-primary/10 px-1 py-0.5 font-mono text-primary">
                                    {firstItem.material}
                                  </span>
                                ) : null}
                                {firstItem.size ? <span>{firstItem.size}</span> : null}
                              </div>
                            </td>

                            {/* Quantity */}
                            <td className="whitespace-nowrap px-4 py-3.5 font-medium text-foreground">
                              {firstItem.quantity ? `${firstItem.quantity} ${firstItem.unit || "pcs"}` : "Per MTO"}
                            </td>

                            {/* Date (IST) */}
                            <td className="whitespace-nowrap px-4 py-3.5 font-mono text-muted-foreground">
                              {formatKolkataTime(rfq.created_at)}
                            </td>

                            {/* Status with Quick Update Dropdown */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <select
                                value={rfq.status}
                                disabled={updatingRfqId === rfq.id}
                                onChange={(e) => handleUpdateRfqStatus(rfq.id, e.target.value)}
                                className="rounded border border-border bg-card px-2 py-1 text-xs font-medium text-foreground outline-none focus:border-primary"
                              >
                                <option value="New">New</option>
                                <option value="Submitted">Submitted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Responded">Responded</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="whitespace-nowrap px-4 py-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRfq(rfq)}
                                  className="inline-flex items-center gap-1 rounded border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                                >
                                  <Eye className="h-3 w-3" />
                                  View Details
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingRfqId === rfq.id}
                                  onClick={() => handleDeleteRfq(rfq.id, rfq.reference)}
                                  className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground hover:border-red-500/50 hover:text-red-400"
                                  title="Delete enquiry"
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
          {/* 3. CUSTOMER MANAGEMENT (REGISTERED DIRECTORY)            */}
          {/* ======================================================== */}
          {activeTab === "customers" ? (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Registered Customers Directory</h1>
                  <p className="text-xs text-muted-foreground">
                    Accounts stored securely in MySQL &ldquo;users&rdquo; table. Passwords and hashes are strictly protected.
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search name, email, company, phone…"
                      className="w-64 rounded-sm border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <select
                    value={customerStatusFilter}
                    onChange={(e) => setCustomerStatusFilter(e.target.value)}
                    className="rounded-sm border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <select
                    value={customerMethodFilter}
                    onChange={(e) => setCustomerMethodFilter(e.target.value)}
                    className="rounded-sm border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="all">All Login Methods</option>
                    <option value="password">Password</option>
                  </select>
                </div>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="rounded-md border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                  No customer accounts match your search.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border border-border bg-card shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                        <th className="px-4 py-3">Customer Full Name</th>
                        <th className="px-4 py-3">Work Email</th>
                        <th className="px-4 py-3">Phone / Mobile Number</th>
                        <th className="px-4 py-3">Company / Org</th>
                        <th className="px-4 py-3">Login Method</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Registered (IST)</th>
                        <th className="px-4 py-3">Last Login (IST)</th>
                        <th className="px-4 py-3 text-center">Total Queries</th>
                        <th className="sticky right-0 z-10 bg-card border-l border-border/80 px-4 py-3 text-right shadow-[-4px_0_8px_rgba(0,0,0,0.35)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-muted/20">
                          {/* Name */}
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">
                            {cust.full_name || "—"}
                          </td>

                          {/* Email */}
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-muted-foreground">
                            {cust.email}
                          </td>

                          {/* Phone */}
                          <td className="whitespace-nowrap px-4 py-3">
                            {cust.phone ? (
                              <span className="font-mono text-foreground">{cust.phone}</span>
                            ) : (
                              <span className="text-muted-foreground/60">—</span>
                            )}
                          </td>

                          {/* Company */}
                          <td className="whitespace-nowrap px-4 py-3 text-foreground">
                            {cust.company || <span className="text-muted-foreground/60">—</span>}
                          </td>

                          {/* Method */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[10px] uppercase font-semibold ${
                                cust.login_method === "google"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {cust.login_method || "password"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                cust.status === "inactive"
                                  ? "bg-red-500/10 text-red-400 border border-red-500/30"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              }`}
                            >
                              {cust.status || "active"}
                            </span>
                          </td>

                          {/* Registered (IST) */}
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-muted-foreground">
                            {formatKolkataTime(cust.created_at)}
                          </td>

                          {/* Last Login (IST) */}
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-muted-foreground">
                            {formatKolkataTime(cust.last_login_at)}
                          </td>

                          {/* Total RFQs */}
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                              {cust.rfq_count || 0}
                            </span>
                          </td>

                          {/* Actions - Sticky right for guaranteed visibility */}
                          <td className="sticky right-0 z-10 bg-card border-l border-border/80 whitespace-nowrap px-4 py-3 text-right shadow-[-4px_0_8px_rgba(0,0,0,0.35)]">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openCustomerDetails(cust)}
                                className="rounded border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                                title="View customer profile & full inquiry history"
                              >
                                History
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditCustomer(cust)}
                                className="rounded border border-border bg-background p-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                                title="Edit contact info & account status"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingCustomerId === cust.id}
                                onClick={() => handleDeleteCustomer(cust.id, cust.email, cust.full_name)}
                                className="inline-flex items-center gap-1 rounded border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-colors"
                                title="Permanently delete this customer account"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {/* ======================================================== */}
          {/* 4. SECURITY / SETTINGS                                   */}
          {/* ======================================================== */}
          {activeTab === "settings" ? (
            <div className="mx-auto max-w-xl space-y-6">
              <div>
                <h1 className="text-xl font-bold text-foreground">Security &amp; Administrator Settings</h1>
                <p className="text-xs text-muted-foreground">
                  Update owner credentials and review system security settings.
                </p>
              </div>

              {/* Change Password Card */}
              <div className="rounded-md border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Change Owner Password</h2>
                    <p className="text-xs text-muted-foreground">Set a secure password for administrator sign in</p>
                  </div>
                </div>

                {passwordMessage ? (
                  <div className="mt-4 flex items-center gap-2 rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{passwordMessage}</span>
                  </div>
                ) : null}

                {passwordError ? (
                  <div className="mt-4 flex items-center gap-2 rounded-sm border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                ) : null}

                <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
                  <div>
                    <label className="font-mono text-xs uppercase text-muted-foreground">
                      Current Password (if set)
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current administrator password"
                      className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase text-muted-foreground">New Password *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase text-muted-foreground">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordBusy}
                      className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-50"
                    >
                      {passwordBusy ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Updating…
                        </>
                      ) : (
                        "Update Administrator Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Console Info Card */}
              <div className="rounded-md border border-border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground">Console Environment</h3>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between border-b border-border/50 pb-1.5">
                    <span>Admin Account:</span>
                    <span className="font-mono text-foreground">{user.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1.5">
                    <span>Database Engine:</span>
                    <span className="font-mono text-foreground">MySQL (trishul_db on 127.0.0.1:3306)</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1.5">
                    <span>Role Privileges:</span>
                    <span className="font-mono uppercase text-primary">Owner Administrator</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Session Status:</span>
                    <span className="font-mono text-emerald-400">Authenticated &amp; Encrypted</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out of Admin Console
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* ======================================================== */}
      {/* RFQ DETAIL MODAL (ADMIN)                                 */}
      {/* ======================================================== */}
      {selectedRfq ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">{selectedRfq.reference}</span>
                  {getRfqStatusBadge(selectedRfq.status)}
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

            {/* Admin Action & Status Updater */}
            <div className="mt-4 rounded-md border border-border/80 bg-muted/20 p-4 space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  Manage Request Status &amp; Customer Response
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <select
                    value={adminStatusDraft}
                    onChange={(e) => setAdminStatusDraft(e.target.value)}
                    className="rounded border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Customer Response">Awaiting Customer Response</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Customer Response */}
              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Customer-Facing Response / Reply:
                </label>
                <textarea
                  value={adminResponseDraft}
                  onChange={(e) => setAdminResponseDraft(e.target.value)}
                  placeholder="Type official response to customer (pricing, delivery time, material specifications)..."
                  rows={3}
                  className="w-full rounded border border-border bg-card p-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifyCustomerCheckbox"
                    checked={notifyCustomerDraft}
                    onChange={(e) => setNotifyCustomerDraft(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="notifyCustomerCheckbox" className="text-xs text-muted-foreground select-none cursor-pointer">
                    Send branded email notification to customer on update ({selectedRfq.email})
                  </label>
                </div>
              </div>

              {/* Internal Staff Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-foreground">
                    Internal Private Notes:
                  </label>
                  <span className="text-[10px] text-amber-500 font-mono">
                    Staff Only — Never sent to customer
                  </span>
                </div>
                <textarea
                  value={adminNotesDraft}
                  onChange={(e) => setAdminNotesDraft(e.target.value)}
                  placeholder="Private notes (supplier costs, dispatch remarks, mill certificates)..."
                  rows={2}
                  className="w-full rounded border border-border bg-card/60 p-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Action Buttons & Feedback */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50">
                <div className="text-xs">
                  {rfqActionMessage ? (
                    <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {rfqActionMessage}
                    </span>
                  ) : null}
                  {rfqActionError ? (
                    <span className="text-red-400 font-medium inline-flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {rfqActionError}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={savingRfqAction}
                  onClick={handleSaveRfqDetails}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {savingRfqAction ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Save &amp; Update Request
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm border border-border/60 bg-muted/10 p-3 text-xs">
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Customer Name:</span>
                <span className="font-medium text-foreground">{selectedRfq.contact_name || "—"}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">{selectedRfq.company || "—"}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Work Email:</span>
                <span className="font-medium text-foreground">{selectedRfq.email}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Phone Number:</span>
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

            {/* Line items */}
            <div className="mt-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Line Items</h4>
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
                  <div className="p-3 text-xs text-muted-foreground">Items logged in customer drawing / MTO.</div>
                )}
              </div>
            </div>

            {/* Customer Message */}
            {selectedRfq.message ? (
              <div className="mt-4">
                <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Inquiry Notes &amp; Specifications
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

            {/* Request Activity History & Audit Log */}
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Activity History &amp; Audit Trail
                </h4>
                {loadingRfqHistory ? (
                  <span className="text-[10px] text-muted-foreground animate-pulse">Loading audit trail...</span>
                ) : null}
              </div>

              {rfqHistory.length === 0 && !loadingRfqHistory ? (
                <div className="rounded border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  No activity records logged for this inquiry yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rfqHistory.map((act) => (
                    <div
                      key={act.id}
                      className={`rounded border p-2.5 text-xs ${
                        act.is_internal
                          ? "border-amber-500/30 bg-amber-500/5"
                          : "border-border bg-card/60"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="font-semibold text-foreground">
                            {act.actor_name || (act.actor_type === "admin" ? "Admin Staff" : act.actor_type === "system" ? "System" : "Customer")}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase font-mono text-muted-foreground">
                            {act.action}
                          </span>
                          {act.is_internal ? (
                            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                              Internal
                            </span>
                          ) : null}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {formatKolkataTime(act.created_at)}
                        </span>
                      </div>

                      {act.old_status && act.new_status && act.old_status !== act.new_status ? (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                          <span className="text-muted-foreground">Status changed:</span>
                          <span className="font-medium text-foreground">{act.old_status}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold text-primary">{act.new_status}</span>
                        </div>
                      ) : null}

                      {act.message ? (
                        <p className="mt-1 text-xs text-foreground/90 whitespace-pre-wrap rounded bg-muted/20 p-1.5">
                          {act.message}
                        </p>
                      ) : null}

                      {/* Email Notification Status */}
                      {!act.is_internal && act.action !== "SUBMITTED" ? (
                        <div className="mt-1.5 flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                          {act.email_sent ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[10px]">
                              <CheckCircle2 className="h-3 w-3" />
                              Customer Email Sent
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-zinc-400 text-[10px]">
                                <AlertCircle className="h-3 w-3" />
                                Email Not Dispatched
                              </span>
                              <button
                                type="button"
                                disabled={retryingNotification}
                                onClick={handleRetryNotification}
                                className="text-[10px] font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                              >
                                {retryingNotification ? "Retrying..." : "Retry Email"}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                disabled={deletingRfqId === selectedRfq.id}
                onClick={() => handleDeleteRfq(selectedRfq.id, selectedRfq.reference)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Inquiry
              </button>
              <button
                type="button"
                onClick={() => setSelectedRfq(null)}
                className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ======================================================== */}
      {/* CUSTOMER DETAILS & INQUIRY HISTORY MODAL                 */}
      {/* ======================================================== */}
      {selectedCustomer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedCustomer.full_name}</h3>
                <p className="font-mono text-xs text-muted-foreground">{selectedCustomer.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm border border-border bg-muted/20 p-4 text-xs">
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Phone Number:</span>
                <span className="font-medium text-foreground">{selectedCustomer.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">{selectedCustomer.company || "Not provided"}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Login Method:</span>
                <span className="font-medium capitalize text-foreground">{selectedCustomer.login_method}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Account Status:</span>
                <span className="font-medium capitalize text-foreground">{selectedCustomer.status}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Registration Date (IST):</span>
                <span className="font-mono text-muted-foreground">{formatKolkataTime(selectedCustomer.created_at)}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Last Login (IST):</span>
                <span className="font-mono text-muted-foreground">{formatKolkataTime(selectedCustomer.last_login_at)}</span>
              </div>
            </div>

            {/* Customer Inquiries History */}
            <div className="mt-5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Inquiry &amp; RFQ History ({customerHistory.length})
              </h4>

              {loadingCustomerHistory ? (
                <div className="mt-2 flex items-center justify-center py-6 text-xs text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                  Loading inquiry history…
                </div>
              ) : customerHistory.length === 0 ? (
                <div className="mt-2 rounded-sm border border-border p-4 text-center text-xs text-muted-foreground">
                  No RFQ inquiries submitted by this customer yet.
                </div>
              ) : (
                <div className="mt-2 divide-y divide-border rounded-sm border border-border bg-muted/10">
                  {customerHistory.map((q) => {
                    const firstItem = q.items?.[0] || {};
                    return (
                      <div key={q.id} className="flex items-center justify-between p-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary">{q.reference}</span>
                            {getRfqStatusBadge(q.status)}
                          </div>
                          <div className="mt-0.5 text-muted-foreground">
                            {firstItem.product || "Custom Metal Product"}{" "}
                            {firstItem.material ? `(${firstItem.material})` : ""}
                            {firstItem.quantity ? ` • ${firstItem.quantity} ${firstItem.unit || "pcs"}` : ""}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                            Submitted: {formatKolkataTime(q.created_at)}
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(null);
                              setSelectedRfq(q);
                            }}
                            className="rounded border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                          >
                            View RFQ
                          </button>
                          <button
                            type="button"
                            disabled={deletingRfqId === q.id}
                            onClick={() => handleDeleteRfq(q.id, q.reference)}
                            className="rounded border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground hover:border-red-500/50 hover:text-red-400"
                            title="Delete enquiry"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => handleDeleteCustomer(selectedCustomer.id, selectedCustomer.email, selectedCustomer.full_name)}
                disabled={deletingCustomerId === selectedCustomer.id}
                className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                title="Permanently delete this customer account"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ======================================================== */}
      {/* EDIT CUSTOMER CONTACT MODAL                              */}
      {/* ======================================================== */}
      {editingCustomer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Edit Customer Contact</h3>
                <p className="font-mono text-xs text-muted-foreground">{editingCustomer.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError ? (
              <div className="mt-4 flex items-center gap-2 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{editError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSaveCustomer} className="mt-4 space-y-4">
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground">Phone / Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground">Company / Organization</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                  className="mt-1.5 w-full rounded-sm border border-border bg-card px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleDeleteCustomer(editingCustomer.id, editingCustomer.email, editingCustomer.full_name)}
                  disabled={deletingCustomerId === editingCustomer.id}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                  title="Permanently delete this customer account"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Customer
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editBusy}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-50"
                  >
                    {editBusy ? "Saving…" : "Save Contact Info"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default AdminConsolePage;
