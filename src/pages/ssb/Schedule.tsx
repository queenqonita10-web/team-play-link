import * as React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockTrainingSchedules, mockTrainers, mockTrainerAssignments } from "@/data/mock";
import { TrainingSchedule, Trainer, TrainerAssignment } from "@/types";
import { TrainingCalendar } from "@/components/ssb/TrainingCalendar";
import { TrainingDetailDialog } from "@/components/ssb/TrainingDetailDialog";
import { TrainingScheduleForm } from "@/components/ssb/TrainingScheduleForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { addDays, addWeeks, addMonths, parseISO, format } from "date-fns";

export default function Schedule() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [schedules, setSchedules] = React.useState<TrainingSchedule[]>(mockTrainingSchedules);
  const [selectedSchedule, setSelectedSchedule] = React.useState<TrainingSchedule | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formInitialData, setFormInitialData] = React.useState<TrainingSchedule | null>(null);

  const handleEventClick = (schedule: TrainingSchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailOpen(true);
  };

  const handleAddClick = (date: Date) => {
    setFormInitialData(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (schedule: TrainingSchedule) => {
    setFormInitialData(schedule);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    setIsDetailOpen(false);
    toast({
      title: "Schedule Deleted",
      description: "The training session has been removed.",
    });
  };

  const handleNotify = (id: string) => {
    toast({
      title: "Notifications Sent",
      description: "Parents have been notified about the training schedule.",
    });
  };

  const handleFormSubmit = (data: any) => {
    if (formInitialData) {
      // Update existing
      setSchedules(prev => prev.map(s => s.id === formInitialData.id ? { ...s, ...data } : s));
      toast({
        title: "Schedule Updated",
        description: "Training session has been successfully updated.",
      });
    } else {
      // Create new (handle recurrence)
      const newSchedules: TrainingSchedule[] = [];
      const baseId = `sch-${Date.now()}`;
      
      const baseSchedule: TrainingSchedule = {
        id: baseId,
        ...data,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      newSchedules.push(baseSchedule);

      // Simple recurrence logic for demo
      if (data.recurrence !== "none" && data.recurrenceEndDate) {
        let currentStart = new Date(data.startTime);
        let currentEnd = new Date(data.endTime);
        const endDate = new Date(data.recurrenceEndDate);
        
        let count = 1;
        while (count < 10) { // Limit for safety in demo
          if (data.recurrence === "daily") {
            currentStart = addDays(currentStart, 1);
            currentEnd = addDays(currentEnd, 1);
          } else if (data.recurrence === "weekly") {
            currentStart = addWeeks(currentStart, 1);
            currentEnd = addWeeks(currentEnd, 1);
          } else if (data.recurrence === "monthly") {
            currentStart = addMonths(currentStart, 1);
            currentEnd = addMonths(currentEnd, 1);
          }
          
          if (currentStart > endDate) break;
          
          newSchedules.push({
            ...baseSchedule,
            id: `${baseId}-${count}`,
            startTime: currentStart.toISOString(),
            endTime: currentEnd.toISOString(),
          });
          count++;
        }
      }

      setSchedules(prev => [...prev, ...newSchedules]);
      toast({
        title: "Schedule Created",
        description: `${newSchedules.length} session(s) have been created.`,
      });
    }
    setIsFormOpen(false);
  };

  const handleEventDrop = (scheduleId: string, newStartTime: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === scheduleId) {
        const duration = new Date(s.endTime).getTime() - new Date(s.startTime).getTime();
        const newEndTime = new Date(new Date(newStartTime).getTime() + duration).toISOString();
        return { ...s, startTime: newStartTime, endTime: newEndTime };
      }
      return s;
    }));
    
    toast({
      title: "Schedule Moved",
      description: `Session moved to ${format(new Date(newStartTime), "PPP 'at' HH:mm")}`,
    });
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.ssb.trainingSchedule}</h1>
          <p className="text-muted-foreground">Manage training sessions, assignments, and notifications.</p>
        </div>
      </div>

      <TrainingCalendar 
        schedules={schedules} 
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
        onAddClick={handleAddClick}
      />

      <TrainingDetailDialog
        schedule={selectedSchedule}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onNotify={handleNotify}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{formInitialData ? "Edit Training Schedule" : "Create Training Schedule"}</DialogTitle>
          </DialogHeader>
          <TrainingScheduleForm
            initialData={formInitialData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
