import * as React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockCompetitions, mockCompetitionCategories } from "@/data/mock";
import { Competition, CompetitionCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Settings, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompetitionForm } from "@/components/eo/CompetitionForm";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function Tournaments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [competitions, setCompetitions] = React.useState<Competition[]>(mockCompetitions);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingComp, setEditingComp] = React.useState<Competition | null>(null);

  const handleCreateClick = () => {
    setEditingComp(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (comp: Competition) => {
    setEditingComp(comp);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setCompetitions(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Competition Deleted",
      description: "The competition has been removed successfully.",
      variant: "destructive",
    });
  };

  const handleFormSubmit = (data: any) => {
    if (editingComp) {
      setCompetitions(prev => prev.map(c => c.id === editingComp.id ? { ...c, ...data } : c));
    } else {
      const newComp: Competition = {
        id: `comp-${Date.now()}`,
        eoId: "eo1",
        ...data,
        registrationPeriod: {
          start: data.registrationStart,
          end: data.registrationEnd,
        },
        status: "upcoming",
      };
      setCompetitions(prev => [newComp, ...prev]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.eo.tournaments}</h1>
          <p className="text-muted-foreground">Manage your leagues and tournaments efficiently.</p>
        </div>
        <Button onClick={handleCreateClick} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> {t.eo.createTournament}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((comp) => {
          const categories = mockCompetitionCategories.filter(c => c.competitionId === comp.id);
          
          return (
            <Card key={comp.id} className="group hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20">
              <CardHeader className="pb-3 relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={comp.type === "league" ? "secondary" : "default"} className="capitalize">
                      {comp.type}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs font-normal">
                      {comp.format}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(comp)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(comp.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {comp.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {comp.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                      {cat.ageCategory}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(comp.startDate), "dd MMM")} - {format(new Date(comp.endDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="truncate">{comp.prizeStructure || "TBD"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <div className={comp.status === "ongoing" ? "h-2 w-2 rounded-full bg-green-500 animate-pulse" : "h-2 w-2 rounded-full bg-muted-foreground"} />
                    <span className="capitalize">{comp.status}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1 hover:bg-primary/10 hover:text-primary">
                    Manage <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingComp ? "Edit Competition" : "Create New Competition"}</DialogTitle>
          </DialogHeader>
          <CompetitionForm
            initialData={editingComp}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
