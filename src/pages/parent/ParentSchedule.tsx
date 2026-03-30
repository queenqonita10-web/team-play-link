import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function ParentSchedule() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jadwal & Latihan</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Jadwal Anak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Lihat jadwal latihan dan kegiatan anak Anda.</p>
        </CardContent>
      </Card>
    </div>
  );
}