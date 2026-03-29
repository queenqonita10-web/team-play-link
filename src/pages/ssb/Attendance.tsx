import * as React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockAttendance, mockPlayers, mockTrainingSchedules } from "@/data/mock";
import { AttendanceRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AttendanceScanner } from "@/components/ssb/AttendanceScanner";
import { AttendanceStats } from "@/components/ssb/AttendanceStats";
import { ManualAttendanceForm } from "@/components/ssb/ManualAttendanceForm";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Calendar, 
  User, 
  Plus, 
  Search, 
  FileText, 
  QrCode, 
  Filter, 
  Download,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function Attendance() {
  const { t } = useLanguage();
  const [records, setRecords] = React.useState<AttendanceRecord[]>(mockAttendance);
  const [isManualOpen, setIsManualOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleAddManual = (data: any) => {
    const newRecord: AttendanceRecord = {
      id: `a-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecords(prev => [newRecord, ...prev]);
    setIsManualOpen(false);
  };

  const handleScanSuccess = (playerId: string) => {
    const existingRecord = records.find(r => r.playerId === playerId && r.date === new Date().toISOString().split('T')[0]);
    if (existingRecord) return;

    const newRecord: AttendanceRecord = {
      id: `a-${Date.now()}`,
      playerId,
      sessionId: "ts1", // Default for demo
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toISOString(),
      status: "present",
      method: "qr_code",
      qrCode: `qr-${playerId}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const filteredRecords = records.filter(r => {
    const player = mockPlayers.find(p => p.id === r.playerId);
    return player?.name.toLowerCase().includes(searchTerm.toLowerCase());
  }).map(r => {
    const player = mockPlayers.find(p => p.id === r.playerId);
    const session = mockTrainingSchedules.find(s => s.id === r.sessionId);
    return { 
      ...r, 
      playerName: player?.name || "", 
      group: session?.title || "", 
      ageCategory: session?.ageCategory || "" 
    };
  });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.ssb.attendanceRecord}</h1>
          <p className="text-muted-foreground">Monitor and manage player attendance for training sessions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Manual Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manual Attendance Record</DialogTitle>
                <DialogDescription>Input attendance status for players manually.</DialogDescription>
              </DialogHeader>
              <ManualAttendanceForm onSubmit={handleAddManual} onCancel={() => setIsManualOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 space-y-6">
          <AttendanceStats records={records} />
        </TabsContent>

        <TabsContent value="history" className="m-0 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search player name..." 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-medium text-sm">{r.playerName}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{r.ageCategory}</div>
                        </TableCell>
                        <TableCell className="text-sm">{r.group}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{format(new Date(r.date), "dd MMM yyyy")}</div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase">
                            <Clock className="h-2 w-2" /> {r.checkInTime ? format(new Date(r.checkInTime), "HH:mm") : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] font-normal uppercase">
                            {r.method === "qr_code" ? (
                              <span className="flex items-center gap-1"><QrCode className="h-2.5 w-2.5" /> QR Code</span>
                            ) : (
                              <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" /> Manual</span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {r.status === "present" && (
                              <Badge className="bg-green-600 hover:bg-green-700 gap-1 h-6">
                                <CheckCircle2 className="h-3 w-3" /> Present
                              </Badge>
                            )}
                            {r.status === "permitted" && (
                              <Badge className="bg-amber-600 hover:bg-amber-700 gap-1 h-6">
                                <Clock className="h-3 w-3" /> Permitted
                              </Badge>
                            )}
                            {r.status === "absent" && (
                              <Badge className="bg-red-600 hover:bg-red-700 gap-1 h-6">
                                <XCircle className="h-3 w-3" /> Absent
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="m-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <AttendanceScanner sessionId="ts1" onScanSuccess={handleScanSuccess} />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Scans</CardTitle>
                <CardDescription>Latest automated check-ins for the active session.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {records.filter(r => r.method === "qr_code").slice(0, 5).map(r => {
                      const player = mockPlayers.find(p => p.id === r.playerId);
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{player?.name}</div>
                                <div className="text-[10px] text-muted-foreground uppercase">{player?.ageCategory}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <div className="text-sm font-medium">{r.checkInTime ? format(new Date(r.checkInTime), "HH:mm") : "-"}</div>
                            <div className="text-[10px] text-green-600 font-bold uppercase">Verified</div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {records.filter(r => r.method === "qr_code").length === 0 && (
                      <TableRow>
                        <TableCell className="text-center py-10 text-muted-foreground text-sm italic">
                          No scans recorded yet for this session.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
