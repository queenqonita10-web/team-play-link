import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function ScoutDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scouting Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Talent Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Search and evaluate player talent across academies.</p>
        </CardContent>
      </Card>
    </div>
  );
}