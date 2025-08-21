"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Target, BookOpen } from "lucide-react"

const weeklyStats = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.0 },
  { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 2.5 },
]

const subjectProgress = [
  { subject: "Mathematics", progress: 85, color: "bg-primary" },
  { subject: "Chemistry", progress: 70, color: "bg-accent" },
  { subject: "Computer Science", progress: 92, color: "bg-chart-3" },
]

export function StudyStats() {
  const totalHours = weeklyStats.reduce((sum, day) => sum + day.hours, 0)
  const avgHours = totalHours / 7
  const maxHours = Math.max(...weeklyStats.map((day) => day.hours))

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Study Statistics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Weekly Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">This Week</h4>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {totalHours.toFixed(1)}h total
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {avgHours.toFixed(1)}h avg
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-20">
            {weeklyStats.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t flex-shrink-0 transition-all duration-300 hover:bg-primary/30"
                  style={{ height: `${(day.hours / maxHours) * 60}px` }}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Subject Progress
          </h4>
          <div className="space-y-3">
            {subjectProgress.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="text-muted-foreground">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Weekly Insight</h4>
              <p className="text-xs text-muted-foreground mt-1">
                You're 15% ahead of your study goals this week! Computer Science is your strongest subject.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
