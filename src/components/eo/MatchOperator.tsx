import * as React from "react";
import { 
  TournamentMatch, 
  TournamentTeam, 
  Player, 
  MatchGoal, 
  MatchCard, 
  MatchStatistics,
  MatchStatus,
  GoalType,
  CardType
} from "@/types";
import { mockPlayers, mockTournamentTeams } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Shield, 
  Timer, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  History
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateScore, validateMatchUpdate, createAuditLog } from "@/lib/match-utils";

interface MatchOperatorProps {
  match: TournamentMatch;
  onUpdate: (updatedMatch: TournamentMatch) => void;
}

export function MatchOperator({ match, onUpdate }: MatchOperatorProps) {
  const { toast } = useToast();
  const homeTeam = mockTournamentTeams.find(t => t.id === match.homeTeamId);
  const awayTeam = mockTournamentTeams.find(t => t.id === match.awayTeamId);
  
  const homePlayers = mockPlayers.filter(p => homeTeam?.players.includes(p.globalId));
  const awayPlayers = mockPlayers.filter(p => awayTeam?.players.includes(p.globalId));

  const [activeTab, setActiveTab] = React.useState("goals");

  const addGoal = (teamId: string, playerId: string, minute: number, type: GoalType) => {
    const newGoal: MatchGoal = {
      id: `g-${Date.now()}`,
      matchId: match.id,
      teamId,
      playerId,
      minute,
      type
    };

    const error = validateMatchUpdate(match, "ADD_GOAL", newGoal);
    if (error) {
      toast({ variant: "destructive", title: "Validation Error", description: error });
      return;
    }

    const updatedMatch = { ...match };
    updatedMatch.goals = [...match.goals, newGoal];
    
    // Recalculate scores using utility
    const { homeScore, awayScore } = calculateScore(updatedMatch.goals, match.homeTeamId, match.awayTeamId);
    updatedMatch.homeScore = homeScore;
    updatedMatch.awayScore = awayScore;

    updatedMatch.auditLog.push(createAuditLog("operator-1", "ADD_GOAL", null, newGoal));

    onUpdate(updatedMatch);
    toast({ title: "Goal Recorded", description: `Goal added at minute ${minute}` });
  };

  const addCard = (teamId: string, playerId: string, minute: number, type: CardType, reason: string) => {
    const newCard: MatchCard = {
      id: `c-${Date.now()}`,
      matchId: match.id,
      teamId,
      playerId,
      minute,
      type,
      reason
    };

    const error = validateMatchUpdate(match, "ADD_CARD", newCard);
    if (error) {
      toast({ variant: "destructive", title: "Validation Error", description: error });
      return;
    }

    const updatedMatch = { ...match };
    updatedMatch.cards = [...match.cards, newCard];
    updatedMatch.auditLog.push(createAuditLog("operator-1", "ADD_CARD", null, newCard));

    onUpdate(updatedMatch);
    toast({ title: "Card Recorded", description: `${type} card issued at minute ${minute}` });
  };

  const updateStats = (team: 'home' | 'away', stats: Partial<MatchStatistics>) => {
    const error = validateMatchUpdate(match, "UPDATE_STATS", stats);
    if (error) {
      toast({ variant: "destructive", title: "Validation Error", description: error });
      return;
    }

    const updatedMatch = { ...match };
    if (!updatedMatch.stats) {
      updatedMatch.stats = {
        home: { matchId: match.id, teamId: match.homeTeamId, possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, corners: 0, offsides: 0, fouls: 0, passAccuracy: 0 },
        away: { matchId: match.id, teamId: match.awayTeamId, possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, corners: 0, offsides: 0, fouls: 0, passAccuracy: 0 },
      };
    }
    updatedMatch.stats[team] = { ...updatedMatch.stats[team], ...stats };

    updatedMatch.auditLog.push(createAuditLog("operator-1", "UPDATE_STATS", null, { team, stats }));

    onUpdate(updatedMatch);
  };

  const updateStatus = (status: MatchStatus) => {
    const updatedMatch = { ...match, status };
    updatedMatch.auditLog.push(createAuditLog("operator-1", "UPDATE_STATUS", match.status, status));
    onUpdate(updatedMatch);
    toast({ title: "Match Status Updated", description: `Match is now ${status}` });
  };

  const exportMatchReport = () => {
    toast({ 
      title: "Exporting Match Report", 
      description: "Generating PDF match report... (Simulated)",
    });
    // In a real app, this would trigger a download or navigate to a PDF route
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select value={match.status} onValueChange={(v: MatchStatus) => updateStatus(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Match Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="postponed">Postponed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {match.status === "live" && (
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={exportMatchReport}>
          <TrendingUp className="h-4 w-4 mr-2" /> Export Match Report
        </Button>
      </div>

      {/* Scoreboard */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-8">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                {homeTeam?.name.substring(0, 1)}
              </div>
              <div className="font-bold text-lg">{homeTeam?.name}</div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-black tabular-nums flex items-center gap-4">
                <span>{match.homeScore}</span>
                <span className="text-primary-foreground/50">:</span>
                <span>{match.awayScore}</span>
              </div>
              <Badge variant="outline" className="mt-4 bg-white/10 text-white border-white/20 px-4 py-1">
                {match.status.toUpperCase()}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                {awayTeam?.name.substring(0, 1)}
              </div>
              <div className="font-bold text-lg">{awayTeam?.name}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="history">Audit Log</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="goals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team Goals */}
              <GoalInputForm 
                teamName={homeTeam?.name || ""} 
                players={homePlayers} 
                onAdd={(pid, min, type) => addGoal(match.homeTeamId, pid, min, type)} 
              />
              {/* Away Team Goals */}
              <GoalInputForm 
                teamName={awayTeam?.name || ""} 
                players={awayPlayers} 
                onAdd={(pid, min, type) => addGoal(match.awayTeamId, pid, min, type)} 
              />
            </div>
            
            <Card>
              <CardHeader><CardTitle className="text-sm">Goal History</CardTitle></CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[200px]">
                  {match.goals.sort((a,b) => b.minute - a.minute).map(g => (
                    <div key={g.id} className="flex items-center justify-between p-3 border-b text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{g.minute}'</Badge>
                        <span className="font-bold">{mockPlayers.find(p => p.id === g.playerId)?.name}</span>
                        <span className="text-muted-foreground text-xs">({g.type})</span>
                      </div>
                      <span className={g.teamId === match.homeTeamId ? "text-primary font-bold" : "text-muted-foreground"}>
                        {g.teamId === match.homeTeamId ? "Home" : "Away"}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardInputForm 
                teamName={homeTeam?.name || ""} 
                players={homePlayers} 
                onAdd={(pid, min, type, reason) => addCard(match.homeTeamId, pid, min, type, reason)} 
              />
              <CardInputForm 
                teamName={awayTeam?.name || ""} 
                players={awayPlayers} 
                onAdd={(pid, min, type, reason) => addCard(match.awayTeamId, pid, min, type, reason)} 
              />
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Match Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <div>{homeTeam?.name}</div>
                  <div>Metric</div>
                  <div>{awayTeam?.name}</div>
                </div>
                
                <StatSlider 
                  label="Possession (%)" 
                  homeValue={match.stats?.home.possession || 50} 
                  awayValue={match.stats?.away.possession || 50}
                  onUpdate={(h, a) => {
                    updateStats('home', { possession: h });
                    updateStats('away', { possession: a });
                  }}
                />
                
                <StatCounter 
                  label="Shots on Target" 
                  homeValue={match.stats?.home.shotsOnTarget || 0} 
                  awayValue={match.stats?.away.shotsOnTarget || 0}
                  onUpdate={(h, a) => {
                    updateStats('home', { shotsOnTarget: h });
                    updateStats('away', { shotsOnTarget: a });
                  }}
                />

                <StatCounter 
                  label="Shots off Target" 
                  homeValue={match.stats?.home.shotsOffTarget || 0} 
                  awayValue={match.stats?.away.shotsOffTarget || 0}
                  onUpdate={(h, a) => {
                    updateStats('home', { shotsOffTarget: h });
                    updateStats('away', { shotsOffTarget: a });
                  }}
                />

                <StatCounter 
                  label="Corners" 
                  homeValue={match.stats?.home.corners || 0} 
                  awayValue={match.stats?.away.corners || 0}
                  onUpdate={(h, a) => {
                    updateStats('home', { corners: h });
                    updateStats('away', { corners: a });
                  }}
                />

                <StatCounter 
                  label="Offsides" 
                  homeValue={match.stats?.home.offsides || 0} 
                  awayValue={match.stats?.away.offsides || 0}
                  onUpdate={(h, a) => {
                    updateStats('home', { offsides: h });
                    updateStats('away', { offsides: a });
                  }}
                />

                <StatCounter 
                  label="Fouls" 
                  homeValue={match.stats?.home.fouls || 0} 
                  awayValue={match.stats?.away.fouls || 0}
                  onUpdate={(h, a) => {
                    updateStats('home', { fouls: h });
                    updateStats('away', { fouls: a });
                  }}
                />

                <StatSlider 
                  label="Pass Accuracy (%)" 
                  homeValue={match.stats?.home.passAccuracy || 70} 
                  awayValue={match.stats?.away.passAccuracy || 70}
                  onUpdate={(h, a) => {
                    updateStats('home', { passAccuracy: h });
                    updateStats('away', { passAccuracy: a });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" /> Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {match.auditLog.sort((a,b) => b.timestamp.localeCompare(a.timestamp)).map((log, i) => (
                      <div key={i} className="p-4 space-y-1">
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary">{log.action}</Badge>
                          <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Operator: {log.userId}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function GoalInputForm({ teamName, players, onAdd }: { teamName: string, players: Player[], onAdd: (pid: string, min: number, type: GoalType) => void }) {
  const [pid, setPid] = React.useState("");
  const [min, setMin] = React.useState(1);
  const [type, setType] = React.useState<GoalType>("regular");

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm">Record Goal: {teamName}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px]">Player</Label>
            <Select value={pid} onValueChange={setPid}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Minute</Label>
            <Input type="number" value={min} onChange={e => setMin(parseInt(e.target.value))} className="h-8 text-xs" />
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-[10px]">Type</Label>
            <Select value={type} onValueChange={(v: GoalType) => setType(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="penalty">Penalty</SelectItem>
                <SelectItem value="own_goal">Own Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            size="sm" 
            className="h-8 px-3" 
            disabled={!pid || !min || min < 0}
            onClick={() => {
              if (pid && min >= 0) {
                onAdd(pid, min, type);
                setPid(""); // Reset after add
              }
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CardInputForm({ teamName, players, onAdd }: { teamName: string, players: Player[], onAdd: (pid: string, min: number, type: CardType, reason: string) => void }) {
  const [pid, setPid] = React.useState("");
  const [min, setMin] = React.useState(1);
  const [type, setType] = React.useState<CardType>("yellow");
  const [reason, setReason] = React.useState("");

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm">Disciplinary: {teamName}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px]">Player</Label>
            <Select value={pid} onValueChange={setPid}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Type</Label>
            <Select value={type} onValueChange={(v: CardType) => setType(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-[10px]">Minute</Label>
            <Input type="number" value={min} onChange={e => setMin(parseInt(e.target.value))} className="h-8 text-xs" />
          </div>
          <Button 
            size="sm" 
            className="h-8 px-3" 
            disabled={!pid || !min || min < 0}
            onClick={() => {
              if (pid && min >= 0) {
                onAdd(pid, min, type, reason);
                setPid("");
                setReason("");
              }
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatSlider({ label, homeValue, awayValue, onUpdate }: { label: string, homeValue: number, awayValue: number, onUpdate: (h: number, a: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span>{homeValue}%</span>
        <span>{label}</span>
        <span>{awayValue}%</span>
      </div>
      <input 
        type="range" 
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
        value={homeValue} 
        onChange={e => {
          const h = parseInt(e.target.value);
          onUpdate(h, 100 - h);
        }}
      />
    </div>
  );
}

function StatCounter({ label, homeValue, awayValue, onUpdate }: { label: string, homeValue: number, awayValue: number, onUpdate: (h: number, a: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdate(Math.max(0, homeValue - 1), awayValue)}>-</Button>
        <span className="w-8 text-center font-black">{homeValue}</span>
        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdate(homeValue + 1, awayValue)}>+</Button>
      </div>
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdate(homeValue, Math.max(0, awayValue - 1))}>-</Button>
        <span className="w-8 text-center font-black">{awayValue}</span>
        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdate(homeValue, awayValue + 1)}>+</Button>
      </div>
    </div>
  );
}
