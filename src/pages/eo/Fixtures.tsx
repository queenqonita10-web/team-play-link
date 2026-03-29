import * as React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockTournamentMatches, mockTournamentTeams, mockCompetitions, mockCompetitionCategories } from "@/data/mock";
import { TournamentMatch, TournamentTeam } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Trophy,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function Fixtures() {
  const { t } = useLanguage();
  const [selectedCompId, setSelectedCompId] = React.useState<string>(mockCompetitions[0].id);
  const [selectedCatId, setSelectedCatId] = React.useState<string>(mockCompetitionCategories[0].id);
  const [searchTerm, setSearchTerm] = React.useState("");

  const categories = mockCompetitionCategories.filter(c => c.competitionId === selectedCompId);
  
  const filteredMatches = mockTournamentMatches.filter(m => {
    if (m.categoryId !== selectedCatId) return false;
    
    const homeTeam = mockTournamentTeams.find(t => t.id === m.homeTeamId);
    const awayTeam = mockTournamentTeams.find(t => t.id === m.awayTeamId);
    
    const searchLower = searchTerm.toLowerCase();
    return (
      homeTeam?.name.toLowerCase().includes(searchLower) ||
      awayTeam?.name.toLowerCase().includes(searchLower) ||
      m.stage.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.eo.fixtureList}</h1>
          <p className="text-muted-foreground">Schedule and results for all competition matches.</p>
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

      <Card className="border-2 border-primary/5">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search team or stage..." 
                className="pl-9 bg-muted/20 border-none focus-visible:ring-primary" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background">
                {filteredMatches.length} Matches Found
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((m) => {
              const homeTeam = mockTournamentTeams.find(t => t.id === m.homeTeamId);
              const awayTeam = mockTournamentTeams.find(t => t.id === m.awayTeamId);

              return (
                <Card key={m.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-all">
                  <div className="bg-muted/30 px-4 py-2 flex justify-between items-center border-b">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {m.stage}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(m.date), "dd MMM yyyy")}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.time}</span>
                    </div>
                    <Badge variant={m.status === "completed" ? "default" : "secondary"} className="text-[10px] h-5">
                      {m.status}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                      <div className="flex flex-col md:flex-row items-center gap-4 md:justify-end">
                        <span className="font-bold text-lg text-center md:text-right order-2 md:order-1">{homeTeam?.name}</span>
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xl font-black text-muted-foreground order-1 md:order-2">
                          {homeTeam?.name.substring(0, 1)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl font-black tabular-nums">
                            {m.status === "completed" ? m.homeScore : "-"}
                          </div>
                          <div className="text-xl font-light text-muted-foreground">:</div>
                          <div className="text-4xl font-black tabular-nums">
                            {m.status === "completed" ? m.awayScore : "-"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {m.venue}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xl font-black text-muted-foreground">
                          {awayTeam?.name.substring(0, 1)}
                        </div>
                        <span className="font-bold text-lg text-center md:text-left">{awayTeam?.name}</span>
                      </div>
                    </div>

                    {m.statistics?.scorers && m.statistics.scorers.length > 0 && (
                      <div className="mt-8 pt-4 border-t grid grid-cols-2 gap-8">
                        <div className="space-y-1 text-right">
                          {m.statistics.scorers.filter(s => s.teamId === m.homeTeamId).map((s, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {s.minute}' ⚽
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          {m.statistics.scorers.filter(s => s.teamId === m.awayTeamId).map((s, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              ⚽ {s.minute}'
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="inline-flex h-12 w-12 rounded-full bg-muted items-center justify-center">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg">No matches found</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Try adjusting your filters or search term to find what you're looking for.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
