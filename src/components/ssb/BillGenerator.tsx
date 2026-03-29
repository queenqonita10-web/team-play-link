import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockPlayers } from "@/data/mock";
import { Invoice, PaymentType } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface BillGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (invoices: Invoice[]) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function BillGenerator({ open, onOpenChange, onGenerate }: BillGeneratorProps) {
  const { t } = useLanguage();
  const [month, setMonth] = useState("2026-04");
  const [type, setType] = useState<PaymentType>("monthly");
  const [amount, setAmount] = useState("250000");
  const [description, setDescription] = useState("");

  const activePlayers = mockPlayers.filter((p) => p.status === "active");

  const typeLabels: Record<PaymentType, string> = {
    monthly: t.ssb.monthlyDues,
    registration: t.ssb.registration,
    event: t.ssb.eventFee,
  };

  const handleGenerate = () => {
    const newInvoices: Invoice[] = activePlayers.map((player, i) => ({
      id: `gen-${Date.now()}-${i}`,
      playerId: player.id,
      type,
      description: description || `${typeLabels[type]} - ${month}`,
      amount: parseInt(amount) || 0,
      status: "pending" as const,
      dueDate: `${month}-10`,
      createdAt: new Date().toISOString().split("T")[0],
    }));
    onGenerate(newInvoices);
    onOpenChange(false);
    toast({ title: t.ssb.billGenerated, description: `${newInvoices.length} invoices` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.ssb.generateBills}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.ssb.selectMonth}</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.ssb.type}</Label>
            <Select value={type} onValueChange={(v) => setType(v as PaymentType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t.ssb.monthlyDues}</SelectItem>
                <SelectItem value="registration">{t.ssb.registration}</SelectItem>
                <SelectItem value="event">{t.ssb.eventFee}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t.ssb.amount}</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.ssb.description}</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={typeLabels[type]} />
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <div className="text-sm text-muted-foreground mb-2">Preview: {activePlayers.length} pemain aktif</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {activePlayers.map((p) => (
                <div key={p.id} className="flex justify-between text-xs">
                  <span>{p.name}</span>
                  <span className="font-medium">{fmt(parseInt(amount) || 0)}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full">{t.ssb.generateBills} ({activePlayers.length})</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
