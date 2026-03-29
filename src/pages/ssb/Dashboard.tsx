import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPlayers, mockInvoices, mockTrainingSessions } from "@/data/mock";
import { Users, ClipboardCheck, Wallet, Calendar } from "lucide-react";

export default function SSBDashboard() {
  const { t } = useLanguage();
  const pendingCount = mockInvoices.filter((i) => i.status === "pending" || i.status === "overdue").length;
  const upcoming = mockTrainingSessions.filter((s) => s.date >= "2026-03-29").length;

  const stats = [
    { label: t.ssb.totalPlayers, value: mockPlayers.length, icon: Users, color: "text-primary" },
    { label: t.ssb.todayAttendance, value: "75%", icon: ClipboardCheck, color: "text-emerald-500" },
    { label: t.ssb.pendingPayments, value: pendingCount, icon: Wallet, color: "text-amber-500" },
    { label: t.ssb.upcomingTraining, value: upcoming, icon: Calendar, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.ssb.dashboard}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">{t.ssb.upcomingTraining}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockTrainingSessions.slice(0, 3).map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-sm">{s.group} · {s.ageCategory}</div>
                <div className="text-xs text-muted-foreground">{s.coach} · {s.venue}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{s.date}</div>
                <div className="text-xs text-muted-foreground">{s.time}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
