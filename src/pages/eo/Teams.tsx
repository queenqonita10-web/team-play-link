import { useLanguage } from "@/i18n/LanguageContext";
import { mockTeams } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Teams() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.eo.teamRegistration}</h1>
      <div className="grid gap-3">
        {mockTeams.map((team) => (
          <Card key={team.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-muted-foreground">{team.ssbName}</div>
              </div>
              <Badge variant="outline">{team.ageCategory}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
