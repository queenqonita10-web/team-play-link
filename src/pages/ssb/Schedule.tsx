import { useLanguage } from "@/i18n/LanguageContext";
import { mockTrainingSessions } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function Schedule() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.ssb.trainingSchedule}</h1>
      <div className="grid gap-4">
        {mockTrainingSessions.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{s.group}</div>
                  <Badge variant="outline" className="mt-1">{s.ageCategory}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{s.date}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{s.time}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{s.venue}</div>
                <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{s.coach}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
