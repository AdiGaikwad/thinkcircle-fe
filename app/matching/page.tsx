"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Users, Clock, Target, Brain, RefreshCw } from "lucide-react"
import { GroupMatchCard } from "@/components/group-match-card"
import { MatchingAnimation } from "@/components/matching-animation"

// Mock data for demonstration
const mockMatches = [
  {
    id: "1",
    name: "Advanced Calculus Study Circle",
    subject: "Mathematics",
    compatibility: 95,
    members: [
      {
        name: "Sarah Chen",
        avatar: "/diverse-students-studying.png",
        level: "Advanced",
        subjects: ["Calculus", "Linear Algebra"],
      },
      {
        name: "Mike Rodriguez",
        avatar: "/diverse-students-studying.png",
        level: "Advanced",
        subjects: ["Calculus", "Physics"],
      },
      {
        name: "Emma Thompson",
        avatar: "/diverse-students-studying.png",
        level: "Intermediate",
        subjects: ["Calculus", "Statistics"],
      },
    ],
    schedule: "Mon, Wed, Fri 7-9 PM",
    goals: "Prepare for final exams and master integration techniques",
    learningStyle: "Visual & Problem-solving",
    groupSize: "Small (4 people)",
    nextSession: "Tomorrow at 7:00 PM",
  },
  {
    id: "2",
    name: "Organic Chemistry Lab Partners",
    subject: "Chemistry",
    compatibility: 88,
    members: [
      {
        name: "Alex Kim",
        avatar: "/diverse-students-studying.png",
        level: "Intermediate",
        subjects: ["Organic Chemistry", "Biochemistry"],
      },
      {
        name: "Jordan Lee",
        avatar: "/diverse-students-studying.png",
        level: "Advanced",
        subjects: ["Chemistry", "Biology"],
      },
      {
        name: "Taylor Swift",
        avatar: "/diverse-students-studying.png",
        level: "Intermediate",
        subjects: ["Chemistry", "Physics"],
      },
    ],
    schedule: "Tue, Thu 3-5 PM",
    goals: "Master reaction mechanisms and lab techniques",
    learningStyle: "Kinesthetic & Visual",
    groupSize: "Small (4 people)",
    nextSession: "Thursday at 3:00 PM",
  },
  {
    id: "3",
    name: "Computer Science Algorithms Group",
    subject: "Computer Science",
    compatibility: 82,
    members: [
      {
        name: "David Park",
        avatar: "/diverse-students-studying.png",
        level: "Advanced",
        subjects: ["Algorithms", "Data Structures"],
      },
      {
        name: "Lisa Wang",
        avatar: "/diverse-students-studying.png",
        level: "Intermediate",
        subjects: ["Programming", "Algorithms"],
      },
      {
        name: "Chris Johnson",
        avatar: "/diverse-students-studying.png",
        level: "Advanced",
        subjects: ["Computer Science", "Mathematics"],
      },
    ],
    schedule: "Daily 6-8 PM",
    goals: "Prepare for technical interviews and coding competitions",
    learningStyle: "Problem-solving & Discussion",
    groupSize: "Medium (5 people)",
    nextSession: "Today at 6:00 PM",
  },
]

export default function MatchingPage() {
  const [isMatching, setIsMatching] = useState(true)
  const [matchProgress, setMatchProgress] = useState(0)
  const [matches, setMatches] = useState<typeof mockMatches>([])
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])

  useEffect(() => {
    // Simulate AI matching process
    const timer = setInterval(() => {
      setMatchProgress((prev) => {
        if (prev >= 100) {
          setIsMatching(false)
          setMatches(mockMatches)
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups((prev) => [...prev, groupId])
  }

  const handleDeclineGroup = (groupId: string) => {
    setMatches((prev) => prev.filter((match) => match.id !== groupId))
  }

  const restartMatching = () => {
    setIsMatching(true)
    setMatchProgress(0)
    setMatches([])
    setJoinedGroups([])

    const timer = setInterval(() => {
      setMatchProgress((prev) => {
        if (prev >= 100) {
          setIsMatching(false)
          setMatches(mockMatches)
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
            <Brain className="w-4 h-4" />
            AI-Powered Matching
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Finding Your Perfect Study Groups</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI analyzes your learning profile to match you with compatible study partners and optimal group dynamics
          </p>
        </div>

        {isMatching ? (
          /* Matching Animation Section */
          <div className="max-w-2xl mx-auto space-y-8">
            <MatchingAnimation />

            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  Analyzing Your Profile
                </CardTitle>
                <CardDescription>
                  Finding students with compatible learning styles, schedules, and academic goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Matching Progress</span>
                    <span>{matchProgress}%</span>
                  </div>
                  <Progress value={matchProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Analyzing Compatibility</p>
                    <p className="text-xs text-muted-foreground">Learning styles & skill levels</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm font-medium">Matching Schedules</p>
                    <p className="text-xs text-muted-foreground">Finding optimal time slots</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Aligning Goals</p>
                    <p className="text-xs text-muted-foreground">Academic objectives & topics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Matches Results Section */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-foreground">Your Study Group Matches</h2>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {matches.length} Groups Found
                </Badge>
              </div>
              <Button variant="outline" onClick={restartMatching} className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="w-4 h-4" />
                Find New Matches
              </Button>
            </div>

            <div className="grid gap-6">
              {matches.map((match) => (
                <GroupMatchCard
                  key={match.id}
                  match={match}
                  isJoined={joinedGroups.includes(match.id)}
                  onJoin={() => handleJoinGroup(match.id)}
                  onDecline={() => handleDeclineGroup(match.id)}
                />
              ))}
            </div>

            {matches.length === 0 && (
              <Card className="backdrop-blur-sm bg-card/80 border-border/50 text-center py-12">
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">No More Matches</h3>
                      <p className="text-muted-foreground mb-4">
                        You've reviewed all available study groups. Try adjusting your preferences or check back later
                        for new groups.
                      </p>
                      <Button onClick={restartMatching} className="flex items-center gap-2 mx-auto">
                        <RefreshCw className="w-4 h-4" />
                        Search Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
