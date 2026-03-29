import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SkillRating } from '@/types';
import { format, parseISO } from 'date-fns';

interface SkillVisualizerProps {
  ratings: SkillRating[];
}

export const SkillVisualizer: React.FC<SkillVisualizerProps> = ({ ratings }) => {
  if (!ratings || ratings.length === 0) return null;

  const latestRating = ratings[ratings.length - 1];

  // Data for Radar Chart (latest rating)
  const radarData = [
    { subject: 'Passing', A: latestRating.passing, fullMark: 10 },
    { subject: 'Shooting', A: latestRating.shooting, fullMark: 10 },
    { subject: 'Dribbling', A: latestRating.dribbling, fullMark: 10 },
    { subject: 'First Touch', A: latestRating.firstTouch, fullMark: 10 },
    { subject: 'Speed', A: latestRating.speed, fullMark: 10 },
    { subject: 'Stamina', A: latestRating.stamina, fullMark: 10 },
    { subject: 'Vision', A: latestRating.vision, fullMark: 10 },
    { subject: 'Teamwork', A: latestRating.teamwork, fullMark: 10 },
  ];

  // Data for Line Chart (progress over time)
  const lineData = ratings.map(r => ({
    date: format(parseISO(r.date), 'MMM yyyy'),
    Average: r.overallAverage,
    Technical: (r.passing + r.shooting + r.dribbling + r.firstTouch) / 4,
    Physical: (r.speed + r.stamina + r.strength + r.agility) / 4,
    Tactical: (r.positioning + r.vision + r.decisionMaking + r.teamwork) / 4,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Profile</CardTitle>
          <CardDescription>Current technical & physical attributes</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Radar
                name="Player"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Progress</CardTitle>
          <CardDescription>Skill growth over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={[0, 10]} fontSize={12} />
              <Tooltip />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="Average" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Technical" stroke="#10b981" />
              <Line type="monotone" dataKey="Physical" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
