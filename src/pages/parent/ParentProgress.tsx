import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function ParentProgress() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Progress Report</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Perkembangan Anak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pantau perkembangan skill dan evaluasi pelatih.</p>
        </CardContent>
      </Card>
    </div>
  );
}