import * as React from "react";
import { 
  CompetitionRegistration, 
  CompetitionInvoice, 
  Competition, 
  CompetitionCategory,
  PaymentStatus
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  MoreVertical,
  Mail,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface RegistrationManagerProps {
  registrations: CompetitionRegistration[];
  invoices: CompetitionInvoice[];
  competitions: Competition[];
  categories: CompetitionCategory[];
}

export function RegistrationManager({ 
  registrations, 
  invoices, 
  competitions, 
  categories 
}: RegistrationManagerProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleExport = () => {
    toast({
      title: "Exporting Report",
      description: "Preparing Excel registration report...",
    });
  };

  const handleSendReminder = (regId: string) => {
    toast({
      title: "Reminder Sent",
      description: "Payment reminder has been sent via WhatsApp & Email.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search team or SSB..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">Total Registrations</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/10">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {registrations.filter(r => r.paymentStatus === "paid").length}
            </div>
            <p className="text-xs text-muted-foreground">Paid In Full</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {registrations.filter(r => r.paymentStatus === "pending" || r.paymentStatus === "unpaid").length}
            </div>
            <p className="text-xs text-muted-foreground">Waiting for Payment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Recent Registrations</CardTitle>
          <CardDescription>Manage team applications and payment tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team / SSB</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => {
                const invoice = invoices.find(inv => inv.registrationId === reg.id);
                const category = categories.find(cat => cat.id === reg.categoryId);
                
                return (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div className="font-medium">{reg.teamName}</div>
                      <div className="text-xs text-muted-foreground">SSB ID: {reg.ssbId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category?.ageCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(reg.registeredAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(reg.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      Rp {invoice?.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleSendReminder(reg.id)}>
                            <Mail className="h-4 w-4 mr-2" /> Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" /> View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <AlertCircle className="h-4 w-4 mr-2" /> Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
