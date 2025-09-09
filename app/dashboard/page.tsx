"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Brain,
  Target,
  BarChart3,
  Bell,
  Plus,
} from "lucide-react";
import { StudyGroupCard } from "@/components/study-group-card";
import { SessionSummary } from "@/components/session-summary";
import { ActionItems } from "@/components/action-items";
import { StudyStats } from "@/components/study-stats";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock data for dashboard
const studyGroups = [
  {
    id: "1",
    name: "Advanced Calculus Study Circle",
    subject: "Mathematics",
    members: 4,
    nextSession: "Tomorrow at 7:00 PM",
    recentActivity: "2 hours ago",
    progress: 75,
    status: "active" as const,
    unreadMessages: 3,
  },
  {
    id: "2",
    name: "Organic Chemistry Lab Partners",
    subject: "Chemistry",
    members: 4,
    nextSession: "Thursday at 3:00 PM",
    recentActivity: "1 day ago",
    progress: 60,
    status: "active" as const,
    unreadMessages: 0,
  },
  {
    id: "3",
    name: "Computer Science Algorithms Group",
    subject: "Computer Science",
    members: 5,
    nextSession: "Today at 6:00 PM",
    recentActivity: "30 minutes ago",
    progress: 90,
    status: "active" as const,
    unreadMessages: 7,
  },
];

const recentSummaries = [
  {
    id: "1",
    groupName: "Advanced Calculus Study Circle",
    date: "2 hours ago",
    duration: "45 minutes",
    participants: ["Sarah Chen", "Mike Rodriguez", "You"],
    keyTopics: [
      "Integration by parts",
      "Substitution method",
      "Practice problems",
    ],
    summary:
      "The group focused on integration techniques, with particular emphasis on integration by parts. Mike asked for clarification on the substitution method, which led to a productive discussion with examples. The AI assistant provided step-by-step explanations that helped clarify the concepts.",
    actionItems: [
      "Create shared Google Doc for practice problems",
      "Review integration by parts examples before next session",
      "Mike to practice substitution method problems",
    ],
    aiInsights:
      "The group shows strong collaborative learning. Consider focusing on more complex integration problems in the next session.",
  },
  {
    id: "2",
    groupName: "Computer Science Algorithms Group",
    date: "Yesterday",
    duration: "1 hour 20 minutes",
    participants: ["David Park", "Lisa Wang", "Chris Johnson", "You"],
    keyTopics: ["Binary search trees", "Time complexity", "Code optimization"],
    summary:
      "Deep dive into binary search tree implementations and optimization strategies. The group worked through several coding challenges and discussed time complexity analysis. Strong peer learning with members helping each other debug code.",
    actionItems: [
      "Complete BST implementation homework",
      "Research advanced tree balancing techniques",
      "Prepare for technical interview practice session",
    ],
    aiInsights:
      "Excellent problem-solving collaboration. The group is ready for more advanced data structure topics.",
  },
];

const upcomingSessions = [
  {
    id: "1",
    groupName: "Computer Science Algorithms Group",
    time: "Today at 6:00 PM",
    duration: "2 hours",
    topic: "Graph algorithms and traversal",
    participants: 5,
    isToday: true,
  },
  {
    id: "2",
    groupName: "Advanced Calculus Study Circle",
    time: "Tomorrow at 7:00 PM",
    duration: "1.5 hours",
    topic: "Integration techniques review",
    participants: 4,
    isToday: false,
  },
  {
    id: "3",
    groupName: "Organic Chemistry Lab Partners",
    time: "Thursday at 3:00 PM",
    duration: "2 hours",
    topic: "Reaction mechanisms lab prep",
    participants: 4,
    isToday: false,
  },
];

const actionItems = [
  {
    id: "1",
    title: "Complete BST implementation homework",
    group: "Computer Science Algorithms Group",
    dueDate: "Tomorrow",
    priority: "high" as const,
    completed: false,
  },
  {
    id: "2",
    title: "Review integration by parts examples",
    group: "Advanced Calculus Study Circle",
    dueDate: "Tomorrow",
    priority: "medium" as const,
    completed: false,
  },
  {
    id: "3",
    title: "Create shared Google Doc for practice problems",
    group: "Advanced Calculus Study Circle",
    dueDate: "Today",
    priority: "low" as const,
    completed: true,
  },
  {
    id: "4",
    title: "Research advanced tree balancing techniques",
    group: "Computer Science Algorithms Group",
    dueDate: "This week",
    priority: "medium" as const,
    completed: false,
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const totalUnreadMessages = studyGroups.reduce(
    (sum, group) => sum + group.unreadMessages,
    0
  );
  const todaySessions = upcomingSessions.filter(
    (session) => session.isToday
  ).length;
  const pendingActions = actionItems.filter((item) => !item.completed).length;

  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      if (!user.onboarding) {
        router.push("/onboarding");
      }
      // if(user)
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Study Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your progress and manage your study groups
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Bell className="w-4 h-4" />
              {totalUnreadMessages > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                  {totalUnreadMessages}
                </Badge>
              )}
            </Button>
            <Link href="/matching">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Find New Groups
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studyGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Active Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{todaySessions}</p>
                  <p className="text-sm text-muted-foreground">
                    Sessions Today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingActions}</p>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Study Groups
            </TabsTrigger>
            <TabsTrigger value="summaries" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Summaries
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Action Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Sessions */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>
                  Your scheduled study sessions for the next few days
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      session.isToday
                        ? "bg-accent/5 border-accent/20"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{session.groupName}</h4>
                        {session.isToday && (
                          <Badge variant="secondary">Today</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.topic}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {session.participants} members
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Join Session
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudyStats />
              <ActionItems items={actionItems.slice(0, 4)} />
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="grid gap-6">
              {studyGroups.map((group) => (
                <StudyGroupCard key={group.id} group={group} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summaries" className="space-y-6">
            <div className="space-y-6">
              {recentSummaries.map((summary) => (
                <SessionSummary key={summary.id} summary={summary} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <ActionItems items={actionItems} showAll />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
