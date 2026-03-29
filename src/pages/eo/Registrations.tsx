import * as React from "react";
import { RegistrationManager } from "@/components/eo/RegistrationManager";
import { 
  mockRegistrations, 
  mockCompetitionInvoices, 
  mockCompetitions, 
  mockCompetitionCategories 
} from "@/data/mock";

export default function RegistrationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Registration & Payments</h1>
        <p className="text-muted-foreground">Manage tournament entries and track financial transactions.</p>
      </div>
      
      <RegistrationManager 
        registrations={mockRegistrations}
        invoices={mockCompetitionInvoices}
        competitions={mockCompetitions}
        categories={mockCompetitionCategories}
      />
    </div>
  );
}
