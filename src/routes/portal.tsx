import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  User as UserIcon,
  Package,
  Layers,
  HelpCircle,
  Repeat,
  Settings,
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
  Eye,
  X,
  Building,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Breadcrumbs, Section } from "@/components/site/parts";
import { useAuth } from "@/hooks/useAuth";
import {
  api,
  type ProductRequestItem,
  type MaterialRequestItem,
  type InquiryItem,
  type CustomerStats,
  type ActivityItem,
  type CustomerOrder,
  type RfqInquiryItem,
} from "@/lib/api";

interface PortalSearch {
  tab?: SectionKey;
}

export const Route = createFileRoute("/portal")({
  validateSearch: (search: Record<string, unknown>): PortalSearch => ({
    ...(typeof search["tab"] === "string" ? { tab: search["tab"] as SectionKey } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Customer Dashboard & Management Portal | Trishul Metals & Alloys" },
      {
        name: "description",
        content: "Track cut-to-size RFQs, product requisitions, material specifications, and engineering inquiries.",
      },
      { property: "og:title", content: "Customer Portal | Trishul Metals & Alloys" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CustomerPortalPage,
});

type SectionKey =
  | "overview"
  | "rfqs"
  | "profile"
  | "products"
  | "materials"
  | "inquiries"
  | "orders"
  | "repeat"
  | "settings"
  | "security";

const fieldClass =
  "motion-field mt-1.5 w-full rounded-sm border border-border bg-card/60 px-3.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background";

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s.includes("approved") || s.includes("fulfilled") || s.includes("resolved") || s.includes("answered")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        {status}
      </span>
    );
  }
  if (s.includes("review") || s.includes("pending") || s.includes("open") || s.includes("submitted")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
        <Clock className="h-3 w-3" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-sky-500/40 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sky-400">
      <AlertCircle className="h-3 w-3" />
      {status}
    </span>
  );
}

function CustomerPortalPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, loading: authLoading, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<SectionKey>(search.tab || "overview");
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [productRequests, setProductRequests] = useState<ProductRequestItem[]>([]);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequestItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [rfqs, setRfqs] = useState<RfqInquiryItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiryItem | null>(null);
  const [repeatTarget, setRepeatTarget] = useState<{
    type: "product" | "material";
    item: ProductRequestItem | MaterialRequestItem;
  } | null>(null);

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);

  // Settings / Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdNotice, setPwdNotice] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdBusy, setPwdBusy] = useState(false);

  // Sync profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.fullName || "");
      setProfileCompany(user.company || "");
      setProfilePhone(user.phone || "");
    }
  }, [user]);

  // Load portal data from backend
  const loadPortalData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [statsRes, prodsRes, matsRes, inqRes, actRes, ordersRes, rfqsRes] = await Promise.all([
        api.customer.getStats().catch(() => null),
        api.customer.getProductRequests().catch(() => ({ requests: [] })),
        api.customer.getMaterialRequests().catch(() => ({ requests: [] })),
        api.customer.getInquiries().catch(() => ({ inquiries: [] })),
        api.customer.getRecentActivity().catch(() => ({ activity: [] })),
        api.customer.getOrders().catch(() => ({ orders: [] })),
        api.customer.getRfqs().catch(() => ({ rfqs: [] })),
      ]);

      if (statsRes) setStats(statsRes);
      setProductRequests(prodsRes.requests || []);
      setMaterialRequests(matsRes.requests || []);
      setInquiries(inqRes.inquiries || []);
      setActivity(actRes.activity || []);
      setOrders(ordersRes.orders || []);
      setRfqs(rfqsRes.rfqs || []);
    } catch (err) {
      console.error("[Portal Data Load Error]:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      void loadPortalData();
    }
  }, [user]);

  // Redirect to /auth if not logged in
  if (!authLoading && !user) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-sm border border-border bg-card p-8 text-center shadow-md">
        <Shield className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-bold text-foreground">Sign in to Customer Portal</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You must be logged in to access customer requisitions, RFQs, and account details.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth"
            search={{ redirect: "/portal" }}
            className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90"
          >
            Sign in to Customer Portal
          </Link>
          <Link
            to="/"
            className="rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileBusy(true);
    setProfileNotice(null);
    try {
      await updateProfile({
        fullName: profileName,
        company: profileCompany,
        phone: profilePhone,
      });
      setProfileNotice("Profile updated successfully.");
    } catch (err: any) {
      setProfileNotice(err?.message || "Failed to update profile.");
    } finally {
      setProfileBusy(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdNotice(null);
    setPwdError(null);

    if (newPassword !== confirmNewPassword) {
      setPwdError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters long.");
      return;
    }

    setPwdBusy(true);
    try {
      await api.auth.changePassword({
        currentPassword,
        newPassword,
      });
      setPwdNotice("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setPwdError(err?.message || "Failed to update password.");
    } finally {
      setPwdBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/" });
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Customer Portal" }]} />

      <Section className="py-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20 rounded-sm border border-border bg-card p-4 shadow-sm">
              {/* User Profile Mini Header */}
              <div className="border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-bold text-primary">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.fullName || "Valued Customer"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.company || user?.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-sm bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {user?.role === "admin" ? "Administrator" : "Verified Client"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ID: #{user?.id?.slice(0, 8)}
                  </span>
                </div>
              </div>

              {/* Navigation Items (8 sections) */}
              <nav className="mt-4 space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("rfqs")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "rfqs"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <span>My RFQ Inquiries</span>
                  </div>
                  {rfqs.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        activeTab === "rfqs" ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rfqs.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "products"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4" />
                    <span>My Product Requests</span>
                  </div>
                  {productRequests.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        activeTab === "products" ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {productRequests.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("materials")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "materials"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4" />
                    <span>My Material Requests</span>
                  </div>
                  {materialRequests.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        activeTab === "materials" ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {materialRequests.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("inquiries")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "inquiries"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4" />
                    <span>My Inquiries</span>
                  </div>
                  {inquiries.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        activeTab === "inquiries" ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {inquiries.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "orders"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4" />
                    <span>My Purchases & Orders</span>
                  </div>
                  {orders.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        activeTab === "orders" ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("repeat")}
                  className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "repeat"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Repeat className="h-4 w-4" />
                  <span>Repeat Requests</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Login & Security</span>
                </button>

                {user?.role === "admin" && (
                  <div className="pt-2">
                    <Link
                      to="/admin"
                      className="flex w-full items-center justify-between rounded-sm border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-opacity hover:opacity-90"
                    >
                      <span>Owner Admin Console</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}

                <div className="border-t border-border pt-2 mt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-9">
            {/* 1. OVERVIEW SECTION */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-sm border border-border bg-gradient-to-r from-card via-card/90 to-background p-6">
                  <div className="relative z-10">
                    <p className="font-mono text-xs uppercase tracking-wider text-primary">
                      Trishul Metals & Alloys Client Portal
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-foreground">
                      Welcome, {user?.fullName || "Valued Client"}
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                      Manage cut-to-size piping specifications, request certified alloy quotations, track status updates, and communicate directly with our engineering desk.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShowProductModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Request Product</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMaterialModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/60"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Request Material</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInquiryModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/60"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>Ask Engineering</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 sm:grid-cols-3">
                  <div
                    onClick={() => setActiveTab("rfqs")}
                    className="cursor-pointer rounded-sm border border-border bg-card p-4 transition-colors hover:border-primary/60"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>RFQ Inquiries</span>
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {rfqs.length}
                    </p>
                    <p className="mt-1 text-[11px] text-primary">
                      {rfqs.filter((r) => r.status === "Submitted").length} submitted · view all →
                    </p>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Product Requests
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {productRequests.length}
                    </p>
                    <p className="mt-1 text-[11px] text-primary">
                      {productRequests.filter((r) => r.status === "Pending Review").length} pending review
                    </p>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Material Requests
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {materialRequests.length}
                    </p>
                    <p className="mt-1 text-[11px] text-primary">
                      {materialRequests.filter((r) => r.status === "Pending Review").length} pending review
                    </p>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Active Orders
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {orders.length}
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-400">
                      {orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length} in progress
                    </p>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Support Inquiries
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {inquiries.length}
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-400">
                      {inquiries.filter((i) => i.status === "Open").length} open tickets
                    </p>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="rounded-sm border border-border bg-card p-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                    <button
                      type="button"
                      onClick={() => void loadPortalData()}
                      className="text-xs text-primary hover:underline"
                    >
                      Refresh
                    </button>
                  </div>

                  {activity.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No recent requests logged yet. Use the buttons above to submit your first quotation or inquiry.
                    </div>
                  ) : (
                    <div className="mt-4 divide-y divide-border">
                      {activity.map((act) => (
                        <div key={act.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background text-primary">
                              {act.type === "product_request" ? (
                                <Package className="h-4 w-4" />
                              ) : act.type === "material_request" ? (
                                <Layers className="h-4 w-4" />
                              ) : (
                                <HelpCircle className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{act.title}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">
                                {new Date(act.created_at).toLocaleDateString()} · {act.detail || act.type.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                          <div>{getStatusBadge(act.status)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. MY PROFILE SECTION */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Customer Information Top Card */}
                <div className="rounded-sm border border-border bg-gradient-to-r from-card via-card/95 to-background p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || "User Avatar"}
                          className="h-16 w-16 rounded-full border-2 border-primary object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/15 text-lg font-bold text-primary shadow-sm">
                          {(user?.fullName || user?.email || "TM").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground truncate">
                          {user?.fullName || "Valued Customer"}
                        </h2>
                        <span className="rounded-sm bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
                          {user?.role === "admin" ? "Administrator" : "Verified Customer"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-primary/70" />
                        <span>{user?.company || "Company not specified"}</span>
                      </p>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5 text-xs text-muted-foreground border-t border-border/50">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span className="truncate">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span>{user?.phone || "Phone not provided"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span>
                            Member since:{" "}
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-0 sm:self-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab("rfqs")}
                        className="inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        <span>My RFQ Inquiries ({rfqs.length})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Edit Form Card */}
                <div className="rounded-sm border border-border bg-card p-6">
                  <h3 className="text-base font-semibold text-foreground">Contact & Company Settings</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Update your official contact details used for RFQ routing, test certificates, and dispatch notifications.
                  </p>

                  {profileNotice && (
                    <div className="mt-4 rounded-sm border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
                      {profileNotice}
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="mt-6 max-w-lg space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={profileCompany}
                        onChange={(e) => setProfileCompany(e.target.value)}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Registered Work Email (Permanent)
                      </label>
                      <input
                        disabled
                        type="email"
                        value={user?.email || ""}
                        className={`${fieldClass} opacity-60 cursor-not-allowed`}
                      />
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        Email address is tied to your verified account and quotation records. Contact support to change.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className={fieldClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileBusy}
                      className="rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50"
                    >
                      {profileBusy ? "Saving…" : "Save Profile"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 3. MY RFQ INQUIRIES SECTION */}
            {activeTab === "rfqs" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border bg-card p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">My RFQ Inquiries</h3>
                    <p className="text-xs text-muted-foreground">
                      Track and review all multi-item Request for Quotations (RFQs) submitted through the website.
                    </p>
                  </div>
                  <Link
                    to="/rfq"
                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Submit New RFQ</span>
                  </Link>
                </div>

                {rfqs.length === 0 ? (
                  <div className="rounded-sm border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-semibold text-foreground mb-1">
                      You haven't submitted any inquiries yet.
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                      Submit your piping specifications, MTO spreadsheet, or drawing files to receive an itemized quotation.
                    </p>
                    <Link
                      to="/rfq"
                      className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Submit New RFQ</span>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-sm border border-border bg-card">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="p-3">Inquiry Reference</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Material / Grade</th>
                          <th className="p-3">Quantity</th>
                          <th className="p-3">Submission Date & Time</th>
                          <th className="p-3">Inquiry Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rfqs.map((rfq) => {
                          const primaryItem = rfq.items?.[0];
                          const itemSummary =
                            rfq.items && rfq.items.length > 1
                              ? `${primaryItem?.product || "Piping Specification"} (+${rfq.items.length - 1} more items)`
                              : primaryItem?.product || "Piping Specification";
                          const materialSummary =
                            rfq.items && rfq.items.length > 1
                              ? `${primaryItem?.material || "Alloy"} (+${rfq.items.length - 1})`
                              : primaryItem?.material || "—";
                          const quantitySummary =
                            rfq.items && rfq.items.length > 1
                              ? `${rfq.items.reduce((acc, it) => acc + (parseFloat(it.quantity || "0") || 0), 0) || rfq.items.length} total units`
                              : primaryItem?.quantity
                              ? `${primaryItem.quantity} ${primaryItem.unit || "pcs"}`
                              : "—";

                          const createdDate = new Date(rfq.created_at);
                          const formattedDate = createdDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          });
                          const formattedTime = createdDate.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });

                          return (
                            <tr key={rfq.id} className="transition-colors hover:bg-muted/30">
                              <td className="p-3 font-mono font-semibold text-primary">
                                {rfq.reference}
                              </td>
                              <td className="p-3 font-medium text-foreground max-w-[200px] truncate">
                                {itemSummary}
                              </td>
                              <td className="p-3 font-mono text-[11px] text-muted-foreground">
                                {materialSummary}
                              </td>
                              <td className="p-3 text-foreground font-mono">
                                {quantitySummary}
                              </td>
                              <td className="p-3 text-muted-foreground text-[11px]">
                                {formattedDate}, {formattedTime}
                              </td>
                              <td className="p-3">
                                {getStatusBadge(rfq.status)}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRfq(rfq)}
                                  className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>View Details</span>
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
            )}

            {/* 3. MY PRODUCT REQUESTS SECTION */}
            {activeTab === "products" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border bg-card p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">My Product Requests</h3>
                    <p className="text-xs text-muted-foreground">
                      Review all requested piping components, dimensions, and manufacturing statuses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Product Request</span>
                  </button>
                </div>

                {productRequests.length === 0 ? (
                  <div className="rounded-sm border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                    No product requests submitted yet. Click "New Product Request" to request a cut-to-size quote.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-sm border border-border bg-card">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Material / Grade</th>
                          <th className="p-3">Size</th>
                          <th className="p-3">Quantity</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {productRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-muted/30">
                            <td className="p-3 font-semibold text-foreground">{req.product_name}</td>
                            <td className="p-3 text-muted-foreground">{req.material || "—"}</td>
                            <td className="p-3 font-mono">{req.size || "—"}</td>
                            <td className="p-3 font-mono font-medium">{req.quantity}</td>
                            <td className="p-3">{getStatusBadge(req.status)}</td>
                            <td className="p-3 font-mono text-muted-foreground">
                              {new Date(req.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => setRepeatTarget({ type: "product", item: req })}
                                className="inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary hover:text-primary"
                              >
                                <Repeat className="h-3 w-3" />
                                <span>Repeat</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. MY MATERIAL REQUESTS SECTION */}
            {activeTab === "materials" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border bg-card p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">My Material Requests</h3>
                    <p className="text-xs text-muted-foreground">
                      Track raw material allocations, mill test requisitions, and alloy inquiries.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMaterialModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Material Request</span>
                  </button>
                </div>

                {materialRequests.length === 0 ? (
                  <div className="rounded-sm border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                    <Layers className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                    No material requests logged yet. Click "New Material Request" to specify your alloy requirements.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-sm border border-border bg-card">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="p-3">Material Grade</th>
                          <th className="p-3">Product Form</th>
                          <th className="p-3">Quantity</th>
                          <th className="p-3">Specification</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {materialRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-muted/30">
                            <td className="p-3 font-semibold text-foreground">{req.material_name}</td>
                            <td className="p-3 text-muted-foreground">{req.form || "Pipes / Flanges"}</td>
                            <td className="p-3 font-mono font-medium">{req.quantity}</td>
                            <td className="p-3 font-mono text-muted-foreground">{req.specification || "—"}</td>
                            <td className="p-3">{getStatusBadge(req.status)}</td>
                            <td className="p-3 font-mono text-muted-foreground">
                              {new Date(req.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => setRepeatTarget({ type: "material", item: req })}
                                className="inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary hover:text-primary"
                              >
                                <Repeat className="h-3 w-3" />
                                <span>Repeat</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 5. MY INQUIRIES SECTION */}
            {activeTab === "inquiries" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border bg-card p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">My Inquiries & Support</h3>
                    <p className="text-xs text-muted-foreground">
                      Direct channel to Trishul Metals metallurgical engineers and export desk.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Inquiry</span>
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="rounded-sm border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                    <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                    No inquiries recorded. Submit an inquiry for material test reports, dimensional tolerances, or custom fabrication.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="rounded-sm border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                          <h4 className="text-sm font-semibold text-foreground">{inq.subject}</h4>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {new Date(inq.created_at).toLocaleDateString()}
                            </span>
                            {getStatusBadge(inq.status)}
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-foreground/90">
                          {inq.message}
                        </p>

                        {inq.response ? (
                          <div className="mt-4 rounded-sm border border-primary/30 bg-primary/5 p-3.5">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                              Trishul Engineering Response:
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-foreground">
                              {inq.response}
                            </p>
                          </div>
                        ) : (
                          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                            Status: Awaiting review by metallurgist.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. REPEAT REQUESTS SECTION */}
            {activeTab === "repeat" && (
              <div className="space-y-4">
                <div className="rounded-sm border border-border bg-card p-4">
                  <h3 className="text-base font-semibold text-foreground">Rapid Repeat Requests</h3>
                  <p className="text-xs text-muted-foreground">
                    One-click duplicate orders from your historical requisitions with customized quantities.
                  </p>
                </div>

                {productRequests.length === 0 && materialRequests.length === 0 ? (
                  <div className="rounded-sm border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                    <Repeat className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                    No previous orders available to repeat yet. Submit your first product or material request to enable rapid repeat.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {productRequests.map((req) => (
                      <div key={req.id} className="flex flex-col justify-between rounded-sm border border-border bg-card p-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                              Product Order
                            </span>
                            {getStatusBadge(req.status)}
                          </div>
                          <h4 className="mt-2 text-sm font-semibold text-foreground">{req.product_name}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Grade: {req.material || "Standard"} · Size: {req.size || "Standard"}
                          </p>
                          <p className="font-mono text-xs text-foreground mt-2">
                            Previous Qty: {req.quantity}
                          </p>
                        </div>
                        <div className="mt-4 border-t border-border pt-3">
                          <button
                            type="button"
                            onClick={() => setRepeatTarget({ type: "product", item: req })}
                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                          >
                            <Repeat className="h-3.5 w-3.5" />
                            <span>Repeat This Order</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {materialRequests.map((req) => (
                      <div key={req.id} className="flex flex-col justify-between rounded-sm border border-border bg-card p-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                              Material Allocation
                            </span>
                            {getStatusBadge(req.status)}
                          </div>
                          <h4 className="mt-2 text-sm font-semibold text-foreground">{req.material_name}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Form: {req.form || "Pipes / Flanges"} · Spec: {req.specification || "Standard"}
                          </p>
                          <p className="font-mono text-xs text-foreground mt-2">
                            Previous Qty: {req.quantity}
                          </p>
                        </div>
                        <div className="mt-4 border-t border-border pt-3">
                          <button
                            type="button"
                            onClick={() => setRepeatTarget({ type: "material", item: req })}
                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90"
                          >
                            <Repeat className="h-3.5 w-3.5" />
                            <span>Repeat This Order</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. PURCHASES & ORDERS SECTION */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="rounded-sm border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">My Confirmed Purchases & Orders</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Track fabrication status, material testing inspection, and dispatch delivery for confirmed POs.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {orders.length === 0 ? (
                      <div className="rounded-sm border border-border/80 bg-background/50 p-8 text-center">
                        <Package className="mx-auto h-10 w-10 text-muted-foreground/60" />
                        <h4 className="mt-3 text-sm font-semibold text-foreground">No Confirmed Purchase Orders Yet</h4>
                        <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                          Once your cut-to-size RFQ is approved and quoted, your purchase order and dispatch bill of lading (B/L) will appear here in real time.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowProductModal(true)}
                          className="mt-4 rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
                        >
                          Submit New Cut-to-Size RFQ
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                            <tr>
                              <th className="px-4 py-3">PO Number</th>
                              <th className="px-4 py-3">Item Details</th>
                              <th className="px-4 py-3">Order Value</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Tracking / B/L</th>
                              <th className="px-4 py-3">Order Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {orders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-muted/20">
                                <td className="px-4 py-3 font-mono font-bold text-primary">{ord.order_number}</td>
                                <td className="px-4 py-3">
                                  <p className="font-semibold text-foreground">{ord.title}</p>
                                  {ord.description && (
                                    <p className="text-[11px] text-muted-foreground">{ord.description}</p>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono font-bold text-foreground">
                                  ₹{parseFloat(String(ord.total_amount)).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="rounded-sm bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400">
                                    {ord.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                                  {ord.tracking_number || "In Fabrication"}
                                </td>
                                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                                  {new Date(ord.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. LOGIN & SECURITY SECTION */}
            {activeTab === "security" && (
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground">Login, Identity & Session Security</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  View your authenticated session details, identity provider credentials, and access keys.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-sm border border-border bg-background/50 p-4">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Authentication Protocol</span>
                    <p className="mt-1 font-semibold text-foreground">
                      {user?.role === "admin" ? "Owner Administrator" : "Verified Customer"}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{user?.email}</p>
                  </div>

                  <div className="rounded-sm border border-border bg-background/50 p-4">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Active Session Security</span>
                    <p className="mt-1 font-mono text-xs text-emerald-400">HTTP-Only Encrypted Cookie</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Protection: SameSite=Lax, 30-Day TTL</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Change Password</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Update your account password (min 8 characters).
                  </p>

                  {pwdNotice && (
                    <div className="mt-3 rounded-sm border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
                      {pwdNotice}
                    </div>
                  )}
                  {pwdError && (
                    <div className="mt-3 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                      {pwdError}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="mt-4 max-w-lg space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        New Password (min 8 characters) *
                      </label>
                      <input
                        required
                        minLength={8}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New strong password"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Confirm New Password *
                      </label>
                      <input
                        required
                        minLength={8}
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={fieldClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={pwdBusy}
                      className="rounded-sm bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50"
                    >
                      {pwdBusy ? "Updating Password…" : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 8. ACCOUNT SETTINGS SECTION */}
            {activeTab === "settings" && (
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground">Account Security & Settings</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Update your authentication credentials and manage session security.
                </p>

                {pwdNotice && (
                  <div className="mt-4 rounded-sm border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
                    {pwdNotice}
                  </div>
                )}
                {pwdError && (
                  <div className="mt-4 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                    {pwdError}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="mt-6 max-w-lg space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your existing password"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      New Password (min 8 characters) *
                    </label>
                    <input
                      required
                      minLength={8}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Confirm New Password *
                    </label>
                    <input
                      required
                      minLength={8}
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className={fieldClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pwdBusy}
                    className="rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50"
                  >
                    {pwdBusy ? "Updating Password…" : "Update Password"}
                  </button>
                </form>

                <div className="mt-8 border-t border-border pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Security Session
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Signed in as <span className="font-semibold text-foreground">{user?.email}</span> via encrypted session stored in SQLite database.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </Section>

      {/* MODAL: New Product Request */}
      {showProductModal && (
        <NewProductModal
          onClose={() => setShowProductModal(false)}
          onSuccess={() => {
            setShowProductModal(false);
            void loadPortalData();
            setActiveTab("products");
          }}
        />
      )}

      {/* MODAL: New Material Request */}
      {showMaterialModal && (
        <NewMaterialModal
          onClose={() => setShowMaterialModal(false)}
          onSuccess={() => {
            setShowMaterialModal(false);
            void loadPortalData();
            setActiveTab("materials");
          }}
        />
      )}

      {/* MODAL: New Inquiry */}
      {showInquiryModal && (
        <NewInquiryModal
          onClose={() => setShowInquiryModal(false)}
          onSuccess={() => {
            setShowInquiryModal(false);
            void loadPortalData();
            setActiveTab("inquiries");
          }}
        />
      )}

      {/* MODAL: Repeat Request */}
      {repeatTarget && (
        <RepeatOrderModal
          target={repeatTarget}
          onClose={() => setRepeatTarget(null)}
          onSuccess={() => {
            setRepeatTarget(null);
            void loadPortalData();
            if (repeatTarget.type === "product") setActiveTab("products");
            else setActiveTab("materials");
          }}
        />
      )}

      {/* MODAL: View RFQ Details */}
      {selectedRfq && (
        <RfqDetailModal
          rfq={selectedRfq}
          onClose={() => setSelectedRfq(null)}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// SUB-MODALS
// ----------------------------------------------------------------------

function RfqDetailModal({ rfq, onClose }: { rfq: RfqInquiryItem; onClose: () => void }) {
  const createdDate = new Date(rfq.created_at);
  const formattedDate = createdDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = createdDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-sm border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 pr-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-bold text-primary">{rfq.reference}</span>
              {getStatusBadge(rfq.status)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted on {formattedDate} at {formattedTime}
            </p>
          </div>
        </div>

        {/* Customer & Company Details */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 rounded-sm border border-border bg-muted/20 p-3.5 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Contact Person</span>
            <span className="font-medium text-foreground">{rfq.contact_name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Company</span>
            <span className="font-medium text-foreground">{rfq.company}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Email</span>
            <span className="font-medium text-foreground truncate block">{rfq.email}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Phone</span>
            <span className="font-medium text-foreground">{rfq.phone || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Country</span>
            <span className="font-medium text-foreground">{rfq.country || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Project Name</span>
            <span className="font-medium text-foreground">{rfq.project_name || "—"}</span>
          </div>
        </div>

        {/* Commercial & Shipping Terms */}
        {(rfq.incoterm || rfq.delivery_port || rfq.target_lead_time) && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-sm border border-border bg-muted/10 p-3 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Incoterm</span>
              <span className="font-medium text-foreground">{rfq.incoterm || "—"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Delivery Port</span>
              <span className="font-medium text-foreground">{rfq.delivery_port || "—"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Target Lead Time</span>
              <span className="font-medium text-foreground">{rfq.target_lead_time || "—"}</span>
            </div>
          </div>
        )}

        {/* Product Items Table */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Requested Products & Materials ({rfq.items?.length || 0})
          </h4>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Material / Grade</th>
                  <th className="p-2.5">Product Type</th>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Rating / Facing</th>
                  <th className="p-2.5">Quantity</th>
                  <th className="p-2.5">Processing / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rfq.items && rfq.items.length > 0 ? (
                  rfq.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="p-2.5 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-foreground">{item.material || "—"}</td>
                      <td className="p-2.5 text-foreground">{item.product || "—"}</td>
                      <td className="p-2.5 font-mono">{item.size || "—"}</td>
                      <td className="p-2.5 font-mono text-[11px] text-muted-foreground">
                        {[item.rating, item.facing].filter(Boolean).join(" / ") || "—"}
                      </td>
                      <td className="p-2.5 font-mono font-medium text-foreground">
                        {item.quantity ? `${item.quantity} ${item.unit || "pcs"}` : "—"}
                      </td>
                      <td className="p-2.5 text-[11px] text-muted-foreground">
                        {item.cutLength ? `Cut length: ${item.cutLength}. ` : ""}
                        {item.processing && item.processing.length > 0 ? item.processing.join(", ") : "Standard"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">No specific line items recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality, Testing & Certification */}
        {(rfq.certification || (rfq.testing && rfq.testing.length > 0)) && (
          <div className="mt-4 rounded-sm border border-border p-3 text-xs space-y-2">
            {rfq.certification && (
              <div>
                <span className="font-semibold text-foreground">Certification: </span>
                <span className="text-muted-foreground">{rfq.certification}</span>
              </div>
            )}
            {rfq.testing && rfq.testing.length > 0 && (
              <div>
                <span className="font-semibold text-foreground">Testing Scope: </span>
                <span className="text-muted-foreground">{rfq.testing.join(" · ")}</span>
              </div>
            )}
          </div>
        )}

        {/* Customer Message */}
        {rfq.message && (
          <div className="mt-4 rounded-sm border border-border bg-muted/10 p-3 text-xs">
            <span className="font-semibold text-foreground block mb-1">Message / Requirements:</span>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{rfq.message}</p>
          </div>
        )}

        {/* Attachments */}
        {rfq.attachments && rfq.attachments.length > 0 && (
          <div className="mt-4">
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Attached Files ({rfq.attachments.length})
            </h5>
            <div className="flex flex-wrap gap-2">
              {rfq.attachments.map((att, i) => (
                <div key={i} className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-1.5 text-xs text-foreground">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>{att.name}</span>
                  {att.size ? <span className="font-mono text-[10px] text-muted-foreground">({(att.size / 1024).toFixed(0)} KB)</span> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function NewProductModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [productName, setProductName] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [specification, setSpecification] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !quantity) {
      setError("Product Name and Quantity are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.customer.createProductRequest({
        productName,
        material,
        size,
        quantity,
        specification,
        notes,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to submit request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-sm border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-foreground">New Product Request</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Submit specifications for flanges, buttweld fittings, or forged piping components.
        </p>

        {error && (
          <div className="mt-3 rounded-sm border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product Name / Description *
            </label>
            <input
              required
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Weld Neck Flange ASME B16.5"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Material / Grade
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Inconel 625 / SS 316L"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nominal Size / Class
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder='e.g. 4" Class 300'
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity *
              </label>
              <input
                required
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50 pcs"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Specification / Standard
              </label>
              <input
                type="text"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                placeholder="e.g. ASTM B564 / NORSOM M-630"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Additional Notes / Machining Requirements
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Custom bevel angle, facing finish, EN 10204 3.1 requirement..."
              className={fieldClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewMaterialModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [materialName, setMaterialName] = useState("");
  const [form, setForm] = useState("");
  const [quantity, setQuantity] = useState("");
  const [specification, setSpecification] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName || !quantity) {
      setError("Material Grade and Quantity are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.customer.createMaterialRequest({
        materialName,
        form,
        quantity,
        specification,
        notes,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to submit material request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-sm border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-foreground">New Material Specification Request</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Request alloy availability, mill certification, or specialized CRA grades.
        </p>

        {error && (
          <div className="mt-3 rounded-sm border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Material Grade / Alloy *
            </label>
            <input
              required
              type="text"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="e.g. Duplex 2205 / UNS S31803 / Hastelloy C276"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product Form
              </label>
              <input
                type="text"
                value={form}
                onChange={(e) => setForm(e.target.value)}
                placeholder="e.g. Seamless Pipe / Plate / Round Bar"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity *
              </label>
              <input
                required
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 2,500 kg / 120 meters"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Technical Specification / Heat Treatment
            </label>
            <input
              type="text"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              placeholder="e.g. ASTM A790, Solution Annealed, PREN >= 35"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Testing & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Corrosion test (ASTM G48), Charpy Impact at -46°C, EN 10204 3.1..."
              className={fieldClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Submit Material Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewInquiryModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      setError("Subject and Message are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.customer.createInquiry({ subject, message });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to submit inquiry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-foreground">Submit Technical Inquiry</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Our engineering and metallurgical support team will respond directly to your dashboard.
        </p>

        {error && (
          <div className="mt-3 rounded-sm border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subject *
            </label>
            <input
              required
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. MTC verification for Heat H-6251A"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Detailed Query / Request *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry, project parameters, or questions..."
              className={fieldClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Send Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RepeatOrderModal({
  target,
  onClose,
  onSuccess,
}: {
  target: { type: "product" | "material"; item: ProductRequestItem | MaterialRequestItem };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [quantity, setQuantity] = useState(target.item.quantity);
  const [notes, setNotes] = useState(target.item.notes || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemName =
    target.type === "product"
      ? (target.item as ProductRequestItem).product_name
      : (target.item as MaterialRequestItem).material_name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (target.type === "product") {
        await api.customer.repeatProductRequest(target.item.id, { quantity, notes });
      } else {
        await api.customer.repeatMaterialRequest(target.item.id, { quantity, notes });
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to create repeat request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-foreground">Repeat Request</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Duplicate previous request for <span className="font-semibold text-foreground">{itemName}</span> with updated quantities.
        </p>

        {error && (
          <div className="mt-3 rounded-sm border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quantity for Repeat Order *
            </label>
            <input
              required
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Special Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Confirm Repeat Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
