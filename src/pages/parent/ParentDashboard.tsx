import * as React from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Trophy, 
  Award, 
  ChevronRight,
  Target,
  Clock,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { mockPlayers, mockSkillRatings, mockTrainingSchedules, mockInvoices } from "@/data/mock";

const skillHistory = [
  { month: "Jan", technique: 65, physical: 60, tactical: 55, mental: 62 },
  { month: "Feb", technique: 68, physical: 62, tactical: 58, mental: 64 },
  { month: "Mar", technique: 72, physical: 65, tactical: 62, mental: 68 },
  { month: "Apr", technique: 75, physical: 68, tactical: 65, mental: 70 },
];

export default function ParentDashboard() {
  const player = mockPlayers[0]; // Assume first child for mock
  const latestRating = mockSkillRatings.find(r => r.playerId === player.id);
  const unpaidInvoices = mockInvoices.filter(i => i.status === "unpaid");
  const upcomingTraining = mockTrainingSchedules[0];

  const radarData = latestRating ? [
    { subject: "Passing", A: latestRating.passing, fullMark: 100 },
    { subject: "Shooting", A: latestRating.shooting, fullMark: 100 },
    { subject: "Dribbling", A: latestRating.dribbling, fullMark: 100 },
    { subject: "Speed", A: latestRating.speed, fullMark: 100 },
    { subject: "Stamina", A: latestRating.stamina, fullMark: 100 },
    { subject: "Teamwork", A: latestRating.teamwork, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Parent Portal</h1>
          <p className="text-muted-foreground text-sm">Monitoring progress for <span className="font-bold text-primary">{player.name}</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" /> History
          </Button>
          <Button size="sm" className="gap-2">
            <Award className="h-4 w-4" /> Download Certificate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Skill Growth
                </CardTitle>
                <CardDescription>Visualizing performance metrics over time</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">U12 Category</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={skillHistory}>
                  <defs>
                    <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area type="monotone" dataKey="technique" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTech)" name="Technique" />
                  <Area type="monotone" dataKey="physical" stroke="#10b981" strokeWidth={2} fillOpacity={0} name="Physical" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Profile (Radar) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Skill Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" fontSize={10} tick={{ fill: "#6b7280" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={player.name}
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Training */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-4 w-4" /> Next Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTraining ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="font-black text-lg">{upcomingTraining.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(upcomingTraining.startTime).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" /> {upcomingTraining.location}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                  <a href="/ssb/schedule">View All Schedule <ExternalLink className="ml-2 h-3 w-3" /></a>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming training scheduled.</p>
            )}
          </CardContent>
        </Card>

        {/* Billing / Finance */}
        <Card className={unpaidInvoices.length > 0 ? "border-amber-200 bg-amber-50/20" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Wallet className="h-4 w-4" /> Billing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Unpaid Dues:</span>
                <span className="text-lg font-black text-amber-600">{unpaidInvoices.length} Invoices</span>
              </div>
              <div className="text-xs text-muted-foreground">Total Pending: <span className="font-bold text-foreground">Rp {unpaidInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}</span></div>
              <Button className="w-full" variant={unpaidInvoices.length > 0 ? "default" : "outline"} asChild>
                <a href="/ssb/finance">Pay Now <ChevronRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Competition Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Trophy className="h-4 w-4" /> Competitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold">Winner - Jakarta Cup U12</div>
                  <div className="text-[10px] text-muted-foreground">Feb 2026 · ST Position</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold">Top Scorer - Friendly Match</div>
                  <div className="text-[10px] text-muted-foreground">Jan 2026 · 5 Goals</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
