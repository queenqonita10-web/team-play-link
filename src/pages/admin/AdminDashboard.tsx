import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Global Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Manage organizations, users, and system settings from here.</p>
        </CardContent>
      </Card>
    </div>
  );
}