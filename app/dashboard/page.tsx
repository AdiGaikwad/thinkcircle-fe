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
  Loader2,
  UserCheck,
  Eye,
  UserX,
  CheckCheck,
  Check,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import domains from "../data/domains";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeSelector from "@/components/ThemeSelector";
import { Textarea } from "@/components/ui/textarea";

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

interface JoinRequest {
  id: string;
  groupId: string;
  profileId: string;
  status: string;
  createdAt: string;
  profile: {
    id: string;
    goals: string;
    availability: string[];
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      profilepic?: string;
    };
    subjectFocus?: string;
    subjects: string[];
    studyGoals?: string;
    preferredStudyTime?: string;
    academicLevel?: string;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [groups, setGroups] = useState<Group[]>([]);
  // const [summaries, setSummaries] = useState<Summary[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [apiLoading, setLoading] = useState(true);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [findGroupsOpen, setFindGroupsOpen] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  // Create group form state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [newGroupMaxSize, setNewGroupMaxSize] = useState("10");
  // Find groups form state
  const [searchSubject, setSearchSubject] = useState("");

  const [joiningGroups, setJoiningGroups] = useState<Set<string>>(new Set());

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [selectedGroupForRequests, setSelectedGroupForRequests] =
    useState<string>("");
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set()
  );
  const [viewProfileDialog, setViewProfileDialog] =
    useState<JoinRequest | null>(null);

  const { user, authToken, loading } = useAuth();
  const token = authToken;

  const [summaries, setSummaries] = useState<any[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${domains.AUTH_HOST}/api/v1/summary/group/${groups[0].groupId}/summary`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (data.summary) setSummaries(data.summary);
      } catch (err) {
        console.error("Error fetching summaries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [groups]);

  useEffect(() => {
    console.log(token);
    if (token) {
      fetchDashboardData();
    }
  }, [token, loading]);

  useEffect(() => {
    if (selectedGroupForRequests && token) {
      fetchJoinRequests(selectedGroupForRequests);
    }
  }, [selectedGroupForRequests, token]);

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
        setNotifications(notificationsData.notification || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async (groupId: string) => {
    try {
      setLoadingRequests(true);
      const response = await fetch(
        domains.AUTH_HOST + `/api/v1/group/join-request/${groupId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJoinRequests(data.request || []);
      } else {
        toast.error("Error", {
          description: "Failed to fetch join requests.",
        });
      }
    } catch (error) {
      console.error("Error fetching join requests:", error);
      toast.error("Error", {
        description: "Failed to fetch join requests.",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleJoinRequest = async (
    groupId: string,
    requestId: string,
    action: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));

      const response = await fetch(
        domains.AUTH_HOST +
          `/api/v1/group/${groupId}/join-request/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Success", {
          description: `Join request ${action.toLowerCase()} successfully!`,
        });
        // Refresh join requests and notifications
        fetchJoinRequests(groupId);
        refreshNotifications();
        fetchDashboardData(); // Refresh groups data to update member counts
      } else {
        toast.error("Error", {
          description:
            data.message || `Failed to ${action.toLowerCase()} join request.`,
        });
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing join request:`, error);
      toast.error("Error", {
        description: `Failed to ${action.toLowerCase()} join request.`,
      });
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const refreshNotifications = async () => {
    try {
      setNotificationLoading(true);

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
        setNotifications(notificationsData.notification || []);
        toast("Notifications refreshed", {
          description: "Latest notifications have been loaded.",
        });
      } else {
        toast.error("Failed to refresh notifications.");
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
      toast.error("Failed to refresh notifications.");
    } finally {
      setNotificationLoading(false);
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
            description: newGroupDescription,
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
        toast.success("Success", {
          description: "Group created successfully!",
        });
      } else {
        toast.error("Error", { description: "Failed to create group." });
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
      } else {
        toast.error("Error", {
          description: "Failed to find groups.",
        });
      }
    } catch (error) {
      console.error("Error finding groups:", error);
      toast.error("Error", {
        description: "Failed to find groups.",
      });
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      setJoiningGroups((prev) => new Set(prev).add(groupId));

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
      const data = await response.json();

      if (response.ok) {
        toast("Success", {
          description:
            "Join request sent successfully! You'll be notified when the admin responds.",
        });
        findGroups();
        refreshNotifications();
      } else {
        toast("Error", {
          description: data.message || "Failed to send join request.",
        });
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Error", {
        description: "Failed to send join request.",
      });
    } finally {
      setJoiningGroups((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const body = {
        readAll: false,
        id: notificationId,
      };
      await fetch(domains.AUTH_HOST + "/api/v1/notification/read", {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      toast.success("Success", {
        description: "Notification marked as read",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to mark notification as read",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const body = {
        readAll: true,
      };
      await fetch(domains.AUTH_HOST + "/api/v1/notification/read", {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("Success", {
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Failed to mark all notifications as read",
      });
    }
  };

  if (apiLoading || loading) {
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
  // console.log(groups)
  const adminGroups = groups.filter(
    (group: any) => group.group.adminId === user?.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-bl from-background/0 via-background/20 to-background/0">
      <div className="bg-gradient-to-r from-primary/50 via-secondary/30 to-primary animate-pulse  animation-duration-[3500ms] right-0 absolute w-[300px] h-[300px] blur-3xl -z-10 "></div>
      <div className="bg-gradient-to-r from-sidebar-accent-foreground/50 via-sidebar-accent/50 to-sidebar-ring animate-pulse  animation-duration-[5000ms] bottom-0 left-0 absolute w-[300px] h-[300px] blur-3xl -z-10 "></div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2  justify-between mb-8 gap-6 ">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Study Dashboard
            </h1>
            <p className="text-muted-foreground ">
              Welcome back, {user?.firstname}! Manage your study groups and
              track progress
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
              onClick={refreshNotifications}
              disabled={notificationLoading}
            >
              {notificationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {totalUnreadNotifications > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                  {totalUnreadNotifications}
                </Badge>
              )}
            </Button>
            <Link href={"/profile"}>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>

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
                    <Label htmlFor="groupName" className="mb-1">
                      Group Name
                    </Label>
                    <Input
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Advanced Calculus Study Group"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="mb-1">
                      Group Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      placeholder="e.g., This is an awesome group"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="mb-1">
                      Subject Focus
                    </Label>
                    <Input
                      id="subject"
                      value={newGroupSubject}
                      onChange={(e) => setNewGroupSubject(e.target.value)}
                      placeholder="e.g., Mathematics, Chemistry, Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSize" className="mb-1">
                      Maximum Members
                    </Label>
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
                              disabled={joiningGroups.has(group.id)}
                            >
                              {joiningGroups.has(group.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Sending...
                                </>
                              ) : (
                                "Request to Join"
                              )}
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

        <ThemeSelector />
        <br />
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Study Groups
            </TabsTrigger>
            <TabsTrigger
              value="join-requests"
              className="flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Join Requests
              {/* {adminGroups.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {adminGroups.length}
                </Badge>
              )} */}
            </TabsTrigger>
            <TabsTrigger
              value="summaries"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              AI Summaries
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 cursor-pointer"
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
                  {groups.slice(0, 3).map((group: any) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div>
                        <h4 className="font-medium">{group.group.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {group.subjectFocus}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group?.group?.memberCount || 0} members • Created{" "}
                          {new Date(group.group.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/group/${group.groupId}`}>
                          <Button variant="outline" size="sm">
                            Group Details
                          </Button>
                        </Link>
                        <Link href={`/chat/${group.groupId}`}>
                          <Button variant="outline" size="sm">
                            Open Chat
                          </Button>
                        </Link>
                      </div>
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
                  <CardTitle className="flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                      <Bell className="w-5 h-5" />
                      Recent Notifications
                    </div>

                    {notifications.find((n) => n.read != true) && (
                      <Button
                        variant={"outline"}
                        onClick={() => markAllAsRead()}
                        title="Mark all notifications as read"
                      >
                        Read All
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="">
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
                              className="h-2 w-2 p-0 ml-2"
                            ></Badge>
                          )}
                        </div>

                        <div className="justify-end">
                          {!notification.read ? (
                            <Button
                              variant={"outline"}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check />
                            </Button>
                          ) : (
                            <Button disabled variant={"outline"}>
                              <CheckCheck />
                            </Button>
                          )}
                        </div>
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
                          {group.adminId === user?.id && (
                            <Badge variant="outline" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          Subject: {group.group.subjectFocus}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {group.group?.memberCount || 0}/
                            {group.group.maxSize} members
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
                        <Link href={`/group/${group.groupId}`}>
                          <Button variant={"outline"}>Group Details</Button>
                        </Link>
                        <Link href={`/chat/${group.groupId}`}>
                          <Button>Open Chat</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {groups.length === 0 ? (
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
              ) : (
                <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Create new group
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create new study group and invite others to join
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
          <TabsContent value="summaries" className="space-y-6 relative">
            {/* Summaries Section */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Group Summaries
                </h3>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mb-3" />
                    Fetching summaries...
                  </div>
                ) : summaries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Brain className="w-10 h-10 opacity-50 mb-3" />
                    <p>No summaries available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {summaries.map((summary) => (
                      <div
                        key={summary.id}
                        className="flex justify-between items-start p-4 rounded-lg border border-border/40 hover:bg-muted/40 cursor-pointer transition"
                        onClick={() => setSelectedSummary(summary)}
                      >
                        <div>
                          <h4 className="font-semibold">
                            {summary.topicsCovered || "Untitled Summary"}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {summary.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(summary.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                        >
                          Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modal for Summary Details */}
            {selectedSummary && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-card/95 border-border/50 shadow-2xl animate-ai-glow relative">
                  <CardHeader className="border-b border-border/40 flex items-center justify-between">
                    <CardTitle>
                      {selectedSummary.title || "Group Summary"}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedSummary(null)}
                      className="absolute right-4 top-4"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                    {selectedSummary.topicsCovered &&
                      selectedSummary.topicsCovered.length > 0 && (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          Topics Covered: {selectedSummary.topicsCovered.join(", ")}
                        </p>
                      )}
                    {selectedSummary.keyQuestions &&
                      selectedSummary.keyQuestions.length > 0 && (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          Key Questions: {selectedSummary.keyQuestions.join(", ")}
                        </p>
                      )}
                    {selectedSummary.actionItems && selectedSummary.actionItems.length > 0 && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        Action Items: {selectedSummary.actionItems.join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground text-right mt-6">
                      Generated on{" "}
                      {new Date(selectedSummary.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Notifications</h2>
              {notifications.some((n) => !n.read) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All as Read
                </Button>
              )}
            </div>
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
                      <div className="space-y-1 flex-1">
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
                      {!notification.read && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="ml-2"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
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

          <TabsContent value="join-requests" className="space-y-6">
            {adminGroups.length > 0 ? (
              <div className="space-y-6">
                <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                  <CardHeader>
                    <CardTitle>Manage Join Requests</CardTitle>
                    <div className="space-y-2">
                      <Label htmlFor="group-select">Select Group</Label>
                      <Select
                        value={selectedGroupForRequests}
                        onValueChange={setSelectedGroupForRequests}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a group to manage requests" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminGroups.map((group: any) => (
                            <SelectItem
                              key={group.group.id}
                              value={group.group.id}
                            >
                              {group.group.name} ({group.group.subjectFocus})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                </Card>

                {selectedGroupForRequests && (
                  <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Pending Join Requests
                        {loadingRequests && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingRequests ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">
                            Loading join requests...
                          </p>
                        </div>
                      ) : joinRequests.length > 0 ? (
                        <div className="space-y-4">
                          {joinRequests.map((request) => (
                            <Card
                              key={request.id}
                              className="p-4 border border-border/50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage
                                      src={
                                        request?.profile?.user?.profilepic ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback>
                                      {request?.profile?.user?.firstname[0]}
                                      {request?.profile?.user?.lastname[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">
                                      {request?.profile?.user?.firstname}{" "}
                                      {request?.profile?.user?.lastname}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {request?.profile?.user?.email}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Requested{" "}
                                      {new Date(
                                        request.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setViewProfileDialog(request)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleJoinRequest(
                                        selectedGroupForRequests,
                                        request.id,
                                        "REJECTED"
                                      )
                                    }
                                    disabled={processingRequests.has(
                                      request.id
                                    )}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  >
                                    {processingRequests.has(request.id) ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <UserX className="w-4 h-4 mr-2" />
                                    )}
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleJoinRequest(
                                        selectedGroupForRequests,
                                        request.id,
                                        "ACCEPTED"
                                      )
                                    }
                                    disabled={processingRequests.has(
                                      request.id
                                    )}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    {processingRequests.has(request.id) ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <UserCheck className="w-4 h-4 mr-2" />
                                    )}
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Pending Requests
                          </h3>
                          <p className="text-muted-foreground">
                            There are no pending join requests for this group.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                <CardContent className="p-12 text-center">
                  <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Admin Groups
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You need to be an admin of a group to manage join requests.
                  </p>
                  <Button onClick={() => setCreateGroupOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!viewProfileDialog}
          onOpenChange={() => setViewProfileDialog(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                View the complete profile of the user requesting to join
              </DialogDescription>
            </DialogHeader>
            {viewProfileDialog && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        viewProfileDialog?.profile?.user?.profilepic ||
                        "/placeholder.svg"
                      }
                    />
                    <AvatarFallback className="text-lg">
                      {viewProfileDialog?.profile?.user?.firstname[0]}
                      {viewProfileDialog?.profile?.user?.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {viewProfileDialog?.profile?.user?.firstname}{" "}
                      {viewProfileDialog?.profile?.user?.lastname}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {viewProfileDialog?.profile?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Subject Focus</Label>
                    <p className="text-sm text-muted-foreground">
                      {viewProfileDialog?.profile?.subjects.join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Study Goals</Label>
                    <p className="text-sm text-muted-foreground">
                      {viewProfileDialog?.profile?.goals || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Preferred Study Time
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {viewProfileDialog?.profile?.availability.join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                  {/* <div>
                    <Label className="text-sm font-medium">Academic Level</Label>
                    <p className="text-sm text-muted-foreground">
                      {viewProfileDialog?.profile?.academicLevel || "Not specified"}
                    </p>
                  </div> */}
                  <div>
                    <Label className="text-sm font-medium">Request Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        viewProfileDialog?.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                    onClick={() => {
                      handleJoinRequest(
                        selectedGroupForRequests,
                        viewProfileDialog.id,
                        "REJECTED"
                      );
                      setViewProfileDialog(null);
                    }}
                    disabled={processingRequests.has(viewProfileDialog.id)}
                  >
                    {processingRequests.has(viewProfileDialog.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserX className="w-4 h-4 mr-2" />
                    )}
                    Reject Request
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleJoinRequest(
                        selectedGroupForRequests,
                        viewProfileDialog.id,
                        "ACCEPTED"
                      );
                      setViewProfileDialog(null);
                    }}
                    disabled={processingRequests.has(viewProfileDialog.id)}
                  >
                    {processingRequests.has(viewProfileDialog.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Accept Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
