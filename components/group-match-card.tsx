"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Target, Check, X, Calendar, BookOpen, MessageCircle } from "lucide-react"
import Link from "next/link"

interface GroupMember {
  name: string
  avatar: string
  level: string
  subjects: string[]
}

interface GroupMatch {
  id: string
  name: string
  subject: string
  compatibility: number
  members: GroupMember[]
  schedule: string
  goals: string
  learningStyle: string
  groupSize: string
  nextSession: string
}

interface GroupMatchCardProps {
  match: GroupMatch
  isJoined: boolean
  onJoin: () => void
  onDecline: () => void
}

export function GroupMatchCard({ match, isJoined, onJoin, onDecline }: GroupMatchCardProps) {
  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-accent"
    if (score >= 70) return "text-yellow-600"
    return "text-orange-600"
  }

  const getCompatibilityBg = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900/20"
    if (score >= 80) return "bg-accent/10"
    if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-orange-100 dark:bg-orange-900/20"
  }

  return (
    <Card
      className={`backdrop-blur-sm bg-card/80 border-border/50 transition-all duration-300 hover:shadow-lg ${isJoined ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{match.name}</CardTitle>
              {isJoined && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Joined
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{match.subject}</Badge>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${getCompatibilityBg(match.compatibility)}`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                <span className={`text-sm font-medium ${getCompatibilityColor(match.compatibility)}`}>
                  {match.compatibility}% Match
                </span>
              </div>
            </div>
          </div>

          {!isJoined && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onDecline}>
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={onJoin} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Join Group
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Compatibility Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Compatibility Score</span>
            <span className={getCompatibilityColor(match.compatibility)}>{match.compatibility}%</span>
          </div>
          <Progress value={match.compatibility} className="h-2" />
        </div>

        {/* Group Members */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Group Members ({match.members.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {match.members.map((member, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.level}</p>
                  <div className="flex gap-1 mt-1">
                    {member.subjects.slice(0, 2).map((subject, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-1 py-0">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Schedule</p>
                <p className="text-sm text-muted-foreground">{match.schedule}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Next Session</p>
                <p className="text-sm text-accent font-medium">{match.nextSession}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Learning Style</p>
                <p className="text-sm text-muted-foreground">{match.learningStyle}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Group Size</p>
                <p className="text-sm text-muted-foreground">{match.groupSize}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Study Goals
          </h4>
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{match.goals}</p>
        </div>

        {isJoined && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                You're now part of this study group! Check your dashboard for group chat and upcoming sessions.
              </p>
              <Link href={`/chat/${match.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <MessageCircle className="w-4 h-4" />
                  View Group Chat
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
