import * as React from "react";
import { CreditCard, ShieldCheck, AlertCircle, CheckCircle2, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentPortalProps {
  invoiceId: string;
  amount: number;
  description: string;
  onSuccess: (trxId: string) => void;
  onCancel: () => void;
}

export function PaymentPortal({ invoiceId, amount, description, onSuccess, onCancel }: PaymentPortalProps) {
  const { toast } = useToast();
  const [step, setStep] = React.useState<"method" | "processing" | "success">("method");
  const [method, setMethod] = React.useState<string>("virtual_account");

  const handlePay = () => {
    setStep("processing");
    
    // Simulate Payment Gateway (Midtrans/Xendit) processing
    setTimeout(() => {
      const trxId = `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setStep("success");
      onSuccess(trxId);
      toast({
        title: "Payment Successful",
        description: `Transaction ${trxId} has been verified.`,
      });
    }, 2000);
  };

  return (
    <Card className="max-w-md mx-auto border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Payment Checkout</CardTitle>
            <CardDescription className="mt-1">Secure payment via Team Play Link Gateway</CardDescription>
          </div>
          <Badge variant="outline" className="bg-background text-[10px] py-0">SECURE</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {step === "method" && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-primary">Rp {amount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">{description} (Inv: {invoiceId})</p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Select Payment Method</Label>
              <RadioGroup value={method} onValueChange={setMethod} className="grid gap-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="virtual_account" id="va" />
                  <Label htmlFor="va" className="flex-1 cursor-pointer flex justify-between items-center">
                    <span>Virtual Account (Mandiri/BCA)</span>
                    <Badge variant="secondary" className="text-[10px]">Instant</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="ewallet" id="ewallet" />
                  <Label htmlFor="ewallet" className="flex-1 cursor-pointer flex justify-between items-center">
                    <span>E-Wallet (GoPay/OVO/ShopeePay)</span>
                    <Badge variant="secondary" className="text-[10px]">QRIS</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="credit_card" id="cc" />
                  <Label htmlFor="cc" className="flex-1 cursor-pointer flex justify-between items-center">
                    <span>Credit Card / Debit Online</span>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 p-2 rounded">
              <ShieldCheck className="h-3 w-3 text-green-600" />
              Your data is encrypted and processed securely by licensed payment providers.
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="font-bold text-lg">Processing Transaction</h3>
              <p className="text-sm text-muted-foreground">Please do not close or refresh this window...</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-black text-2xl text-green-900">Payment Success!</h3>
              <p className="text-sm text-green-700 mt-1">Thank you for your payment.</p>
            </div>
            <div className="w-full bg-muted/50 p-4 rounded-lg border text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice:</span>
                <span className="font-mono">{invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 border-t bg-muted/10 pt-4">
        {step === "method" && (
          <>
            <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button className="flex-1" onClick={handlePay}>Pay Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </>
        )}
        {step === "success" && (
          <Button className="w-full" onClick={onCancel}>Return to Dashboard</Button>
        )}
      </CardFooter>
    </Card>
  );
}
