"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TypingIndicatorProps {
  users: string[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-muted">
          {users[0]
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-2">
        <div className="bg-card border border-border rounded-lg px-4 py-2">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          {users.length === 1
            ? `${users[0]} is typing...`
            : `${users.slice(0, -1).join(", ")} and ${users[users.length - 1]} are typing...`}
        </span>
      </div>
    </div>
  )
}
