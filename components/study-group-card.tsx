"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Users, Clock, TrendingUp, MoreVertical } from "lucide-react"
import Link from "next/link"

interface StudyGroup {
  id: string
  name: string
  subject: string
  members: number
  nextSession: string
  recentActivity: string
  progress: number
  status: "active" | "inactive" | "completed"
  unreadMessages: number
}

interface StudyGroupCardProps {
  group: StudyGroup
}

export function StudyGroupCard({ group }: StudyGroupCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{group.name}</CardTitle>
              <Badge className={getStatusColor(group.status)}>{group.status}</Badge>
            </div>
            <Badge variant="outline">{group.subject}</Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Study Progress</span>
            <span className="text-muted-foreground">{group.progress}%</span>
          </div>
          <Progress value={group.progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{group.members} Members</p>
              <p className="text-xs text-muted-foreground">Active participants</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Next Session</p>
              <p className="text-xs text-muted-foreground">{group.nextSession}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last activity: {group.recentActivity}</span>
          </div>
          {group.unreadMessages > 0 && (
            <Badge variant="destructive" className="h-5 px-2 text-xs">
              {group.unreadMessages} new
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/chat/${group.id}`} className="flex-1">
            <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
              <MessageCircle className="w-4 h-4" />
              Open Chat
              {group.unreadMessages > 0 && (
                <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
                  {group.unreadMessages}
                </Badge>
              )}
            </Button>
          </Link>
          <Button className="flex-1">Join Session</Button>
        </div>
      </CardContent>
    </Card>
  )
}
