import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  mockCompetitions, 
  mockTournamentTeams, 
  mockTournamentMatches, 
  mockCompetitionCategories,
  mockRegistrations,
  mockCompetitionInvoices
} from "@/data/mock";
import { Trophy, Shield, Calendar, Wallet, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function EODashboard() {
  const { t } = useLanguage();
  const upcoming = mockTournamentMatches.filter((m) => m.status === "scheduled").length;
  const pendingPayments = mockRegistrations.filter(r => r.paymentStatus !== "paid").length;
  const totalRevenue = mockCompetitionInvoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const stats = [
    { label: t.eo.activeTournaments, value: mockCompetitions.filter(c => c.status !== "completed").length, icon: Trophy },
    { label: "Pending Payments", value: pendingPayments, icon: Wallet, color: "text-amber-500" },
    { label: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString()}`, icon: ArrowUpRight, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.eo.dashboard}</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/eo/registrations">Manage Registrations</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color || "text-primary"}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.eo.tournaments}</CardTitle>
            <CardDescription>Overview of your competition events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCompetitions.map((comp) => {
              const categories = mockCompetitionCategories
                .filter(cat => cat.competitionId === comp.id)
                .map(cat => cat.ageCategory);
              
              return (
                <div key={comp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">{comp.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {comp.type} · {categories.join(", ") || "No categories"}
                    </div>
                  </div>
                  <Badge variant={comp.status === "ongoing" ? "default" : "secondary"}>{comp.status}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Registrations</CardTitle>
            <CardDescription>Latest team applications and payment status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRegistrations.slice(0, 5).map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{reg.teamName}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      {mockCompetitionCategories.find(c => c.id === reg.categoryId)?.ageCategory}
                    </div>
                  </div>
                </div>
                <Badge variant={reg.paymentStatus === "paid" ? "outline" : "secondary"} className={reg.paymentStatus === "paid" ? "text-green-600 border-green-200 bg-green-50" : ""}>
                  {reg.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            ))}
            <Button asChild variant="ghost" className="w-full text-xs mt-2" size="sm">
              <Link to="/eo/registrations">View All Registrations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
