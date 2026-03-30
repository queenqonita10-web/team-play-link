import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addHours, parseISO } from "date-fns";
import { TrainingSchedule, AgeCategory, RecurrenceType, Trainer } from "@/types";
import { mockTrainers, mockParticipantGroups } from "@/data/mock";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, MapPin, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().min(3, "Location is required"),
  ageCategory: z.enum(["U8", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U17", "U18", "U20", "Senior"] as const),
  groupId: z.string().optional(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  maxParticipants: z.coerce.number().min(1, "At least 1 participant"),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"] as const),
  recurrenceEndDate: z.date().optional(),
  trainerIds: z.array(z.string()).min(1, "Select at least one trainer"),
});

interface TrainingScheduleFormProps {
  initialData?: TrainingSchedule | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function TrainingScheduleForm({
  initialData,
  onSubmit,
  onCancel,
}: TrainingScheduleFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || "",
      location: initialData.location,
      ageCategory: initialData.ageCategory,
      groupId: initialData.groupId || "",
      date: new Date(initialData.startTime),
      startTime: format(new Date(initialData.startTime), "HH:mm"),
      endTime: format(new Date(initialData.endTime), "HH:mm"),
      maxParticipants: initialData.maxParticipants,
      recurrence: initialData.recurrence?.type || "none",
      recurrenceEndDate: initialData.recurrence?.endDate ? new Date(initialData.recurrence.endDate) : undefined,
      trainerIds: [], // Need to fetch assignments
    } : {
      title: "",
      description: "",
      location: "Lapangan Merdeka",
      ageCategory: "U10",
      groupId: "",
      date: new Date("2026-03-30"),
      startTime: "07:00",
      endTime: "09:00",
      maxParticipants: 20,
      recurrence: "none",
      trainerIds: [],
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Conflict detection logic (mocked)
    const hasConflict = false; // Mocked check
    
    if (hasConflict) {
      toast({
        title: "Conflict Detected",
        description: "Trainer is already assigned to another session at this time.",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const start = new Date(values.date);
    const [startH, startM] = values.startTime.split(":").map(Number);
    start.setHours(startH, startM);

    const end = new Date(values.date);
    const [endH, endM] = values.endTime.split(":").map(Number);
    end.setHours(endH, endM);

    onSubmit({
      ...values,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      recurrenceEndDate: values.recurrenceEndDate?.toISOString(),
    });
  };

  const selectedAgeCategory = form.watch("ageCategory");
  const filteredGroups = mockParticipantGroups.filter(g => g.ageCategory === selectedAgeCategory);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className="max-h-[70vh] px-1">
          <div className="space-y-6 pr-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fundamental Skills Training" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ageCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["U8", "U10", "U12", "U15", "U18", "Senior"].map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredGroups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Filtered by age category</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("2026-01-01") // Mocked min date
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Venue name" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Repeat className="h-4 w-4" /> Recurrence Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recurrence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">One-time</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("recurrence") !== "none" && (
                  <FormField
                    control={form.control}
                    name="recurrenceEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Until Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>End Date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < form.getValues("date")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <FormLabel>Assign Trainers</FormLabel>
              <div className="grid grid-cols-2 gap-4 border rounded-md p-4">
                {mockTrainers.map((trainer) => (
                  <FormField
                    key={trainer.id}
                    control={form.control}
                    name="trainerIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={trainer.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(trainer.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, trainer.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== trainer.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {trainer.name}
                            <span className="block text-[10px] text-muted-foreground">
                              {trainer.specialization}
                            </span>
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Training objectives, equipment needed, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Schedule" : "Create Schedule"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
