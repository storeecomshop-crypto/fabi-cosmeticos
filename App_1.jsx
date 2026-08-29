import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutDashboard, ShoppingCart, Receipt as ReceiptIcon, Package, Users, UserRound, Percent,
  Search, Plus, Minus, X, Check, Printer, MessageCircle, TrendingUp, TrendingDown,
  AlertTriangle, ChevronRight, ChevronLeft, Menu, Trash2, Pencil, ArrowLeft,
  DollarSign, RotateCcw, Star, ShoppingBag, CreditCard, Banknote, Smartphone,
  CalendarDays, Filter, Info, Sparkles, PackagePlus, History, Wallet, ChevronDown,
  ImagePlus, ImageOff, FileText, Download, ArrowDownCircle, ArrowUpCircle,
  Lock, ShieldCheck, Landmark, UserCog, LockOpen,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";

/* Logo oficial da Fabi Cosméticos, incorporada como base64 para funcionar offline e em qualquer ambiente */
const LOGO_DATA_URL = "data:image/png;base64,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+drl//L5z6+sDn0bEOXE1vHZZH7m1KmPfOzjyzowxle/9tcv/uCl3mjYtu3a2tp8um8Yd9551/33v2d1dTXN3QohfOlLX3r00UdPnTqhQN3UyS9KA2df+MG5p773neeeedaAHnzggUceevjBBx/wTUestix98HXbDIYjAOcvvvTUU9+7dvlKr9d7z3vec/r0HceOHavKioAY1bCZz2aD4RDA95966vnnX9y9vnf8xInBYHD27Nl77707Je/resHMZVm+SsQp5mPecSJ++wVAatKZzT7GEE1ZAHju6ef+8ktf+tYTj29tHjt9+vje7s6X/+pL16688thDD/ZXV52rnvvBiwrt9wbf+c63f//3f//KlSsbGxuFc5cvX37iiScmk8mDDzzIzNf3r7uytzed9QfVvG3+3//b/+f6/nVTGAVeeOHZp595em1t1bpiMBiyYefcdDr/2te/+l/+9PO9qnrg/gfZ0Gwy6/f7Xeu/+Odf/M//+XOnT5+65557rDUEMFG9mJ976aXP/fEfnj175/71686armnmk+mJrROn77gDgAaNUZ559rmr13a6EJ577vlzF871hr02NMPVla0Tx6pej6ASQ9PUv/+ffu/MyZMnT50hJWm8dSUJRd/9yZ994Y/+5D977z/4gQ+c3Dr+/Sef+tY3/toq7rn7bi4KSPSh7Q/6Cv3dz/7e//G7vzubTNY3NkarK9/45je/+uUvnz596uTxk/v7+4WzJBKDd4V79snv/9kXPl8V5d7uzoVLly6cv1TX8/X1jZXRKEXRyqKgw6ncACg16N4Y3vJOEvHbnwDEUI9IcEXhCgiee/b5b37zGy+88Py//tf/ujesACB0X/rzPxuP9+eLelD2Adxz193W2Gefe/Y//sf/+N73vvd//af/y+Hr/el/+dM///M/L4riVz79K1vHtgQYDocALly48Nxzz/3r/9f/c/PYer+oGPjaX3/lkUfeS0CUmGo0isr1er3ZfPLCC89dvXr1zB0nV1dXAbzyyitPfPPxqqrW1taccyIym81WVlZSVGRr89j/8Fv/Q9vU/aoXQ0CEcRViBJkQO9cr/+5/+0u/bKwt8Ed//F+/99R3/5f/+X+etTMD6pU9AJ3vIJoCyTGVrotYYiikaV46/9J//fz//xf+27/733/mM0aAEH/105/+zhNP/OD5F4L3tnAhdMlk/s7/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";


/* ============================== CONSTANTS ============================== */

const STORAGE_KEY = "fabi-cosmeticos-db-v1";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pdv", label: "PDV", icon: ShoppingCart },
  { id: "vendas", label: "Vendas", icon: ReceiptIcon },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "estoque", label: "Estoque", icon: PackagePlus, adminOnly: true },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "vendedores", label: "Vendedores", icon: UserRound, adminOnly: true },
  { id: "comissoes", label: "Comissões", icon: Percent },
  { id: "financeiro", label: "Financeiro", icon: Landmark, adminOnly: true },
  { id: "relatorios", label: "Relatórios", icon: FileText, adminOnly: true },
];

const FINANCE_CATEGORIES = {
  saida: [
    { id: "despesa", label: "Despesa" },
    { id: "compra", label: "Compra de mercadoria" },
    { id: "comissao", label: "Comissão paga" },
    { id: "sangria", label: "Sangria de caixa" },
    { id: "outro", label: "Outra saída" },
  ],
  entrada: [
    { id: "reforco", label: "Reforço de caixa" },
    { id: "outro", label: "Outra entrada" },
  ],
};

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

function resizeImageFile(file, maxDim = 480, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
        else if (height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function csvEscape(value) {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename, headers, rows) {
  const lines = [headers.map(csvEscape).join(";"), ...rows.map((r) => r.map(csvEscape).join(";"))];
  const csv = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

  const financeTransactions = [
    { id: uid("fin"), date: daysAgoISO(11, 9, 0), type: "saida", category: "despesa", description: "Aluguel do salão", amount: 650, createdBy: "Fabi", registerId: null },
    { id: uid("fin"), date: daysAgoISO(7, 14, 0), type: "saida", category: "compra", description: "Reposição de mercadoria — distribuidora", amount: 480, createdBy: "Fabi", registerId: null },
    { id: uid("fin"), date: daysAgoISO(3, 11, 0), type: "saida", category: "despesa", description: "Conta de energia", amount: 190, createdBy: "Fabi", registerId: null },
  ];

  const cashRegisters = [
    {
      id: uid("cx"), openedAt: daysAgoISO(1, 8, 30), openedBy: "Fabi", initialAmount: 100,
      status: "fechado", closedAt: daysAgoISO(1, 19, 0), closedBy: "Fabi",
      salesCash: 45, salesPix: 0, salesDebit: 0, salesCredit: 0, salesOther: 0,
      reinforcements: 0, withdrawals: 0, expenses: 0,
      expectedBalance: 145, informedBalance: 145, difference: 0, note: "",
    },
  ];

  return {
    products,
    categories: [...DEFAULT_CATEGORIES],
    customers,
    sellers,
    sales,
    stockMovements,
    financeTransactions,
    cashRegisters,
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
      <img src={LOGO_DATA_URL} alt="Fabi Cosméticos" className="loading-logo" />
      <p>Carregando Fabi Cosméticos…</p>
    </div>
  );
}

function Modal({ open, onClose, title, children, wide, noPadding }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
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

function ProductThumb({ photo, size = 40, rounded = 10 }) {
  const style = { width: size, height: size, borderRadius: rounded };
  if (photo) return <img src={photo} alt="" className="product-thumb" style={style} />;
  return (
    <div className="product-thumb product-thumb-empty" style={style}>
      <ImageOff size={Math.round(size * 0.42)} />
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

const ROLE_STORAGE_KEY = "fabi-cosmeticos-role-v1";

function withDefaults(data) {
  return {
    products: data.products || [],
    categories: data.categories || [...DEFAULT_CATEGORIES],
    customers: data.customers || [],
    sellers: data.sellers || [],
    sales: data.sales || [],
    stockMovements: data.stockMovements || [],
    financeTransactions: data.financeTransactions || [],
    cashRegisters: data.cashRegisters || [],
    settings: {
      companyName: "Fabi Cosméticos", phone: "", whatsapp: "", instagram: "", address: "", cnpj: "",
      receiptMessage: "Obrigado pela preferência!", defaultMinStock: 5, ...(data.settings || {}),
    },
  };
}

export default function FabiCosmeticosApp() {
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [role, setRole] = useState({ type: "admin" });
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

  const changeRole = useCallback((next) => {
    setRole(next);
    setSection(next.type === "vendedora" ? "pdv" : "dashboard");
    window.storage.set(ROLE_STORAGE_KEY, JSON.stringify(next), false).catch(() => {});
  }, []);

  // ---- load ----
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res?.value) setDb(withDefaults(JSON.parse(res.value)));
        else {
          const seed = buildSeed();
          setDb(seed);
          await window.storage.set(STORAGE_KEY, JSON.stringify(seed), false);
        }
      } catch (e) {
        const seed = buildSeed();
        setDb(seed);
        try { await window.storage.set(STORAGE_KEY, JSON.stringify(seed), false); } catch (_) {}
      }
      try {
        const roleRes = await window.storage.get(ROLE_STORAGE_KEY, false);
        if (roleRes?.value) setRole(JSON.parse(roleRes.value));
      } catch (_) {}
      setLoading(false);
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

  const isAdmin = role.type === "admin";
  const visibleNavItems = NAV_ITEMS.filter((n) => isAdmin || !n.adminOnly);
  const activeItem = NAV_ITEMS.find((n) => n.id === section);

  return (
    <div className="app-root">
      <GlobalStyle />
      <Toasts toasts={toasts} />
      <ConfirmDialog state={confirm} onCancel={closeConfirm} onConfirm={runConfirm} />

      {/* Sidebar desktop */}
      <aside className="sidebar no-print-hide">
        <div className="brand">
          <div className="brand-mark"><img src={LOGO_DATA_URL} alt="Fabi Cosméticos" className="brand-mark-img" /></div>
          <div>
            <p className="brand-sub">Gestão inteligente</p>
            <p className="brand-sub">para o seu negócio</p>
          </div>
        </div>
        <nav className="nav-list">
          {visibleNavItems.map((item) => (
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
        <RoleSwitcher db={db} role={role} onChange={changeRole} />
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
        <div className="brand-mark brand-mark-sm"><img src={LOGO_DATA_URL} alt="Fabi Cosméticos" className="brand-mark-img" /></div>
      </header>

      {mobileNavOpen && (
        <div className="mobile-nav-overlay no-print-hide" onMouseDown={(e) => { if (e.target === e.currentTarget) setMobileNavOpen(false); }}>
          <div className="mobile-nav-panel">
            <div className="brand" style={{ marginBottom: 8 }}>
              <div className="brand-mark"><img src={LOGO_DATA_URL} alt="Fabi Cosméticos" className="brand-mark-img" /></div>
              <div>
                <p className="brand-sub">Gestão inteligente</p>
                <p className="brand-sub">para o seu negócio</p>
              </div>
            </div>
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${section === item.id ? "nav-link-active" : ""}`}
                onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </button>
            ))}
            <RoleSwitcher db={db} role={role} onChange={(r) => { changeRole(r); setMobileNavOpen(false); }} />
          </div>
        </div>
      )}

      <main className="main-area">
        {section === "dashboard" && <Dashboard db={db} role={role} setSection={setSection} />}
        {section === "pdv" && <Pdv db={db} role={role} updateDb={updateDb} pushToast={pushToast} />}
        {section === "vendas" && <Vendas db={db} role={role} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "produtos" && <Produtos db={db} role={role} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "estoque" && isAdmin && <Estoque db={db} updateDb={updateDb} pushToast={pushToast} />}
        {section === "clientes" && <Clientes db={db} role={role} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "vendedores" && isAdmin && <Vendedores db={db} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "comissoes" && <Comissoes db={db} role={role} updateDb={updateDb} pushToast={pushToast} />}
        {section === "financeiro" && isAdmin && <Financeiro db={db} updateDb={updateDb} pushToast={pushToast} askConfirm={askConfirm} />}
        {section === "relatorios" && isAdmin && <Relatorios db={db} />}
      </main>
    </div>
  );
}

function RoleSwitcher({ db, role, onChange }) {
  const [open, setOpen] = useState(false);
  const activeSellers = db.sellers.filter((s) => s.status === "ativa");
  const label = role.type === "admin" ? "Administradora" : (db.sellers.find((s) => s.id === role.sellerId)?.name || "Vendedora");

  return (
    <div className="role-switcher">
      <button className="role-switcher-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="role-switcher-icon">{role.type === "admin" ? <ShieldCheck size={14} /> : <UserCog size={14} />}</span>
        <span className="role-switcher-text">
          <span className="role-switcher-caption">Perfil ativo</span>
          <span className="role-switcher-name">{label}</span>
        </span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="role-switcher-menu">
          <button className={role.type === "admin" ? "role-option role-option-active" : "role-option"} onClick={() => { onChange({ type: "admin" }); setOpen(false); }}>
            <ShieldCheck size={14} /> Administradora
          </button>
          <p className="role-switcher-divider">Vendedoras</p>
          {activeSellers.length === 0 && <p className="role-switcher-empty">Nenhuma vendedora ativa</p>}
          {activeSellers.map((s) => (
            <button key={s.id} className={role.type === "vendedora" && role.sellerId === s.id ? "role-option role-option-active" : "role-option"} onClick={() => { onChange({ type: "vendedora", sellerId: s.id }); setOpen(false); }}>
              <UserCog size={14} /> {s.name}
            </button>
          ))}
        </div>
      )}
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

function Dashboard({ db, role, setSection }) {
  const [period, setPeriod] = useState("7dias");
  const [metric, setMetric] = useState("faturamento");
  const isAdmin = !role || role.type === "admin";
  const currentSeller = !isAdmin ? db.sellers.find((s) => s.id === role.sellerId) : null;

  const [rStart, rEnd] = dateRangeForPeriod(period);
  const baseSales = isAdmin ? db.sales : db.sales.filter((s) => s.sellerId === role.sellerId);
  const activeSales = baseSales.filter((s) => s.status !== "cancelada");

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
  const photoOf = (id) => db.products.find((p) => p.id === id)?.photo;

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
        if (!map[it.productId]) map[it.productId] = { productId: it.productId, name: it.productName, qty: 0, revenue: 0, profit: 0 };
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
          <p className="page-eyebrow">Olá, {isAdmin ? "Fabi" : currentSeller?.name?.split(" ")[0] || "vendedora"}! 👋</p>
          <h1 className="page-title">{isAdmin ? "Visão geral da loja" : "Suas vendas"}</h1>
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
        <StatCard icon={ShoppingBag} tone="forest" label={isAdmin ? "Vendas de hoje" : "Minhas vendas hoje"} value={`${todaySales.length} venda${todaySales.length === 1 ? "" : "s"}`} sub={money(todaySales.reduce((s, x) => s + x.total, 0))} />
        <StatCard icon={DollarSign} tone="gold" label="Faturamento" value={money(faturamento)} sub={`Período: ${PERIODS.find((p) => p.id === period)?.label}`} />
        {isAdmin && <StatCard icon={TrendingUp} tone="forest" label="Lucro estimado" value={money(lucro)} sub={faturamento ? `${((lucro / faturamento) * 100).toFixed(1)}% de margem` : "—"} />}
        <StatCard icon={Package} tone="gold" label="Produtos vendidos" value={`${unidadesVendidas} un.`} sub="unidades no período" />
        <StatCard icon={AlertTriangle} tone={lowStock.length ? "warn" : "forest"} label="Estoque baixo" value={`${lowStock.length} produto${lowStock.length === 1 ? "" : "s"}`} sub="abaixo do mínimo" />
        <StatCard icon={Percent} tone="gold" label={isAdmin ? "Comissões" : "Minha comissão"} value={money(comissaoGerada)} sub="geradas no período" />
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
                  <div className="list-simple-left">
                    <ProductThumb photo={p.photo} size={36} />
                    <div>
                      <p className="list-simple-title">{p.name}</p>
                      <p className="list-simple-sub">Estoque: {p.stock} · Mínimo: {p.minStock}</p>
                    </div>
                  </div>
                  {isAdmin && <button className="btn-outline btn-sm" onClick={() => setSection("estoque")}>Repor estoque</button>}
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
              <thead><tr><th>Produto</th><th>Qtd. vendida</th><th>Faturamento</th>{isAdmin && <th>Lucro</th>}</tr></thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i}>
                    <td><div className="cell-with-photo"><ProductThumb photo={photoOf(p.productId)} size={30} /><span>{p.name}</span></div></td>
                    <td>{p.qty} un.</td>
                    <td>{money(p.revenue)}</td>
                    {isAdmin && <td className="text-forest-strong">{money(p.profit)}</td>}
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

function Pdv({ db, role, updateDb, pushToast }) {
  const isAdmin = !role || role.type === "admin";
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // {productId, qty}
  const [sellerId, setSellerId] = useState(!isAdmin ? role.sellerId : (db.sellers.find((s) => s.status === "ativa")?.id || ""));
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

  useEffect(() => {
    if (!isAdmin) setSellerId(role.sellerId);
  }, [isAdmin, role.sellerId]);

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
                    <div className="product-card-photo">
                      <ProductThumb photo={p.photo} size={64} rounded={8} />
                    </div>
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

          <Field label="Vendedora responsável" required hint={!isAdmin ? "Perfil de vendedora: já selecionada automaticamente." : null}>
            <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} disabled={!isAdmin}>
              <option value="">Selecione…</option>
              {db.sellers.filter((s) => s.status === "ativa" || s.id === sellerId).map((s) => (
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
  const isDefaultBrand = !settings?.companyName || settings.companyName === "Fabi Cosméticos";
  return (
    <div className="receipt print-area">
      {isDefaultBrand ? (
        <img src={LOGO_DATA_URL} alt="Fabi Cosméticos" className="receipt-logo" />
      ) : (
        <p className="receipt-brand">{settings.companyName}</p>
      )}
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

function Vendas({ db, role, updateDb, pushToast, askConfirm }) {
  const isAdmin = !role || role.type === "admin";
  const [detail, setDetail] = useState(null);
  const [filters, setFilters] = useState({ from: "", to: "", sellerId: "", customerId: "", payment: "", status: "" });
  const [whatsappSale, setWhatsappSale] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const scopedSales = isAdmin ? db.sales : db.sales.filter((s) => s.sellerId === role.sellerId);
  const filtered = scopedSales.filter((s) => {
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
        <div><p className="page-eyebrow">Histórico</p><h1 className="page-title">{isAdmin ? "Vendas" : "Minhas vendas"}</h1></div>
      </div>

      <div className="card filter-bar">
        <div className="filter-grid">
          <Field label="De"><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></Field>
          <Field label="Até"><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></Field>
          {isAdmin && (
            <Field label="Vendedora">
              <select value={filters.sellerId} onChange={(e) => setFilters((f) => ({ ...f, sellerId: e.target.value }))}>
                <option value="">Todas</option>
                {db.sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          )}
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
              {detail.status !== "cancelada" && isAdmin && (
                <button className="btn-danger" onClick={() => cancelSale(detail)}><RotateCcw size={16} /> Estornar venda</button>
              )}
            </div>
            <Receipt sale={detail} customer={customerOf(detail.customerId)} settings={db.settings} />
          </div>
        )}
      </Modal>

      <WhatsappModal sale={whatsappSale} settings={db.settings} phone={whatsappPhone} setPhone={setWhatsappPhone} onClose={() => setWhatsappSale(null)} />
    </div>
  );
}

/* ============================== PRODUTOS ============================== */

const emptyProduct = { name: "", sku: "", barcode: "", category: "", brand: "", description: "", cost: "", price: "", stock: "", minStock: "5", unit: "un", status: "ativo", photo: null };

function Produtos({ db, role, updateDb, pushToast, askConfirm }) {
  const isAdmin = !role || role.type === "admin";
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [newCategory, setNewCategory] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  const onPhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { pushToast("Selecione um arquivo de imagem.", "error"); return; }
    setPhotoUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      setForm((f) => ({ ...f, photo: dataUrl }));
    } catch (err) {
      pushToast("Não foi possível carregar essa imagem.", "error");
    } finally {
      setPhotoUploading(false);
    }
  };

  const filtered = db.products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchesCat = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openNew = () => { setForm(emptyProduct); setEditingId(null); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, cost: String(p.cost), price: String(p.price), stock: String(p.stock), minStock: String(p.minStock), photo: p.photo || null }); setEditingId(p.id); setModalOpen(true); };

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
        {isAdmin && <button className="btn-gold" onClick={openNew}><Plus size={16} /> Novo produto</button>}
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
          <EmptyState icon={Package} title="Você ainda não possui produtos cadastrados." actionLabel={isAdmin ? "Cadastrar primeiro produto" : undefined} onAction={isAdmin ? openNew : undefined} />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Foto</th><th>Produto</th><th>Categoria</th>{isAdmin && <th>Custo</th>}<th>Venda</th>{isAdmin && <th>Margem</th>}<th>Estoque</th><th>Status</th>{isAdmin && <th></th>}</tr></thead>
              <tbody>
                {filtered.map((p) => {
                  const margin = p.cost > 0 ? (((p.price - p.cost) / p.cost) * 100).toFixed(0) : "—";
                  const st = stockStatus(p);
                  return (
                    <tr key={p.id}>
                      <td><ProductThumb photo={p.photo} size={38} /></td>
                      <td><p className="cell-strong">{p.name}</p><p className="cell-sub">{p.sku}</p></td>
                      <td>{p.category}</td>
                      {isAdmin && <td>{money(p.cost)}</td>}
                      <td>{money(p.price)}</td>
                      {isAdmin && <td>{margin === "—" ? margin : `${margin}%`}</td>}
                      <td>{st.dot} {p.stock}</td>
                      <td><Badge tone={p.status === "ativo" ? "success" : "neutral"}>{p.status === "ativo" ? "Ativo" : "Inativo"}</Badge></td>
                      {isAdmin && (
                        <td>
                          <div className="row-actions">
                            <button className="icon-btn" onClick={() => openEdit(p)}><Pencil size={15} /></button>
                            <button className="icon-btn icon-btn-danger" onClick={() => remove(p)}><Trash2 size={15} /></button>
                          </div>
                        </td>
                      )}
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
          <Field label="Foto do produto" span>
            <div className="photo-upload-row">
              <ProductThumb photo={form.photo} size={72} rounded={12} />
              <div className="photo-upload-actions">
                <label className="btn-outline btn-sm photo-upload-btn">
                  <ImagePlus size={14} /> {photoUploading ? "Carregando…" : form.photo ? "Trocar foto" : "Selecionar foto"}
                  <input type="file" accept="image/*" onChange={onPhotoSelected} style={{ display: "none" }} disabled={photoUploading} />
                </label>
                {form.photo && (
                  <button type="button" className="btn-outline btn-sm" onClick={() => setForm((f) => ({ ...f, photo: null }))}>
                    <X size={14} /> Remover foto
                  </button>
                )}
              </div>
            </div>
          </Field>
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

function Clientes({ db, role, updateDb, pushToast, askConfirm }) {
  const isAdmin = !role || role.type === "admin";
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
                          {isAdmin && <button className="icon-btn icon-btn-danger" onClick={() => remove(c)}><Trash2 size={15} /></button>}
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

function Comissoes({ db, role, updateDb, pushToast }) {
  const isAdmin = !role || role.type === "admin";
  const [filters, setFilters] = useState({ sellerId: "", from: "", to: "", status: "" });
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ date: new Date().toISOString().slice(0, 10), note: "" });

  const scoped = isAdmin ? db.sales : db.sales.filter((s) => s.sellerId === role.sellerId);
  const rows = scoped.filter((s) => s.status !== "cancelada").filter((s) => {
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
    const paidAtIso = new Date(payForm.date).toISOString();
    updateDb((prev) => ({
      ...prev,
      sales: prev.sales.map((s) => s.id === payModal.id ? { ...s, commissionStatus: "pago", commissionPaidAt: paidAtIso, commissionPaidNote: payForm.note } : s),
      financeTransactions: [
        { id: uid("fin"), date: paidAtIso, type: "saida", category: "comissao", description: `Comissão paga · ${payModal.sellerName} · Venda #${payModal.number}`, amount: payModal.commissionAmount, createdBy: "Fabi", registerId: null, relatedSaleId: payModal.id },
        ...prev.financeTransactions,
      ],
    }));
    pushToast(`Comissão da venda #${payModal.number} marcada como paga.`);
    setPayModal(null);
    setPayForm({ date: new Date().toISOString().slice(0, 10), note: "" });
  };

  const markPending = (s) => {
    updateDb((prev) => ({
      ...prev,
      sales: prev.sales.map((x) => x.id === s.id ? { ...x, commissionStatus: "pendente", commissionPaidAt: null } : x),
      financeTransactions: prev.financeTransactions.filter((t) => t.relatedSaleId !== s.id || t.category !== "comissao"),
    }));
    pushToast(`Comissão da venda #${s.number} marcada como pendente.`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Financeiro</p><h1 className="page-title">{isAdmin ? "Comissões" : "Minhas comissões"}</h1></div>
      </div>

      <div className="stat-grid stat-grid-3">
        <StatCard icon={Percent} tone="forest" label="Comissão gerada" value={money(totalGerado)} />
        <StatCard icon={Check} tone="forest" label="Comissão paga" value={money(totalPago)} />
        <StatCard icon={AlertTriangle} tone="gold" label="Comissão pendente" value={money(totalPendente)} />
      </div>

      <div className="card filter-bar">
        <div className="filter-grid">
          {isAdmin && (
            <Field label="Vendedora">
              <select value={filters.sellerId} onChange={(e) => setFilters((f) => ({ ...f, sellerId: e.target.value }))}>
                <option value="">Todas</option>
                {db.sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          )}
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
              <thead><tr><th>Vendedora</th><th>Venda</th><th>Data</th><th>Total vendido</th><th>%</th><th>Comissão</th><th>Status</th>{isAdmin && <th></th>}</tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>{s.sellerName}</td><td>#{s.number}</td><td>{fmtDate(s.date)}</td>
                    <td>{money(s.total)}</td><td>{s.commissionPercent}%</td>
                    <td className="text-gold-strong">{money(s.commissionAmount)}</td>
                    <td><Badge tone={s.commissionStatus === "pago" ? "success" : "warn"}>{s.commissionStatus === "pago" ? "Pago" : "Pendente"}</Badge></td>
                    {isAdmin && (
                      <td>
                        {s.commissionStatus === "pago" ? (
                          <button className="btn-outline btn-sm" onClick={() => markPending(s)}>Marcar pendente</button>
                        ) : (
                          <button className="btn-gold btn-sm" onClick={() => setPayModal(s)}>Marcar como paga</button>
                        )}
                      </td>
                    )}
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

/* ============================== FINANCEIRO ============================== */

function buildLedger(db) {
  const salesEntries = db.sales
    .filter((s) => s.status !== "cancelada")
    .map((s) => ({
      id: `sale-${s.id}`, date: s.date, type: "entrada", category: "venda",
      description: `Venda #${s.number} · ${s.sellerName}`, amount: s.total,
      method: s.payment, registerId: null, source: "venda",
    }));
  const manual = db.financeTransactions.map((t) => ({ ...t, source: "manual" }));
  return [...salesEntries, ...manual].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function Financeiro({ db, updateDb, pushToast, askConfirm }) {
  const [tab, setTab] = useState("lancamentos");
  const [filters, setFilters] = useState({ from: "", to: "", type: "" });
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txForm, setTxForm] = useState({ type: "saida", category: "despesa", description: "", amount: "", date: new Date().toISOString().slice(0, 10) });

  const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState({ initialAmount: "", openedBy: "Fabi" });
  const [movModal, setMovModal] = useState(null); // 'sangria' | 'reforco'
  const [movForm, setMovForm] = useState({ amount: "", description: "" });
  const [closeModal, setCloseModal] = useState(false);
  const [closeForm, setCloseForm] = useState({ informedBalance: "", note: "" });

  const ledger = useMemo(() => buildLedger(db), [db.sales, db.financeTransactions]);
  const filteredLedger = ledger.filter((t) => {
    if (filters.from && new Date(t.date) < startOfDay(filters.from)) return false;
    if (filters.to && new Date(t.date) > endOfDay(filters.to)) return false;
    if (filters.type && t.type !== filters.type) return false;
    return true;
  });
  const totalEntradas = filteredLedger.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount, 0);
  const totalSaidas = filteredLedger.filter((t) => t.type === "saida").reduce((s, t) => s + t.amount, 0);
  const saldo = totalEntradas - totalSaidas;

  const saveTransaction = () => {
    const amount = Number(txForm.amount);
    if (!txForm.description.trim() || !amount || amount <= 0) { pushToast("Preencha a descrição e um valor válido.", "error"); return; }
    updateDb((prev) => ({
      ...prev,
      financeTransactions: [{ id: uid("fin"), date: new Date(txForm.date).toISOString(), type: txForm.type, category: txForm.category, description: txForm.description.trim(), amount, createdBy: "Fabi", registerId: null }, ...prev.financeTransactions],
    }));
    pushToast("Lançamento registrado.");
    setTxModalOpen(false);
    setTxForm({ type: "saida", category: "despesa", description: "", amount: "", date: new Date().toISOString().slice(0, 10) });
  };

  const removeTransaction = (t) => {
    askConfirm({
      title: "Excluir lançamento", danger: true, confirmLabel: "Excluir",
      message: `Excluir o lançamento "${t.description}" no valor de ${money(t.amount)}?`,
      onConfirm: () => { updateDb((prev) => ({ ...prev, financeTransactions: prev.financeTransactions.filter((x) => x.id !== t.id) })); pushToast("Lançamento excluído."); },
    });
  };

  // ---- Caixa ----
  const openRegister = db.cashRegisters.find((r) => r.status === "aberto");

  const registerWindow = openRegister ? [new Date(openRegister.openedAt), new Date()] : null;
  const salesInWindow = registerWindow
    ? db.sales.filter((s) => s.status !== "cancelada" && new Date(s.date) >= registerWindow[0] && new Date(s.date) <= registerWindow[1])
    : [];
  const byMethod = (method) => salesInWindow.filter((s) => s.payment === method).reduce((s, x) => s + x.total, 0);
  const registerTx = openRegister ? db.financeTransactions.filter((t) => t.registerId === openRegister.id) : [];
  const reinforcements = registerTx.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount, 0);
  const withdrawals = registerTx.filter((t) => t.type === "saida" && t.category === "sangria").reduce((s, t) => s + t.amount, 0);
  const cashExpenses = registerTx.filter((t) => t.type === "saida" && t.category !== "sangria").reduce((s, t) => s + t.amount, 0);
  const salesCash = byMethod("dinheiro");
  const expectedBalance = openRegister ? openRegister.initialAmount + salesCash + reinforcements - withdrawals - cashExpenses : 0;

  const openCash = () => {
    const initial = Number(openForm.initialAmount) || 0;
    updateDb((prev) => ({
      ...prev,
      cashRegisters: [{
        id: uid("cx"), openedAt: todayISO(), openedBy: openForm.openedBy || "Fabi", initialAmount: initial, status: "aberto",
        closedAt: null, closedBy: null, salesCash: 0, salesPix: 0, salesDebit: 0, salesCredit: 0, salesOther: 0,
        reinforcements: 0, withdrawals: 0, expenses: 0, expectedBalance: initial, informedBalance: null, difference: null, note: "",
      }, ...prev.cashRegisters],
    }));
    pushToast("Caixa aberto.");
    setOpenModal(false);
    setOpenForm({ initialAmount: "", openedBy: "Fabi" });
  };

  const registerMovement = () => {
    const amount = Number(movForm.amount);
    if (!amount || amount <= 0) { pushToast("Informe um valor válido.", "error"); return; }
    const isSangria = movModal === "sangria";
    updateDb((prev) => ({
      ...prev,
      financeTransactions: [{
        id: uid("fin"), date: todayISO(), type: isSangria ? "saida" : "entrada", category: isSangria ? "sangria" : "reforco",
        description: movForm.description.trim() || (isSangria ? "Sangria de caixa" : "Reforço de caixa"), amount, createdBy: "Fabi", registerId: openRegister.id,
      }, ...prev.financeTransactions],
    }));
    pushToast(isSangria ? "Sangria registrada." : "Reforço registrado.");
    setMovModal(null);
    setMovForm({ amount: "", description: "" });
  };

  const closeCash = () => {
    const informed = Number(closeForm.informedBalance);
    if (closeForm.informedBalance === "" || isNaN(informed)) { pushToast("Informe o saldo contado no caixa.", "error"); return; }
    const difference = informed - expectedBalance;
    updateDb((prev) => ({
      ...prev,
      cashRegisters: prev.cashRegisters.map((r) => r.id === openRegister.id ? {
        ...r, status: "fechado", closedAt: todayISO(), closedBy: "Fabi",
        salesCash, salesPix: byMethod("pix"), salesDebit: byMethod("debito"), salesCredit: byMethod("credito"), salesOther: byMethod("outros"),
        reinforcements, withdrawals, expenses: cashExpenses, expectedBalance, informedBalance: informed, difference, note: closeForm.note,
      } : r),
    }));
    pushToast("Caixa fechado com sucesso.");
    setCloseModal(false);
    setCloseForm({ informedBalance: "", note: "" });
  };

  const exportLedgerCsv = () => {
    downloadCsv("financeiro.csv",
      ["Data", "Tipo", "Categoria", "Descrição", "Valor"],
      filteredLedger.map((t) => [fmtDateTime(t.date), t.type === "entrada" ? "Entrada" : "Saída", t.category, t.description, t.amount.toFixed(2)]));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Financeiro</p><h1 className="page-title">Fluxo de caixa</h1></div>
      </div>

      <div className="tabs">
        <button className={tab === "lancamentos" ? "tab-active" : ""} onClick={() => setTab("lancamentos")}><Wallet size={14} style={{ marginRight: 4 }} />Lançamentos</button>
        <button className={tab === "caixa" ? "tab-active" : ""} onClick={() => setTab("caixa")}><Landmark size={14} style={{ marginRight: 4 }} />Fechamento de caixa</button>
      </div>

      {tab === "lancamentos" ? (
        <>
          <div className="stat-grid stat-grid-3">
            <StatCard icon={ArrowUpCircle} tone="forest" label="Entradas" value={money(totalEntradas)} />
            <StatCard icon={ArrowDownCircle} tone="gold" label="Saídas" value={money(totalSaidas)} />
            <StatCard icon={DollarSign} tone={saldo >= 0 ? "forest" : "warn"} label="Saldo" value={money(saldo)} />
          </div>

          <div className="card filter-bar">
            <div className="filter-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <Field label="De"><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></Field>
              <Field label="Até"><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></Field>
              <Field label="Tipo">
                <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
                  <option value="">Todos</option><option value="entrada">Entradas</option><option value="saida">Saídas</option>
                </select>
              </Field>
            </div>
            <button className="btn-gold btn-sm" onClick={() => setTxModalOpen(true)}><Plus size={14} /> Novo lançamento</button>
            <button className="btn-outline btn-sm" onClick={exportLedgerCsv}><Download size={14} /> Exportar CSV</button>
          </div>

          <div className="card">
            {filteredLedger.length === 0 ? (
              <EmptyState icon={Landmark} title="Nenhum lançamento no período" />
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Data</th><th>Tipo</th><th>Categoria</th><th>Descrição</th><th>Valor</th><th></th></tr></thead>
                  <tbody>
                    {filteredLedger.map((t) => (
                      <tr key={t.id}>
                        <td>{fmtDateTime(t.date)}</td>
                        <td><Badge tone={t.type === "entrada" ? "success" : "danger"}>{t.type === "entrada" ? "Entrada" : "Saída"}</Badge></td>
                        <td style={{ textTransform: "capitalize" }}>{t.category}</td>
                        <td>{t.description}</td>
                        <td className={t.type === "entrada" ? "text-forest-strong" : "text-danger"}>{t.type === "entrada" ? "+ " : "− "}{money(t.amount)}</td>
                        <td>{t.source === "manual" && <button className="icon-btn icon-btn-danger" onClick={() => removeTransaction(t)}><Trash2 size={14} /></button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {!openRegister ? (
            <div className="card"><EmptyState icon={Landmark} title="Nenhum caixa aberto no momento" subtitle="Abra o caixa para começar a registrar sangrias, reforços e o fechamento do dia." actionLabel="Abrir caixa" onAction={() => setOpenModal(true)} /></div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h3>Caixa aberto</h3>
                <Badge tone="success">Aberto desde {fmtDateTime(openRegister.openedAt)}</Badge>
              </div>
              <div className="detail-grid">
                <div><p className="success-label">Operador(a)</p><p className="success-value">{openRegister.openedBy}</p></div>
                <div><p className="success-label">Saldo inicial</p><p className="success-value">{money(openRegister.initialAmount)}</p></div>
                <div><p className="success-label">Vendas em dinheiro</p><p className="success-value">{money(salesCash)}</p></div>
                <div><p className="success-label">Saldo esperado (dinheiro)</p><p className="success-value text-forest-strong">{money(expectedBalance)}</p></div>
              </div>
              <div className="totals-block">
                <div className="totals-row"><span>Vendas Pix</span><span>{money(byMethod("pix"))}</span></div>
                <div className="totals-row"><span>Vendas débito</span><span>{money(byMethod("debito"))}</span></div>
                <div className="totals-row"><span>Vendas crédito</span><span>{money(byMethod("credito"))}</span></div>
                <div className="totals-row"><span>Reforços</span><span>+ {money(reinforcements)}</span></div>
                <div className="totals-row"><span>Sangrias</span><span>− {money(withdrawals)}</span></div>
                <div className="totals-row"><span>Despesas lançadas no caixa</span><span>− {money(cashExpenses)}</span></div>
              </div>
              <div className="success-actions">
                <button className="btn-outline" onClick={() => setMovModal("sangria")}><ArrowDownCircle size={16} /> Sangria</button>
                <button className="btn-outline" onClick={() => setMovModal("reforco")}><ArrowUpCircle size={16} /> Reforço</button>
                <button className="btn-gold" onClick={() => setCloseModal(true)}><Lock size={16} /> Fechar caixa</button>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header"><h3>Histórico de fechamentos</h3></div>
            {db.cashRegisters.filter((r) => r.status === "fechado").length === 0 ? (
              <EmptyState icon={History} title="Nenhum fechamento registrado ainda" />
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Abertura</th><th>Fechamento</th><th>Operador(a)</th><th>Inicial</th><th>Esperado</th><th>Informado</th><th>Diferença</th></tr></thead>
                  <tbody>
                    {db.cashRegisters.filter((r) => r.status === "fechado").sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt)).map((r) => (
                      <tr key={r.id}>
                        <td>{fmtDateTime(r.openedAt)}</td><td>{fmtDateTime(r.closedAt)}</td><td>{r.closedBy}</td>
                        <td>{money(r.initialAmount)}</td><td>{money(r.expectedBalance)}</td><td>{money(r.informedBalance)}</td>
                        <td className={r.difference === 0 ? "" : r.difference > 0 ? "text-forest-strong" : "text-danger"}>
                          {r.difference > 0 ? "+ " : r.difference < 0 ? "− " : ""}{money(Math.abs(r.difference))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <Modal open={txModalOpen} onClose={() => setTxModalOpen(false)} title="Novo lançamento">
        <Field label="Tipo">
          <div className="segmented" style={{ width: "100%" }}>
            <button style={{ flex: 1 }} className={txForm.type === "saida" ? "seg-active" : ""} onClick={() => setTxForm((f) => ({ ...f, type: "saida", category: "despesa" }))}>Saída</button>
            <button style={{ flex: 1 }} className={txForm.type === "entrada" ? "seg-active" : ""} onClick={() => setTxForm((f) => ({ ...f, type: "entrada", category: "outro" }))}>Entrada</button>
          </div>
        </Field>
        <Field label="Categoria">
          <select value={txForm.category} onChange={(e) => setTxForm((f) => ({ ...f, category: e.target.value }))}>
            {FINANCE_CATEGORIES[txForm.type].map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Descrição" required><input value={txForm.description} onChange={(e) => setTxForm((f) => ({ ...f, description: e.target.value }))} placeholder="Ex: Compra de embalagens" /></Field>
        <div className="form-grid">
          <Field label="Valor" required><input type="number" min="0" step="0.01" value={txForm.amount} onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))} /></Field>
          <Field label="Data"><input type="date" value={txForm.date} onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))} /></Field>
        </div>
        <button className="btn-gold btn-block" onClick={saveTransaction}>Registrar lançamento</button>
      </Modal>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Abrir caixa">
        <Field label="Saldo inicial (dinheiro em caixa)"><input type="number" min="0" step="0.01" value={openForm.initialAmount} onChange={(e) => setOpenForm((f) => ({ ...f, initialAmount: e.target.value }))} /></Field>
        <Field label="Operador(a)"><input value={openForm.openedBy} onChange={(e) => setOpenForm((f) => ({ ...f, openedBy: e.target.value }))} /></Field>
        <button className="btn-gold btn-block" onClick={openCash}>Abrir caixa</button>
      </Modal>

      <Modal open={!!movModal} onClose={() => setMovModal(null)} title={movModal === "sangria" ? "Registrar sangria" : "Registrar reforço"}>
        <Field label="Valor" required><input type="number" min="0" step="0.01" value={movForm.amount} onChange={(e) => setMovForm((f) => ({ ...f, amount: e.target.value }))} /></Field>
        <Field label="Motivo"><input value={movForm.description} onChange={(e) => setMovForm((f) => ({ ...f, description: e.target.value }))} /></Field>
        <button className="btn-gold btn-block" onClick={registerMovement}>Confirmar</button>
      </Modal>

      <Modal open={closeModal} onClose={() => setCloseModal(false)} title="Fechar caixa">
        <div className="margin-preview" style={{ marginBottom: 12 }}>
          <p>Saldo esperado em dinheiro: <strong>{money(expectedBalance)}</strong></p>
        </div>
        <Field label="Saldo contado (informado)" required><input type="number" min="0" step="0.01" value={closeForm.informedBalance} onChange={(e) => setCloseForm((f) => ({ ...f, informedBalance: e.target.value }))} /></Field>
        {closeForm.informedBalance !== "" && !isNaN(Number(closeForm.informedBalance)) && (
          <p className={Number(closeForm.informedBalance) - expectedBalance === 0 ? "cell-sub" : "cancel-note"}>
            Diferença: {money(Number(closeForm.informedBalance) - expectedBalance)}
          </p>
        )}
        <Field label="Observação"><textarea rows={2} value={closeForm.note} onChange={(e) => setCloseForm((f) => ({ ...f, note: e.target.value }))} /></Field>
        <button className="btn-gold btn-block" onClick={closeCash}>Confirmar fechamento</button>
      </Modal>
    </div>
  );
}

/* ============================== RELATÓRIOS ============================== */

function Relatorios({ db }) {
  const [tab, setTab] = useState("vendas");
  return (
    <div className="page">
      <div className="page-header">
        <div><p className="page-eyebrow">Análises</p><h1 className="page-title">Relatórios</h1></div>
      </div>
      <div className="tabs">
        <button className={tab === "vendas" ? "tab-active" : ""} onClick={() => setTab("vendas")}>Vendas</button>
        <button className={tab === "comissoes" ? "tab-active" : ""} onClick={() => setTab("comissoes")}>Comissões</button>
        <button className={tab === "estoque" ? "tab-active" : ""} onClick={() => setTab("estoque")}>Estoque</button>
        <button className={tab === "produtos" ? "tab-active" : ""} onClick={() => setTab("produtos")}>Produtos</button>
      </div>
      {tab === "vendas" && <RelatorioVendas db={db} />}
      {tab === "comissoes" && <RelatorioComissoes db={db} />}
      {tab === "estoque" && <RelatorioEstoque db={db} />}
      {tab === "produtos" && <RelatorioProdutos db={db} />}
    </div>
  );
}

function RelatorioVendas({ db }) {
  const [filters, setFilters] = useState({ from: "", to: "", sellerId: "", payment: "", status: "" });
  const rows = db.sales.filter((s) => {
    if (filters.from && new Date(s.date) < startOfDay(filters.from)) return false;
    if (filters.to && new Date(s.date) > endOfDay(filters.to)) return false;
    if (filters.sellerId && s.sellerId !== filters.sellerId) return false;
    if (filters.payment && s.payment !== filters.payment) return false;
    if (filters.status && s.status !== filters.status) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
  const validRows = rows.filter((s) => s.status !== "cancelada");
  const totalVendido = validRows.reduce((s, x) => s + x.total, 0);
  const ticketMedio = validRows.length ? totalVendido / validRows.length : 0;
  const customerOf = (id) => db.customers.find((c) => c.id === id);

  const exportCsv = () => downloadCsv("relatorio-vendas.csv",
    ["Nº", "Data", "Cliente", "Vendedora", "Total", "Pagamento", "Status"],
    rows.map((s) => [s.number, fmtDateTime(s.date), customerOf(s.customerId)?.name || "Não identificado", s.sellerName, s.total.toFixed(2), s.payment, s.status]));

  return (
    <div className="page" style={{ gap: 14 }}>
      <div className="stat-grid stat-grid-3">
        <StatCard icon={DollarSign} tone="forest" label="Total vendido" value={money(totalVendido)} />
        <StatCard icon={ReceiptIcon} tone="gold" label="Nº de vendas" value={validRows.length} />
        <StatCard icon={TrendingUp} tone="forest" label="Ticket médio" value={money(ticketMedio)} />
      </div>
      <div className="card filter-bar">
        <div className="filter-grid">
          <Field label="De"><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></Field>
          <Field label="Até"><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></Field>
          <Field label="Vendedora">
            <select value={filters.sellerId} onChange={(e) => setFilters((f) => ({ ...f, sellerId: e.target.value }))}>
              <option value="">Todas</option>{db.sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Pagamento">
            <select value={filters.payment} onChange={(e) => setFilters((f) => ({ ...f, payment: e.target.value }))}>
              <option value="">Todas</option>{PAYMENT_METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              <option value="">Todos</option><option value="concluida">Concluída</option><option value="cancelada">Cancelada</option>
            </select>
          </Field>
        </div>
        <button className="btn-outline btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <div className="card">
        {rows.length === 0 ? <EmptyState icon={ReceiptIcon} title="Nenhuma venda encontrada" /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Nº</th><th>Data</th><th>Cliente</th><th>Vendedora</th><th>Total</th><th>Pagamento</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.number}</td><td>{fmtDate(s.date)}</td><td>{customerOf(s.customerId)?.name || "Não identificado"}</td>
                    <td>{s.sellerName}</td><td>{money(s.total)}</td><td>{PAYMENT_METHODS.find((m) => m.id === s.payment)?.label}</td>
                    <td><Badge tone={s.status === "cancelada" ? "danger" : "success"}>{s.status === "cancelada" ? "Cancelada" : "Concluída"}</Badge></td>
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

function RelatorioComissoes({ db }) {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const validSales = db.sales.filter((s) => s.status !== "cancelada").filter((s) => {
    if (filters.from && new Date(s.date) < startOfDay(filters.from)) return false;
    if (filters.to && new Date(s.date) > endOfDay(filters.to)) return false;
    return true;
  });
  const rows = db.sellers.map((seller) => {
    const sales = validSales.filter((s) => s.sellerId === seller.id);
    const totalVendido = sales.reduce((s, x) => s + x.total, 0);
    const gerada = sales.reduce((s, x) => s + x.commissionAmount, 0);
    const paga = sales.filter((s) => s.commissionStatus === "pago").reduce((s, x) => s + x.commissionAmount, 0);
    return { seller, nVendas: sales.length, totalVendido, gerada, paga, pendente: gerada - paga };
  });
  const exportCsv = () => downloadCsv("relatorio-comissoes.csv",
    ["Vendedora", "Nº vendas", "Total vendido", "%", "Comissão gerada", "Paga", "Pendente"],
    rows.map((r) => [r.seller.name, r.nVendas, r.totalVendido.toFixed(2), r.seller.commissionPercent, r.gerada.toFixed(2), r.paga.toFixed(2), r.pendente.toFixed(2)]));

  return (
    <div className="page" style={{ gap: 14 }}>
      <div className="card filter-bar">
        <div className="filter-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <Field label="De"><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></Field>
          <Field label="Até"><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></Field>
        </div>
        <button className="btn-outline btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Vendedora</th><th>Nº vendas</th><th>Total vendido</th><th>%</th><th>Gerada</th><th>Paga</th><th>Pendente</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.seller.id}>
                  <td>{r.seller.name}</td><td>{r.nVendas}</td><td>{money(r.totalVendido)}</td>
                  <td>{r.seller.commissionPercent}%</td><td className="text-gold-strong">{money(r.gerada)}</td>
                  <td className="text-forest-strong">{money(r.paga)}</td><td>{money(r.pendente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RelatorioEstoque({ db }) {
  const totalInvestido = db.products.reduce((s, p) => s + p.cost * p.stock, 0);
  const semEstoque = db.products.filter((p) => p.stock <= 0).length;
  const baixoEstoque = db.products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const exportCsv = () => downloadCsv("relatorio-estoque.csv",
    ["Produto", "Código", "Atual", "Mínimo", "Custo", "Valor investido", "Status"],
    db.products.map((p) => [p.name, p.sku, p.stock, p.minStock, p.cost.toFixed(2), (p.cost * p.stock).toFixed(2), stockStatus(p).label]));

  return (
    <div className="page" style={{ gap: 14 }}>
      <div className="stat-grid stat-grid-3">
        <StatCard icon={DollarSign} tone="forest" label="Valor investido em estoque" value={money(totalInvestido)} />
        <StatCard icon={AlertTriangle} tone="gold" label="Produtos com estoque baixo" value={baixoEstoque} />
        <StatCard icon={AlertTriangle} tone="warn" label="Produtos sem estoque" value={semEstoque} />
      </div>
      <div className="card filter-bar" style={{ justifyContent: "flex-end" }}>
        <button className="btn-outline btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Foto</th><th>Produto</th><th>Atual</th><th>Mínimo</th><th>Custo</th><th>Valor investido</th><th>Status</th></tr></thead>
            <tbody>
              {db.products.map((p) => {
                const st = stockStatus(p);
                return (
                  <tr key={p.id}>
                    <td><ProductThumb photo={p.photo} size={32} /></td>
                    <td>{p.name}</td><td>{p.stock}</td><td>{p.minStock}</td>
                    <td>{money(p.cost)}</td><td>{money(p.cost * p.stock)}</td>
                    <td style={{ color: st.color, fontWeight: 600 }}>{st.dot} {st.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RelatorioProdutos({ db }) {
  const [order, setOrder] = useState("mais");
  const stats = useMemo(() => {
    const map = Object.fromEntries(db.products.map((p) => [p.id, { productId: p.id, name: p.name, photo: p.photo, qty: 0, revenue: 0 }]));
    db.sales.filter((s) => s.status !== "cancelada").forEach((s) => {
      s.items.forEach((it) => {
        if (!map[it.productId]) map[it.productId] = { productId: it.productId, name: it.productName, photo: null, qty: 0, revenue: 0 };
        map[it.productId].qty += it.qty;
        map[it.productId].revenue += it.price * it.qty;
      });
    });
    return Object.values(map);
  }, [db.products, db.sales]);

  const sorted = [...stats].sort((a, b) => {
    if (order === "mais") return b.qty - a.qty;
    if (order === "menos") return a.qty - b.qty;
    return b.revenue - a.revenue;
  });

  const exportCsv = () => downloadCsv("relatorio-produtos.csv", ["Produto", "Qtd. vendida", "Faturamento"], sorted.map((p) => [p.name, p.qty, p.revenue.toFixed(2)]));

  return (
    <div className="page" style={{ gap: 14 }}>
      <div className="card filter-bar">
        <div className="metric-toggle">
          <button className={`chip ${order === "mais" ? "chip-active" : ""}`} onClick={() => setOrder("mais")}>Mais vendidos</button>
          <button className={`chip ${order === "menos" ? "chip-active" : ""}`} onClick={() => setOrder("menos")}>Menos vendidos</button>
          <button className={`chip ${order === "receita" ? "chip-active" : ""}`} onClick={() => setOrder("receita")}>Maior faturamento</button>
        </div>
        <button className="btn-outline btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Produto</th><th>Qtd. vendida</th><th>Faturamento</th></tr></thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.productId}>
                  <td><div className="cell-with-photo"><ProductThumb photo={p.photo} size={30} /><span>{p.name}</span></div></td>
                  <td>{p.qty} un.</td><td>{money(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
        width: 48px; height: 48px; border-radius: 12px; background: #fff;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        padding: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      }
      .brand-mark-img { width: 100%; height: 100%; object-fit: contain; display: block; }
      .brand-mark-sm { width: 34px; height: 34px; border-radius: 9px; padding: 3px; }
      .brand-name { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 15px; line-height: 1.2; color: #fff; }
      .brand-sub { font-size: 11px; color: rgba(255,255,255,0.65); margin: 0; line-height: 1.35; }
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

      /* Role switcher */
      .role-switcher { position: relative; margin: 10px 0 4px; }
      .role-switcher-trigger { width: 100%; display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 10px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #fff; }
      .role-switcher-icon { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 7px; background: rgba(201,162,39,0.2); color: var(--gold-400); flex-shrink: 0; }
      .role-switcher-text { flex: 1; text-align: left; display: flex; flex-direction: column; min-width: 0; }
      .role-switcher-caption { font-size: 10px; color: rgba(255,255,255,0.5); }
      .role-switcher-name { font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .role-switcher-menu { position: absolute; bottom: calc(100% + 6px); left: 0; right: 0; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); padding: 8px; z-index: 30; max-height: 260px; overflow-y: auto; }
      .role-option { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 9px; border-radius: 8px; font-size: 13px; color: var(--ink); text-align: left; }
      .role-option:hover { background: var(--cream); }
      .role-option-active { background: var(--gold-100); color: var(--gold-600); font-weight: 600; }
      .role-switcher-divider { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); padding: 8px 9px 3px; margin: 0; }
      .role-switcher-empty { font-size: 12px; color: var(--ink-soft); padding: 4px 9px 6px; margin: 0; }

      /* Product thumbnails */
      .product-thumb { object-fit: cover; flex-shrink: 0; background: #EFEDE5; }
      .product-thumb-empty { display: flex; align-items: center; justify-content: center; color: var(--ink-soft); }
      .product-card-photo { display: flex; justify-content: center; margin-bottom: 2px; }
      .list-simple-left { display: flex; align-items: center; gap: 10px; }
      .cell-with-photo { display: flex; align-items: center; gap: 8px; }

      /* Photo upload */
      .photo-upload-row { display: flex; align-items: center; gap: 14px; }
      .photo-upload-actions { display: flex; flex-direction: column; gap: 6px; }
      .photo-upload-btn { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }

      /* Finance / reports */
      .stat-grid-3 { grid-template-columns: repeat(3, 1fr); }

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
      .loading-logo { width: 96px; height: auto; animation: pulse 1.4s ease-in-out infinite; }
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
      .receipt-logo { display: block; margin: 0 auto 6px; height: 100px; width: auto; max-width: 100%; object-fit: contain; }
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

      @media print {
        body * { visibility: hidden !important; }
        .receipt, .receipt * { visibility: visible !important; }
        .receipt {
          position: fixed !important;
          top: 0; left: 0; right: 0;
          margin: 0 auto;
          width: 100%;
          max-width: 420px;
          border: none;
          background: #fff;
          padding: 28px 22px;
        }
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
