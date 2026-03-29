import { useLanguage } from "@/i18n/LanguageContext";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Mail } from "lucide-react";

interface PaymentNotificationProps {
  invoice: Invoice | null;
  playerName: string;
  parentPhone: string;
  parentEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function PaymentNotification({ invoice, playerName, parentPhone, parentEmail, open, onOpenChange }: PaymentNotificationProps) {
  const { t } = useLanguage();

  if (!invoice) return null;

  const waMessage = `Yth. Orang Tua/Wali ${playerName},\n\nMohon segera melakukan pembayaran:\n📋 ${invoice.description}\n💰 ${fmt(invoice.amount)}\n📅 Jatuh tempo: ${invoice.dueDate}\n\nTerima kasih.\n— SSB Garuda Muda`;

  const emailMessage = `Subject: Pengingat Pembayaran - ${invoice.description}\n\nKepada Orang Tua/Wali ${playerName},\n\nKami mengingatkan bahwa tagihan berikut belum dibayar:\n\nDeskripsi: ${invoice.description}\nJumlah: ${fmt(invoice.amount)}\nJatuh Tempo: ${invoice.dueDate}\n\nMohon segera melakukan pembayaran.\n\nHormat kami,\nSSB Garuda Muda`;

  const handleSend = (channel: "whatsapp" | "email") => {
    toast({ title: t.ssb.notificationSent, description: `${channel === "whatsapp" ? "WhatsApp" : "Email"} → ${channel === "whatsapp" ? parentPhone : parentEmail}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.ssb.sendReminder}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-500" /> {t.ssb.reminderWhatsApp}
            </h4>
            <pre className="text-xs bg-muted/50 p-3 rounded-lg whitespace-pre-wrap font-sans">{waMessage}</pre>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => handleSend("whatsapp")}>
              <MessageCircle className="h-4 w-4 mr-2" /> {t.ssb.sendReminder} WhatsApp ({parentPhone})
            </Button>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" /> {t.ssb.reminderEmail}
            </h4>
            <pre className="text-xs bg-muted/50 p-3 rounded-lg whitespace-pre-wrap font-sans">{emailMessage}</pre>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => handleSend("email")}>
              <Mail className="h-4 w-4 mr-2" /> {t.ssb.sendReminder} Email ({parentEmail})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
