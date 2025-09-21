"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  Brain,
  BarChart3,
  Bell,
  Plus,
  MessageSquare,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import domains from "../data/domains";

interface Group {
  id: string;
  name: string;
  subjectFocus: string;
  createdByAI: boolean;
  maxSize: number;
  createdAt: string;
  adminId: string;
  members?: GroupMember[];
  _count?: {
    members: number;
    messages: number;
  };
}

interface GroupMember {
  id: string;
  role: string;
  joinedAt: string;
  profile: {
    id: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      profilepic?: string;
    };
  };
}

interface Summary {
  id: string;
  groupId: string;
  topicsCovered: string[];
  keyQuestions: string[];
  actionItems: string[];
  createdAt: string;
  group: {
    name: string;
  };
}

interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [groups, setGroups] = useState<Group[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [findGroupsOpen, setFindGroupsOpen] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);

  // Create group form state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [newGroupMaxSize, setNewGroupMaxSize] = useState("10");

  // Find groups form state
  const [searchSubject, setSearchSubject] = useState("");

  const { user, authToken } = useAuth();
  const token = authToken;
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const groupsResponse = await fetch(
        domains.AUTH_HOST + "/api/v1/group/my-groups",
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        setGroups(groupsData.groups || []);
      }

      // Fetch summaries (keeping existing logic as summaries endpoint not provided)
      // This would need to be implemented based on your backend structure

      const notificationsResponse = await fetch(
        domains.AUTH_HOST + "/api/v1/notification/notification",
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupName || !newGroupSubject) return;

    try {
      const response = await fetch(
        domains.AUTH_HOST + "/api/v1/group/create-group",
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newGroupName,
            subjectFocus: newGroupSubject,
            maxsize: Number.parseInt(newGroupMaxSize),
          }),
        }
      );

      if (response.ok) {
        setCreateGroupOpen(false);
        setNewGroupName("");
        setNewGroupSubject("");
        setNewGroupMaxSize("10");
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const findGroups = async () => {
    if (!searchSubject) return;

    try {
  
      const response = await fetch(
        domains.AUTH_HOST +
          `/api/v1/group/groups?subjectFocus=${encodeURIComponent(
            searchSubject
          )}`,
        {
          method: "GET",
         
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableGroups(data.findgroups || []);
      }
    } catch (error) {
      console.error("Error finding groups:", error);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const response = await fetch(
        domains.AUTH_HOST + `/api/v1/group/join/${groupId}`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectFocus: searchSubject,
          }),
        }
      );

      if (response.ok) {
        // Refresh available groups
        findGroups();
        // Show success message or update UI as needed
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalUnreadNotifications = notifications.filter((n) => !n.read).length;
  const totalGroups = groups.length;
  const totalMessages = groups.reduce(
    (sum, group) => sum + (group._count?.messages || 0),
    0
  );

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
              Welcome back, {user?.firstname}! Manage your study groups and
              track progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Bell className="w-4 h-4" />
              {totalUnreadNotifications > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                  {totalUnreadNotifications}
                </Badge>
              )}
            </Button>

            <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Study Group</DialogTitle>
                  <DialogDescription>
                    Create a new study group and invite others to join
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Advanced Calculus Study Group"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject Focus</Label>
                    <Input
                      id="subject"
                      value={newGroupSubject}
                      onChange={(e) => setNewGroupSubject(e.target.value)}
                      placeholder="e.g., Mathematics, Chemistry, Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSize">Maximum Members</Label>
                    <Select
                      value={newGroupMaxSize}
                      onValueChange={setNewGroupMaxSize}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="15">15 members</SelectItem>
                        <SelectItem value="20">20 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={createGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={findGroupsOpen} onOpenChange={setFindGroupsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Search className="w-4 h-4" />
                  Find Groups
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Find Study Groups</DialogTitle>
                  <DialogDescription>
                    Search for study groups by subject to join
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={searchSubject}
                      onChange={(e) => setSearchSubject(e.target.value)}
                      placeholder="Enter subject (e.g., Mathematics, Chemistry)"
                      className="flex-1"
                    />
                    <Button onClick={findGroups}>Search</Button>
                  </div>

                  {availableGroups.length > 0 && (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {availableGroups.map((group) => (
                        <Card key={group.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{group.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Subject: {group.subjectFocus} • Max{" "}
                                {group.maxSize} members
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Created{" "}
                                {new Date(group.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => joinGroup(group.id)}
                            >
                              Request to Join
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
                  <p className="text-2xl font-bold">{totalGroups}</p>
                  <p className="text-sm text-muted-foreground">Study Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalMessages}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{summaries.length}</p>
                  <p className="text-sm text-muted-foreground">AI Summaries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {totalUnreadNotifications}
                  </p>
                  <p className="text-sm text-muted-foreground">Notifications</p>
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
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Groups */}
              <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groups.slice(0, 3).map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div>
                        <h4 className="font-medium">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {group.subjectFocus}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group._count?.members || 0} members • Created{" "}
                          {new Date(group.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/chat/${group.id}`}>
                        <Button variant="outline" size="sm">
                          Open Chat
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {groups.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No study groups yet. Create or join a group to get
                      started!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            notification.type === "JOIN_REQUEST"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {notification.type.replace("_", " ")}
                        </Badge>
                        {!notification.read && (
                          <Badge
                            variant="destructive"
                            className="h-2 w-2 p-0"
                          ></Badge>
                        )}
                      </div>
                      <p className="text-sm">{notification.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No notifications yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="grid gap-6">
              {groups.map((group: any) => (
                <Card
                  key={group.id}
                  className="backdrop-blur-sm bg-card/80 border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {group.group.name}
                          </h3>
                          {group.createdByAI && (
                            <Badge variant="secondary" className="text-xs">
                              AI Matched
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          Subject: {group.group.subjectFocus}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {group._count?.members || 0}/{group.group.maxSize}{" "}
                            members
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {group._count?.messages || 0} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created{" "}
                            {new Date(
                              group.group.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/chat/${group.id}`}>
                          <Button>Open Chat</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {groups.length === 0 && (
                <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Study Groups Yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first study group or find existing groups to
                      join
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={() => setCreateGroupOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setFindGroupsOpen(true)}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Find Groups
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="summaries" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardContent className="p-12 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  AI Summaries Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  AI summaries will appear here after your study group sessions
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`backdrop-blur-sm border-border/50 ${
                    notification.read
                      ? "bg-card/60"
                      : "bg-card/80 border-accent/20"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              notification.type === "JOIN_REQUEST"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {notification.type.replace("_", " ")}
                          </Badge>
                          {!notification.read && (
                            <Badge
                              variant="destructive"
                              className="h-2 w-2 p-0"
                            ></Badge>
                          )}
                        </div>
                        <p className="text-sm">{notification.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {notifications.length === 0 && (
                <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                  <CardContent className="p-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Notifications
                    </h3>
                    <p className="text-muted-foreground">
                      You're all caught up! Notifications will appear here when
                      you have updates.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
