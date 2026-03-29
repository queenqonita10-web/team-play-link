import { useLanguage } from "@/i18n/LanguageContext";
import { mockMatches } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Fixtures() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.eo.fixtureList}</h1>
      <div className="grid gap-4">
        {mockMatches.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-2">{m.stage} · {m.date} {m.time} · {m.venue}</div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm flex-1 text-right pr-3">{m.homeTeam}</span>
                <div className="px-4 py-1 rounded-lg bg-muted font-bold text-sm min-w-[60px] text-center">
                  {m.status === "completed" ? `${m.homeScore} - ${m.awayScore}` : "vs"}
                </div>
                <span className="font-medium text-sm flex-1 pl-3">{m.awayTeam}</span>
              </div>
              <div className="flex justify-center mt-2">
                <Badge variant={m.status === "completed" ? "default" : "secondary"}>{m.status}</Badge>
              </div>
              {m.scorers && m.scorers.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                  {m.scorers.map((s, i) => (
                    <div key={i}>⚽ {s.playerName} ({s.team}) {s.minute}'</div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
