import { useLanguage } from "@/i18n/LanguageContext";
import { mockAttendance, mockPlayers, mockTrainingSessions } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Attendance() {
  const { t } = useLanguage();

  const records = mockAttendance.map((a) => {
    const player = mockPlayers.find((p) => p.id === a.playerId);
    const session = mockTrainingSessions.find((s) => s.id === a.sessionId);
    return { ...a, playerName: player?.name || "", group: session?.group || "", ageCategory: session?.ageCategory || "" };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.ssb.attendanceRecord}</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.ssb.playerName}</TableHead>
                <TableHead>{t.ssb.trainingGroup}</TableHead>
                <TableHead>{t.ssb.ageCategory}</TableHead>
                <TableHead className="text-center">{t.common.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.playerName}</TableCell>
                  <TableCell>{r.group}</TableCell>
                  <TableCell>{r.ageCategory}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={r.status === "present" ? "default" : "destructive"}>
                      {r.status === "present" ? t.common.present : t.common.absent}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
