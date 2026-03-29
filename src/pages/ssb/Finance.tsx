import { useLanguage } from "@/i18n/LanguageContext";
import { mockPayments, mockPlayers } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Finance() {
  const { t } = useLanguage();

  const rows = mockPayments.map((p) => {
    const player = mockPlayers.find((pl) => pl.id === p.playerId);
    return { ...p, playerName: player?.name || "" };
  });

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.ssb.finance}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground">{t.common.paid}</div>
            <div className="text-2xl font-bold text-primary">{rows.filter(r => r.status === "paid").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground">{t.common.unpaid}</div>
            <div className="text-2xl font-bold text-amber-500">{rows.filter(r => r.status === "unpaid").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.ssb.playerName}</TableHead>
                <TableHead>{t.ssb.monthlyFee}</TableHead>
                <TableHead className="text-center">{t.ssb.paymentStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.playerName}</TableCell>
                  <TableCell>{fmt(r.amount)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={r.status === "paid" ? "default" : "secondary"}>
                      {r.status === "paid" ? t.common.paid : t.common.unpaid}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
