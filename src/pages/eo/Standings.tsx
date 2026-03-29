import { useLanguage } from "@/i18n/LanguageContext";
import { mockStandings } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Standings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.eo.standingsTable}</h1>
      <Card>
        <CardHeader><CardTitle>Liga Junior Kota - Group A</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>{t.eo.teams}</TableHead>
                  <TableHead className="text-center">{t.eo.played}</TableHead>
                  <TableHead className="text-center">{t.eo.won}</TableHead>
                  <TableHead className="text-center">{t.eo.drawn}</TableHead>
                  <TableHead className="text-center">{t.eo.lost}</TableHead>
                  <TableHead className="text-center">{t.eo.goalsFor}</TableHead>
                  <TableHead className="text-center">{t.eo.goalsAgainst}</TableHead>
                  <TableHead className="text-center">{t.eo.goalDifference}</TableHead>
                  <TableHead className="text-center font-bold">{t.eo.points}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStandings.map((row, i) => (
                  <TableRow key={row.teamId}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell className="font-medium">{row.teamName}</TableCell>
                    <TableCell className="text-center">{row.played}</TableCell>
                    <TableCell className="text-center">{row.won}</TableCell>
                    <TableCell className="text-center">{row.drawn}</TableCell>
                    <TableCell className="text-center">{row.lost}</TableCell>
                    <TableCell className="text-center">{row.goalsFor}</TableCell>
                    <TableCell className="text-center">{row.goalsAgainst}</TableCell>
                    <TableCell className="text-center">{row.goalDifference}</TableCell>
                    <TableCell className="text-center font-bold">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
