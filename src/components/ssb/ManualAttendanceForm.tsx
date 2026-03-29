import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  mockPlayers, 
  mockTrainingSchedules,
  mockParticipantGroups
} from "@/data/mock";
import { Player, TrainingSchedule, AttendanceStatus, AttendanceMethod } from "@/types";
import { User, Calendar, CheckCircle, XCircle, Clock, Save, FileText } from "lucide-react";

const formSchema = z.object({
  playerId: z.string().min(1, "Player is required"),
  sessionId: z.string().min(1, "Session is required"),
  status: z.enum(["present", "permitted", "absent"] as const),
  notes: z.string().optional(),
});

interface ManualAttendanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ManualAttendanceForm({ onSubmit, onCancel }: ManualAttendanceFormProps) {
  const { toast } = useToast();
  const [selectedAgeCategory, setSelectedAgeCategory] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerId: "",
      sessionId: "",
      status: "present",
      notes: "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      method: "manual" as AttendanceMethod,
      date: new Date().toISOString().split('T')[0],
      checkInTime: values.status === "present" ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast({
      title: "Attendance Recorded",
      description: `Manual entry for ${mockPlayers.find(p => p.id === values.playerId)?.name} saved.`,
    });
  };

  const selectedSessionId = form.watch("sessionId");
  const session = mockTrainingSchedules.find(s => s.id === selectedSessionId);
  const players = session ? mockPlayers.filter(p => p.ageCategory === session.ageCategory) : mockPlayers;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sessionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Training Session
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockTrainingSchedules.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title} ({s.ageCategory})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="playerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Player
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSessionId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedSessionId ? "Select player" : "Select session first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {players.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Showing players in {session?.ageCategory || 'all'} category</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Attendance Status</FormLabel>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={field.value === "present" ? "default" : "outline"}
                  className={cn(
                    "flex-1 gap-2 h-12",
                    field.value === "present" && "bg-green-600 hover:bg-green-700"
                  )}
                  onClick={() => field.onChange("present")}
                >
                  <CheckCircle className="h-4 w-4" /> Present
                </Button>
                <Button
                  type="button"
                  variant={field.value === "permitted" ? "default" : "outline"}
                  className={cn(
                    "flex-1 gap-2 h-12",
                    field.value === "permitted" && "bg-amber-600 hover:bg-amber-700"
                  )}
                  onClick={() => field.onChange("permitted")}
                >
                  <Clock className="h-4 w-4" /> Permitted
                </Button>
                <Button
                  type="button"
                  variant={field.value === "absent" ? "default" : "outline"}
                  className={cn(
                    "flex-1 gap-2 h-12",
                    field.value === "absent" && "bg-red-600 hover:bg-red-700"
                  )}
                  onClick={() => field.onChange("absent")}
                >
                  <XCircle className="h-4 w-4" /> Absent
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Notes (Optional)
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g. Reason for permission, injury, late arrival" 
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" /> Save Record
          </Button>
        </div>
      </form>
    </Form>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
