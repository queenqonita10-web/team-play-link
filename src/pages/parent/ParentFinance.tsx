import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function ParentFinance() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tagihan & Iuran</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Riwayat Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Lihat tagihan dan riwayat pembayaran iuran bulanan.</p>
        </CardContent>
      </Card>
    </div>
  );
}