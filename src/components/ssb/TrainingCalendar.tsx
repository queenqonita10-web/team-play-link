import * as React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays, subDays, startOfDay, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainingSchedule, Trainer, TrainerAssignment } from "@/types";
import { mockTrainers, mockTrainerAssignments } from "@/data/mock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrainingCalendarProps {
  schedules: TrainingSchedule[];
  onEventClick?: (schedule: TrainingSchedule) => void;
  onEventDrop?: (scheduleId: string, newStartTime: string) => void;
  onAddClick?: (date: Date) => void;
}

type CalendarView = "month" | "week" | "day";

export function TrainingCalendar({
  schedules,
  onEventClick,
  onEventDrop,
  onAddClick,
}: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date("2026-03-30")); // Set to mock date for demo
  const [view, setView] = React.useState<CalendarView>("month");
  const [draggedEventId, setDraggedEventId] = React.useState<string | null>(null);

  const next = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const today = () => setCurrentDate(new Date("2026-03-30"));

  const getEventsForDay = (day: Date) => {
    return schedules.filter((s) => isSameDay(new Date(s.startTime), day));
  };

  const handleDragStart = (e: React.DragEvent, scheduleId: string) => {
    setDraggedEventId(scheduleId);
    e.dataTransfer.setData("scheduleId", scheduleId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const scheduleId = e.dataTransfer.getData("scheduleId");
    if (scheduleId && onEventDrop) {
      // Logic to calculate new start time based on the dropped date
      // For now, we just keep the time part of the original start time
      const originalSchedule = schedules.find(s => s.id === scheduleId);
      if (originalSchedule) {
        const originalStart = new Date(originalSchedule.startTime);
        const newStart = new Date(date);
        newStart.setHours(originalStart.getHours());
        newStart.setMinutes(originalStart.getMinutes());
        onEventDrop(scheduleId, newStart.toISOString());
      }
    }
    setDraggedEventId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="border rounded-lg overflow-hidden bg-background">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground uppercase">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date("2026-03-30"));
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[120px] border-b border-r p-1 transition-colors hover:bg-muted/30",
                  !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                  i % 7 === 6 && "border-r-0"
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isToday && "bg-primary text-primary-foreground"
                  )}>
                    {format(day, "d")}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => onAddClick?.(day)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event.id)}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "text-[10px] p-1 rounded border cursor-pointer truncate flex items-center gap-1",
                        event.status === "scheduled" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-500",
                        draggedEventId === event.id && "opacity-50"
                      )}
                    >
                      <GripVertical className="h-2 w-2 opacity-30" />
                      <span className="font-semibold">{format(new Date(event.startTime), "HH:mm")}</span>
                      <span>{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 to 21:00

    return (
      <div className="border rounded-lg overflow-hidden bg-background flex flex-col">
        <div className="grid grid-cols-[80px_1fr] border-b bg-muted/50">
          <div className="p-2 border-r"></div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => (
              <div key={day.toISOString()} className="p-2 text-center border-r last:border-r-0">
                <div className="text-xs font-medium text-muted-foreground uppercase">{format(day, "EEE")}</div>
                <div className={cn(
                  "text-sm font-bold mt-1 inline-flex w-7 h-7 items-center justify-center rounded-full",
                  isSameDay(day, new Date("2026-03-30")) && "bg-primary text-primary-foreground"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[600px]">
          <div className="grid grid-cols-[80px_1fr] relative">
            <div className="border-r">
              {hours.map(hour => (
                <div key={hour} className="h-20 border-b text-[10px] p-1 text-muted-foreground text-right pr-2">
                  {format(new Date().setHours(hour, 0), "HH:mm")}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 relative">
              {calendarDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="relative border-r last:border-r-0"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  {hours.map(hour => (
                    <div key={hour} className="h-20 border-b"></div>
                  ))}
                  {getEventsForDay(day).map(event => {
                    const start = new Date(event.startTime);
                    const end = new Date(event.endTime);
                    const startHour = start.getHours();
                    const startMin = start.getMinutes();
                    const durationMin = (end.getTime() - start.getTime()) / (1000 * 60);
                    
                    const top = (startHour - 7) * 80 + (startMin / 60) * 80;
                    const height = (durationMin / 60) * 80;

                    return (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event.id)}
                        onClick={() => onEventClick?.(event)}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        className={cn(
                          "absolute left-0 right-0 m-0.5 p-1 rounded border shadow-sm cursor-pointer z-10 overflow-hidden text-[10px]",
                          event.status === "scheduled" ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-gray-100 border-gray-300 text-gray-600"
                        )}
                      >
                        <div className="font-bold">{event.title}</div>
                        <div>{format(start, "HH:mm")} - {format(end, "HH:mm")}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-2 w-2" /> {event.location}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 7);
    const dayEvents = getEventsForDay(currentDate);

    return (
      <div className="border rounded-lg overflow-hidden bg-background flex flex-col">
        <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
          <div className="font-bold text-lg">{format(currentDate, "EEEE, d MMMM yyyy")}</div>
          <Badge variant="outline">{dayEvents.length} Sessions</Badge>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[600px]">
          <div className="grid grid-cols-[100px_1fr] relative">
            <div className="border-r">
              {hours.map(hour => (
                <div key={hour} className="h-20 border-b text-xs p-2 text-muted-foreground text-right pr-4">
                  {format(new Date().setHours(hour, 0), "HH:mm")}
                </div>
              ))}
            </div>
            <div
              className="relative"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, currentDate)}
            >
              {hours.map(hour => (
                <div key={hour} className="h-20 border-b"></div>
              ))}
              {dayEvents.map(event => {
                const start = new Date(event.startTime);
                const end = new Date(event.endTime);
                const startHour = start.getHours();
                const startMin = start.getMinutes();
                const durationMin = (end.getTime() - start.getTime()) / (1000 * 60);
                
                const top = (startHour - 7) * 80 + (startMin / 60) * 80;
                const height = (durationMin / 60) * 80;

                return (
                  <Card
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onClick={() => onEventClick?.(event)}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    className={cn(
                      "absolute left-2 right-2 p-2 shadow-md cursor-pointer z-10 overflow-hidden",
                      event.status === "scheduled" ? "border-l-4 border-l-blue-500 bg-blue-50" : "border-l-4 border-l-gray-500 bg-gray-50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {format(start, "HH:mm")} - {format(end, "HH:mm")}
                        </div>
                      </div>
                      <Badge>{event.ageCategory}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {event.maxParticipants} max
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md p-1 bg-background">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3" onClick={today}>
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold min-w-[150px]">
            {format(currentDate, view === "month" ? "MMMM yyyy" : "MMM d, yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md p-1 bg-background">
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView("day")}
            >
              Day
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="h-10 w-10 rounded-full" onClick={() => onAddClick?.(currentDate)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Schedule</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mt-4">
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>
    </div>
  );
}
