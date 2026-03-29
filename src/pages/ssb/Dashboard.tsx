import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockPlayers, mockInvoices, mockTrainingSessions } from "@/data/mock";
import { Users, ClipboardCheck, Wallet, Calendar, ArrowRight, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function SSBDashboard() {
  const { t } = useLanguage();
  const pendingCount = mockInvoices.filter((i) => i.status === "pending" || i.status === "overdue").length;
  const upcoming = mockTrainingSessions.filter((s) => s.date >= "2026-03-29").length;
  const unverifiedPlayers = mockPlayers.filter(p => p.verificationStatus !== "verified").length;

  const stats = [
    { label: t.ssb.totalPlayers, value: mockPlayers.length, icon: Users, color: "text-primary" },
    { label: "Belum Verifikasi", value: unverifiedPlayers, icon: Shield, color: "text-amber-500" },
    { label: t.ssb.pendingPayments, value: pendingCount, icon: Wallet, color: "text-rose-500" },
    { label: t.ssb.upcomingTraining, value: upcoming, icon: Calendar, color: "text-blue-500" },
  ];

  // Group players by category
  const categoryStats = mockPlayers.reduce((acc: any, p) => {
    acc[p.ageCategory] = (acc[p.ageCategory] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">{t.ssb.dashboard}</h1>
        <Button asChild size="sm" className="gap-2">
          <Link to="/ssb/players">
            Manajemen Pemain <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Jadwal Latihan Terdekat</CardTitle>
              <CardDescription>Sesi latihan yang akan datang minggu ini.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/ssb/schedule">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTrainingSessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{s.group} · {s.ageCategory}</div>
                    <div className="text-xs text-muted-foreground">{s.coach} · {s.venue}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{s.date}</div>
                  <div className="text-xs text-muted-foreground">{s.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Komposisi Pemain</CardTitle>
            <CardDescription>Distribusi pemain per kategori umur.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([cat, count]: [string, any]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{cat}</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">{count} Pemain</Badge>
                </div>
              ))}
              <div className="pt-4 border-t mt-4">
                <Button variant="outline" className="w-full text-xs" asChild>
                  <Link to="/ssb/players">Kelola Semua Pemain</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
