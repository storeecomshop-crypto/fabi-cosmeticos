import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutDashboard, ShoppingCart, Receipt as ReceiptIcon, Package, Users, UserRound, Percent,
  Search, Plus, Minus, X, Check, Printer, MessageCircle, TrendingUp, TrendingDown,
  AlertTriangle, ChevronRight, ChevronLeft, Menu, Trash2, Pencil, ArrowLeft,
  DollarSign, RotateCcw, Star, ShoppingBag, CreditCard, Banknote, Smartphone,
  CalendarDays, Filter, Info, Sparkles, PackagePlus, History, Wallet, ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";

/* ============================== CONSTANTS ============================== */

const STORAGE_KEY = "fabi-cosmeticos-db-v1";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pdv", label: "PDV", icon: ShoppingCart },
  { id: "vendas", label: "Vendas", icon: ReceiptIcon },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "estoque", label: "Estoque", icon: PackagePlus },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "vendedores", label: "Vendedores", icon: UserRound },
  { id: "comissoes", label: "Comissões", icon: Percent },
];

const PAYMENT_METHODS = [
  { id: "dinheiro", label: "Dinheiro", icon: Banknote },
  { id: "pix", label: "Pix", icon: Smartphone },
  { id: "debito", label: "Cartão de débito", icon: CreditCard },
  { id: "credito", label: "Cartão de crédito", icon: CreditCard },
  { id: "outros", label: "Outros", icon: Wallet },
];

const UNITS = ["un", "ml", "g", "kg", "l", "cx"];

const DEFAULT_CATEGORIES = [
  "Shampoo", "Condicionador", "Máscaras", "Cremes para cabelo",
  "Finalizadores", "Óleos", "Tratamentos", "Tinturas", "Acessórios", "Outros",
];

/* ============================== HELPERS ============================== */

const uid = (p = "id") => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const money = (n) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(n) || 0);

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt)) return "—";
  return dt.toLocaleDateString("pt-BR");
};

const fmtDateTime = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt)) return "—";
  return `${dt.toLocaleDateString("pt-BR")} às ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};

const todayISO = () => new Date().toISOString();

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const endOfDay = (d) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

function dateRangeForPeriod(period, custom) {
  const now = new Date();
  switch (period) {
    case "hoje":
      return [startOfDay(now), endOfDay(now)];
    case "ontem": {
      const y = new Date(now); y.setDate(y.getDate() - 1);
      return [startOfDay(y), endOfDay(y)];
    }
    case "7dias": {
      const s = new Date(now); s.setDate(s.getDate() - 6);
      return [startOfDay(s), endOfDay(now)];
    }
    case "30dias": {
      const s = new Date(now); s.setDate(s.getDate() - 29);
      return [startOfDay(s), endOfDay(now)];
    }
    case "mes": {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      return [startOfDay(s), endOfDay(now)];
    }
    case "mesAnterior": {
      const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const e = new Date(now.getFullYear(), now.getMonth(), 0);
      return [startOfDay(s), endOfDay(e)];
    }
    case "personalizado":
      if (custom?.from && custom?.to) return [startOfDay(custom.from), endOfDay(custom.to)];
      return [startOfDay(now), endOfDay(now)];
    default:
      return [startOfDay(now), endOfDay(now)];
  }
}

function nextSaleNumber(sales) {
  const max = sales.reduce((m, s) => {
    const n = parseInt(String(s.number).replace(/\D/g, ""), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return String(max + 1).padStart(6, "0");
}

function stockStatus(p) {
  if (p.stock <= 0) return { label: "Sem estoque", color: "#C0392B", dot: "🔴" };
  if (p.stock <= p.minStock) return { label: "Estoque baixo", color: "#B8912F", dot: "🟡" };
  return { label: "Estoque normal", color: "#237050", dot: "🟢" };
}

/* ============================== SEED DATA ============================== */

function daysAgoISO(n, hour = 10, min = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

function buildSeed() {
  const products = [
    { id: "p1", name: "Shampoo Hidratante Nutrição Profunda 500ml", sku: "SH-001", barcode: "7891000001015", category: "Shampoo", brand: "Fabi Hair", description: "Shampoo hidratante para cabelos secos.", cost: 18, price: 34.9, stock: 42, minStock: 10, unit: "un", status: "ativo" },
    { id: "p2", name: "Condicionador Reconstrutor Force 500ml", sku: "CD-002", barcode: "7891000001022", category: "Condicionador", brand: "Fabi Hair", description: "Condicionador reconstrutor pós-química.", cost: 19, price: 36.9, stock: 38, minStock: 10, unit: "un", status: "ativo" },
    { id: "p3", name: "Máscara Capilar Intensiva Ouro 300g", sku: "MC-003", barcode: "7891000001039", category: "Máscaras", brand: "Fabi Hair", description: "Máscara de tratamento semanal intensivo.", cost: 24, price: 49.9, stock: 4, minStock: 6, unit: "un", status: "ativo" },
    { id: "p4", name: "Óleo de Argan Puro 60ml", sku: "OL-004", barcode: "7891000001046", category: "Óleos", brand: "Fabi Hair", description: "Óleo finalizador com argan e vitamina E.", cost: 14, price: 29.9, stock: 21, minStock: 8, unit: "un", status: "ativo" },
    { id: "p5", name: "Leave-in Finalizador Anti-Frizz 200ml", sku: "LV-005", barcode: "7891000001053", category: "Finalizadores", brand: "Fabi Hair", description: "Leave-in que controla o frizz por até 72h.", cost: 12, price: 27.5, stock: 30, minStock: 10, unit: "un", status: "ativo" },
    { id: "p6", name: "Creme para Pentear Cachos Definidos 250g", sku: "CP-006", brand: "Fabi Hair", description: "Creme modelador para cachos.", category: "Cremes para cabelo", cost: 11, price: 24.9, stock: 2, minStock: 8, unit: "un", status: "ativo", barcode: "7891000001060" },
    { id: "p7", name: "Ampola de Tratamento Reconstrução 15ml", sku: "AM-007", barcode: "7891000001077", category: "Tratamentos", brand: "Fabi Hair", description: "Ampola concentrada de reparação intensa.", cost: 6, price: 14.9, stock: 60, minStock: 15, unit: "un", status: "ativo" },
    { id: "p8", name: "Coloração Amadeirado 60g", sku: "TN-008", barcode: "7891000001084", category: "Tinturas", brand: "Fabi Hair", description: "Coloração permanente sem amônia.", cost: 15, price: 32.9, stock: 16, minStock: 5, unit: "un", status: "ativo" },
    { id: "p9", name: "Touca de Cetim para Dormir", sku: "AC-009", barcode: "7891000001091", category: "Acessórios", brand: "Fabi Hair", description: "Protege os fios durante o sono.", cost: 9, price: 22.9, stock: 12, minStock: 5, unit: "un", status: "ativo" },
    { id: "p10", name: "Sérum Reparador de Pontas 30ml", sku: "SE-010", barcode: "7891000001107", category: "Tratamentos", brand: "Fabi Hair", description: "Sela as pontas e reduz o ressecamento.", cost: 13, price: 28.9, stock: 0, minStock: 6, unit: "un", status: "ativo" },
  ];

  const sellers = [
    { id: "v1", name: "Maria Santos", phone: "5575991112222", whatsapp: "5575991112222", cpf: "", startDate: "2024-02-01", commissionPercent: 5, status: "ativa" },
    { id: "v2", name: "Joana Ferreira", phone: "5575992223333", whatsapp: "5575992223333", cpf: "", startDate: "2023-11-10", commissionPercent: 7, status: "ativa" },
    { id: "v3", name: "Camila Rocha", phone: "5575993334444", whatsapp: "5575993334444", cpf: "", startDate: "2025-01-20", commissionPercent: 6, status: "ativa" },
  ];

  const customers = [
    { id: "c1", name: "Ana Paula Oliveira", phone: "5575981112222", whatsapp: "5575981112222", cpf: "", birthday: "", address: "", notes: "" },
    { id: "c2", name: "Beatriz Souza", phone: "5575982223333", whatsapp: "5575982223333", cpf: "", birthday: "", address: "", notes: "" },
    { id: "c3", name: "Carla Mendes", phone: "5575983334444", whatsapp: "5575983334444", cpf: "", birthday: "", address: "", notes: "" },
    { id: "c4", name: "Fernanda Lima", phone: "5575984445555", whatsapp: "5575984445555", cpf: "", birthday: "", address: "", notes: "" },
  ];

  const rawSales = [
    { daysAgo: 13, sellerId: "v1", customerId: "c1", items: [["p1", 1], ["p5", 1]], payment: "pix", discountPercent: 0 },
    { daysAgo: 12, sellerId: "v2", customerId: "c2", items: [["p3", 1], ["p4", 1]], payment: "credito", discountPercent: 5 },
    { daysAgo: 10, sellerId: "v3", customerId: null, items: [["p7", 2]], payment: "dinheiro", discountPercent: 0 },
    { daysAgo: 9, sellerId: "v1", customerId: "c3", items: [["p2", 1], ["p6", 1], ["p9", 1]], payment: "debito", discountPercent: 0 },
    { daysAgo: 8, sellerId: "v2", customerId: "c4", items: [["p8", 1]], payment: "pix", discountPercent: 0 },
    { daysAgo: 6, sellerId: "v1", customerId: "c1", items: [["p1", 2], ["p4", 1]], payment: "dinheiro", discountPercent: 0 },
    { daysAgo: 5, sellerId: "v3", customerId: null, items: [["p5", 1], ["p7", 3]], payment: "pix", discountPercent: 10 },
    { daysAgo: 4, sellerId: "v2", customerId: "c2", items: [["p3", 1]], payment: "credito", discountPercent: 0 },
    { daysAgo: 3, sellerId: "v1", customerId: "c4", items: [["p2", 2], ["p9", 1]], payment: "debito", discountPercent: 0 },
    { daysAgo: 2, sellerId: "v3", customerId: "c3", items: [["p6", 1], ["p1", 1]], payment: "dinheiro", discountPercent: 0 },
    { daysAgo: 1, sellerId: "v2", customerId: null, items: [["p8", 1], ["p7", 1]], payment: "pix", discountPercent: 0 },
    { daysAgo: 0, sellerId: "v1", customerId: "c1", items: [["p4", 1], ["p5", 2]], payment: "credito", discountPercent: 0 },
  ];

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const sales = [];
  const stockMovements = [];

  rawSales.forEach((rs, idx) => {
    const seller = sellers.find((s) => s.id === rs.sellerId);
    const items = rs.items.map(([pid, qty]) => {
      const p = productMap[pid];
      return { productId: pid, productName: p.name, sku: p.sku, qty, price: p.price, cost: p.cost };
    });
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const discountValue = rs.discountPercent ? subtotal * (rs.discountPercent / 100) : 0;
    const total = subtotal - discountValue;
    const totalCost = items.reduce((sum, it) => sum + it.cost * it.qty, 0);
    const profit = total - totalCost;
    const commissionAmount = total * (seller.commissionPercent / 100);
    const date = daysAgoISO(rs.daysAgo, 9 + idx, 15);
    const saleId = uid("sale");
    sales.push({
      id: saleId,
      number: String(idx + 1).padStart(6, "0"),
      date,
      customerId: rs.customerId,
      sellerId: rs.sellerId,
      sellerName: seller.name,
      items,
      subtotal,
      discountType: "percent",
      discountValue: rs.discountPercent || 0,
      discountAmount: discountValue,
      total,
      totalCost,
      profit,
      payment: rs.payment,
      cashReceived: rs.payment === "dinheiro" ? Math.ceil(total / 5) * 5 : null,
      status: "concluida",
      commissionPercent: seller.commissionPercent,
      commissionAmount,
      commissionStatus: rs.daysAgo > 8 ? "pago" : "pendente",
      commissionPaidAt: rs.daysAgo > 8 ? daysAgoISO(rs.daysAgo - 1) : null,
      commissionPaidNote: "",
      cancelReason: null,
      cancelledAt: null,
    });
    items.forEach((it) => {
      stockMovements.push({
        id: uid("mov"),
        date,
        productId: it.productId,
        productName: it.productName,
        type: "venda",
        qty: -it.qty,
        previous: null,
        after: null,
        reason: `Venda #${String(idx + 1).padStart(6, "0")}`,
        user: seller.name,
      });
    });
  });

  // one entrada movement per product for demo history
  products.forEach((p) => {
    stockMovements.unshift({
      id: uid("mov"),
      date: daysAgoISO(20),
      productId: p.id,
      productName: p.name,
      type: "entrada",
      qty: p.stock + 10,
      previous: 0,
      after: p.stock + 10,
      reason: "Estoque inicial",
      user: "Fabi",
    });
  });

  return {
    products,
    categories: [...DEFAULT_CATEGORIES],
    customers,
    sellers,
    sales,
    stockMovements,
    settings: {
      companyName: "Fabi Cosméticos",
      phone: "",
      whatsapp: "",
      instagram: "",
      address: "",
      cnpj: "",
      receiptMessage: "Obrigado pela preferência!",
      defaultMinStock: 5,
    },
  };
}

/* ============================== SMALL UI PIECES ============================== */

function IconCircle({ icon: Icon, tone = "forest", size = 18 }) {
  return (
    <span className={`icon-circle icon-circle-${tone}`}>
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}

function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function EmptyState({ icon: Icon = Sparkles, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon size={26} strokeWidth={1.75} /></div>
      <p className="empty-state-title">{title}</p>
      {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
      {actionLabel && (
        <button className="btn-gold" onClick={onAction}>
          <Plus size={16} /> {actionLabel}
        </button>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-mark">FC</div>
      <p>Carregando Fabi Cosméticos…</p>
    </div>
  );
}

function Modal({ open, onClose, title, children, wide, noPadding }) {
  if (!open) return null;
  return (
    <div className="modal-overlay no-print-hide" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`modal-panel ${wide ? "modal-wide" : ""}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className={noPadding ? "" : "modal-body"}>{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ state, onCancel, onConfirm }) {
  if (!state?.open) return null;
  return (
    <div className="modal-overlay no-print-hide">
      <div className="modal-panel modal-confirm">
        <div className="confirm-icon"><AlertTriangle size={22} /></div>
        <h3>{state.title}</h3>
        <p>{state.message}</p>
        {state.extra}
        <div className="confirm-actions">
          <button className="btn-outline" onClick={onCancel}>Cancelar</button>
          <button className={state.danger ? "btn-danger" : "btn-gold"} onClick={onConfirm}>
            {state.confirmLabel || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toasts({ toasts }) {
  return (
    <div className="toast-stack no-print-hide">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" ? <Check size={16} /> : <Info size={16} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children, required, hint, span }) {
  return (
    <div className={`field ${span ? "field-span" : ""}`}>
      <label>{label}{required && <span className="req">*</span>}</label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone = "forest" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}><Icon size={19} /></div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ============================== APP ============================== */

export default function FabiCosmeticosApp() {
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [section, setSection] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false });
  const saveTimer = useRef(null);

  const pushToast = useCallback((message, type = "success") => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const askConfirm = useCallback((cfg) => {
    setConfirm({ open: true, ...cfg });
  }, []);
  const closeConfirm = () => setConfirm({ open: false });
  const runConfirm = () => { confirm.onConfirm?.(); closeConfirm(); };

  // ---- load ----
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res?.value) {
          setDb(JSON.parse(res.value));
        } else {
          const seed = buildSeed();
          setDb(seed);
          await window.storage.set(STORAGE_KEY, JSON.stringify(seed), false);
        }
      } catch (e) {
        const seed = buildSeed();
        setDb(seed);
        try { await window.storage.set(STORAGE_KEY, JSON.stringify(seed), false); } catch (_) {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- persist (debounced) ----
  useEffect(() => {
    if (!db) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(db), false); }
      catch (e) { pushToast("Não foi possível salvar os dados agora.", "error"); }
    }, 350);
    return () => clearTimeout(saveTimer.current);
  }, [db, pushToast]);

  const updateDb = useCallback((updater) => {
    setDb((prev) => (typeof updater === "function" ? updater(prev) : { ...prev, ...updater }));
  }, []);

  if (loading || !db) return <LoadingScreen />;

  const activeItem = NAV_ITEMS.find((n) => n.id === section);

  return (
    <div className="app-root">
      <GlobalStyle />
      <Toasts toasts={toasts} />
      <ConfirmDialog state={confirm} onCancel={closeConfirm} onConfirm={runConfirm} />

      {/* Sidebar desktop */}
      <aside className="sidebar no-print-hide">
        <div className="brand">
          <div className="brand-mark">FC</div>
          <div>
            <p className="brand-name">Fabi Cosméticos</p>
            <p className="brand-sub">Gestão inteligente</p>
          </div>
        </div>
        <nav className="nav-list">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${section === item.id ? "nav-link-active" : ""}`}
              onClick={() => setSection(item.id)}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {section === item.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>Feito com carinho para a</p>
          <p className="sidebar-footer-brand">Fabi Cosméticos ✦</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-topbar no-print-hide">
        <button className="icon-btn" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
        <div className="mobile-topbar-title">
          {activeItem && <activeItem.icon size={16} />}
          <span>{activeItem?.label}</span>
        </div>
        <div className="brand-mark brand-mark-sm">FC</div>
      </header>

      {mobileNavOpen && (
        <div className="mobile-nav-overlay no-print-hide" onMouseDown={(e) => { if (e.target === e.currentTarget) setMobileNavOpen(false); }}>
          <div className="mobile-nav-panel">
            <div className="brand" style={{ marginBottom: 8 }}>
              <div className="brand-mark">FC</div>
              <div>
                <p className="brand-name">Fabi Cosméticos</p>
                <p className="brand-sub">Gestão inteligente</p>
              </div>
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${section === item.id ? "nav-link-active" : ""}`}
                onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="main-area">
        {section === "dashboard" && <Dashboard db={db} setSection={setSection} />}
        {section === "pdv" && <Pdv db={db} updateDb={updateDb} pushToast={pushToast} />}
        {section === "vendas" && <Vendas db={db} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "produtos" && <Produtos db={db} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "estoque" && <Estoque db={db} updateDb={updateDb} pushToast={pushToast} />}
        {section === "clientes" && <Clientes db={db} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "vendedores" && <Vendedores db={db} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "comissoes" && <Comissoes db={db} updateDb={updateDb} pushToast={pushToast} />}
      </main>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

const PERIODS = [
  { id: "hoje", label: "Hoje" },
  { id: "ontem", label: "Ontem" },
  { id: "7dias", label: "7 dias" },
  { id: "30dias", label: "30 dias" },
  { id: "mes", label: "Este mês" },
  { id: "mesAnterior", label: "Mês anterior" },
];

function Dashboard({ db, setSection }) {
  const [period, setPeriod] = useState("7dias");
  const [metric, setMetric] = useState("faturamento");

  const [rStart, rEnd] = dateRangeForPeriod(period);
  const activeSales = db.sales.filter((s) => s.status !== "cancelada");

  const inRange = activeSales.filter((s) => {
    const d = new Date(s.date);
    return d >= rStart && d <= rEnd;
  });

  const [tStart, tEnd] = dateRangeForPeriod("hoje");
  const todaySales = activeSales.filter((s) => { const d = new Date(s.date); return d >= tStart && d <= tEnd; });

  const faturamento = inRange.reduce((sum, s) => sum + s.total, 0);
  const lucro = inRange.reduce((sum, s) => sum + s.profit, 0);
  const unidadesVendidas = inRange.reduce((sum, s) => sum + s.items.reduce((a, it) => a + it.qty, 0), 0);
  const comissaoGerada = inRange.reduce((sum, s) => sum + s.commissionAmount, 0);
  const lowStock = db.products.filter((p) => p.status === "ativo" && p.stock <= p.minStock);

  const chartData = useMemo(() => {
    const map = {};
    inRange.forEach((s) => {
      const key = new Date(s.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      if (!map[key]) map[key] = { name: key, faturamento: 0, quantidade: 0, lucro: 0, sortKey: new Date(s.date).setHours(0, 0, 0, 0) };
      map[key].faturamento += s.total;
      map[key].quantidade += s.items.reduce((a, it) => a + it.qty, 0);
      map[key].lucro += s.profit;
    });
    return Object.values(map).sort((a, b) => a.sortKey - b.sortKey);
  }, [inRange]);

  const topProducts = useMemo(() => {
    const map = {};
    inRange.forEach((s) => {
      s.items.forEach((it) => {
        if (!map[it.productId]) map[it.productId] = { name: it.productName, qty: 0, revenue: 0, profit: 0 };
        map[it.productId].qty += it.qty;
        map[it.productId].revenue += it.price * it.qty;
        map[it.productId].profit += (it.price - it.cost) * it.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [inRange]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Olá, Fabi! 👋</p>
          <h1 className="page-title">Visão geral da loja</h1>
        </div>
        <div className="period-pills">
          {PERIODS.map((p) => (
            <button key={p.id} className={`pill ${period === p.id ? "pill-active" : ""}`} onClick={() => setPeriod(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={ShoppingBag} tone="forest" label="Vendas de hoje" value={`${todaySales.length} venda${todaySales.length === 1 ? "" : "s"}`} sub={money(todaySales.reduce((s, x) => s + x.total, 0))} />
        <StatCard icon={DollarSign} tone="gold" label="Faturamento" value={money(faturamento)} sub={`Período: ${PERIODS.find((p) => p.id === period)?.label}`} />
        <StatCard icon={TrendingUp} tone="forest" label="Lucro estimado" value={money(lucro)} sub={faturamento ? `${((lucro / faturamento) * 100).toFixed(1)}% de margem` : "—"} />
        <StatCard icon={Package} tone="gold" label="Produtos vendidos" value={`${unidadesVendidas} un.`} sub="unidades no período" />
        <StatCard icon={AlertTriangle} tone={lowStock.length ? "warn" : "forest"} label="Estoque baixo" value={`${lowStock.length} produto${lowStock.length === 1 ? "" : "s"}`} sub="abaixo do mínimo" />
        <StatCard icon={Percent} tone="gold" label="Comissões" value={money(comissaoGerada)} sub="geradas no período" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Vendas no período</h3>
            <div className="metric-toggle">
              {[["faturamento", "Faturamento"], ["quantidade", "Quantidade"], ["lucro", "Lucro"]].map(([id, label]) => (
                <button key={id} className={`chip ${metric === id ? "chip-active" : ""}`} onClick={() => setMetric(id)}>{label}</button>
              ))}
            </div>
          </div>
          {chartData.length === 0 ? (
            <EmptyState icon={TrendingUp} title="Sem vendas neste período" subtitle="Assim que houver vendas, o gráfico aparece aqui." />
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#E8E2D2" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B6A5E" }} axisLine={{ stroke: "#E8E2D2" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B6A5E" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => (metric === "quantidade" ? v : `R$${v}`)} width={metric === "quantidade" ? 32 : 56} />
                  <Tooltip formatter={(v) => (metric === "quantidade" ? `${v} un.` : money(v))} contentStyle={{ borderRadius: 10, border: "1px solid #E8E2D2", fontSize: 13 }} />
                  <Bar dataKey={metric} radius={[6, 6, 0, 0]} fill={metric === "faturamento" ? "#0F3D2E" : metric === "lucro" ? "#237050" : "#C9A227"} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header"><h3>Estoque baixo</h3></div>
          {lowStock.length === 0 ? (
            <EmptyState icon={Check} title="Tudo em dia" subtitle="Nenhum produto abaixo do estoque mínimo." />
          ) : (
            <div className="list-simple">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="list-simple-row">
                  <div>
                    <p className="list-simple-title">{p.name}</p>
                    <p className="list-simple-sub">Estoque: {p.stock} · Mínimo: {p.minStock}</p>
                  </div>
                  <button className="btn-outline btn-sm" onClick={() => setSection("estoque")}>Repor estoque</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Produtos mais vendidos</h3></div>
        {topProducts.length === 0 ? (
          <EmptyState icon={Star} title="Ainda sem dados" subtitle="Os produtos mais vendidos aparecerão aqui." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Produto</th><th>Qtd. vendida</th><th>Faturamento</th><th>Lucro</th></tr></thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.qty} un.</td>
                    <td>{money(p.revenue)}</td>
                    <td className="text-forest-strong">{money(p.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== PDV ============================== */

function Pdv({ db, updateDb, pushToast }) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // {productId, qty}
  const [sellerId, setSellerId] = useState(db.sellers.find((s) => s.status === "ativa")?.id || "");
  const [customerId, setCustomerId] = useState("");
  const [payment, setPayment] = useState("dinheiro");
  const [cashReceived, setCashReceived] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [quickCustomerOpen, setQuickCustomerOpen] = useState(false);
  const [quickCustomer, setQuickCustomer] = useState({ name: "", phone: "" });
  const [successSale, setSuccessSale] = useState(null);
  const [whatsappSale, setWhatsappSale] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState("");

  const activeProducts = db.products.filter((p) => p.status === "ativo");
  const filtered = activeProducts.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.barcode || "").includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const cartLines = cart.map((c) => {
    const product = db.products.find((p) => p.id === c.productId);
    return { ...c, product };
  }).filter((l) => l.product);

  const subtotal = cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const discountAmount = discountType === "percent" ? subtotal * ((Number(discountValue) || 0) / 100) : Math.min(Number(discountValue) || 0, subtotal);
  const total = Math.max(subtotal - discountAmount, 0);
  const troco = payment === "dinheiro" ? Math.max((Number(cashReceived) || 0) - total, 0) : 0;

  const addToCart = (product) => {
    const inCart = cart.find((c) => c.productId === product.id)?.qty || 0;
    if (inCart + 1 > product.stock) { pushToast(`Estoque insuficiente para ${product.name}.`, "error"); return; }
    setCart((prev) => {
      const found = prev.find((c) => c.productId === product.id);
      if (found) return prev.map((c) => c.productId === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { productId: product.id, qty: 1 }];
    });
  };

  const changeQty = (productId, delta) => {
    setCart((prev) => prev.map((c) => {
      if (c.productId !== productId) return c;
      const product = db.products.find((p) => p.id === productId);
      const next = c.qty + delta;
      if (next > product.stock) { pushToast("Quantidade acima do estoque disponível.", "error"); return c; }
      return { ...c, qty: next };
    }).filter((c) => c.qty > 0));
  };

  const removeItem = (productId) => setCart((prev) => prev.filter((c) => c.productId !== productId));

  const resetSale = () => {
    setCart([]); setCustomerId(""); setPayment("dinheiro"); setCashReceived("");
    setDiscountType("percent"); setDiscountValue(0);
  };

  const addQuickCustomer = () => {
    if (!quickCustomer.name.trim()) { pushToast("Informe o nome do cliente.", "error"); return; }
    const newCustomer = { id: uid("cust"), name: quickCustomer.name.trim(), phone: quickCustomer.phone.trim(), whatsapp: quickCustomer.phone.trim(), cpf: "", birthday: "", address: "", notes: "" };
    updateDb((prev) => ({ ...prev, customers: [...prev.customers, newCustomer] }));
    setCustomerId(newCustomer.id);
    setQuickCustomer({ name: "", phone: "" });
    setQuickCustomerOpen(false);
    pushToast("Cliente cadastrado.");
  };

  const finalizeSale = () => {
    if (cartLines.length === 0) { pushToast("Adicione ao menos um produto ao carrinho.", "error"); return; }
    if (!sellerId) { pushToast("Selecione a vendedora responsável.", "error"); return; }
    if (payment === "dinheiro" && (Number(cashReceived) || 0) < total) { pushToast("Valor recebido é menor que o total da venda.", "error"); return; }
    for (const l of cartLines) {
      if (l.qty > l.product.stock) { pushToast(`Estoque insuficiente: ${l.product.name}. Disponível: ${l.product.stock}, solicitado: ${l.qty}.`, "error"); return; }
    }

    const seller = db.sellers.find((s) => s.id === sellerId);
    const totalCost = cartLines.reduce((sum, l) => sum + l.product.cost * l.qty, 0);
    const profit = total - totalCost;
    const number = nextSaleNumber(db.sales);
    const date = todayISO();
    const saleId = uid("sale");

    const items = cartLines.map((l) => ({
      productId: l.product.id, productName: l.product.name, sku: l.product.sku, qty: l.qty, price: l.product.price, cost: l.product.cost,
    }));

    const newSale = {
      id: saleId, number, date, customerId: customerId || null, sellerId, sellerName: seller.name,
      items, subtotal, discountType, discountValue: Number(discountValue) || 0, discountAmount, total, totalCost, profit,
      payment, cashReceived: payment === "dinheiro" ? Number(cashReceived) || 0 : null, status: "concluida",
      commissionPercent: seller.commissionPercent, commissionAmount: total * (seller.commissionPercent / 100),
      commissionStatus: "pendente", commissionPaidAt: null, commissionPaidNote: "", cancelReason: null, cancelledAt: null,
    };

    const movements = items.map((it) => {
      const p = db.products.find((pp) => pp.id === it.productId);
      return { id: uid("mov"), date, productId: it.productId, productName: it.productName, type: "venda", qty: -it.qty, previous: p.stock, after: p.stock - it.qty, reason: `Venda #${number}`, user: seller.name };
    });

    updateDb((prev) => ({
      ...prev,
      sales: [newSale, ...prev.sales],
      products: prev.products.map((p) => {
        const line = cartLines.find((l) => l.product.id === p.id);
        return line ? { ...p, stock: p.stock - line.qty } : p;
      }),
      stockMovements: [...movements, ...prev.stockMovements],
    }));

    pushToast(`Venda #${number} realizada com sucesso!`);
    setSuccessSale(newSale);
    resetSale();
  };

  const customerOf = (id) => db.customers.find((c) => c.id === id);

  return (
    <div className="page pdv-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Ponto de venda</p>
          <h1 className="page-title">Nova venda</h1>
        </div>
      </div>

      <div className="pdv-grid">
        <div className="pdv-left card">
          <div className="search-box">
            <Search size={17} />
            <input placeholder="Buscar por nome, código, código de barras ou categoria…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="Nenhum produto encontrado" subtitle="Tente buscar por outro termo." />
          ) : (
            <div className="product-grid">
              {filtered.map((p) => {
                const st = stockStatus(p);
                const disabled = p.stock <= 0;
                return (
                  <button key={p.id} className="product-card" disabled={disabled} onClick={() => addToCart(p)}>
                    <div className="product-card-top">
                      <span className="product-card-cat">{p.category}</span>
                      <span title={st.label}>{st.dot}</span>
                    </div>
                    <p className="product-card-name">{p.name}</p>
                    <div className="product-card-bottom">
                      <span className="product-card-price">{money(p.price)}</span>
                      <span className="product-card-stock">{disabled ? "Sem estoque" : `${p.stock} un.`}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pdv-right card">
          <h3 className="pdv-cart-title"><ShoppingCart size={17} /> Carrinho</h3>
          {cartLines.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="Carrinho vazio" subtitle="Clique em um produto para adicionar." />
          ) : (
            <div className="cart-list">
              {cartLines.map((l) => (
                <div key={l.productId} className="cart-row">
                  <div className="cart-row-info">
                    <p className="cart-row-name">{l.product.name}</p>
                    <p className="cart-row-price">{money(l.product.price)} / un.</p>
                  </div>
                  <div className="cart-row-qty">
                    <button onClick={() => changeQty(l.productId, -1)}><Minus size={13} /></button>
                    <span>{l.qty}</span>
                    <button onClick={() => changeQty(l.productId, 1)}><Plus size={13} /></button>
                  </div>
                  <p className="cart-row-subtotal">{money(l.product.price * l.qty)}</p>
                  <button className="icon-btn" onClick={() => removeItem(l.productId)}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="pdv-divider" />

          <Field label="Desconto">
            <div className="discount-row">
              <div className="segmented">
                <button className={discountType === "percent" ? "seg-active" : ""} onClick={() => setDiscountType("percent")}>%</button>
                <button className={discountType === "fixed" ? "seg-active" : ""} onClick={() => setDiscountType("fixed")}>R$</button>
              </div>
              <input type="number" min="0" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="0" />
            </div>
          </Field>

          <div className="totals-block">
            <div className="totals-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="totals-row"><span>Desconto</span><span>− {money(discountAmount)}</span></div>
            <div className="totals-row totals-total"><span>Total</span><span>{money(total)}</span></div>
          </div>

          <Field label="Vendedora responsável" required>
            <select value={sellerId} onChange={(e) => setSellerId(e.target.value)}>
              <option value="">Selecione…</option>
              {db.sellers.filter((s) => s.status === "ativa").map((s) => (
                <option key={s.id} value={s.id}>{s.name} · {s.commissionPercent}%</option>
              ))}
            </select>
          </Field>

          <Field label="Cliente">
            <div className="inline-select-row">
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">Cliente não identificado</option>
                {db.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button className="btn-outline btn-sm" onClick={() => setQuickCustomerOpen(true)}><Plus size={14} /> Novo</button>
            </div>
          </Field>

          <Field label="Forma de pagamento">
            <div className="payment-grid">
              {PAYMENT_METHODS.map((m) => (
                <button key={m.id} className={`payment-option ${payment === m.id ? "payment-option-active" : ""}`} onClick={() => setPayment(m.id)}>
                  <m.icon size={16} /> <span>{m.label}</span>
                </button>
              ))}
            </div>
          </Field>

          {payment === "dinheiro" && (
            <div className="cash-row">
              <Field label="Valor recebido">
                <input type="number" min="0" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} placeholder="0,00" />
              </Field>
              <Field label="Troco">
                <div className="troco-display">{money(troco)}</div>
              </Field>
            </div>
          )}

          <button className="btn-gold btn-block btn-lg" onClick={finalizeSale}>
            <Check size={18} /> Finalizar venda
          </button>
        </div>
      </div>

      <Modal open={quickCustomerOpen} onClose={() => setQuickCustomerOpen(false)} title="Novo cliente rápido">
        <Field label="Nome" required><input value={quickCustomer.name} onChange={(e) => setQuickCustomer((q) => ({ ...q, name: e.target.value }))} /></Field>
        <Field label="Telefone / WhatsApp"><input value={quickCustomer.phone} onChange={(e) => setQuickCustomer((q) => ({ ...q, phone: e.target.value }))} placeholder="55 75 90000-0000" /></Field>
        <button className="btn-gold btn-block" onClick={addQuickCustomer}>Cadastrar cliente</button>
      </Modal>

      <Modal open={!!successSale} onClose={() => setSuccessSale(null)} title="Venda realizada com sucesso!">
        {successSale && (
          <div>
            <div className="success-banner"><Check size={20} /> Venda #{successSale.number} concluída</div>
            <div className="success-grid">
              <div><p className="success-label">Total</p><p className="success-value">{money(successSale.total)}</p></div>
              <div><p className="success-label">Vendedora</p><p className="success-value">{successSale.sellerName}</p></div>
              <div><p className="success-label">Pagamento</p><p className="success-value">{PAYMENT_METHODS.find((m) => m.id === successSale.payment)?.label}</p></div>
            </div>
            <Receipt sale={successSale} customer={customerOf(successSale.customerId)} settings={db.settings} />
            <div className="success-actions">
              <button className="btn-outline" onClick={() => window.print()}><Printer size={16} /> Imprimir</button>
              <button className="btn-outline" onClick={() => { setWhatsappSale(successSale); setWhatsappPhone(customerOf(successSale.customerId)?.whatsapp || ""); }}>
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button className="btn-gold" onClick={() => setSuccessSale(null)}>Nova venda</button>
            </div>
          </div>
        )}
      </Modal>

      <WhatsappModal sale={whatsappSale} settings={db.settings} phone={whatsappPhone} setPhone={setWhatsappPhone} onClose={() => setWhatsappSale(null)} />
    </div>
  );
}

/* ============================== RECEIPT / WHATSAPP ============================== */

function Receipt({ sale, customer, settings }) {
  if (!sale) return null;
  return (
    <div className="receipt print-area">
      <p className="receipt-brand">{settings?.companyName || "Fabi Cosméticos"}</p>
      <p className="receipt-sub">Comprovante de venda</p>
      <div className="receipt-line" />
      <div className="receipt-meta">
        <span>Venda</span><span>#{sale.number}</span>
      </div>
      <div className="receipt-meta"><span>Data</span><span>{fmtDateTime(sale.date)}</span></div>
      <div className="receipt-meta"><span>Vendedora</span><span>{sale.sellerName}</span></div>
      <div className="receipt-meta"><span>Cliente</span><span>{customer?.name || "Não identificado"}</span></div>
      <div className="receipt-line" />
      <table className="receipt-table">
        <thead><tr><th>Produto</th><th>Qtd</th><th>Valor</th></tr></thead>
        <tbody>
          {sale.items.map((it, i) => (
            <tr key={i}><td>{it.productName}</td><td>{it.qty}</td><td>{money(it.price * it.qty)}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="receipt-line" />
      <div className="receipt-meta"><span>Subtotal</span><span>{money(sale.subtotal)}</span></div>
      <div className="receipt-meta"><span>Desconto</span><span>− {money(sale.discountAmount)}</span></div>
      <div className="receipt-meta receipt-total"><span>Total</span><span>{money(sale.total)}</span></div>
      <div className="receipt-meta"><span>Pagamento</span><span>{PAYMENT_METHODS.find((m) => m.id === sale.payment)?.label}</span></div>
      {sale.payment === "dinheiro" && sale.cashReceived != null && (
        <div className="receipt-meta"><span>Troco</span><span>{money(Math.max(sale.cashReceived - sale.total, 0))}</span></div>
      )}
      <div className="receipt-line" />
      <p className="receipt-thanks">{settings?.receiptMessage || "Obrigado pela preferência!"}</p>
    </div>
  );
}

function buildWhatsappMessage(sale, settings) {
  const lines = [];
  lines.push(`*${settings?.companyName || "Fabi Cosméticos"}*`);
  lines.push("Comprovante de compra");
  lines.push("");
  lines.push(`Venda: #${sale.number}`);
  lines.push(`Data: ${fmtDateTime(sale.date)}`);
  lines.push("");
  sale.items.forEach((it) => lines.push(`• ${it.productName} x${it.qty} — ${money(it.price * it.qty)}`));
  lines.push("");
  lines.push(`Total: ${money(sale.total)}`);
  lines.push(`Pagamento: ${PAYMENT_METHODS.find((m) => m.id === sale.payment)?.label}`);
  lines.push("");
  lines.push(settings?.receiptMessage || "Obrigado pela preferência!");
  return lines.join("\n");
}

function WhatsappModal({ sale, settings, phone, setPhone, onClose }) {
  if (!sale) return null;
  const send = () => {
    const digits = (phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(buildWhatsappMessage(sale, settings));
    const url = digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
    onClose();
  };
  return (
    <Modal open={!!sale} onClose={onClose} title="Enviar comprovante pelo WhatsApp">
      <Field label="Número do WhatsApp" hint="Formato: código do país + DDD + número, ex: 5575990001111">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5575990001111" />
      </Field>
      <button className="btn-gold btn-block" onClick={send}><MessageCircle size={16} /> Abrir WhatsApp</button>
    </Modal>
  );
}

/* ============================== VENDAS ============================== */

function Vendas({ db, updateDb, pushToast, askConfirm }) {
  const [detail, setDetail] = useState(null);
  const [filters, setFilters] = useState({ from: "", to: "", sellerId: "", customerId: "", payment: "", status: "" });
  const [whatsappSale, setWhatsappSale] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const filtered = db.sales.filter((s) => {
    if (filters.from && new Date(s.date) < startOfDay(filters.from)) return false;
    if (filters.to && new Date(s.date) > endOfDay(filters.to)) return false;
    if (filters.sellerId && s.sellerId !== filters.sellerId) return false;
    if (filters.customerId && s.customerId !== filters.customerId) return false;
    if (filters.payment && s.payment !== filters.payment) return false;
    if (filters.status && s.status !== filters.status) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const customerOf = (id) => db.customers.find((c) => c.id === id);

  const cancelSale = (sale) => {
    askConfirm({
      title: "Estornar venda", danger: true, confirmLabel: "Estornar venda",
      message: `A venda #${sale.number} será cancelada, os produtos voltarão ao estoque e a comissão será revertida.`,
      extra: (
        <Field label="Motivo do cancelamento" required>
          <textarea rows={2} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Descreva o motivo…" />
        </Field>
      ),
      onConfirm: () => {
        const movements = sale.items.map((it) => {
          const p = db.products.find((pp) => pp.id === it.productId);
          return { id: uid("mov"), date: todayISO(), productId: it.productId, productName: it.productName, type: "devolução", qty: it.qty, previous: p?.stock ?? null, after: (p?.stock ?? 0) + it.qty, reason: `Estorno da venda #${sale.number}`, user: "Fabi" };
        });
        updateDb((prev) => ({
          ...prev,
          sales: prev.sales.map((s) => s.id === sale.id ? { ...s, status: "cancelada", cancelReason: cancelReason || "Não informado", cancelledAt: todayISO(), commissionStatus: "cancelada" } : s),
          products: prev.products.map((p) => {
            const it = sale.items.find((i) => i.productId === p.id);
            return it ? { ...p, stock: p.stock + it.qty } : p;
          }),
          stockMovements: [...movements, ...prev.stockMovements],
        }));
        setCancelReason("");
        setDetail(null);
        pushToast(`Venda #${sale.number} estornada.`);
      },
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Histórico</p><h1 className="page-title">Vendas</h1></div>
      </div>

      <div className="card filter-bar">
        <div className="filter-grid">
          <Field label="De"><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></Field>
          <Field label="Até"><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></Field>
          <Field label="Vendedora">
            <select value={filters.sellerId} onChange={(e) => setFilters((f) => ({ ...f, sellerId: e.target.value }))}>
              <option value="">Todas</option>
              {db.sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Cliente">
            <select value={filters.customerId} onChange={(e) => setFilters((f) => ({ ...f, customerId: e.target.value }))}>
              <option value="">Todos</option>
              {db.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Pagamento">
            <select value={filters.payment} onChange={(e) => setFilters((f) => ({ ...f, payment: e.target.value }))}>
              <option value="">Todas</option>
              {PAYMENT_METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              <option value="">Todos</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState icon={ReceiptIcon} title="Nenhuma venda encontrada" subtitle="Ajuste os filtros ou registre uma nova venda no PDV." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Nº</th><th>Data</th><th>Cliente</th><th>Vendedora</th><th>Valor</th><th>Pagamento</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="table-row-click" onClick={() => setDetail(s)}>
                    <td>#{s.number}</td>
                    <td>{fmtDate(s.date)}</td>
                    <td>{customerOf(s.customerId)?.name || "Não identificado"}</td>
                    <td>{s.sellerName}</td>
                    <td>{money(s.total)}</td>
                    <td>{PAYMENT_METHODS.find((m) => m.id === s.payment)?.label}</td>
                    <td><Badge tone={s.status === "cancelada" ? "danger" : "success"}>{s.status === "cancelada" ? "Cancelada" : "Concluída"}</Badge></td>
                    <td><ChevronRight size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Venda #${detail.number}` : ""} wide>
        {detail && (
          <div>
            <div className="detail-grid">
              <div><p className="success-label">Data</p><p className="success-value">{fmtDateTime(detail.date)}</p></div>
              <div><p className="success-label">Cliente</p><p className="success-value">{customerOf(detail.customerId)?.name || "Não identificado"}</p></div>
              <div><p className="success-label">Vendedora</p><p className="success-value">{detail.sellerName}</p></div>
              <div><p className="success-label">Status</p><p className="success-value"><Badge tone={detail.status === "cancelada" ? "danger" : "success"}>{detail.status === "cancelada" ? "Cancelada" : "Concluída"}</Badge></p></div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {detail.items.map((it, i) => <tr key={i}><td>{it.productName}</td><td>{it.qty}</td><td>{money(it.price)}</td><td>{money(it.price * it.qty)}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="totals-block" style={{ marginTop: 10 }}>
              <div className="totals-row"><span>Subtotal</span><span>{money(detail.subtotal)}</span></div>
              <div className="totals-row"><span>Desconto</span><span>− {money(detail.discountAmount)}</span></div>
              <div className="totals-row totals-total"><span>Total</span><span>{money(detail.total)}</span></div>
              <div className="totals-row"><span>Custo</span><span>{money(detail.totalCost)}</span></div>
              <div className="totals-row"><span>Lucro</span><span className="text-forest-strong">{money(detail.profit)}</span></div>
            </div>
            {detail.status === "cancelada" && (
              <p className="cancel-note"><AlertTriangle size={14} /> Cancelada em {fmtDateTime(detail.cancelledAt)} — {detail.cancelReason}</p>
            )}
            <div className="success-actions">
              <button className="btn-outline" onClick={() => window.print()}><Printer size={16} /> Imprimir</button>
              <button className="btn-outline" onClick={() => { setWhatsappSale(detail); setWhatsappPhone(customerOf(detail.customerId)?.whatsapp || ""); }}><MessageCircle size={16} /> WhatsApp</button>
              {detail.status !== "cancelada" && (
                <button className="btn-danger" onClick={() => cancelSale(detail)}><RotateCcw size={16} /> Estornar venda</button>
              )}
            </div>
            <div style={{ display: "none" }}><Receipt sale={detail} customer={customerOf(detail.customerId)} settings={db.settings} /></div>
            <Receipt sale={detail} customer={customerOf(detail.customerId)} settings={db.settings} />
          </div>
        )}
      </Modal>

      <WhatsappModal sale={whatsappSale} settings={db.settings} phone={whatsappPhone} setPhone={setWhatsappPhone} onClose={() => setWhatsappSale(null)} />
    </div>
  );
}

/* ============================== PRODUTOS ============================== */

const emptyProduct = { name: "", sku: "", barcode: "", category: "", brand: "", description: "", cost: "", price: "", stock: "", minStock: "5", unit: "un", status: "ativo" };

function Produtos({ db, updateDb, pushToast, askConfirm }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [newCategory, setNewCategory] = useState("");

  const filtered = db.products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchesCat = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openNew = () => { setForm(emptyProduct); setEditingId(null); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, cost: String(p.cost), price: String(p.price), stock: String(p.stock), minStock: String(p.minStock) }); setEditingId(p.id); setModalOpen(true); };

  const cost = Number(form.cost) || 0;
  const price = Number(form.price) || 0;
  const profitUnit = price - cost;
  const marginPct = cost > 0 ? (profitUnit / cost) * 100 : 0;

  const save = () => {
    if (!form.name.trim() || !form.sku.trim() || !form.category || !form.price) { pushToast("Preencha nome, código, categoria e preço de venda.", "error"); return; }
    let categories = db.categories;
    let category = form.category;
    if (category === "__new__") {
      if (!newCategory.trim()) { pushToast("Informe o nome da nova categoria.", "error"); return; }
      category = newCategory.trim();
      if (!categories.includes(category)) categories = [...categories, category];
    }
    const payload = { ...form, category, cost, price, stock: Number(form.stock) || 0, minStock: Number(form.minStock) || 0 };
    updateDb((prev) => ({
      ...prev,
      categories,
      products: editingId
        ? prev.products.map((p) => p.id === editingId ? { ...p, ...payload } : p)
        : [{ ...payload, id: uid("prod") }, ...prev.products],
    }));
    pushToast(editingId ? "Produto atualizado." : "Produto cadastrado.");
    setModalOpen(false);
    setNewCategory("");
  };

  const remove = (p) => {
    askConfirm({
      title: "Excluir produto", danger: true, confirmLabel: "Excluir",
      message: `Tem certeza que deseja excluir "${p.name}"? Essa ação não pode ser desfeita.`,
      onConfirm: () => { updateDb((prev) => ({ ...prev, products: prev.products.filter((x) => x.id !== p.id) })); pushToast("Produto excluído."); },
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Catálogo</p><h1 className="page-title">Produtos</h1></div>
        <button className="btn-gold" onClick={openNew}><Plus size={16} /> Novo produto</button>
      </div>

      <div className="card filter-bar">
        <div className="search-box"><Search size={16} /><input placeholder="Buscar por nome ou código…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">Todas as categorias</option>
          {db.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="Você ainda não possui produtos cadastrados." actionLabel="Cadastrar primeiro produto" onAction={openNew} />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Produto</th><th>Categoria</th><th>Custo</th><th>Venda</th><th>Margem</th><th>Estoque</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((p) => {
                  const margin = p.cost > 0 ? (((p.price - p.cost) / p.cost) * 100).toFixed(0) : "—";
                  const st = stockStatus(p);
                  return (
                    <tr key={p.id}>
                      <td><p className="cell-strong">{p.name}</p><p className="cell-sub">{p.sku}</p></td>
                      <td>{p.category}</td>
                      <td>{money(p.cost)}</td>
                      <td>{money(p.price)}</td>
                      <td>{margin === "—" ? margin : `${margin}%`}</td>
                      <td>{st.dot} {p.stock}</td>
                      <td><Badge tone={p.status === "ativo" ? "success" : "neutral"}>{p.status === "ativo" ? "Ativo" : "Inativo"}</Badge></td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => openEdit(p)}><Pencil size={15} /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => remove(p)}><Trash2 size={15} /></button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar produto" : "Novo produto"} wide>
        <div className="form-grid">
          <Field label="Nome do produto" required span><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Código / SKU" required><input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} /></Field>
          <Field label="Código de barras"><input value={form.barcode} onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))} /></Field>
          <Field label="Categoria" required>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              <option value="">Selecione…</option>
              {db.categories.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="__new__">+ Nova categoria…</option>
            </select>
            {form.category === "__new__" && <input style={{ marginTop: 8 }} placeholder="Nome da nova categoria" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />}
          </Field>
          <Field label="Marca"><input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} /></Field>
          <Field label="Unidade de medida">
            <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </Field>
          <Field label="Descrição" span><textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
          <Field label="Preço de custo" required><input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} /></Field>
          <Field label="Preço de venda" required><input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></Field>
          <Field label="Estoque atual"><input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} /></Field>
          <Field label="Estoque mínimo"><input type="number" min="0" value={form.minStock} onChange={(e) => setForm((f) => ({ ...f, minStock: e.target.value }))} /></Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
            </select>
          </Field>
          <div className="field field-span margin-preview">
            <p>Lucro unitário: <strong className={profitUnit >= 0 ? "text-forest-strong" : "text-danger"}>{money(profitUnit)}</strong></p>
            <p>Margem: <strong>{cost > 0 ? `${marginPct.toFixed(1)}%` : "—"}</strong></p>
          </div>
        </div>
        <button className="btn-gold btn-block" onClick={save}>{editingId ? "Salvar alterações" : "Cadastrar produto"}</button>
      </Modal>
    </div>
  );
}

/* ============================== ESTOQUE ============================== */

function Estoque({ db, updateDb, pushToast }) {
  const [entryOpen, setEntryOpen] = useState(false);
  const [entry, setEntry] = useState({ productId: "", qty: "", unitCost: "", supplier: "", invoice: "", date: new Date().toISOString().slice(0, 10), note: "" });
  const [tab, setTab] = useState("estoque");

  const openEntry = (productId = "") => {
    const p = db.products.find((x) => x.id === productId);
    setEntry({ productId, qty: "", unitCost: p ? String(p.cost) : "", supplier: "", invoice: "", date: new Date().toISOString().slice(0, 10), note: "" });
    setEntryOpen(true);
  };

  const submitEntry = () => {
    const product = db.products.find((p) => p.id === entry.productId);
    const qty = Number(entry.qty);
    if (!product) { pushToast("Selecione um produto.", "error"); return; }
    if (!qty || qty <= 0) { pushToast("Informe uma quantidade válida.", "error"); return; }
    const previous = product.stock;
    const after = previous + qty;
    updateDb((prev) => ({
      ...prev,
      products: prev.products.map((p) => p.id === product.id ? { ...p, stock: after } : p),
      stockMovements: [{
        id: uid("mov"), date: new Date(entry.date).toISOString(), productId: product.id, productName: product.name,
        type: "entrada", qty, previous, after,
        reason: [entry.supplier && `Fornecedor: ${entry.supplier}`, entry.invoice && `Nota: ${entry.invoice}`, entry.note].filter(Boolean).join(" · ") || "Entrada de estoque",
        user: "Fabi",
      }, ...prev.stockMovements],
    }));
    pushToast(`Estoque de "${product.name}" atualizado.`);
    setEntryOpen(false);
  };

  const movementBadge = { entrada: "success", venda: "neutral", devolução: "warn", ajuste: "neutral" };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Controle</p><h1 className="page-title">Estoque</h1></div>
        <button className="btn-gold" onClick={() => openEntry()}><PackagePlus size={16} /> Registrar entrada</button>
      </div>

      <div className="tabs">
        <button className={tab === "estoque" ? "tab-active" : ""} onClick={() => setTab("estoque")}>Produtos</button>
        <button className={tab === "historico" ? "tab-active" : ""} onClick={() => setTab("historico")}><History size={14} style={{ marginRight: 4 }} />Histórico</button>
      </div>

      {tab === "estoque" ? (
        <div className="card">
          {db.products.length === 0 ? (
            <EmptyState icon={PackagePlus} title="Nenhum produto cadastrado" subtitle="Cadastre produtos para controlar o estoque." />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Produto</th><th>Código</th><th>Categoria</th><th>Atual</th><th>Mínimo</th><th>Custo</th><th>Venda</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {db.products.map((p) => {
                    const st = stockStatus(p);
                    return (
                      <tr key={p.id}>
                        <td>{p.name}</td><td>{p.sku}</td><td>{p.category}</td>
                        <td><strong>{p.stock}</strong></td><td>{p.minStock}</td>
                        <td>{money(p.cost)}</td><td>{money(p.price)}</td>
                        <td><span style={{ color: st.color, fontWeight: 600 }}>{st.dot} {st.label}</span></td>
                        <td><button className="btn-outline btn-sm" onClick={() => openEntry(p.id)}>Repor</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          {db.stockMovements.length === 0 ? (
            <EmptyState icon={History} title="Nenhuma movimentação registrada" />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Qtd.</th><th>Anterior</th><th>Atual</th><th>Motivo</th><th>Responsável</th></tr></thead>
                <tbody>
                  {db.stockMovements.slice(0, 80).map((m) => (
                    <tr key={m.id}>
                      <td>{fmtDateTime(m.date)}</td><td>{m.productName}</td>
                      <td><Badge tone={movementBadge[m.type] || "neutral"}>{m.type}</Badge></td>
                      <td className={m.qty < 0 ? "text-danger" : "text-forest-strong"}>{m.qty > 0 ? `+${m.qty}` : m.qty}</td>
                      <td>{m.previous ?? "—"}</td><td>{m.after ?? "—"}</td>
                      <td>{m.reason}</td><td>{m.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal open={entryOpen} onClose={() => setEntryOpen(false)} title="Registrar entrada de estoque">
        <Field label="Produto" required>
          <select value={entry.productId} onChange={(e) => { const p = db.products.find((x) => x.id === e.target.value); setEntry((f) => ({ ...f, productId: e.target.value, unitCost: p ? String(p.cost) : f.unitCost })); }}>
            <option value="">Selecione…</option>
            {db.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <div className="form-grid">
          <Field label="Quantidade" required><input type="number" min="1" value={entry.qty} onChange={(e) => setEntry((f) => ({ ...f, qty: e.target.value }))} /></Field>
          <Field label="Custo unitário"><input type="number" min="0" step="0.01" value={entry.unitCost} onChange={(e) => setEntry((f) => ({ ...f, unitCost: e.target.value }))} /></Field>
          <Field label="Fornecedor"><input value={entry.supplier} onChange={(e) => setEntry((f) => ({ ...f, supplier: e.target.value }))} /></Field>
          <Field label="Número da nota"><input value={entry.invoice} onChange={(e) => setEntry((f) => ({ ...f, invoice: e.target.value }))} /></Field>
          <Field label="Data"><input type="date" value={entry.date} onChange={(e) => setEntry((f) => ({ ...f, date: e.target.value }))} /></Field>
          <Field label="Observação" span><textarea rows={2} value={entry.note} onChange={(e) => setEntry((f) => ({ ...f, note: e.target.value }))} /></Field>
        </div>
        <button className="btn-gold btn-block" onClick={submitEntry}>Confirmar entrada</button>
      </Modal>
    </div>
  );
}

/* ============================== CLIENTES ============================== */

const emptyCustomer = { name: "", phone: "", whatsapp: "", cpf: "", birthday: "", address: "", notes: "" };

function Clientes({ db, updateDb, pushToast, askConfirm }) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const [detail, setDetail] = useState(null);

  const stats = (customerId) => {
    const sales = db.sales.filter((s) => s.customerId === customerId && s.status !== "cancelada");
    return {
      total: sales.length,
      spent: sales.reduce((sum, s) => sum + s.total, 0),
      last: sales.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date,
      sales,
    };
  };

  const filtered = db.customers.filter((c) => {
    const q = search.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || (c.phone || "").includes(q);
  });

  const openNew = () => { setForm(emptyCustomer); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => { setForm(c); setEditingId(c.id); setModalOpen(true); };

  const save = () => {
    if (!form.name.trim()) { pushToast("Informe o nome do cliente.", "error"); return; }
    updateDb((prev) => ({
      ...prev,
      customers: editingId ? prev.customers.map((c) => c.id === editingId ? { ...c, ...form } : c) : [{ ...form, id: uid("cust") }, ...prev.customers],
    }));
    pushToast(editingId ? "Cliente atualizado." : "Cliente cadastrado.");
    setModalOpen(false);
  };

  const remove = (c) => {
    askConfirm({
      title: "Excluir cliente", danger: true, confirmLabel: "Excluir",
      message: `Tem certeza que deseja excluir "${c.name}"?`,
      onConfirm: () => { updateDb((prev) => ({ ...prev, customers: prev.customers.filter((x) => x.id !== c.id) })); pushToast("Cliente excluído."); },
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Relacionamento</p><h1 className="page-title">Clientes</h1></div>
        <button className="btn-gold" onClick={openNew}><Plus size={16} /> Novo cliente</button>
      </div>

      <div className="card filter-bar">
        <div className="search-box"><Search size={16} /><input placeholder="Buscar por nome ou telefone…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="Você ainda não possui clientes cadastrados." actionLabel="Cadastrar primeiro cliente" onAction={openNew} />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Nome</th><th>Telefone</th><th>Compras</th><th>Total gasto</th><th>Última compra</th><th></th></tr></thead>
              <tbody>
                {filtered.map((c) => {
                  const s = stats(c.id);
                  return (
                    <tr key={c.id} className="table-row-click" onClick={() => setDetail(c)}>
                      <td>{c.name}</td><td>{c.phone || "—"}</td><td>{s.total}</td>
                      <td>{money(s.spent)}</td><td>{fmtDate(s.last)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => openEdit(c)}><Pencil size={15} /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => remove(c)}><Trash2 size={15} /></button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar cliente" : "Novo cliente"}>
        <div className="form-grid">
          <Field label="Nome" required span><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Telefone"><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></Field>
          <Field label="WhatsApp"><input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} /></Field>
          <Field label="CPF"><input value={form.cpf} onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))} /></Field>
          <Field label="Data de nascimento"><input type="date" value={form.birthday} onChange={(e) => setForm((f) => ({ ...f, birthday: e.target.value }))} /></Field>
          <Field label="Endereço" span><input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></Field>
          <Field label="Observações" span><textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} /></Field>
        </div>
        <button className="btn-gold btn-block" onClick={save}>{editingId ? "Salvar alterações" : "Cadastrar cliente"}</button>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name || ""} wide>
        {detail && (() => {
          const s = stats(detail.id);
          return (
            <div>
              <div className="detail-grid">
                <div><p className="success-label">Telefone</p><p className="success-value">{detail.phone || "—"}</p></div>
                <div><p className="success-label">Total de compras</p><p className="success-value">{s.total}</p></div>
                <div><p className="success-label">Valor gasto</p><p className="success-value">{money(s.spent)}</p></div>
                <div><p className="success-label">Última compra</p><p className="success-value">{fmtDate(s.last)}</p></div>
              </div>
              <h4 style={{ margin: "14px 0 8px", fontFamily: "var(--font-display)" }}>Histórico de compras</h4>
              {s.sales.length === 0 ? <EmptyState icon={ReceiptIcon} title="Nenhuma compra ainda" /> : (
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Nº</th><th>Data</th><th>Valor</th><th>Vendedora</th></tr></thead>
                    <tbody>{s.sales.sort((a, b) => new Date(b.date) - new Date(a.date)).map((sale) => (
                      <tr key={sale.id}><td>#{sale.number}</td><td>{fmtDate(sale.date)}</td><td>{money(sale.total)}</td><td>{sale.sellerName}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

/* ============================== VENDEDORES ============================== */

const emptySeller = { name: "", phone: "", whatsapp: "", cpf: "", startDate: new Date().toISOString().slice(0, 10), commissionPercent: "5", status: "ativa" };

function Vendedores({ db, updateDb, pushToast, askConfirm }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptySeller);

  const stats = (sellerId) => {
    const sales = db.sales.filter((s) => s.sellerId === sellerId && s.status !== "cancelada");
    return { count: sales.length, total: sales.reduce((sum, s) => sum + s.total, 0), commission: sales.reduce((sum, s) => sum + s.commissionAmount, 0) };
  };

  const openNew = () => { setForm(emptySeller); setEditingId(null); setModalOpen(true); };
  const openEdit = (s) => { setForm({ ...s, commissionPercent: String(s.commissionPercent) }); setEditingId(s.id); setModalOpen(true); };

  const save = () => {
    if (!form.name.trim() || form.commissionPercent === "") { pushToast("Informe nome e percentual de comissão.", "error"); return; }
    const payload = { ...form, commissionPercent: Number(form.commissionPercent) };
    updateDb((prev) => ({
      ...prev,
      sellers: editingId ? prev.sellers.map((s) => s.id === editingId ? { ...s, ...payload } : s) : [{ ...payload, id: uid("v") }, ...prev.sellers],
    }));
    pushToast(editingId ? "Vendedora atualizada." : "Vendedora cadastrada.");
    setModalOpen(false);
  };

  const remove = (s) => {
    askConfirm({
      title: "Excluir vendedora", danger: true, confirmLabel: "Excluir",
      message: `Tem certeza que deseja excluir "${s.name}"? O histórico de vendas será mantido.`,
      onConfirm: () => { updateDb((prev) => ({ ...prev, sellers: prev.sellers.filter((x) => x.id !== s.id) })); pushToast("Vendedora excluída."); },
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Equipe</p><h1 className="page-title">Vendedores</h1></div>
        <button className="btn-gold" onClick={openNew}><Plus size={16} /> Nova vendedora</button>
      </div>

      {db.sellers.length === 0 ? (
        <div className="card"><EmptyState icon={UserRound} title="Nenhuma vendedora cadastrada" actionLabel="Cadastrar primeira vendedora" onAction={openNew} /></div>
      ) : (
        <div className="seller-grid">
          {db.sellers.map((s) => {
            const st = stats(s.id);
            return (
              <div key={s.id} className="seller-card">
                <div className="seller-card-top">
                  <div className="seller-avatar">{s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                  <Badge tone={s.status === "ativa" ? "success" : "neutral"}>{s.status === "ativa" ? "Ativa" : "Inativa"}</Badge>
                </div>
                <p className="seller-name">{s.name}</p>
                <p className="seller-commission">Comissão: {s.commissionPercent}%</p>
                <div className="seller-stats">
                  <div><p className="stat-label">Vendas</p><p className="stat-value-sm">{st.count}</p></div>
                  <div><p className="stat-label">Total vendido</p><p className="stat-value-sm">{money(st.total)}</p></div>
                  <div><p className="stat-label">Comissão gerada</p><p className="stat-value-sm text-gold-strong">{money(st.commission)}</p></div>
                </div>
                <div className="row-actions" style={{ justifyContent: "flex-end", marginTop: 10 }}>
                  <button className="icon-btn" onClick={() => openEdit(s)}><Pencil size={15} /></button>
                  <button className="icon-btn icon-btn-danger" onClick={() => remove(s)}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar vendedora" : "Nova vendedora"}>
        <div className="form-grid">
          <Field label="Nome" required span><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Telefone"><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></Field>
          <Field label="WhatsApp"><input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} /></Field>
          <Field label="CPF"><input value={form.cpf} onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))} /></Field>
          <Field label="Data de entrada"><input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} /></Field>
          <Field label="Percentual de comissão (%)" required><input type="number" min="0" max="100" step="0.5" value={form.commissionPercent} onChange={(e) => setForm((f) => ({ ...f, commissionPercent: e.target.value }))} /></Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="ativa">Ativa</option><option value="inativa">Inativa</option>
            </select>
          </Field>
        </div>
        <button className="btn-gold btn-block" onClick={save}>{editingId ? "Salvar alterações" : "Cadastrar vendedora"}</button>
      </Modal>
    </div>
  );
}

/* ============================== COMISSÕES ============================== */

function Comissoes({ db, updateDb, pushToast }) {
  const [filters, setFilters] = useState({ sellerId: "", from: "", to: "", status: "" });
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ date: new Date().toISOString().slice(0, 10), note: "" });

  const rows = db.sales.filter((s) => s.status !== "cancelada").filter((s) => {
    if (filters.sellerId && s.sellerId !== filters.sellerId) return false;
    if (filters.from && new Date(s.date) < startOfDay(filters.from)) return false;
    if (filters.to && new Date(s.date) > endOfDay(filters.to)) return false;
    if (filters.status && s.commissionStatus !== filters.status) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalGerado = rows.reduce((sum, s) => sum + s.commissionAmount, 0);
  const totalPago = rows.filter((s) => s.commissionStatus === "pago").reduce((sum, s) => sum + s.commissionAmount, 0);
  const totalPendente = rows.filter((s) => s.commissionStatus === "pendente").reduce((sum, s) => sum + s.commissionAmount, 0);

  const markPaid = () => {
    updateDb((prev) => ({
      ...prev,
      sales: prev.sales.map((s) => s.id === payModal.id ? { ...s, commissionStatus: "pago", commissionPaidAt: new Date(payForm.date).toISOString(), commissionPaidNote: payForm.note } : s),
    }));
    pushToast(`Comissão da venda #${payModal.number} marcada como paga.`);
    setPayModal(null);
    setPayForm({ date: new Date().toISOString().slice(0, 10), note: "" });
  };

  const markPending = (s) => {
    updateDb((prev) => ({ ...prev, sales: prev.sales.map((x) => x.id === s.id ? { ...x, commissionStatus: "pendente", commissionPaidAt: null } : x) }));
    pushToast(`Comissão da venda #${s.number} marcada como pendente.`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Financeiro</p><h1 className="page-title">Comissões</h1></div>
      </div>

      <div className="stat-grid stat-grid-3">
        <StatCard icon={Percent} tone="forest" label="Comissão gerada" value={money(totalGerado)} />
        <StatCard icon={Check} tone="forest" label="Comissão paga" value={money(totalPago)} />
        <StatCard icon={AlertTriangle} tone="gold" label="Comissão pendente" value={money(totalPendente)} />
      </div>

      <div className="card filter-bar">
        <div className="filter-grid">
          <Field label="Vendedora">
            <select value={filters.sellerId} onChange={(e) => setFilters((f) => ({ ...f, sellerId: e.target.value }))}>
              <option value="">Todas</option>
              {db.sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="De"><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></Field>
          <Field label="Até"><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></Field>
          <Field label="Status">
            <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              <option value="">Todos</option><option value="pendente">Pendente</option><option value="pago">Pago</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="card">
        {rows.length === 0 ? (
          <EmptyState icon={Percent} title="Nenhuma comissão encontrada" subtitle="Ajuste os filtros ou realize vendas no PDV." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Vendedora</th><th>Venda</th><th>Data</th><th>Total vendido</th><th>%</th><th>Comissão</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>{s.sellerName}</td><td>#{s.number}</td><td>{fmtDate(s.date)}</td>
                    <td>{money(s.total)}</td><td>{s.commissionPercent}%</td>
                    <td className="text-gold-strong">{money(s.commissionAmount)}</td>
                    <td><Badge tone={s.commissionStatus === "pago" ? "success" : "warn"}>{s.commissionStatus === "pago" ? "Pago" : "Pendente"}</Badge></td>
                    <td>
                      {s.commissionStatus === "pago" ? (
                        <button className="btn-outline btn-sm" onClick={() => markPending(s)}>Marcar pendente</button>
                      ) : (
                        <button className="btn-gold btn-sm" onClick={() => setPayModal(s)}>Marcar como paga</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Registrar pagamento de comissão">
        {payModal && (
          <div>
            <p className="pay-summary">Venda #{payModal.number} · {payModal.sellerName} · <strong>{money(payModal.commissionAmount)}</strong></p>
            <Field label="Data do pagamento"><input type="date" value={payForm.date} onChange={(e) => setPayForm((f) => ({ ...f, date: e.target.value }))} /></Field>
            <Field label="Observação"><textarea rows={2} value={payForm.note} onChange={(e) => setPayForm((f) => ({ ...f, note: e.target.value }))} /></Field>
            <button className="btn-gold btn-block" onClick={markPaid}>Confirmar pagamento</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============================== GLOBAL STYLE ============================== */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

      .app-root {
        --forest-900: #0F3D2E;
        --forest-800: #154A38;
        --forest-700: #1C5C43;
        --forest-600: #237050;
        --gold-600: #A9801F;
        --gold-500: #C9A227;
        --gold-400: #D9B84E;
        --gold-100: #F5EBCB;
        --cream: #FBF8F1;
        --ink: #24261F;
        --ink-soft: #6B6A5E;
        --line: #E8E2D2;
        --danger: #B3402F;
        --danger-bg: #F7E7E3;
        --success-bg: #E4EEE7;
        --warn-bg: #F6EFD9;

        font-family: 'Inter', -apple-system, sans-serif;
        color: var(--ink);
        background: var(--cream);
        min-height: 100vh;
        display: flex;
        position: relative;
      }
      .app-root * { box-sizing: border-box; }
      .app-root h1, .app-root h2, .app-root h3, .app-root h4 { font-family: 'Playfair Display', Georgia, serif; margin: 0; color: var(--forest-900); }
      .app-root button { font-family: inherit; cursor: pointer; }
      .app-root input, .app-root select, .app-root textarea {
        font-family: inherit; width: 100%; padding: 9px 11px; border-radius: 9px;
        border: 1px solid var(--line); background: #fff; color: var(--ink); font-size: 13.5px; outline: none;
      }
      .app-root input:focus, .app-root select:focus, .app-root textarea:focus { border-color: var(--gold-500); box-shadow: 0 0 0 3px rgba(201,162,39,0.15); }

      /* Sidebar */
      .sidebar {
        width: 236px; background: linear-gradient(180deg, var(--forest-900), var(--forest-800));
        color: #fff; display: flex; flex-direction: column; padding: 22px 16px; flex-shrink: 0;
        position: sticky; top: 0; height: 100vh;
      }
      .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 26px; padding: 0 4px; }
      .brand-mark {
        width: 38px; height: 38px; border-radius: 11px; background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
        display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif;
        font-weight: 700; color: var(--forest-900); font-size: 15px; flex-shrink: 0;
      }
      .brand-mark-sm { width: 30px; height: 30px; font-size: 12px; border-radius: 9px; }
      .brand-name { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 15px; line-height: 1.2; color: #fff; }
      .brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 1px; }
      .nav-list { display: flex; flex-direction: column; gap: 3px; flex: 1; }
      .nav-link {
        display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; border: none;
        background: transparent; color: rgba(255,255,255,0.75); font-size: 13.5px; font-weight: 500; text-align: left; position: relative;
        transition: background .15s ease, color .15s ease;
      }
      .nav-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
      .nav-link-active { background: rgba(201,162,39,0.16); color: var(--gold-400); font-weight: 600; }
      .nav-dot { position: absolute; right: 10px; width: 5px; height: 5px; border-radius: 50%; background: var(--gold-400); }
      .sidebar-footer { padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: rgba(255,255,255,0.45); }
      .sidebar-footer-brand { color: var(--gold-400); font-weight: 600; margin-top: 2px; }

      /* Mobile topbar */
      .mobile-topbar { display: none; }
      .mobile-nav-overlay { display: none; }

      .main-area { flex: 1; min-width: 0; padding: 28px 32px 60px; }

      .page { display: flex; flex-direction: column; gap: 18px; max-width: 1180px; }
      .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
      .page-eyebrow { font-size: 12px; letter-spacing: 0.03em; color: var(--gold-600); font-weight: 600; text-transform: uppercase; margin: 0 0 3px; }
      .page-title { font-size: 26px; }

      .period-pills { display: flex; gap: 6px; flex-wrap: wrap; }
      .pill { padding: 7px 13px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink-soft); font-size: 12.5px; font-weight: 500; }
      .pill-active { background: var(--forest-900); color: #fff; border-color: var(--forest-900); }

      .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      .stat-grid-3 { grid-template-columns: repeat(3, 1fr); }
      .stat-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px; display: flex; gap: 12px; align-items: flex-start; box-shadow: 0 1px 2px rgba(20,30,20,0.03); }
      .stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .stat-icon-forest { background: var(--success-bg); color: var(--forest-700); }
      .stat-icon-gold { background: var(--gold-100); color: var(--gold-600); }
      .stat-icon-warn { background: var(--warn-bg); color: #A9720F; }
      .stat-label { font-size: 12px; color: var(--ink-soft); margin: 0 0 3px; }
      .stat-value { font-size: 19px; font-weight: 700; color: var(--forest-900); font-family: 'Playfair Display', serif; margin: 0; }
      .stat-value-sm { font-size: 15px; font-weight: 700; color: var(--forest-900); margin: 0; }
      .stat-sub { font-size: 11.5px; color: var(--ink-soft); margin: 3px 0 0; }

      .grid-2 { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; align-items: stretch; }
      .card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px; box-shadow: 0 1px 3px rgba(20,30,20,0.04); }
      .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
      .card-header h3 { font-size: 16px; }

      .metric-toggle, .chip { }
      .chip { padding: 5px 10px; border-radius: 999px; border: 1px solid var(--line); background: var(--cream); font-size: 11.5px; color: var(--ink-soft); font-weight: 600; }
      .chip-active { background: var(--gold-100); color: var(--gold-600); border-color: var(--gold-400); }
      .metric-toggle { display: flex; gap: 6px; }

      .list-simple { display: flex; flex-direction: column; gap: 10px; }
      .list-simple-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px; border: 1px solid var(--line); border-radius: 11px; background: var(--cream); }
      .list-simple-title { font-size: 13px; font-weight: 600; color: var(--ink); margin: 0; }
      .list-simple-sub { font-size: 11.5px; color: var(--ink-soft); margin: 2px 0 0; }

      .table-wrap { overflow-x: auto; }
      .table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .table th { text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }
      .table td { padding: 11px 10px; border-bottom: 1px solid var(--line); color: var(--ink); vertical-align: middle; }
      .table tr:last-child td { border-bottom: none; }
      .table-row-click { cursor: pointer; }
      .table-row-click:hover td { background: var(--cream); }
      .cell-strong { font-weight: 600; margin: 0; }
      .cell-sub { font-size: 11.5px; color: var(--ink-soft); margin: 2px 0 0; }
      .text-forest-strong { color: var(--forest-700); font-weight: 700; }
      .text-gold-strong { color: var(--gold-600); font-weight: 700; }
      .text-danger { color: var(--danger); font-weight: 600; }

      .badge { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 700; }
      .badge-success { background: var(--success-bg); color: var(--forest-700); }
      .badge-warn { background: var(--warn-bg); color: #A9720F; }
      .badge-danger { background: var(--danger-bg); color: var(--danger); }
      .badge-neutral { background: #EFEDE5; color: var(--ink-soft); }

      .btn-gold, .btn-outline, .btn-danger {
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        padding: 10px 16px; border-radius: 10px; font-size: 13.5px; font-weight: 600; border: 1px solid transparent; white-space: nowrap;
        transition: transform .1s ease, box-shadow .15s ease, opacity .15s ease;
      }
      .btn-gold { background: linear-gradient(135deg, var(--gold-400), var(--gold-600)); color: #241B04; box-shadow: 0 2px 6px rgba(169,128,31,0.35); }
      .btn-gold:hover { opacity: 0.92; }
      .btn-gold:active { transform: scale(0.98); }
      .btn-outline { background: #fff; border-color: var(--line); color: var(--forest-900); }
      .btn-outline:hover { border-color: var(--gold-400); }
      .btn-danger { background: var(--danger-bg); color: var(--danger); }
      .btn-danger:hover { opacity: 0.85; }
      .btn-block { width: 100%; margin-top: 6px; }
      .btn-lg { padding: 13px 16px; font-size: 14.5px; }
      .btn-sm { padding: 6px 11px; font-size: 12px; }

      .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; background: transparent; border: 1px solid transparent; color: var(--ink-soft); }
      .icon-btn:hover { background: var(--cream); color: var(--forest-900); }
      .icon-btn-danger:hover { background: var(--danger-bg); color: var(--danger); }
      .row-actions { display: flex; gap: 4px; }

      .icon-circle { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; width: 34px; height: 34px; }
      .icon-circle-forest { background: var(--success-bg); color: var(--forest-700); }
      .icon-circle-gold { background: var(--gold-100); color: var(--gold-600); }

      .empty-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 20px; gap: 6px; }
      .empty-state-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--gold-100); color: var(--gold-600); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
      .empty-state-title { font-weight: 600; color: var(--ink); margin: 0; }
      .empty-state-subtitle { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 8px; max-width: 320px; }

      .loading-screen { min-height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: var(--cream, #FBF8F1); font-family: 'Inter', sans-serif; color: #6B6A5E; }
      .loading-mark { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #D9B84E, #A9801F); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 700; color: #0F3D2E; font-size: 20px; animation: pulse 1.4s ease-in-out infinite; }
      @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }

      .modal-overlay { position: fixed; inset: 0; background: rgba(15,25,20,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; backdrop-filter: blur(2px); }
      .modal-panel { background: #fff; border-radius: 16px; width: 100%; max-width: 460px; max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(15,25,20,0.25); }
      .modal-wide { max-width: 620px; }
      .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: #fff; z-index: 2; }
      .modal-header h3 { font-size: 16.5px; }
      .modal-body { padding: 18px 20px 22px; }
      .modal-confirm { max-width: 380px; padding: 24px 22px; text-align: center; }
      .confirm-icon { width: 44px; height: 44px; border-radius: 50%; background: var(--danger-bg); color: var(--danger); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
      .modal-confirm h3 { font-size: 16px; margin-bottom: 6px; }
      .modal-confirm p { font-size: 13px; color: var(--ink-soft); margin: 0 0 10px; }
      .confirm-actions { display: flex; gap: 8px; margin-top: 14px; }
      .confirm-actions button { flex: 1; }

      .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
      .field-span { grid-column: 1 / -1; }
      .field label { font-size: 12px; font-weight: 600; color: var(--ink); }
      .req { color: var(--danger); margin-left: 2px; }
      .field-hint { font-size: 11px; color: var(--ink-soft); margin: 0; }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
      .margin-preview { background: var(--success-bg); border-radius: 10px; padding: 10px 12px; font-size: 12.5px; }
      .margin-preview p { margin: 2px 0; }

      .filter-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
      .filter-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; width: 100%; }
      .filter-grid .field { margin-bottom: 0; }

      .search-box { display: flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: 10px; padding: 0 12px; background: var(--cream); flex: 1; min-width: 200px; color: var(--ink-soft); }
      .search-box input { border: none; background: transparent; padding: 10px 0; }
      .search-box input:focus { box-shadow: none; }

      /* PDV */
      .pdv-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; align-items: flex-start; }
      .pdv-left { min-height: 300px; }
      .pdv-right { position: sticky; top: 20px; }
      .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 14px; max-height: 620px; overflow-y: auto; padding-right: 4px; }
      .product-card { text-align: left; border: 1px solid var(--line); border-radius: 12px; padding: 12px; background: #fff; display: flex; flex-direction: column; gap: 8px; transition: border-color .15s ease, box-shadow .15s ease; }
      .product-card:hover { border-color: var(--gold-400); box-shadow: 0 3px 10px rgba(201,162,39,0.14); }
      .product-card:disabled { opacity: 0.45; cursor: not-allowed; }
      .product-card-top { display: flex; align-items: center; justify-content: space-between; font-size: 10.5px; }
      .product-card-cat { color: var(--gold-600); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
      .product-card-name { font-size: 12.5px; font-weight: 600; line-height: 1.3; margin: 0; min-height: 32px; }
      .product-card-bottom { display: flex; align-items: center; justify-content: space-between; }
      .product-card-price { color: var(--forest-800); font-weight: 700; font-size: 13.5px; }
      .product-card-stock { font-size: 10.5px; color: var(--ink-soft); }

      .pdv-cart-title { display: flex; align-items: center; gap: 8px; font-size: 15px; margin-bottom: 12px; }
      .cart-list { display: flex; flex-direction: column; gap: 10px; max-height: 220px; overflow-y: auto; }
      .cart-row { display: grid; grid-template-columns: 1fr auto auto auto; align-items: center; gap: 8px; }
      .cart-row-name { font-size: 12.5px; font-weight: 600; margin: 0; }
      .cart-row-price { font-size: 11px; color: var(--ink-soft); margin: 1px 0 0; }
      .cart-row-qty { display: flex; align-items: center; gap: 6px; background: var(--cream); border-radius: 8px; padding: 3px 6px; }
      .cart-row-qty button { width: 20px; height: 20px; border-radius: 5px; border: none; background: #fff; display: flex; align-items: center; justify-content: center; }
      .cart-row-subtotal { font-size: 12.5px; font-weight: 700; color: var(--forest-800); white-space: nowrap; }

      .pdv-divider { height: 1px; background: var(--line); margin: 14px 0; }
      .discount-row { display: flex; gap: 8px; }
      .segmented { display: flex; border: 1px solid var(--line); border-radius: 9px; overflow: hidden; flex-shrink: 0; }
      .segmented button { padding: 9px 12px; border: none; background: #fff; font-size: 12.5px; font-weight: 600; color: var(--ink-soft); }
      .seg-active { background: var(--forest-900); color: #fff; }

      .totals-block { background: var(--cream); border-radius: 12px; padding: 12px 14px; margin: 10px 0 14px; display: flex; flex-direction: column; gap: 6px; }
      .totals-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-soft); }
      .totals-total { font-size: 16px; font-weight: 700; color: var(--forest-900); padding-top: 6px; border-top: 1px dashed var(--line); }

      .inline-select-row { display: flex; gap: 8px; }
      .inline-select-row select { flex: 1; }

      .payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .payment-option { display: flex; align-items: center; gap: 7px; border: 1px solid var(--line); border-radius: 10px; padding: 9px 10px; background: #fff; font-size: 12px; font-weight: 600; color: var(--ink-soft); }
      .payment-option-active { border-color: var(--gold-500); background: var(--gold-100); color: var(--gold-600); }

      .cash-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .troco-display { padding: 9px 11px; border-radius: 9px; background: var(--success-bg); color: var(--forest-800); font-weight: 700; font-size: 14px; }

      .success-banner { display: flex; align-items: center; gap: 8px; background: var(--success-bg); color: var(--forest-800); padding: 10px 12px; border-radius: 10px; font-weight: 700; font-size: 13.5px; margin-bottom: 14px; }
      .success-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
      .success-label { font-size: 11px; color: var(--ink-soft); margin: 0; }
      .success-value { font-size: 14px; font-weight: 700; color: var(--forest-900); margin: 2px 0 0; }
      .success-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
      .success-actions button { flex: 1; min-width: 120px; }

      .detail-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
      .cancel-note { display: flex; align-items: center; gap: 6px; color: var(--danger); background: var(--danger-bg); padding: 8px 10px; border-radius: 9px; font-size: 12.5px; margin-top: 12px; }

      .receipt { border: 1px dashed var(--line); border-radius: 12px; padding: 16px; margin-top: 16px; font-family: 'Inter', monospace; font-size: 12.5px; background: var(--cream); }
      .receipt-brand { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 16px; text-align: center; margin: 0; color: var(--forest-900); }
      .receipt-sub { text-align: center; font-size: 11px; color: var(--ink-soft); margin: 2px 0 8px; }
      .receipt-line { border-top: 1px dashed var(--line); margin: 8px 0; }
      .receipt-meta { display: flex; justify-content: space-between; margin: 3px 0; }
      .receipt-total { font-weight: 700; font-size: 14px; color: var(--forest-900); }
      .receipt-table { width: 100%; border-collapse: collapse; margin: 6px 0; }
      .receipt-table th { text-align: left; font-size: 10.5px; color: var(--ink-soft); border-bottom: 1px solid var(--line); padding: 4px 2px; }
      .receipt-table td { padding: 4px 2px; font-size: 12px; border-bottom: 1px dotted var(--line); }
      .receipt-thanks { text-align: center; font-weight: 600; color: var(--forest-800); margin: 8px 0 0; }

      .tabs { display: flex; gap: 6px; }
      .tabs button { padding: 9px 16px; border-radius: 10px 10px 0 0; border: 1px solid var(--line); border-bottom: none; background: var(--cream); font-size: 13px; font-weight: 600; color: var(--ink-soft); display: flex; align-items: center; }
      .tab-active { background: #fff; color: var(--forest-900); }

      .seller-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
      .seller-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px; }
      .seller-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .seller-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--forest-700), var(--forest-900)); color: var(--gold-400); display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Playfair Display', serif; }
      .seller-name { font-weight: 700; font-size: 15px; margin: 0; color: var(--forest-900); }
      .seller-commission { font-size: 12px; color: var(--gold-600); font-weight: 600; margin: 2px 0 12px; }
      .seller-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-top: 1px solid var(--line); padding-top: 10px; }

      .pay-summary { background: var(--cream); padding: 10px 12px; border-radius: 10px; font-size: 13px; margin-bottom: 12px; }

      .toast-stack { position: fixed; top: 18px; right: 18px; display: flex; flex-direction: column; gap: 8px; z-index: 200; }
      .toast { display: flex; align-items: center; gap: 8px; background: var(--forest-900); color: #fff; padding: 11px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; box-shadow: 0 6px 20px rgba(15,25,20,0.25); animation: slidein .2s ease; }
      .toast-error { background: var(--danger); }
      @keyframes slidein { from { transform: translateX(10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

      .print-area { display: block; }

      @media print {
        .no-print-hide { display: none !important; }
        .main-area { padding: 0; }
        .modal-overlay { position: static; background: none; padding: 0; display: block; }
        .modal-panel { box-shadow: none; max-width: none; max-height: none; overflow: visible; }
        .modal-header { display: none; }
        .modal-body > *:not(.receipt) { display: none; }
        body { background: #fff; }
      }

      @media (max-width: 980px) {
        .grid-2 { grid-template-columns: 1fr; }
        .pdv-grid { grid-template-columns: 1fr; }
        .pdv-right { position: static; }
        .stat-grid { grid-template-columns: repeat(2, 1fr); }
        .filter-grid { grid-template-columns: repeat(3, 1fr); }
        .form-grid { grid-template-columns: 1fr; }
        .detail-grid { grid-template-columns: repeat(2, 1fr); }
      }

      @media (max-width: 720px) {
        .app-root { flex-direction: column; }
        .sidebar { display: none; }
        .mobile-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--forest-900); color: #fff; position: sticky; top: 0; z-index: 50; }
        .mobile-topbar-title { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14px; }
        .mobile-nav-overlay { display: block; position: fixed; inset: 0; background: rgba(15,25,20,0.5); z-index: 90; }
        .mobile-nav-panel { background: linear-gradient(180deg, var(--forest-900), var(--forest-800)); width: 78%; max-width: 280px; height: 100%; padding: 20px 16px; display: flex; flex-direction: column; gap: 3px; }
        .main-area { padding: 18px 14px 50px; }
        .page-title { font-size: 21px; }
        .stat-grid, .stat-grid-3 { grid-template-columns: 1fr 1fr; }
        .filter-grid { grid-template-columns: 1fr 1fr; }
        .success-grid { grid-template-columns: 1fr; }
        .detail-grid { grid-template-columns: 1fr 1fr; }
        .cash-row { grid-template-columns: 1fr; }
        .payment-grid { grid-template-columns: 1fr; }
        .seller-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
