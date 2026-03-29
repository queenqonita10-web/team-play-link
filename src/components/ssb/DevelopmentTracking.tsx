import React from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  Star,
  ChevronRight,
  History,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { SkillVisualizer } from "./SkillVisualizer";
import { EvaluationForm } from "./EvaluationForm";
import { Player, SkillRating, CoachEvaluation } from "@/types";
import { format, parseISO } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

interface DevelopmentTrackingProps {
  player: Player;
}

export function DevelopmentTracking({ player }: DevelopmentTrackingProps) {
  const { toast } = useToast();
  const [isEvalOpen, setIsEvalOpen] = React.useState(false);
  
  const latestRating = player.skillRatings?.[player.skillRatings.length - 1];
  const latestEvaluation = player.evaluations?.[player.evaluations.length - 1];

  const handleExportPDF = () => {
    toast({
      title: "Generating Report",
      description: "PDF report for " + player.name + " is being generated...",
    });
  };

  const handleNewEvaluation = (data: any) => {
    // In a real app, this would be an API call
    console.log("New evaluation data:", data);
    setIsEvalOpen(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Player Development Tracking
          </h2>
          <p className="text-sm text-muted-foreground">Comprehensive skill analysis and coach evaluations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" /> Export Report (PDF)
          </Button>
          <Dialog open={isEvalOpen} onOpenChange={setIsEvalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> New Evaluation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Coach Evaluation Form</DialogTitle>
                <CardDescription>Evaluate {player.name}'s performance for the current period.</CardDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-1">
                <EvaluationForm 
                  playerId={player.id} 
                  playerName={player.name} 
                  onSubmit={handleNewEvaluation} 
                  onCancel={() => setIsEvalOpen(false)} 
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Visualizations Section */}
      <SkillVisualizer ratings={player.skillRatings || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Evaluation Column */}
        <Card className="lg:col-span-2 border-2 border-primary/10">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Latest Coach Evaluation</CardTitle>
                <CardDescription>
                  {latestEvaluation ? `Assessment for ${format(parseISO(latestEvaluation.date), 'MMMM yyyy')}` : "No evaluations yet"}
                </CardDescription>
              </div>
              {latestEvaluation && (
                <Badge variant="outline" className="bg-background capitalize">{latestEvaluation.period} Review</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {latestEvaluation ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> Technical & Physical</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                        {latestEvaluation.comments.technical}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                        {latestEvaluation.comments.physical}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Tactical & Mental</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                        {latestEvaluation.comments.tactical}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                        {latestEvaluation.comments.mental}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {latestEvaluation.strengths.map((s, i) => (
                        <Badge key={i} variant="secondary" className="bg-green-50 text-green-700 border-green-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> Areas to Improve</h4>
                    <div className="flex flex-wrap gap-2">
                      {latestEvaluation.weaknesses.map((w, i) => (
                        <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">{w}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-blue-900"><Target className="h-4 w-4 text-blue-600" /> Recommendations & Next Targets</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">{latestEvaluation.recommendations}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {latestEvaluation.nextTargets.map((t, i) => (
                      <li key={i} className="text-xs text-blue-700 flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground italic">
                No evaluation records available for this player.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evaluation History Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" /> Evaluation History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y">
                {player.evaluations?.sort((a, b) => b.date.localeCompare(a.date)).map((eval_item) => (
                  <div key={eval_item.id} className="p-4 hover:bg-muted/30 cursor-pointer transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold">{format(parseISO(eval_item.date), 'dd MMM yyyy')}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">{eval_item.period}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 italic mb-2">"{eval_item.comments.technical}"</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">Evaluated by Coach ID: {eval_item.evaluatorId}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
                {(!player.evaluations || player.evaluations.length === 0) && (
                  <div className="p-8 text-center text-sm text-muted-foreground italic">
                    No history found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-muted/10">
            <Button variant="ghost" className="w-full text-xs gap-2" size="sm">
              View All Evaluations <ChevronRight className="h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

const Brain = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
  </svg>
);
