import { useLanguage } from "@/i18n/LanguageContext";
import { mockTournamentTeams, mockCompetitionCategories } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Teams() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.eo.teamRegistration}</h1>
      <div className="grid gap-3">
        {mockTournamentTeams.map((team) => {
          const category = mockCompetitionCategories.find(c => c.id === team.categoryId);
          
          return (
            <Card key={team.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-muted-foreground">SSB ID: {team.ssbId}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{category?.ageCategory || "Unknown"}</Badge>
                  <Badge variant={team.status === "approved" ? "default" : "secondary"}>
                    {team.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
