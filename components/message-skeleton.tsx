"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MessageSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback className="bg-muted" />
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-5/6 bg-muted rounded" />
          <div className="h-3 w-4/6 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

export function MessageGroupSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <MessageSkeleton key={i} />
      ))}
    </div>
  )
}
