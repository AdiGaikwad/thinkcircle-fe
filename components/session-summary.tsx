"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Brain, CheckCircle, Lightbulb } from "lucide-react"

interface SessionSummary {
  id: string
  groupName: string
  date: string
  duration: string
  participants: string[]
  keyTopics: string[]
  summary: string
  actionItems: string[]
  aiInsights: string
}

interface SessionSummaryProps {
  summary: SessionSummary
}

export function SessionSummary({ summary }: SessionSummaryProps) {
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{summary.groupName}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {summary.date} • {summary.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {summary.participants.length} participants
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            AI Generated
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Participants */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Participants</h4>
          <div className="flex items-center gap-2">
            {summary.participants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`/generic-placeholder-participant.png?key=participant${index}`} alt={participant} />
                  <AvatarFallback className="text-xs">
                    {participant
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{participant}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Topics */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Topics Discussed</h4>
          <div className="flex flex-wrap gap-2">
            {summary.keyTopics.map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Session Summary</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary.summary}</p>
        </div>

        {/* Action Items */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Action Items
          </h4>
          <div className="space-y-2">
            {summary.actionItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">AI Insights</h4>
              <p className="text-sm text-muted-foreground">{summary.aiInsights}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
