import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPlayers, mockTrainingSessions, mockPayments, mockAttendance } from "@/data/mock";

export default function ParentDashboard() {
  const { t } = useLanguage();
  const child = mockPlayers[0]; // Mock: first player is "my child"
  const childPayments = mockPayments.filter((p) => p.playerId === child.id);
  const childAttendance = mockAttendance.filter((a) => a.playerId === child.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.parent.title}</h1>

      <Card>
        <CardHeader><CardTitle>{t.parent.myChild}</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">{child.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <div className="font-semibold text-lg">{child.name}</div>
            <div className="text-sm text-muted-foreground">{child.position} · {child.ageCategory}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{t.parent.childAttendance}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{childAttendance.filter(a => a.status === "present").length}/{childAttendance.length}</div>
            <div className="text-sm text-muted-foreground">{t.common.present}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{t.parent.childPayments}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {childPayments.map((p) => (
              <div key={p.id} className="flex justify-between items-center">
                <span className="text-sm">{p.month}</span>
                <Badge variant={p.status === "paid" ? "default" : "secondary"}>
                  {p.status === "paid" ? t.common.paid : t.common.unpaid}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{t.parent.childSchedule}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockTrainingSessions.filter(s => s.ageCategory === child.ageCategory).map((s) => (
            <div key={s.id} className="flex justify-between items-center p-2 rounded bg-muted/50">
              <div className="text-sm">{s.group} · {s.venue}</div>
              <div className="text-xs text-muted-foreground">{s.date} {s.time}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
