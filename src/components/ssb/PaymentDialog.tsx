import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, HandCoins } from "lucide-react";

interface PaymentDialogProps {
  invoice: Invoice | null;
  playerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: (invoiceId: string, method: "midtrans" | "xendit" | "manual") => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function PaymentDialog({ invoice, playerName, open, onOpenChange, onPaid }: PaymentDialogProps) {
  const { t } = useLanguage();
  const [method, setMethod] = useState<"midtrans" | "xendit" | "manual">("manual");
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split("T")[0]);

  if (!invoice) return null;

  const handlePay = () => {
    if (method === "midtrans" || method === "xendit") {
      toast({ title: t.ssb.paymentGateway, description: t.ssb.gatewayNotReady });
    }
    onPaid(invoice.id, method);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.ssb.invoiceDetail}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.ssb.playerName}</span>
              <span className="font-medium">{playerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.ssb.description}</span>
              <span className="font-medium">{invoice.description}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.ssb.amount}</span>
              <span className="font-bold text-primary">{fmt(invoice.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.ssb.dueDate}</span>
              <span>{invoice.dueDate}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">{t.ssb.paymentMethod}</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as typeof method)} className="space-y-2">
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="midtrans" id="midtrans" />
                <CreditCard className="h-4 w-4 text-blue-500" />
                <Label htmlFor="midtrans" className="cursor-pointer flex-1">{t.ssb.midtrans}</Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="xendit" id="xendit" />
                <Smartphone className="h-4 w-4 text-indigo-500" />
                <Label htmlFor="xendit" className="cursor-pointer flex-1">{t.ssb.xendit}</Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="manual" id="manual" />
                <HandCoins className="h-4 w-4 text-emerald-500" />
                <Label htmlFor="manual" className="cursor-pointer flex-1">{t.ssb.manual}</Label>
              </div>
            </RadioGroup>
          </div>

          {method === "manual" && (
            <div className="space-y-2">
              <Label>{t.ssb.paidDate}</Label>
              <Input type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
            </div>
          )}

          <Button onClick={handlePay} className="w-full">
            {method === "manual" ? t.ssb.markAsPaid : t.ssb.redirectToGateway}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
