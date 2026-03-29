import * as React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockTournamentTeams, mockTournamentMatches, mockCompetitions, mockCompetitionCategories } from "@/data/mock";
import { StandingRow, Competition, CompetitionCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateStandings } from "@/lib/standings-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Standings() {
  const { t } = useLanguage();
  const [selectedCompId, setSelectedCompId] = React.useState<string>(mockCompetitions[0].id);
  const [selectedCatId, setSelectedCatId] = React.useState<string>(mockCompetitionCategories[0].id);

  const categories = mockCompetitionCategories.filter(c => c.competitionId === selectedCompId);
  const teams = mockTournamentTeams.filter(t => t.categoryId === selectedCatId);
  const matches = mockTournamentMatches.filter(m => m.categoryId === selectedCatId);
  const standings = calculateStandings(teams, matches);

  const competition = mockCompetitions.find(c => c.id === selectedCompId);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.eo.standingsTable}</h1>
          <p className="text-muted-foreground">Real-time ranking based on match results.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Select value={selectedCompId} onValueChange={(val) => {
            setSelectedCompId(val);
            const firstCat = mockCompetitionCategories.find(c => c.competitionId === val);
            if (firstCat) setSelectedCatId(firstCat.id);
          }}>
            <SelectTrigger className="w-full md:w-[240px] bg-background">
              <SelectValue placeholder="Select Competition" />
            </SelectTrigger>
            <SelectContent>
              {mockCompetitions.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCatId} onValueChange={setSelectedCatId}>
            <SelectTrigger className="w-full md:w-[160px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.ageCategory}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-sm border-2">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> 
                    {competition?.name} - {mockCompetitionCategories.find(c => c.id === selectedCatId)?.ageCategory}
                  </CardTitle>
                  <CardDescription>Standings are updated automatically after match completion.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-background">
                  {standings.length} Teams
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10">
                      <TableHead className="w-12 text-center">Pos</TableHead>
                      <TableHead>{t.eo.teams}</TableHead>
                      <TableHead className="text-center font-semibold">{t.eo.played}</TableHead>
                      <TableHead className="text-center">{t.eo.won}</TableHead>
                      <TableHead className="text-center">{t.eo.drawn}</TableHead>
                      <TableHead className="text-center">{t.eo.lost}</TableHead>
                      <TableHead className="text-center hidden md:table-cell">{t.eo.goalsFor}</TableHead>
                      <TableHead className="text-center hidden md:table-cell">{t.eo.goalsAgainst}</TableHead>
                      <TableHead className="text-center">{t.eo.goalDifference}</TableHead>
                      <TableHead className="text-center font-bold text-primary">{t.eo.points}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standings.map((row, i) => (
                      <TableRow key={row.teamId} className={i < 2 ? "bg-primary/5" : ""}>
                        <TableCell className="text-center font-bold">
                          <span className={i < 2 ? "text-primary" : "text-muted-foreground"}>{i + 1}</span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                              {row.teamName.substring(0, 2)}
                            </div>
                            {row.teamName}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{row.played}</TableCell>
                        <TableCell className="text-center text-green-600">{row.won}</TableCell>
                        <TableCell className="text-center text-amber-600">{row.drawn}</TableCell>
                        <TableCell className="text-center text-red-600">{row.lost}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">{row.goalsFor}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">{row.goalsAgainst}</TableCell>
                        <TableCell className="text-center">{row.goalDifference}</TableCell>
                        <TableCell className="text-center font-bold text-primary">{row.points}</TableCell>
                      </TableRow>
                    ))}
                    {standings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="h-32 text-center text-muted-foreground italic">
                          No teams registered for this category yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" /> Competition Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Point Win</span>
                <span className="font-bold">3 Points</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Point Draw</span>
                <span className="font-bold">1 Point</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Tie-breaker 1</span>
                <span className="font-bold">Goal Difference</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Tie-breaker 2</span>
                <span className="font-bold">Goals For</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tie-breaker 3</span>
                <span className="font-bold">Head-to-Head</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" /> Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Top 2 teams from each group will advance to the knockout stage.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
