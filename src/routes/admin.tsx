import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Package,
  Layers,
  HelpCircle,
  ShoppingCart,
  Boxes,
  FileSpreadsheet,
  Shield,
  Settings,
  LogOut,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Send,
  Download,
  Filter,
} from "lucide-react";
import { Breadcrumbs, Section } from "@/components/site/parts";
import { useAuth } from "@/hooks/useAuth";
import { api, type User } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner Admin Management Dashboard | Trishul Metals & Alloys" },
      { name: "description", content: "Owner administrative portal for Trishul Metals & Alloys operations." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

type AdminSectionKey =
  | "overview"
  | "customers"
  | "login_activity"
  | "product_requests"
  | "material_requests"
  | "inquiries"
  | "orders"
  | "stock"
  | "reports"
  | "audit_logs"
  | "settings";

function formatKolkataTime(isoString?: string | null) {
  if (!isoString) return "Never";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(d) + " IST";
  } catch {
    return isoString;
  }
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminSectionKey>("overview");
  const [loadingData, setLoadingData] = useState(true);

  // Admin login credentials (for non-logged in state)
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Overview data
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  // Customers data
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Login activity
  const [loginActivity, setLoginActivity] = useState<any[]>([]);

  // Requests & Inquiries
  const [productRequests, setProductRequests] = useState<any[]>([]);
  const [materialRequests, setMaterialRequests] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrderCustomerId, setNewOrderCustomerId] = useState("");
  const [newOrderTitle, setNewOrderTitle] = useState("");
  const [newOrderAmount, setNewOrderAmount] = useState("");
  const [newOrderTracking, setNewOrderTracking] = useState("");
  const [orderModalBusy, setOrderModalBusy] = useState(false);

  // Stock items
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [newStockCategory, setNewStockCategory] = useState("Flanges");
  const [newStockGrade, setNewStockGrade] = useState("");
  const [newStockProduct, setNewStockProduct] = useState("");
  const [newStockSize, setNewStockSize] = useState("");
  const [newStockQty, setNewStockQty] = useState("");
  const [newStockSpec, setNewStockSpec] = useState("");
  const [stockModalBusy, setStockModalBusy] = useState(false);

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Inquiry Response Modal
  const [respondingInquiry, setRespondingInquiry] = useState<any | null>(null);
  const [inquiryReplyText, setInquiryReplyText] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);

  // Quote Update Modal
  const [quotingRequest, setQuotingRequest] = useState<any | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteStatus, setQuoteStatus] = useState("Quotation Sent");
  const [quoteBusy, setQuoteBusy] = useState(false);

  // Feedback notifications
  const [notice, setNotice] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!user || user.role !== "admin") return;
    setLoadingData(true);
    try {
      const [ovRes, custRes, actRes, prodsRes, matsRes, inqRes, ordRes, stkRes, logRes] = await Promise.all([
        api.admin.getOverview().catch(() => null),
        api.admin.getCustomers({ limit: 100 }).catch(() => ({ customers: [] })),
        api.admin.getLoginActivity().catch(() => ({ loginActivity: [] })),
        api.admin.getProductRequests().catch(() => ({ requests: [] })),
        api.admin.getMaterialRequests().catch(() => ({ requests: [] })),
        api.admin.getInquiries().catch(() => ({ inquiries: [] })),
        api.admin.getOrders().catch(() => ({ orders: [] })),
        api.admin.getStock().catch(() => ({ stock: [] })),
        api.admin.getActivityLogs().catch(() => ({ logs: [] })),
      ]);

      if (ovRes) {
        setOverviewStats(ovRes.stats);
        setRecentUsers(ovRes.recentUsers || []);
        setRecentRequests(ovRes.recentRequests || []);
      }
      setCustomers(custRes.customers || []);
      setLoginActivity(actRes.loginActivity || []);
      setProductRequests(prodsRes.requests || []);
      setMaterialRequests(matsRes.requests || []);
      setInquiries(inqRes.inquiries || []);
      setOrders(ordRes.orders || []);
      setStockItems(stkRes.stock || []);
      setAuditLogs(logRes.logs || []);
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
      const loggedUser = await login(adminEmail, adminPassword);
      if (loggedUser.role !== "admin") {
        setLoginError("This account does not have Owner Administrator privileges.");
      }
    } catch (err: any) {
      setLoginError(err?.message || "Invalid administrator credentials.");
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/" });
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        (c.full_name && c.full_name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [customers, customerSearch]);

  // Submit quote
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotingRequest) return;
    setQuoteBusy(true);
    try {
      await api.admin.updateProductRequest(quotingRequest.id, {
        status: quoteStatus,
        quotation_amount: parseFloat(quoteAmount) || 0,
      });
      setNotice(`Quotation of INR ${quoteAmount} applied to request #${quotingRequest.id.slice(0, 8)}`);
      setQuotingRequest(null);
      void fetchAdminData();
    } catch (err: any) {
      alert("Failed to submit quotation: " + err.message);
    } finally {
      setQuoteBusy(false);
    }
  };

  // Submit inquiry response
  const handleInquiryReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingInquiry) return;
    setReplyBusy(true);
    try {
      await api.admin.respondInquiry(respondingInquiry.id, {
        response: inquiryReplyText,
        status: "Responded",
      });
      setNotice(`Response sent to customer regarding "${respondingInquiry.subject}"`);
      setRespondingInquiry(null);
      setInquiryReplyText("");
      void fetchAdminData();
    } catch (err: any) {
      alert("Failed to send response: " + err.message);
    } finally {
      setReplyBusy(false);
    }
  };

  // Create new order
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderCustomerId || !newOrderTitle) return;
    setOrderModalBusy(true);
    try {
      await api.admin.createOrder({
        userId: newOrderCustomerId,
        title: newOrderTitle,
        totalAmount: parseFloat(newOrderAmount) || 0,
        trackingNumber: newOrderTracking,
      });
      setNotice(`New purchase order recorded successfully.`);
      setShowOrderModal(false);
      setNewOrderTitle("");
      setNewOrderAmount("");
      setNewOrderTracking("");
      void fetchAdminData();
    } catch (err: any) {
      alert("Failed to create order: " + err.message);
    } finally {
      setOrderModalBusy(false);
    }
  };

  // Add stock item
  const handleAddStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockGrade || !newStockCategory) return;
    setStockModalBusy(true);
    try {
      await api.admin.addStock({
        category: newStockCategory,
        grade: newStockGrade,
        product: newStockProduct,
        size: newStockSize,
        quantity: parseInt(newStockQty, 10) || 0,
        spec: newStockSpec,
        location: "Mumbai",
      });
      setNotice(`Inventory stock updated with ${newStockGrade}.`);
      setShowStockModal(false);
      setNewStockGrade("");
      setNewStockProduct("");
      setNewStockSize("");
      setNewStockQty("");
      setNewStockSpec("");
      void fetchAdminData();
    } catch (err: any) {
      alert("Failed to add stock item: " + err.message);
    } finally {
      setStockModalBusy(false);
    }
  };

  // If unauthenticated, show secure admin login form
  if (!authLoading && !user) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Owner Administration" }]} />
        <Section>
          <div className="mx-auto my-12 max-w-md rounded-sm border border-border bg-card p-6 shadow-md md:p-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Shield className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">Trishul Metals & Alloys</h1>
                <p className="text-xs text-muted-foreground">Owner & Administrator Management Portal</p>
              </div>
            </div>

            {loginError && (
              <div className="mt-4 flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@trishulmetal.com"
                  className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loginBusy}
                className="w-full rounded-sm bg-primary py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loginBusy ? "Authenticating Master Key..." : "Sign In to Admin Dashboard"}
              </button>
            </form>

            <div className="mt-6 rounded-sm border border-border/70 bg-card/60 p-3 text-center text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground">Default Owner Access:</p>
              <p className="font-mono text-[10px] mt-1 text-primary">admin@trishulmetal.com</p>
              <p className="font-mono text-[10px]">Admin@Trishul2026!</p>
            </div>
          </div>
        </Section>
      </>
    );
  }

  // If logged in as non-admin customer
  if (user && user.role !== "admin") {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-sm border border-destructive/30 bg-card p-8 text-center shadow-md">
        <Shield className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-bold text-foreground">Restricted Owner Administration</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You are currently signed in as <strong>{user.email}</strong>, which has standard Client privileges. Administrator permissions are required to access management telemetry.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/portal"
            className="rounded-sm bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
          >
            Go to Customer Portal
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Owner Administration", to: "/admin" }]} />

      <Section>
        {notice && (
          <div className="mb-6 flex items-center justify-between rounded-sm border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{notice}</span>
            </div>
            <button onClick={() => setNotice(null)} className="font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Admin Navigation Sidebar (11 Sections) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20 rounded-sm border border-border bg-card p-4 shadow-sm">
              <div className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    OWNER CONSOLE
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{user?.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-emerald-400">MySQL: trishul_db</span>
                </div>
              </div>

              <nav className="mt-4 space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Overview & KPIs</span>
                </button>

                <button
                  onClick={() => setActiveTab("customers")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "customers"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>All Customers</span>
                  </div>
                  <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{customers.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab("login_activity")}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "login_activity"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Login Activity</span>
                </button>

                <button
                  onClick={() => setActiveTab("product_requests")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "product_requests"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="h-3.5 w-3.5" />
                    <span>Product RFQs</span>
                  </div>
                  {productRequests.length > 0 && (
                    <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{productRequests.length}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("material_requests")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "material_requests"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Material Requisitions</span>
                  </div>
                  {materialRequests.length > 0 && (
                    <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{materialRequests.length}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("inquiries")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "inquiries"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Customer Inquiries</span>
                  </div>
                  {inquiries.length > 0 && (
                    <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{inquiries.length}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "orders"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Purchases & Orders</span>
                  </div>
                  {orders.length > 0 && (
                    <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{orders.length}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("stock")}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "stock"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Boxes className="h-3.5 w-3.5" />
                    <span>Stock Inventory</span>
                  </div>
                  <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{stockItems.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab("reports")}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "reports"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Reports & Export</span>
                </button>

                <button
                  onClick={() => setActiveTab("audit_logs")}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "audit_logs"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Audit Logs</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>System Diagnostics</span>
                </button>

                <div className="border-t border-border pt-2 mt-2">
                  <Link
                    to="/portal"
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View Customer Portal</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Admin Workspace Panel */}
          <main className="lg:col-span-9">
            {/* 1. OVERVIEW & KPIS */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-primary">
                    TRISHUL METALS TELEMETRY OVERVIEW
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Live operational metrics sourced directly from MySQL (<span className="text-foreground">trishul_db</span>)
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Registered Customers</p>
                      <p className="mt-2 font-mono text-2xl font-bold text-foreground">
                        {overviewStats?.totalCustomers ?? customers.length}
                      </p>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pending RFQs</p>
                      <p className="mt-2 font-mono text-2xl font-bold text-amber-500">
                        {overviewStats?.productRequests?.pending ?? 0}
                      </p>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Orders</p>
                      <p className="mt-2 font-mono text-2xl font-bold text-emerald-500">
                        {overviewStats?.orders?.active ?? orders.length}
                      </p>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Open Inquiries</p>
                      <p className="mt-2 font-mono text-2xl font-bold text-primary">
                        {overviewStats?.inquiries?.open ?? inquiries.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Inquiries & Customers */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-sm border border-border bg-card p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Recently Registered Customers</h3>
                      <button onClick={() => setActiveTab("customers")} className="text-[11px] text-primary hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="mt-3 divide-y divide-border/60">
                      {(recentUsers.length > 0 ? recentUsers : customers.slice(0, 5)).map((c) => (
                        <div key={c.id} className="py-2.5 text-xs">
                          <p className="font-semibold text-foreground">{c.full_name || "Customer"}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{c.email}</p>
                          <p className="text-[10px] text-muted-foreground/80">{c.company || "Independent Buyer"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Recent Customer Requisitions</h3>
                      <button onClick={() => setActiveTab("product_requests")} className="text-[11px] text-primary hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="mt-3 divide-y divide-border/60">
                      {productRequests.slice(0, 5).map((r) => (
                        <div key={r.id} className="py-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">{r.product_name}</span>
                            <span className="font-mono text-[10px] text-primary">{r.quantity}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{r.customer_name} ({r.customer_company || "Client"})</p>
                          <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[9px] uppercase font-mono">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ALL CUSTOMERS */}
            {activeTab === "customers" && (
              <div className="space-y-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Registered Customers Directory</h2>
                    <p className="text-xs text-muted-foreground">Accounts stored in MySQL `users` table</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name, company, email..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full rounded-sm border border-border bg-card pl-9 pr-3 py-1.5 text-xs outline-none focus:border-primary sm:w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Customer Name</th>
                        <th className="px-4 py-3">Work Email</th>
                        <th className="px-4 py-3">Company</th>
                        <th className="px-4 py-3">Login Method</th>
                        <th className="px-4 py-3">Last Active (IST)</th>
                        <th className="px-4 py-3">Registered (IST)</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-semibold text-foreground">{c.full_name}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{c.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{c.company || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                              c.login_method === "google" ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"
                            }`}>
                              {c.login_method || "password"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                            {formatKolkataTime(c.last_login_at)}
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                            {formatKolkataTime(c.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedCustomer(c)}
                              className="rounded-sm bg-muted px-2 py-1 text-[11px] font-medium hover:text-foreground"
                            >
                              History
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. LOGIN ACTIVITY (Asia/Kolkata Timestamps) */}
            {activeTab === "login_activity" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Customer & Admin Login History</h2>
                  <p className="text-xs text-muted-foreground">Real-time audit log stamped in Asia/Kolkata timezone</p>
                </div>

                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">IP Address</th>
                        <th className="px-4 py-3">Timestamp (Asia/Kolkata)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {loginActivity.map((l) => (
                        <tr key={l.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{l.full_name || l.email}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{l.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase">
                              {l.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                              l.login_method === "google" ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"
                            }`}>
                              {l.login_method}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{l.ip_address || "127.0.0.1"}</td>
                          <td className="px-4 py-3 font-mono text-[10px] text-primary">{formatKolkataTime(l.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. PRODUCT RFQS & QUOTATION MANAGEMENT */}
            {activeTab === "product_requests" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Customer Cut-to-Size Product RFQs</h2>
                  <p className="text-xs text-muted-foreground">Review incoming requisitions and assign formal price quotes</p>
                </div>

                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Product Spec</th>
                        <th className="px-4 py-3">Material / Grade</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Quote (INR)</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {productRequests.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{r.customer_name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{r.customer_company || r.customer_email}</p>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">{r.product_name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.material || "CRA Grade"}</td>
                          <td className="px-4 py-3 font-mono text-primary">{r.quantity}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase">
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-foreground font-semibold">
                            {r.quotation_amount ? `₹${r.quotation_amount.toLocaleString()}` : "Pending"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setQuotingRequest(r);
                                setQuoteAmount(String(r.quotation_amount || ""));
                              }}
                              className="rounded-sm bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground"
                            >
                              Quote / Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. PURCHASES & ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Purchase Order Fulfillment</h2>
                    <p className="text-xs text-muted-foreground">Manage confirmed client purchase orders & dispatch tracking</p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Record New Order</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Order #</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Title / Description</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Fulfillment Status</th>
                        <th className="px-4 py-3">Tracking</th>
                        <th className="px-4 py-3">Date (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                            No orders recorded yet. Click "Record New Order" above to issue an order.
                          </td>
                        </tr>
                      ) : (
                        orders.map((o) => (
                          <tr key={o.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3 font-mono text-primary font-bold">{o.order_number}</td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{o.customer_name}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">{o.customer_email}</p>
                            </td>
                            <td className="px-4 py-3 text-foreground">{o.title}</td>
                            <td className="px-4 py-3 font-mono font-bold">₹{parseFloat(o.total_amount).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="rounded-sm bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-emerald-400">
                                {o.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                              {o.tracking_number || "Awaiting BL"}
                            </td>
                            <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                              {formatKolkataTime(o.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. STOCK & INVENTORY MANAGEMENT */}
            {activeTab === "stock" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Mumbai Warehouse Certified Inventory</h2>
                    <p className="text-xs text-muted-foreground">Certified CRA piping items stored in MySQL `stock_items`</p>
                  </div>
                  <button
                    onClick={() => setShowStockModal(true)}
                    className="flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Stock Item</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Grade</th>
                        <th className="px-4 py-3">Product Form</th>
                        <th className="px-4 py-3">Size & Rating</th>
                        <th className="px-4 py-3">Available Qty</th>
                        <th className="px-4 py-3">Warehouse</th>
                        <th className="px-4 py-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {stockItems.map((stk) => (
                        <tr key={stk.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-semibold text-foreground">{stk.category}</td>
                          <td className="px-4 py-3 font-bold text-primary">{stk.grade}</td>
                          <td className="px-4 py-3 text-muted-foreground">{stk.product}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                            {stk.size || stk.size_range} {stk.rating ? `(${stk.rating})` : ""}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-foreground">
                            {stk.quantity} {stk.unit || "pcs"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{stk.location || "Mumbai"}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Remove ${stk.grade} from stock?`)) {
                                  await api.admin.deleteStock(stk.id);
                                  void fetchAdminData();
                                }
                              }}
                              className="text-destructive hover:underline text-[11px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. REPORTS & CSV EXPORT */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="rounded-sm border border-border bg-card p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Business Reports & Data Extraction</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Export clean, structured business data in standard CSV format</p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <h3 className="text-xs font-bold text-foreground">Customer Accounts Directory</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Includes customer name, email, company, contact number, login method, and registration dates.
                      </p>
                      <a
                        href="/api/admin/export-csv?type=customers"
                        download
                        className="mt-4 inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Customers CSV</span>
                      </a>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <h3 className="text-xs font-bold text-foreground">Client Purchase Orders Report</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Includes PO numbers, customer contact details, item titles, order values, currency, and fulfillment status.
                      </p>
                      <a
                        href="/api/admin/export-csv?type=orders"
                        download
                        className="mt-4 inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Orders CSV</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. AUDIT LOGS */}
            {activeTab === "audit_logs" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Administrator Audit Trail</h2>
                  <p className="text-xs text-muted-foreground">Immutable log of operations executed by administrators</p>
                </div>

                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Admin</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Target</th>
                        <th className="px-4 py-3">Details</th>
                        <th className="px-4 py-3">IP Address</th>
                        <th className="px-4 py-3">Timestamp (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            No administrative audit records logged yet.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3 font-semibold text-foreground">{log.admin_email}</td>
                            <td className="px-4 py-3 font-mono text-[10px] text-primary">{log.action}</td>
                            <td className="px-4 py-3 text-muted-foreground">{log.target_type}</td>
                            <td className="px-4 py-3 text-foreground">{log.details || "—"}</td>
                            <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{log.ip_address}</td>
                            <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                              {formatKolkataTime(log.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. SYSTEM DIAGNOSTICS & SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="rounded-sm border border-border bg-card p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Trishul Metals Architecture Status</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <span className="font-mono text-[11px] text-muted-foreground">Primary Database</span>
                      <p className="mt-1 font-mono text-sm font-bold text-emerald-400">MySQL Server 8.0 (trishul_db)</p>
                      <p className="mt-1 text-xs text-muted-foreground">Pool limit: 15 connections, keepalive active</p>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <span className="font-mono text-[11px] text-muted-foreground">Google OAuth 2.0</span>
                      <p className="mt-1 font-mono text-sm font-bold text-primary">PKCE (RFC 7636) Enabled</p>
                      <p className="mt-1 text-xs text-muted-foreground">Direct Node.js backend callback</p>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <span className="font-mono text-[11px] text-muted-foreground">Session Protocol</span>
                      <p className="mt-1 font-mono text-sm font-bold text-foreground">HTTP-Only SameSite=Lax (trishul_session)</p>
                      <p className="mt-1 text-xs text-muted-foreground">30-day persistent server-side token table</p>
                    </div>

                    <div className="rounded-sm border border-border bg-card/60 p-4">
                      <span className="font-mono text-[11px] text-muted-foreground">Timezone Standard</span>
                      <p className="mt-1 font-mono text-sm font-bold text-foreground">Asia/Kolkata (IST)</p>
                      <p className="mt-1 text-xs text-muted-foreground">All business telemetry converted to IST</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modal: Quotation Assignment */}
        {quotingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Set Price Quotation for RFQ
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Customer: <strong>{quotingRequest.customer_name}</strong> ({quotingRequest.product_name})
              </p>

              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Status</label>
                  <select
                    value={quoteStatus}
                    onChange={(e) => setQuoteStatus(e.target.value)}
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Under Evaluation">Under Evaluation</option>
                    <option value="Approved">Approved</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Quotation Total (INR)</label>
                  <input
                    type="number"
                    required
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="e.g. 175000"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuotingRequest(null)}
                    className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteBusy}
                    className="rounded-sm bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    {quoteBusy ? "Saving..." : "Save & Update Quote"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Record New Order */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Record New Client Purchase Order
              </h3>
              <form onSubmit={handleCreateOrderSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Select Customer</label>
                  <select
                    required
                    value={newOrderCustomerId}
                    onChange={(e) => setNewOrderCustomerId(e.target.value)}
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} ({c.company || c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Order Title / Products</label>
                  <input
                    type="text"
                    required
                    value={newOrderTitle}
                    onChange={(e) => setNewOrderTitle(e.target.value)}
                    placeholder="e.g. 50 pcs Inconel 625 4-inch Weld Neck Flanges"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Total Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={newOrderAmount}
                    onChange={(e) => setNewOrderAmount(e.target.value)}
                    placeholder="e.g. 450000"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Tracking Number / BL Reference</label>
                  <input
                    type="text"
                    value={newOrderTracking}
                    onChange={(e) => setNewOrderTracking(e.target.value)}
                    placeholder="e.g. TM-BL-2026-8812"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderModalBusy}
                    className="rounded-sm bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    {orderModalBusy ? "Saving..." : "Save Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Stock Item */}
        {showStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Add Certified Inventory to Mumbai Stock
              </h3>
              <form onSubmit={handleAddStockSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Category</label>
                  <select
                    value={newStockCategory}
                    onChange={(e) => setNewStockCategory(e.target.value)}
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="Flanges">Flanges</option>
                    <option value="Fittings">Fittings</option>
                    <option value="Pipes">Pipes</option>
                    <option value="Round Bars">Round Bars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Material Grade</label>
                  <input
                    type="text"
                    required
                    value={newStockGrade}
                    onChange={(e) => setNewStockGrade(e.target.value)}
                    placeholder="e.g. Inconel 625, UNS S32750, Monel 400"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Product Form</label>
                  <input
                    type="text"
                    value={newStockProduct}
                    onChange={(e) => setNewStockProduct(e.target.value)}
                    placeholder="e.g. Weld Neck Flanges, Equal Tees"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">Size Range</label>
                    <input
                      type="text"
                      value={newStockSize}
                      onChange={(e) => setNewStockSize(e.target.value)}
                      placeholder='e.g. 2" to 12"'
                      className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">Available Quantity</label>
                    <input
                      type="number"
                      required
                      value={newStockQty}
                      onChange={(e) => setNewStockQty(e.target.value)}
                      placeholder="e.g. 150"
                      className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">Material Specification</label>
                  <input
                    type="text"
                    value={newStockSpec}
                    onChange={(e) => setNewStockSpec(e.target.value)}
                    placeholder="e.g. ASTM B564, NORSOK M-630 MDS D55"
                    className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowStockModal(false)}
                    className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={stockModalBusy}
                    className="rounded-sm bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    {stockModalBusy ? "Saving..." : "Add to Stock"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
