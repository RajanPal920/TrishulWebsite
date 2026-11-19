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
  Edit2,
  Phone,
  Mail,
  Building2,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  FileText,
  Calendar,
  Hash,
} from "lucide-react";
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

  // Customers data & pagination state
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersTotal, setCustomersTotal] = useState(0);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerMethodFilter, setCustomerMethodFilter] = useState("all");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("all");
  const [customerSort, setCustomerSort] = useState("registered_desc");
  const [customerPage, setCustomerPage] = useState(1);
  const [customerTotalPages, setCustomerTotalPages] = useState(1);
  const [customersLoading, setCustomersLoading] = useState(false);

  // Customer Details modal state
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerDetail, setCustomerDetail] = useState<any | null>(null);
  const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
  const [customerDetailTab, setCustomerDetailTab] = useState<"info" | "rfqs" | "orders" | "products" | "materials" | "logins">("info");

  // Edit Customer Modal state
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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

  const fetchCustomers = async (page = customerPage) => {
    setCustomersLoading(true);
    try {
      const res = await api.admin.getCustomers({
        search: customerSearch,
        method: customerMethodFilter,
        status: customerStatusFilter,
        sort: customerSort,
        page,
        limit: 15,
      });
      setCustomers(res.customers || []);
      setCustomersTotal(res.total || 0);
      setCustomerPage(res.page || 1);
      setCustomerTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error("[Admin Customers Fetch Error]:", err);
    } finally {
      setCustomersLoading(false);
    }
  };

  // Debounced/responsive customer fetch when filters or sort change
  useEffect(() => {
    let timer: any;
    if (user && user.role === "admin" && activeTab === "customers") {
      timer = setTimeout(() => {
        void fetchCustomers(customerPage);
      }, 200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [customerSearch, customerMethodFilter, customerStatusFilter, customerSort, customerPage, activeTab]);

  const handleOpenCustomerDetails = async (cust: any) => {
    setSelectedCustomer(cust);
    setCustomerDetail(null);
    setCustomerDetailLoading(true);
    setCustomerDetailTab("info");
    try {
      const data = await api.admin.getCustomer(cust.id);
      setCustomerDetail(data);
    } catch (err: any) {
      console.error("[Customer Detail Fetch Error]:", err);
    } finally {
      setCustomerDetailLoading(false);
    }
  };

  const handleOpenEditCustomer = (cust: any) => {
    setEditingCustomer(cust);
    setEditName(cust.full_name || "");
    setEditEmail(cust.email || "");
    setEditPhone(cust.phone || "");
    setEditCompany(cust.company || "");
    setEditStatus(cust.status === "inactive" ? "inactive" : "active");
    setEditError(null);
  };

  const handleSaveCustomerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setEditError(null);

    if (!editName.trim() || editName.trim().length < 2) {
      setEditError("Customer Full Name is required (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim() || !emailRegex.test(editEmail.trim())) {
      setEditError("A valid work email address is required.");
      return;
    }

    if (editPhone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(editPhone.trim())) {
        setEditError("Invalid phone number format. Please include country code (e.g. +91 98200 12345).");
        return;
      }
    }

    setEditBusy(true);
    try {
      const res = await api.admin.updateCustomer(editingCustomer.id, {
        full_name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phone: editPhone.trim() || null,
        company: editCompany.trim() || null,
        status: editStatus,
      });

      setNotice("Customer contact details updated successfully.");
      setEditingCustomer(null);

      // Refresh table
      await fetchCustomers(customerPage);

      // If customer detail modal is currently showing this user, update it
      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        void handleOpenCustomerDetails({ ...selectedCustomer, ...res.customer });
      }
    } catch (err: any) {
      setEditError(err?.message || "Failed to update customer account.");
    } finally {
      setEditBusy(false);
    }
  };

  // Immediate in-memory customer filter fallback for instant search typing responsiveness
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        (c.full_name && c.full_name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
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

  // If unauthenticated, show clean standalone admin login screen (completely isolated from public site)
  if (!authLoading && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-2xl md:p-8">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/20 text-primary border border-primary/40 font-bold">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Trishul Metals & Alloys</h1>
              <p className="text-xs text-muted-foreground font-mono">Owner & Administrator Management Portal</p>
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
                Administrator Work Email
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
                Master Security Key
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

          <div className="mt-6 border-t border-border/60 pt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <span>← Back to User Interface</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If logged in as non-admin customer, show standalone restricted page
  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-lg rounded-sm border border-destructive/30 bg-card p-8 text-center shadow-2xl">
          <Shield className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-bold text-foreground">Restricted Owner Administration</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are currently signed in as <strong>{user.email}</strong>, which has standard Client privileges. Owner administrator permissions are required to access management telemetry.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <span>← Back to User Interface</span>
            </Link>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Standalone Admin Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/20 text-primary border border-primary/40 font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                  TRISHUL METALS & ALLOYS
                </span>
                <span className="rounded-sm bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary border border-primary/30">
                  OWNER CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span>Production Database:</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-400">MySQL trishul_db</span>
              </p>
            </div>
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-mono text-xs font-semibold text-foreground">{user?.email}</span>
              <span className="text-[10px] text-primary font-mono flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Owner Administrator
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                title="Return to public website while keeping admin session active"
              >
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                <span>Back to User Interface</span>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                title="Sign out of administrative session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Panel */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
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

                <div className="border-t border-border pt-2 mt-2 space-y-1">
                  <Link
                    to="/"
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-primary" />
                    <span>Back to User Interface</span>
                  </Link>
                  <Link
                    to="/portal"
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" />
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
                          <p className="text-[10px] text-[#F5F5F5]">{c.company || "Independent Buyer"}</p>
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
                {/* Search, Filter & Summary Bar */}
                <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Registered Customers Directory
                        </h2>
                        {customersLoading && (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Verified customer accounts stored in MySQL `users` table with telephone numbers & inquiry history
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="rounded-full bg-primary/15 border border-primary/30 px-3 py-1 font-mono text-xs font-semibold text-primary">
                        Total: {customersTotal} Customers
                      </span>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5 pt-3 border-t border-border/60">
                    {/* Search Field */}
                    <div className="relative lg:col-span-2">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by name, company, email, phone, ID..."
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setCustomerPage(1);
                        }}
                        className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    {/* Login Method Filter */}
                    <div>
                      <select
                        value={customerMethodFilter}
                        onChange={(e) => {
                          setCustomerMethodFilter(e.target.value);
                          setCustomerPage(1);
                        }}
                        className="w-full rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      >
                        <option value="all">All Login Methods</option>
                        <option value="google">Google OAuth</option>
                        <option value="password">Email & Password</option>
                      </select>
                    </div>

                    {/* Account Status Filter */}
                    <div>
                      <select
                        value={customerStatusFilter}
                        onChange={(e) => {
                          setCustomerStatusFilter(e.target.value);
                          setCustomerPage(1);
                        }}
                        className="w-full rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Accounts</option>
                        <option value="inactive">Inactive Accounts</option>
                      </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div>
                      <select
                        value={customerSort}
                        onChange={(e) => {
                          setCustomerSort(e.target.value);
                          setCustomerPage(1);
                        }}
                        className="w-full rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      >
                        <option value="registered_desc">Newest Registered</option>
                        <option value="registered_asc">Oldest Registered</option>
                        <option value="login_desc">Recently Active</option>
                        <option value="name_asc">Customer Name (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customers Table */}
                <div className="overflow-x-auto rounded-sm border border-border bg-card">
                  <table className="w-full min-w-[1100px] text-left text-xs">
                    <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-3.5 py-3 min-w-[170px]">Customer Name</th>
                        <th className="px-3 py-3 min-w-[180px]">Work Email</th>
                        <th className="px-3 py-3 min-w-[140px]">Phone / Mobile</th>
                        <th className="px-3 py-3 min-w-[140px]">Company</th>
                        <th className="px-2.5 py-3 text-center min-w-[95px]">Method</th>
                        <th className="px-2.5 py-3 text-center min-w-[90px]">Status</th>
                        <th className="px-3 py-3 min-w-[150px]">Registered (IST)</th>
                        <th className="px-3 py-3 min-w-[150px]">Last Active (IST)</th>
                        <th className="px-2 py-3 text-center min-w-[70px]">RFQs</th>
                        <th className="px-2 py-3 text-center min-w-[70px]">Orders</th>
                        <th className="px-3.5 py-3 text-right min-w-[140px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="py-8 text-center text-xs text-muted-foreground">
                            {customersLoading ? "Loading customers..." : "No matching customer records found."}
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((c) => (
                          <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                            {/* 1. Customer Name */}
                            <td className="px-3.5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold uppercase border border-primary/30">
                                  {c.full_name?.charAt(0) || "C"}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleOpenCustomerDetails(c)}
                                  className="text-left font-semibold text-foreground hover:text-primary transition-colors truncate max-w-[140px]"
                                  title={c.full_name}
                                >
                                  {c.full_name}
                                </button>
                              </div>
                            </td>

                            {/* 2. Work Email */}
                            <td className="px-3 py-3">
                              <span className="font-mono text-[11px] text-muted-foreground truncate block max-w-[180px]" title={c.email}>
                                {c.email}
                              </span>
                            </td>

                            {/* 3. Phone / Mobile Number */}
                            <td className="px-3 py-3">
                              {c.phone && c.phone.trim() ? (
                                <span className="font-mono text-[11px] text-foreground font-medium">
                                  {c.phone}
                                </span>
                              ) : (
                                <span className="text-[11px] italic text-[#EAEAEA]">
                                  Not Provided
                                </span>
                              )}
                            </td>

                            {/* 4. Company */}
                            <td className="px-3 py-3">
                              <span className="text-muted-foreground truncate block max-w-[140px]" title={c.company || "—"}>
                                {c.company && c.company.trim() ? c.company : "—"}
                              </span>
                            </td>

                            {/* 5. Login Method */}
                            <td className="px-2.5 py-3 text-center">
                              <span
                                className={`inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase font-semibold ${
                                  c.login_method === "google"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-primary/10 text-primary border border-primary/20"
                                }`}
                              >
                                {c.login_method || "password"}
                              </span>
                            </td>

                            {/* 6. Account Status */}
                            <td className="px-2.5 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase font-semibold ${
                                  c.status === "inactive"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    c.status === "inactive" ? "bg-amber-400" : "bg-emerald-400"
                                  }`}
                                />
                                {c.status || "active"}
                              </span>
                            </td>

                            {/* 7. Registration (IST) */}
                            <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatKolkataTime(c.created_at)}
                            </td>

                            {/* 8. Last Active (IST) */}
                            <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatKolkataTime(c.last_login_at)}
                            </td>

                            {/* 9. Total RFQ Inquiries */}
                            <td className="px-2 py-3 text-center">
                              <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary border border-primary/20">
                                {c.rfq_count ?? 0}
                              </span>
                            </td>

                            {/* 10. Total Orders */}
                            <td className="px-2 py-3 text-center">
                              <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground border border-border/80">
                                {c.orders_count ?? 0}
                              </span>
                            </td>

                            {/* 11. Actions */}
                            <td className="px-3.5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenCustomerDetails(c)}
                                  className="inline-flex items-center gap-1 rounded-sm bg-muted/80 px-2 py-1 text-[11px] font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                  title="View full customer profile & history"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCustomer(c)}
                                  className="inline-flex items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                                  title="Edit customer contact details"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Footer */}
                  <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row text-xs text-muted-foreground">
                    <div>
                      Showing{" "}
                      <span className="font-semibold text-foreground">
                        {filteredCustomers.length === 0 ? 0 : (customerPage - 1) * 15 + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-foreground">
                        {Math.min(customerPage * 15, customersTotal)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-foreground">{customersTotal}</span> registered customers
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={customerPage <= 1 || customersLoading}
                        onClick={() => {
                          const p = customerPage - 1;
                          setCustomerPage(p);
                          void fetchCustomers(p);
                        }}
                        className="inline-flex items-center gap-1 rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-medium disabled:opacity-40 hover:bg-muted"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>Previous</span>
                      </button>

                      <span className="px-2 font-mono text-xs">
                        Page {customerPage} of {Math.max(1, customerTotalPages)}
                      </span>

                      <button
                        type="button"
                        disabled={customerPage >= customerTotalPages || customersLoading}
                        onClick={() => {
                          const p = customerPage + 1;
                          setCustomerPage(p);
                          void fetchCustomers(p);
                        }}
                        className="inline-flex items-center gap-1 rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-medium disabled:opacity-40 hover:bg-muted"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
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

        {/* Modal: Customer Details 360-degree View */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-sm border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-base border border-primary/40">
                    {selectedCustomer.full_name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {selectedCustomer.full_name}
                      </h3>
                      <span
                        className={`rounded-sm px-2 py-0.5 font-mono text-[9px] uppercase font-semibold ${
                          selectedCustomer.status === "inactive"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {selectedCustomer.status || "active"}
                      </span>
                      <span
                        className={`rounded-sm px-2 py-0.5 font-mono text-[9px] uppercase font-semibold ${
                          selectedCustomer.login_method === "google"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {selectedCustomer.login_method || "password"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>{selectedCustomer.email}</span>
                      {selectedCustomer.company && (
                        <>
                          <span>•</span>
                          <span>{selectedCustomer.company}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCustomer(selectedCustomer)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Contact</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-border/80 px-6 bg-muted/15 overflow-x-auto text-xs font-medium">
                {[
                  { key: "info", label: "Customer Info" },
                  { key: "rfqs", label: `RFQ Inquiries (${customerDetail?.rfqs?.length ?? selectedCustomer.rfq_count ?? 0})` },
                  { key: "orders", label: `Purchases & Orders (${customerDetail?.orders?.length ?? selectedCustomer.orders_count ?? 0})` },
                  { key: "products", label: `Cut-to-Size Requests (${customerDetail?.productRequests?.length ?? 0})` },
                  { key: "materials", label: `Material Requests (${customerDetail?.materialRequests?.length ?? 0})` },
                  { key: "logins", label: `Login History (${customerDetail?.loginHistory?.length ?? 0})` },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setCustomerDetailTab(t.key as any)}
                    className={`px-3.5 py-2.5 border-b-2 font-medium whitespace-nowrap transition-colors ${
                      customerDetailTab === t.key
                        ? "border-primary text-primary font-semibold"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {customerDetailLoading ? (
                  <div className="flex items-center justify-center py-12 text-xs text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2 text-primary" />
                    Loading complete customer record from MySQL...
                  </div>
                ) : (
                  <>
                    {/* TAB 1: CUSTOMER INFO */}
                    {customerDetailTab === "info" && (
                      <div className="space-y-6">
                        {/* 1. Basic Info Grid */}
                        <div className="rounded-sm border border-border bg-background/50 p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                            Customer Profile Information
                          </h4>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Customer ID</span>
                              <span className="font-mono text-[11px] text-foreground select-all">
                                {customerDetail?.customer?.id || selectedCustomer.id}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Full Name</span>
                              <span className="font-semibold text-foreground">
                                {customerDetail?.customer?.full_name || selectedCustomer.full_name}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Work Email</span>
                              <span className="font-mono text-[11px] text-foreground">
                                {customerDetail?.customer?.email || selectedCustomer.email}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Phone / Mobile</span>
                              {customerDetail?.customer?.phone || selectedCustomer.phone ? (
                                <span className="font-mono text-[11px] font-semibold text-primary">
                                  {customerDetail?.customer?.phone || selectedCustomer.phone}
                                </span>
                              ) : (
                                <span className="text-[#EAEAEA] italic">Not Provided</span>
                              )}
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Company / Organization</span>
                              <span className="text-foreground">
                                {customerDetail?.customer?.company || selectedCustomer.company || "Not Provided"}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Account Role</span>
                              <span className="capitalize text-foreground">
                                {customerDetail?.customer?.role || selectedCustomer.role || "Customer"}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Login Method</span>
                              <span className="font-mono text-[11px] text-foreground">
                                {selectedCustomer.login_method === "google" ? "Google OAuth 2.0" : "Password Authentication"}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Registered Date (IST)</span>
                              <span className="font-mono text-[11px] text-foreground">
                                {formatKolkataTime(customerDetail?.customer?.created_at || selectedCustomer.created_at)}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Last Login Activity (IST)</span>
                              <span className="font-mono text-[11px] text-foreground">
                                {formatKolkataTime(customerDetail?.customer?.last_login_at || selectedCustomer.last_login_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Customer Activity KPI Cards */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                            Customer Activity & Commercial Engagement
                          </h4>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            <div className="rounded-sm border border-border bg-card p-3">
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground">RFQs</span>
                              <p className="mt-1 font-mono text-xl font-bold text-primary">
                                {customerDetail?.activityStats?.totalRfqs ?? selectedCustomer.rfq_count ?? 0}
                              </p>
                            </div>

                            <div className="rounded-sm border border-border bg-card p-3">
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Orders</span>
                              <p className="mt-1 font-mono text-xl font-bold text-foreground">
                                {customerDetail?.activityStats?.totalOrders ?? selectedCustomer.orders_count ?? 0}
                              </p>
                            </div>

                            <div className="rounded-sm border border-border bg-card p-3">
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Cut-to-Size</span>
                              <p className="mt-1 font-mono text-xl font-bold text-foreground">
                                {customerDetail?.activityStats?.totalProductRequests ?? 0}
                              </p>
                            </div>

                            <div className="rounded-sm border border-border bg-card p-3">
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Materials</span>
                              <p className="mt-1 font-mono text-xl font-bold text-foreground">
                                {customerDetail?.activityStats?.totalMaterialRequests ?? 0}
                              </p>
                            </div>

                            <div className="rounded-sm border border-border bg-card p-3 col-span-2 sm:col-span-1">
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Last Inquiry</span>
                              <p className="mt-1 font-mono text-[10px] text-foreground truncate">
                                {customerDetail?.activityStats?.lastInquiryDate
                                  ? formatKolkataTime(customerDetail.activityStats.lastInquiryDate)
                                  : "None"}
                              </p>
                            </div>

                            <div className="rounded-sm border border-border bg-card p-3 col-span-2 sm:col-span-1">
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Last Purchase</span>
                              <p className="mt-1 font-mono text-[10px] text-foreground truncate">
                                {customerDetail?.activityStats?.lastPurchaseDate
                                  ? formatKolkataTime(customerDetail.activityStats.lastPurchaseDate)
                                  : "None"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: RFQ INQUIRIES */}
                    {customerDetailTab === "rfqs" && (
                      <div className="space-y-4">
                        {!customerDetail?.rfqs || customerDetail.rfqs.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground border border-border rounded-sm bg-background/50">
                            No RFQ inquiries submitted yet by this customer.
                          </div>
                        ) : (
                          customerDetail.rfqs.map((rfq: any) => (
                            <div key={rfq.id} className="rounded-sm border border-border bg-background/50 p-4 space-y-3">
                              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-border/60 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-primary">
                                    {rfq.reference}
                                  </span>
                                  <span className="rounded-sm bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[9px] uppercase font-semibold text-primary">
                                    {rfq.status}
                                  </span>
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {formatKolkataTime(rfq.created_at)}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">Project</span>
                                  <span className="font-medium text-foreground">{rfq.project_name || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">Incoterm</span>
                                  <span className="font-medium text-foreground">{rfq.incoterm || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">Delivery Port</span>
                                  <span className="font-medium text-foreground">{rfq.delivery_port || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">Target Lead Time</span>
                                  <span className="font-medium text-foreground">{rfq.target_lead_time || "—"}</span>
                                </div>
                              </div>

                              {rfq.message && (
                                <p className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-sm border border-border/40">
                                  <span className="font-semibold text-foreground">Message: </span>
                                  {rfq.message}
                                </p>
                              )}

                              {/* RFQ Line Items */}
                              {rfq.items && rfq.items.length > 0 && (
                                <div className="overflow-x-auto rounded-sm border border-border/60">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="border-b border-border/60 bg-muted/40 font-mono text-[9px] uppercase text-muted-foreground">
                                      <tr>
                                        <th className="px-3 py-1.5">Product</th>
                                        <th className="px-3 py-1.5">Grade</th>
                                        <th className="px-3 py-1.5">Size / Class</th>
                                        <th className="px-3 py-1.5 text-right">Quantity</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                      {rfq.items.map((it: any, idx: number) => (
                                        <tr key={idx}>
                                          <td className="px-3 py-1.5 font-medium text-foreground">
                                            {it.product || it.product_name || "Alloy Component"}
                                          </td>
                                          <td className="px-3 py-1.5 font-mono text-primary">
                                            {it.material || it.grade || "—"}
                                          </td>
                                          <td className="px-3 py-1.5 text-muted-foreground">
                                            {it.size || it.rating || "—"}
                                          </td>
                                          <td className="px-3 py-1.5 text-right font-mono text-foreground">
                                            {it.quantity} {it.unit || "pcs"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* TAB 3: PURCHASES & ORDERS */}
                    {customerDetailTab === "orders" && (
                      <div className="space-y-4">
                        {!customerDetail?.orders || customerDetail.orders.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground border border-border rounded-sm bg-background/50">
                            No recorded purchase orders for this customer yet.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-sm border border-border">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                                <tr>
                                  <th className="px-3 py-2.5">Order Number</th>
                                  <th className="px-3 py-2.5">Title / Items</th>
                                  <th className="px-3 py-2.5">Amount</th>
                                  <th className="px-3 py-2.5">Tracking Number</th>
                                  <th className="px-3 py-2.5">Status</th>
                                  <th className="px-3 py-2.5">Order Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60">
                                {customerDetail.orders.map((ord: any) => (
                                  <tr key={ord.id} className="hover:bg-muted/20">
                                    <td className="px-3 py-2.5 font-mono text-primary font-bold">
                                      {ord.order_number}
                                    </td>
                                    <td className="px-3 py-2.5 font-medium text-foreground">
                                      {ord.title}
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-foreground font-semibold">
                                      {ord.currency} {Number(ord.total_amount).toLocaleString("en-IN")}
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-muted-foreground">
                                      {ord.tracking_number || "—"}
                                    </td>
                                    <td className="px-3 py-2.5">
                                      <span className="rounded-sm bg-primary/10 border border-primary/20 px-1.5 py-0.5 font-mono text-[9px] uppercase font-semibold text-primary">
                                        {ord.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">
                                      {formatKolkataTime(ord.created_at)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: PRODUCT REQUESTS */}
                    {customerDetailTab === "products" && (
                      <div className="space-y-4">
                        {!customerDetail?.productRequests || customerDetail.productRequests.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground border border-border rounded-sm bg-background/50">
                            No cut-to-size product requests on record.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-sm border border-border">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                                <tr>
                                  <th className="px-3 py-2.5">Product Name</th>
                                  <th className="px-3 py-2.5">Material</th>
                                  <th className="px-3 py-2.5">Size</th>
                                  <th className="px-3 py-2.5">Quantity</th>
                                  <th className="px-3 py-2.5">Quotation</th>
                                  <th className="px-3 py-2.5">Status</th>
                                  <th className="px-3 py-2.5">Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60">
                                {customerDetail.productRequests.map((pr: any) => (
                                  <tr key={pr.id}>
                                    <td className="px-3 py-2.5 font-semibold text-foreground">{pr.product_name}</td>
                                    <td className="px-3 py-2.5 font-mono text-primary">{pr.material || "—"}</td>
                                    <td className="px-3 py-2.5 text-muted-foreground">{pr.size || "—"}</td>
                                    <td className="px-3 py-2.5 font-mono text-foreground">{pr.quantity}</td>
                                    <td className="px-3 py-2.5 font-mono text-foreground font-semibold">
                                      {pr.quotation_amount ? `INR ${Number(pr.quotation_amount).toLocaleString("en-IN")}` : "Pending"}
                                    </td>
                                    <td className="px-3 py-2.5">
                                      <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase">
                                        {pr.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">
                                      {formatKolkataTime(pr.created_at)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 5: MATERIAL REQUESTS */}
                    {customerDetailTab === "materials" && (
                      <div className="space-y-4">
                        {!customerDetail?.materialRequests || customerDetail.materialRequests.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground border border-border rounded-sm bg-background/50">
                            No raw material inquiries on record.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-sm border border-border">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                                <tr>
                                  <th className="px-3 py-2.5">Material Name</th>
                                  <th className="px-3 py-2.5">Form</th>
                                  <th className="px-3 py-2.5">Quantity</th>
                                  <th className="px-3 py-2.5">Status</th>
                                  <th className="px-3 py-2.5">Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60">
                                {customerDetail.materialRequests.map((mr: any) => (
                                  <tr key={mr.id}>
                                    <td className="px-3 py-2.5 font-semibold text-foreground">{mr.material_name}</td>
                                    <td className="px-3 py-2.5 text-muted-foreground">{mr.form || "—"}</td>
                                    <td className="px-3 py-2.5 font-mono text-foreground">{mr.quantity}</td>
                                    <td className="px-3 py-2.5">
                                      <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase">
                                        {mr.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">
                                      {formatKolkataTime(mr.created_at)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 6: LOGIN HISTORY */}
                    {customerDetailTab === "logins" && (
                      <div className="space-y-4">
                        {!customerDetail?.loginHistory || customerDetail.loginHistory.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground border border-border rounded-sm bg-background/50">
                            No login audit logs available.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-sm border border-border">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                                <tr>
                                  <th className="px-3 py-2.5">Login Timestamp (Asia/Kolkata)</th>
                                  <th className="px-3 py-2.5">Method</th>
                                  <th className="px-3 py-2.5">IP Address</th>
                                  <th className="px-3 py-2.5">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60">
                                {customerDetail.loginHistory.map((lh: any) => (
                                  <tr key={lh.id}>
                                    <td className="px-3 py-2.5 font-mono text-primary font-medium">
                                      {formatKolkataTime(lh.created_at)}
                                    </td>
                                    <td className="px-3 py-2.5">
                                      <span
                                        className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                                          lh.login_method === "google"
                                            ? "bg-blue-500/10 text-blue-400"
                                            : "bg-primary/10 text-primary"
                                        }`}
                                      >
                                        {lh.login_method}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-muted-foreground">
                                      {lh.ip_address || "127.0.0.1"}
                                    </td>
                                    <td className="px-3 py-2.5">
                                      <span className="rounded-sm bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 font-mono text-[9px] uppercase">
                                        {lh.status || "success"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Customer Contact */}
        {editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-sm border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Edit Customer Contact
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modify profile & status stored in MySQL `users` table
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {editError && (
                <div className="mt-4 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveCustomerEdit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone / Mobile Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Include country code (e.g. +91 for India, +1 for USA/Canada, +44 for UK).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="e.g. Singhania EPC Ltd"
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="active">Active (Access Allowed)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="rounded-sm border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editBusy}
                    className="rounded-sm bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-gold)] hover:opacity-90 disabled:opacity-50"
                  >
                    {editBusy ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
