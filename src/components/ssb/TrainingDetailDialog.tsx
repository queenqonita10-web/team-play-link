import * as React from "react";
import { format } from "date-fns";
import { Clock, MapPin, User, Users, Bell, Trash2, Edit2, CheckCircle, AlertCircle, Calendar as CalendarIcon, Phone, Mail } from "lucide-react";
import { TrainingSchedule, Trainer, TrainerAssignment, ParticipantGroup, Player } from "@/types";
import { mockTrainers, mockTrainerAssignments, mockParticipantGroups, mockPlayers } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainingDetailDialogProps {
  schedule: TrainingSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (schedule: TrainingSchedule) => void;
  onDelete: (id: string) => void;
  onNotify: (id: string) => void;
}

export function TrainingDetailDialog({
  schedule,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onNotify,
}: TrainingDetailDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("details");
  
  if (!schedule) return null;

  const assignments = mockTrainerAssignments.filter(a => a.scheduleId === schedule.id);
  const assignedTrainers = assignments.map(a => mockTrainers.find(t => t.id === a.trainerId)).filter(Boolean) as Trainer[];
  const group = mockParticipantGroups.find(g => g.id === schedule.groupId);
  const players = group ? group.players.map(pid => mockPlayers.find(p => p.id === pid)).filter(Boolean) as Player[] : [];

  const handleAssignTrainer = (trainerId: string) => {
    // Check for conflict (mocked)
    const trainer = mockTrainers.find(t => t.id === trainerId);
    toast({
      title: "Trainer Assigned",
      description: `${trainer?.name} has been assigned to this session.`,
    });
  };

  const handleNotify = () => {
    onNotify(schedule.id);
    toast({
      title: "Notifications Sent",
      description: `Reminders have been sent to parents of ${players.length} players.`,
    });
  };

  const startTime = new Date(schedule.startTime);
  const endTime = new Date(schedule.endTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex justify-between items-start pr-8">
            <div>
              <DialogTitle className="text-xl">{schedule.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {schedule.ageCategory} • {format(startTime, "EEEE, d MMMM yyyy")}
              </DialogDescription>
            </div>
            <Badge variant={schedule.status === "scheduled" ? "default" : "secondary"}>
              {schedule.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent border-b-0 h-12 w-full justify-start gap-4">
              <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-1">Details</TabsTrigger>
              <TabsTrigger value="trainers" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-1">Trainers ({assignedTrainers.length})</TabsTrigger>
              <TabsTrigger value="participants" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-1">Participants ({players.length})</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <TabsContent value="details" className="m-0 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Time
                    </span>
                    <p className="text-sm font-semibold">
                      {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Location
                    </span>
                    <p className="text-sm font-semibold">{schedule.location}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                      <Users className="h-3 w-3" /> Group
                    </span>
                    <p className="text-sm font-semibold">{group?.name || "No Group Assigned"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                      <CalendarIcon className="h-3 w-3" /> Recurrence
                    </span>
                    <p className="text-sm font-semibold">
                      {schedule.recurrence?.type === "weekly" ? "Every Week" : schedule.recurrence?.type || "None"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {schedule.description || "No description provided for this session."}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Notifications</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Reminders are automatically sent 24 hours before the session. 
                      You can also trigger them manually.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 h-8" onClick={handleNotify}>
                      Send Now
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trainers" className="m-0 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold">Assigned Trainers</h4>
                  <div className="w-48">
                    <Select onValueChange={handleAssignTrainer}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Add trainer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTrainers.filter(t => !assignedTrainers.find(at => at.id === t.id)).map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  {assignedTrainers.map((trainer) => (
                    <div key={trainer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={trainer.photoUrl} alt={trainer.name} />
                          <AvatarFallback>{trainer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{trainer.name}</p>
                          <p className="text-xs text-muted-foreground">{trainer.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {assignedTrainers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground italic text-sm border-2 border-dashed rounded-lg">
                      No trainers assigned yet.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="participants" className="m-0 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold">Players in Group</h4>
                  <Badge variant="outline">{players.length} / {schedule.maxParticipants}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center gap-3 p-2 border rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.photoUrl} />
                        <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate">{player.name}</p>
                        <p className="text-[10px] text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {players.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground italic text-sm">
                    No players in this group.
                  </div>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="p-6 bg-muted/20 border-t flex items-center justify-between sm:justify-between">
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(schedule.id)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button size="sm" onClick={() => onEdit(schedule)}>
              <Edit2 className="h-4 w-4 mr-2" /> Edit Session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
