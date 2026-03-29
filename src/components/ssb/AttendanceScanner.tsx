import * as React from "react";
import { QrCode, Camera, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockPlayers, mockTrainingSchedules } from "@/data/mock";

interface AttendanceScannerProps {
  sessionId: string;
  onScanSuccess: (playerId: string) => void;
}

export function AttendanceScanner({ sessionId, onScanSuccess }: AttendanceScannerProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<{ success: boolean; message: string; player?: string } | null>(null);
  const [progress, setProgress] = React.useState(0);

  const session = mockTrainingSchedules.find(s => s.id === sessionId);

  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setProgress(0);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleScanComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleScanComplete = () => {
    // Simulate finding a random player from the session's age category
    const eligiblePlayers = mockPlayers.filter(p => p.ageCategory === session?.ageCategory);
    if (eligiblePlayers.length > 0) {
      const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
      setScanResult({
        success: true,
        message: "QR Code Valid",
        player: randomPlayer.name
      });
      onScanSuccess(randomPlayer.id);
      toast({
        title: "Check-in Success",
        description: `${randomPlayer.name} has been marked as present.`,
      });
    } else {
      setScanResult({
        success: false,
        message: "Invalid QR Code or Player Not Found"
      });
    }
    setIsScanning(false);
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Attendance Scanner
            </CardTitle>
            <CardDescription>Scan player's QR code for automatic check-in</CardDescription>
          </div>
          <Badge variant="outline" className="bg-background">Session: {session?.title || "Active Session"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          {!isScanning && !scanResult && (
            <div className="w-full max-w-[300px] aspect-square border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center bg-muted/20 transition-all hover:bg-muted/30">
              <Camera className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground text-center px-6">
                Camera will activate when you start scanning
              </p>
              <Button onClick={startScan} className="mt-6">
                Start Scanner
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="w-full max-w-[300px] aspect-square relative rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>
              <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary animate-scan shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 px-6">
                <Progress value={progress} className="h-1.5" />
                <p className="text-[10px] text-white/70 text-center mt-2 uppercase tracking-widest font-medium">Scanning...</p>
              </div>
            </div>
          )}

          {scanResult && (
            <div className={cn(
              "w-full max-w-[300px] aspect-square rounded-2xl flex flex-col items-center justify-center border-2 p-6 text-center animate-in zoom-in-95 duration-300",
              scanResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              {scanResult.success ? (
                <>
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-bold text-green-900 text-lg">{scanResult.message}</h3>
                  <p className="text-sm text-green-700 mt-2">
                    Check-in recorded for:
                    <span className="block font-bold mt-1 text-base">{scanResult.player}</span>
                  </p>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-red-900 text-lg">{scanResult.message}</h3>
                  <p className="text-sm text-red-700 mt-2">Please try again or use manual attendance.</p>
                </>
              )}
              <div className="flex gap-2 mt-8">
                <Button variant="outline" size="sm" onClick={() => setScanResult(null)}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Reset
                </Button>
                <Button size="sm" onClick={startScan}>
                  Scan Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
