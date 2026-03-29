import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCompetitions, mockTournamentTeams, mockTournamentMatches, mockCompetitionCategories } from "@/data/mock";
import { Trophy, Shield, Calendar } from "lucide-react";

export default function EODashboard() {
  const { t } = useLanguage();
  const upcoming = mockTournamentMatches.filter((m) => m.status === "scheduled").length;

  const stats = [
    { label: t.eo.activeTournaments, value: mockCompetitions.filter(c => c.status !== "completed").length, icon: Trophy },
    { label: t.eo.registeredTeams, value: mockTournamentTeams.length, icon: Shield },
    { label: t.eo.upcomingMatches, value: upcoming, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.eo.dashboard}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">{t.eo.tournaments}</CardTitle></CardHeader>
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
    </div>
  );
}
