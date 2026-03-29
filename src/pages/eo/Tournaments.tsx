import { useLanguage } from "@/i18n/LanguageContext";
import { mockTournaments } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Users } from "lucide-react";

export default function Tournaments() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.eo.tournaments}</h1>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t.eo.createTournament}</Button>
      </div>

      <div className="grid gap-4">
        {mockTournaments.map((tour) => (
          <Card key={tour.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{tour.name}</h3>
                  <div className="flex gap-1.5 mt-1">
                    {tour.ageCategories.map((a) => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}
                  </div>
                </div>
                <Badge variant={tour.status === "ongoing" ? "default" : "secondary"}>{tour.status}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{tour.startDate}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{tour.venue}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{tour.teamsCount} {t.eo.teams}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
