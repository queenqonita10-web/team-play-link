import * as React from "react";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Filter, 
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  mockAttendance, 
  mockPlayers, 
  mockTrainingSchedules,
  mockParticipantGroups
} from "@/data/mock";
import { AttendanceRecord, Player, TrainingSchedule } from "@/types";
import { format, subDays, isSameMonth, parseISO } from "date-fns";

interface AttendanceStatsProps {
  records: AttendanceRecord[];
}

export function AttendanceStats({ records }: AttendanceStatsProps) {
  // 1. Calculate general stats
  const totalSessions = mockTrainingSchedules.length;
  const totalRecords = records.length;
  const presentCount = records.filter(r => r.status === "present").length;
  const permittedCount = records.filter(r => r.status === "permitted").length;
  const absentCount = records.filter(r => r.status === "absent").length;
  
  const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
  
  // 2. Group by age category
  const ageCategoryStats = ["U8", "U10", "U12", "U15", "U18", "Senior"].map(cat => {
    const catPlayers = mockPlayers.filter(p => p.ageCategory === cat);
    const catRecords = records.filter(r => {
      const p = mockPlayers.find(player => player.id === r.playerId);
      return p?.ageCategory === cat;
    });
    
    const catPresent = catRecords.filter(r => r.status === "present").length;
    const catTotal = catRecords.length;
    const catPercentage = catTotal > 0 ? (catPresent / catTotal) * 100 : 0;
    
    return { category: cat, totalPlayers: catPlayers.length, percentage: catPercentage, totalRecords: catTotal };
  }).filter(s => s.totalPlayers > 0);

  // 3. Most diligent players (Top 5)
  const playerStats = mockPlayers.map(p => {
    const pRecords = records.filter(r => r.playerId === p.id);
    const pPresent = pRecords.filter(r => r.status === "present").length;
    const pTotal = pRecords.length;
    const pPercentage = pTotal > 0 ? (pPresent / pTotal) * 100 : 0;
    
    return { name: p.name, percentage: pPercentage, category: p.ageCategory, present: pPresent, total: pTotal };
  }).sort((a, b) => b.percentage - a.percentage).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Attendance Rate</p>
              <h3 className="text-2xl font-bold">{Math.round(attendancePercentage)}%</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Average across all groups</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-700 uppercase font-semibold">Present</p>
              <h3 className="text-2xl font-bold text-green-900">{presentCount}</h3>
              <p className="text-[10px] text-green-600 mt-0.5">Records</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-700 uppercase font-semibold">Permitted</p>
              <h3 className="text-2xl font-bold text-amber-900">{permittedCount}</h3>
              <p className="text-[10px] text-amber-600 mt-0.5">Records</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-red-700 uppercase font-semibold">Absent</p>
              <h3 className="text-2xl font-bold text-red-900">{absentCount}</h3>
              <p className="text-[10px] text-red-600 mt-0.5">Records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Group Performance</CardTitle>
                <CardDescription>Attendance percentage by age category</CardDescription>
              </div>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {ageCategoryStats.map(stat => (
              <div key={stat.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{stat.category}</span>
                  <span className="text-muted-foreground">{Math.round(stat.percentage)}% ({stat.totalRecords} records)</span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Top Attenders</CardTitle>
                <CardDescription>Players with the highest presence record</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerStats.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-primary">
                      {Math.round(p.percentage)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
