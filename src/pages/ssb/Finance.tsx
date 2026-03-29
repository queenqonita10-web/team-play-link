import { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockInvoices, mockPlayers } from "@/data/mock";
import { Invoice, PaymentStatus, PaymentType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, AlertTriangle, Clock, TrendingUp, Plus, FileText, Sheet, Bell, CreditCard } from "lucide-react";
import PaymentDialog from "@/components/ssb/PaymentDialog";
import BillGenerator from "@/components/ssb/BillGenerator";
import PaymentNotification from "@/components/ssb/PaymentNotification";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function Finance() {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [payDialog, setPayDialog] = useState<{ open: boolean; invoice: Invoice | null; playerName: string }>({ open: false, invoice: null, playerName: "" });
  const [billGenOpen, setBillGenOpen] = useState(false);
  const [notifDialog, setNotifDialog] = useState<{ open: boolean; invoice: Invoice | null; playerName: string; phone: string; email: string }>({ open: false, invoice: null, playerName: "", phone: "", email: "" });

  const getPlayer = (id: string) => mockPlayers.find((p) => p.id === id);

  // Summary stats
  const totalIncome = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const overdueTotal = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const thisMonthPaid = invoices.filter((i) => i.status === "paid" && i.createdAt.startsWith("2026-03")).reduce((s, i) => s + i.amount, 0);

  // Chart data
  const chartData = useMemo(() => {
    const months = ["2026-01", "2026-02", "2026-03"];
    return months.map((m) => ({
      month: m.split("-")[1] === "01" ? "Jan" : m.split("-")[1] === "02" ? "Feb" : "Mar",
      income: invoices.filter((i) => i.status === "paid" && i.createdAt.startsWith(m)).reduce((s, i) => s + i.amount, 0),
      pending: invoices.filter((i) => (i.status === "pending" || i.status === "overdue") && i.createdAt.startsWith(m)).reduce((s, i) => s + i.amount, 0),
    }));
  }, [invoices]);

  // Unique months
  const months = [...new Set(invoices.map((i) => i.createdAt.substring(0, 7)))].sort();

  // Filtered invoices
  const filtered = invoices.filter((i) => {
    if (filterMonth !== "all" && !i.createdAt.startsWith(filterMonth)) return false;
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    if (filterType !== "all" && i.type !== filterType) return false;
    return true;
  });

  const statusBadge = (status: PaymentStatus) => {
    const variants: Record<PaymentStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      paid: { variant: "default", label: t.common.paid },
      pending: { variant: "outline", label: t.ssb.pending },
      unpaid: { variant: "secondary", label: t.common.unpaid },
      overdue: { variant: "destructive", label: t.ssb.overdue },
    };
    const v = variants[status];
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  const typeLabel = (type: PaymentType) => {
    const labels: Record<PaymentType, string> = { monthly: t.ssb.monthlyDues, registration: t.ssb.registration, event: t.ssb.eventFee };
    return labels[type];
  };

  const handlePaid = (invoiceId: string, method: "midtrans" | "xendit" | "manual") => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: "paid" as const, paidDate: new Date().toISOString().split("T")[0], paymentMethod: method } : i))
    );
  };

  const handleGenerate = (newInvoices: Invoice[]) => {
    setInvoices((prev) => [...prev, ...newInvoices]);
  };

  const handleExport = (type: "pdf" | "excel") => {
    toast({ title: type === "pdf" ? t.ssb.exportPDF : t.ssb.exportExcel, description: t.ssb.exportNotReady });
  };

  const stats = [
    { label: t.ssb.totalIncome, value: fmt(totalIncome), icon: DollarSign, color: "text-emerald-500" },
    { label: t.ssb.outstanding, value: fmt(outstanding), icon: Clock, color: "text-amber-500" },
    { label: t.ssb.overdue, value: fmt(overdueTotal), icon: AlertTriangle, color: "text-destructive" },
    { label: t.ssb.thisMonth, value: fmt(thisMonthPaid), icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.ssb.finance}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4 mr-1" /> {t.ssb.exportPDF}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
            <Sheet className="h-4 w-4 mr-1" /> {t.ssb.exportExcel}
          </Button>
          <Button size="sm" onClick={() => setBillGenOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> {t.ssb.generateBills}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.ssb.totalIncome}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} className="text-xs" />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={t.common.paid} />
              <Bar dataKey="pending" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name={t.ssb.pending} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterMonth} onValueChange={setFilterMonth}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t.ssb.selectMonth} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.ssb.selectMonth}</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t.ssb.allStatuses} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.ssb.allStatuses}</SelectItem>
            <SelectItem value="paid">{t.common.paid}</SelectItem>
            <SelectItem value="pending">{t.ssb.pending}</SelectItem>
            <SelectItem value="overdue">{t.ssb.overdue}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t.ssb.allTypes} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.ssb.allTypes}</SelectItem>
            <SelectItem value="monthly">{t.ssb.monthlyDues}</SelectItem>
            <SelectItem value="registration">{t.ssb.registration}</SelectItem>
            <SelectItem value="event">{t.ssb.eventFee}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.ssb.playerName}</TableHead>
                <TableHead>{t.ssb.type}</TableHead>
                <TableHead>{t.ssb.amount}</TableHead>
                <TableHead>{t.ssb.dueDate}</TableHead>
                <TableHead className="text-center">{t.common.status}</TableHead>
                <TableHead className="text-right">{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const player = getPlayer(inv.playerId);
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{player?.name || "-"}</TableCell>
                    <TableCell className="text-sm">{typeLabel(inv.type)}</TableCell>
                    <TableCell>{fmt(inv.amount)}</TableCell>
                    <TableCell className="text-sm">{inv.dueDate}</TableCell>
                    <TableCell className="text-center">{statusBadge(inv.status)}</TableCell>
                    <TableCell className="text-right">
                      {inv.status !== "paid" && (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPayDialog({ open: true, invoice: inv, playerName: player?.name || "" })}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          {(inv.status === "overdue" || inv.status === "pending") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNotifDialog({
                                  open: true,
                                  invoice: inv,
                                  playerName: player?.name || "",
                                  phone: player?.parentPhone || "",
                                  email: player?.parentEmail || "",
                                })
                              }
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentDialog
        invoice={payDialog.invoice}
        playerName={payDialog.playerName}
        open={payDialog.open}
        onOpenChange={(open) => setPayDialog((p) => ({ ...p, open }))}
        onPaid={handlePaid}
      />
      <BillGenerator open={billGenOpen} onOpenChange={setBillGenOpen} onGenerate={handleGenerate} />
      <PaymentNotification
        invoice={notifDialog.invoice}
        playerName={notifDialog.playerName}
        parentPhone={notifDialog.phone}
        parentEmail={notifDialog.email}
        open={notifDialog.open}
        onOpenChange={(open) => setNotifDialog((p) => ({ ...p, open }))}
      />
    </div>
  );
}
