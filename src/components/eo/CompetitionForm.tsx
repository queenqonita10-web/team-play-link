import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  Competition, 
  CompetitionType, 
  TournamentFormat, 
  AgeCategory 
} from "@/types";
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
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Trophy, Calendar, Users, Settings } from "lucide-react";

const categorySchema = z.object({
  ageCategory: z.enum(["U8", "U10", "U12", "U15", "U18", "Senior", "Veteran"] as const),
  maxTeams: z.coerce.number().min(2, "Minimum 2 teams"),
  registrationFee: z.coerce.number().min(0, "Fee cannot be negative"),
  lateFee: z.coerce.number().min(0, "Late fee cannot be negative").optional(),
  rules: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  type: z.enum(["league", "tournament"] as const),
  format: z.enum(["group", "knockout", "hybrid"] as const),
  startDate: z.string(),
  endDate: z.string(),
  registrationStart: z.string(),
  registrationEnd: z.string(),
  description: z.string().optional(),
  prizeStructure: z.string().optional(),
  participantLimit: z.coerce.number().optional(),
  categories: z.array(categorySchema).min(1, "At least one category is required"),
});

interface CompetitionFormProps {
  initialData?: Competition | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CompetitionForm({ initialData, onSubmit, onCancel }: CompetitionFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      type: initialData.type,
      format: initialData.format,
      startDate: initialData.startDate,
      endDate: initialData.endDate,
      registrationStart: initialData.registrationPeriod.start,
      registrationEnd: initialData.registrationPeriod.end,
      description: initialData.description || "",
      prizeStructure: initialData.prizeStructure || "",
      participantLimit: initialData.participantLimit,
      categories: [], // In a real app, fetch these
    } : {
      name: "",
      type: "tournament",
      format: "group",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      registrationStart: format(new Date(), "yyyy-MM-dd"),
      registrationEnd: format(new Date(), "yyyy-MM-dd"),
      categories: [{ ageCategory: "U12", maxTeams: 16, registrationFee: 500000, lateFee: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    toast({
      title: initialData ? "Competition Updated" : "Competition Created",
      description: `${values.name} has been successfully saved.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jakarta Youth Cup 2026" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="league">League</SelectItem>
                            <SelectItem value="tournament">Tournament</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="group">Group Stage Only</SelectItem>
                            <SelectItem value="knockout">Pure Knockout</SelectItem>
                            <SelectItem value="hybrid">Hybrid (Group + Knockout)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Schedule & Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Age Categories & Fees
                </CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ ageCategory: "U12", maxTeams: 16, registrationFee: 500000, lateFee: 0 })}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Category
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                    <div className="flex gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`categories.${index}.ageCategory`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-xs">Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["U8", "U10", "U12", "U15", "U18", "Senior", "Veteran"].map(a => (
                                  <SelectItem key={a} value={a}>{a}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categories.${index}.maxTeams`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel className="text-xs">Max Teams</FormLabel>
                            <FormControl>
                              <Input type="number" className="h-8 text-xs" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="mt-6 h-8 w-8 text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`categories.${index}.registrationFee`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Registration Fee (Rp)</FormLabel>
                            <FormControl>
                              <Input type="number" className="h-8 text-xs" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categories.${index}.lateFee`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Late Fee (Rp)</FormLabel>
                            <FormControl>
                              <Input type="number" className="h-8 text-xs" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" /> Details & Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prizeStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize Structure</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {initialData ? "Update Competition" : "Create Competition"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
