"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Users,
  Calendar,
  FileText,
  Settings,
  Bell,
  MessageCircle,
  Video,
  Phone,
  Copy,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data - replace with actual API call
const groupData = {
  id: "1",
  name: "Advanced Calculus Study Circle",
  subject: "Mathematics",
  description:
    "A dedicated study group focused on mastering integration techniques, calculus fundamentals, and problem-solving strategies.",
  createdAt: "2024-10-15",
  members: [
    { id: "1", name: "You", avatar: "/placeholder.svg?key=user1", online: true, role: "Admin" },
    { id: "2", name: "Sarah Chen", avatar: "/placeholder.svg?key=user2", online: true, role: "Member" },
    { id: "3", name: "Mike Rodriguez", avatar: "/placeholder.svg?key=user3", online: true, role: "Member" },
    { id: "4", name: "Emma Thompson", avatar: "/placeholder.svg?key=user4", online: false, role: "Member" },
  ],
  nextSession: "Tomorrow at 7:00 PM",
  maxMembers: 8,
  visibility: "Private",
  joinCode: "CALC2025",
}

export default function GroupDetailsPage({ params }: { params: { groupId: string } }) {
  const [showSettings, setShowSettings] = useState(false)
  const isAdmin = true // Replace with actual admin check

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{groupData.name}</h1>
              <p className="text-muted-foreground">{groupData.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/chat/${groupData.id}`}>
              <Button className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Go to Chat
              </Button>
            </Link>
            {isAdmin && (
              <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Info Card */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle>Group Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{groupData.name}</h3>
                    <p className="text-sm text-muted-foreground">{groupData.description}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subject</p>
                    <Badge className="bg-primary/20 text-primary">{groupData.subject}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Visibility</p>
                    <Badge variant="outline">{groupData.visibility}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-medium">{new Date(groupData.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Members</p>
                    <p className="text-sm font-medium">
                      {groupData.members.length} / {groupData.maxMembers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Members</CardTitle>
                  <Badge variant="outline">{groupData.members.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupData.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.online ? "Online" : "Offline"}</p>
                        </div>
                      </div>
                      <Badge variant={member.role === "Admin" ? "default" : "outline"}>{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-accent font-semibold text-lg">{groupData.nextSession}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All members will be notified 30 minutes before the session starts
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="gap-2">
                      <Video className="w-4 h-4" />
                      Join Video Call
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Phone className="w-4 h-4" />
                      Join Voice Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Go to Chat
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Shared Files
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Join Code */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">Join Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <code className="flex-1 font-mono font-semibold text-accent">{groupData.joinCode}</code>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Group Stats */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Online Members</p>
                  <p className="text-2xl font-bold text-accent">{groupData.members.filter((m) => m.online).length}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{groupData.members.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Settings Section */}
        {showSettings && isAdmin && (
          <Card className="backdrop-blur-sm bg-card/80 border-accent/20">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle>Group Settings</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Edit Group Name */}
              <div>
                <h4 className="font-semibold mb-3">Edit Group Name</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={groupData.name}
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm"
                  />
                  <Button size="sm">Save</Button>
                </div>
              </div>

              <Separator />

              {/* Edit Description */}
              <div>
                <h4 className="font-semibold mb-3">Edit Description</h4>
                <textarea
                  defaultValue={groupData.description}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-none h-24"
                />
                <Button size="sm" className="mt-2">
                  Save
                </Button>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="pt-4">
                <h4 className="font-semibold text-destructive mb-3">Danger Zone</h4>
                <Button variant="destructive" size="sm" className="gap-2 w-full">
                  <Trash2 className="w-4 h-4" />
                  Delete Group
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
