"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Users,
  Calendar,
  FileText,
  Settings,
  Bell,
  UserPlus,
  Video,
  Phone,
} from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  typing: boolean;
}

interface GroupData {
  id: string;
  name: string;
  subject: string;
  members: GroupMember[];
  nextSession: string;
}

interface ChatSidebarProps {
  group: GroupData;
  onClose: () => void;
  user: any;
}

export function ChatSidebar({ group, onClose, user }: ChatSidebarProps) {
  return (
    <div className="w-80 border-l fixed right-0 border-border bg-background/95 backdrop-blur-sm h-screen flex flex-col">
      <Card className="rounded-none overflow-x-scroll overflow-y-hidden border-0 flex-1 flex flex-col">
        <CardHeader className="border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Group Info</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-y-auto">
          {/* Group Details */}
          <div className="p-4 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold">{group.name}</h3>
              <Badge variant="outline">{group.subjectFocus}</Badge>
            </div>

            <div className="flex gap-2">
              <p className=" text-sm">

              {group.description}
              </p>
              {/* <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Video className="w-4 h-4 mr-2" />
                Video Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Voice Call
              </Button> */}
            </div>
          </div>

          {/* <Separator /> */}

          {/* Next Session */}
          {/* <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Next Session</span>
            </div>
            <p className="text-sm text-accent font-medium">{group.nextSession}</p>
          </div> */}

          <Separator />

          {/* Members */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Members ({group.memberCount})
                </span>
              </div>
              {/* <Button variant="ghost" size="sm">
                <UserPlus className="w-4 h-4" />
              </Button> */}
            </div>

            <div className="space-y-3">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          member.profile.user.profilepic || "/placeholder.svg"
                        }
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.profile.user.firstname}
                      </AvatarFallback>
                    </Avatar>
                    {member.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.profile.user.firstname}
                      {member.profile.userId === user.id  && " (You)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.online ? "Online" : "Offline"}
                      {member.typing && " • typing..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="p-4 space-y-2">
            <h4 className="text-sm font-medium mb-3">Quick Actions</h4>

            {/* <Button variant="ghost" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Shared Documents
            </Button> */}

            {/* <Button variant="ghost" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Session
            </Button> */}

            {/* <Button variant="ghost" size="sm" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button> */}

            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Group Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
