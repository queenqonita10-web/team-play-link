import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, ClipboardCheck, Dumbbell, Brain, MessageSquare, Target } from "lucide-react";

const formSchema = z.object({
  date: z.string(),
  period: z.enum(["weekly", "monthly", "quarterly"] as const),
  
  // Teknik
  passing: z.number().min(1).max(10),
  shooting: z.number().min(1).max(10),
  dribbling: z.number().min(1).max(10),
  firstTouch: z.number().min(1).max(10),
  
  // Fisik
  speed: z.number().min(1).max(10),
  stamina: z.number().min(1).max(10),
  strength: z.number().min(1).max(10),
  agility: z.number().min(1).max(10),
  
  // Taktik
  positioning: z.number().min(1).max(10),
  vision: z.number().min(1).max(10),
  decisionMaking: z.number().min(1).max(10),
  teamwork: z.number().min(1).max(10),
  
  // Mental
  leadership: z.number().min(1).max(10),
  composure: z.number().min(1).max(10),
  workEthic: z.number().min(1).max(10),
  coachability: z.number().min(1).max(10),

  // Comments
  commentTechnical: z.string().min(5, "Comment required"),
  commentPhysical: z.string().min(5, "Comment required"),
  commentTactical: z.string().min(5, "Comment required"),
  commentMental: z.string().min(5, "Comment required"),
  
  recommendations: z.string().min(10, "Specific recommendation required"),
  strengths: z.string(), // comma separated
  weaknesses: z.string(), // comma separated
  nextTargets: z.string(), // comma separated
});

interface EvaluationFormProps {
  playerId: string;
  playerName: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function EvaluationForm({ playerId, playerName, onSubmit, onCancel }: EvaluationFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("technical");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      period: "monthly",
      passing: 5, shooting: 5, dribbling: 5, firstTouch: 5,
      speed: 5, stamina: 5, strength: 5, agility: 5,
      positioning: 5, vision: 5, decisionMaking: 5, teamwork: 5,
      leadership: 5, composure: 5, workEthic: 5, coachability: 5,
      commentTechnical: "", commentPhysical: "", commentTactical: "", commentMental: "",
      recommendations: "", strengths: "", weaknesses: "", nextTargets: ""
    }
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    toast({
      title: "Evaluation Saved",
      description: `New performance record for ${playerName} has been created.`,
    });
  };

  const SkillSlider = ({ name, label, icon: Icon }: { name: any, label: string, icon: any }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3 p-4 border rounded-lg bg-card/50">
          <div className="flex justify-between items-center">
            <FormLabel className="flex items-center gap-2 font-semibold">
              <Icon className="h-4 w-4 text-primary" /> {label}
            </FormLabel>
            <Badge variant="secondary" className="text-lg w-10 justify-center h-8 font-bold">
              {field.value}
            </Badge>
          </div>
          <FormControl>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[field.value]}
              onValueChange={(vals) => field.onChange(vals[0])}
            />
          </FormControl>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Beginner (1)</span>
            <span>Expert (10)</span>
          </div>
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Date</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-12">
            <TabsTrigger value="technical" className="gap-2"><ClipboardCheck className="h-4 w-4" /> Technical</TabsTrigger>
            <TabsTrigger value="physical" className="gap-2"><Dumbbell className="h-4 w-4" /> Physical</TabsTrigger>
            <TabsTrigger value="tactical" className="gap-2"><Brain className="h-4 w-4" /> Tactical</TabsTrigger>
            <TabsTrigger value="mental" className="gap-2"><MessageSquare className="h-4 w-4" /> Mental</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[450px] mt-4 border rounded-xl p-4 bg-muted/20">
            <TabsContent value="technical" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillSlider name="passing" label="Passing" icon={ClipboardCheck} />
                <SkillSlider name="shooting" label="Shooting" icon={ClipboardCheck} />
                <SkillSlider name="dribbling" label="Dribbling" icon={ClipboardCheck} />
                <SkillSlider name="firstTouch" label="First Touch" icon={ClipboardCheck} />
              </div>
              <FormField
                control={form.control}
                name="commentTechnical"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Feedback</FormLabel>
                    <FormControl><Textarea {...field} placeholder="Comment on technique..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="physical" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillSlider name="speed" label="Speed" icon={Dumbbell} />
                <SkillSlider name="stamina" label="Stamina" icon={Dumbbell} />
                <SkillSlider name="strength" label="Strength" icon={Dumbbell} />
                <SkillSlider name="agility" label="Agility" icon={Dumbbell} />
              </div>
              <FormField
                control={form.control}
                name="commentPhysical"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Feedback</FormLabel>
                    <FormControl><Textarea {...field} placeholder="Comment on physical attributes..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="tactical" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillSlider name="positioning" label="Positioning" icon={Brain} />
                <SkillSlider name="vision" label="Vision" icon={Brain} />
                <SkillSlider name="decisionMaking" label="Decision Making" icon={Brain} />
                <SkillSlider name="teamwork" label="Teamwork" icon={Brain} />
              </div>
              <FormField
                control={form.control}
                name="commentTactical"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tactical Feedback</FormLabel>
                    <FormControl><Textarea {...field} placeholder="Comment on tactical understanding..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="mental" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillSlider name="leadership" label="Leadership" icon={MessageSquare} />
                <SkillSlider name="composure" label="Composure" icon={MessageSquare} />
                <SkillSlider name="workEthic" label="Work Ethic" icon={MessageSquare} />
                <SkillSlider name="coachability" label="Coachability" icon={MessageSquare} />
              </div>
              <FormField
                control={form.control}
                name="commentMental"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mental Feedback</FormLabel>
                    <FormControl><Textarea {...field} placeholder="Comment on mindset and mental strength..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Overall Summary</h3>
            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Recommendations</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Long-term development plan..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strengths</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. Speed, Stamina" /></FormControl>
                    <FormDescription>Comma separated</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas to Improve</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. Left Foot" /></FormControl>
                    <FormDescription>Comma separated</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextTargets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Targets</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. Score 2 goals" /></FormControl>
                    <FormDescription>Comma separated</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save Evaluation</Button>
        </div>
      </form>
    </Form>
  );
}
