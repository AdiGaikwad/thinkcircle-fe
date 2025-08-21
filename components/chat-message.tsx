"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pin, Star, Reply, Copy, Check, CheckCheck, Sparkles, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Reaction {
  emoji: string
  count: number
  users: string[]
}

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file"
  reactions: Reaction[]
  readBy: string[]
  isPinned: boolean
  isHighlighted: boolean
  aiType?: "explanation" | "definition" | "quiz" | "suggestion"
}

interface ChatMessageProps {
  message: Message
  isOwn: boolean
  onPin: () => void
  onHighlight: () => void
  onReaction: (emoji: string) => void
  onAIAssist?: () => void
}

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🔥", "💡", "✅"]

export function ChatMessage({ message, isOwn, onPin, onHighlight, onReaction, onAIAssist }: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false)

  const getReadStatus = () => {
    if (!isOwn) return null
    if (message.readBy.length === 0) return <Check className="w-3 h-3 text-muted-foreground" />
    return <CheckCheck className="w-3 h-3 text-accent" />
  }

  const isAIMessage = message.senderId === "ai"

  const getAITypeIcon = () => {
    switch (message.aiType) {
      case "explanation":
        return <Sparkles className="w-3 h-3 text-accent" />
      case "definition":
        return <Bot className="w-3 h-3 text-primary" />
      case "quiz":
        return <span className="text-xs">🧠</span>
      case "suggestion":
        return <span className="text-xs">💡</span>
      default:
        return <Bot className="w-3 h-3 text-accent" />
    }
  }

  return (
    <div className={`flex gap-3 group ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
          <AvatarFallback className={isAIMessage ? "bg-gradient-to-r from-accent to-primary text-white" : ""}>
            {isAIMessage ? (
              <Bot className="w-4 h-4" />
            ) : (
              message.senderName
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex-1 max-w-[70%] ${isOwn ? "flex flex-col items-end" : ""}`}>
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${isAIMessage ? "text-accent" : "text-foreground"}`}>
              {message.senderName}
            </span>
            {isAIMessage && message.aiType && (
              <div className="flex items-center gap-1">
                {getAITypeIcon()}
                <span className="text-xs text-muted-foreground capitalize">{message.aiType}</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
        )}

        <div className={`relative ${isOwn ? "flex flex-col items-end" : ""}`}>
          <div
            className={`
              relative p-3 rounded-lg max-w-full break-words
              ${
                isOwn
                  ? "bg-primary text-primary-foreground ml-12"
                  : isAIMessage
                    ? "bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20"
                    : "bg-card border border-border"
              }
              ${message.isHighlighted ? "ring-2 ring-accent/50 bg-accent/5" : ""}
              ${message.isPinned ? "border-primary/50" : ""}
            `}
          >
            {/* Highlight indicator */}
            {message.isHighlighted && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-full" />
            )}

            {/* Pin indicator */}
            {message.isPinned && (
              <Pin className="absolute -top-2 -right-2 w-4 h-4 text-primary bg-background rounded-full p-0.5" />
            )}

            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isAIMessage ? "text-foreground" : ""}`}>
              {message.content}
            </p>

            {/* Message actions */}
            <div
              className={`
              absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity
              ${isOwn ? "-left-12" : "-right-12"}
            `}
            >
              <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowReactions(!showReactions)}
                >
                  <Sparkles className="w-3 h-3" />
                </Button>

                {!isAIMessage && onAIAssist && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onAIAssist}
                    title="Ask AI about this message"
                  >
                    <Bot className="w-3 h-3 text-accent" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isOwn ? "end" : "start"}>
                    <DropdownMenuItem onClick={onPin}>
                      <Pin className="w-4 h-4 mr-2" />
                      {message.isPinned ? "Unpin" : "Pin"} Message
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onHighlight}>
                      <Star className="w-4 h-4 mr-2" />
                      {message.isHighlighted ? "Remove" : "Highlight"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    {!isAIMessage && onAIAssist && (
                      <DropdownMenuItem onClick={onAIAssist}>
                        <Bot className="w-4 h-4 mr-2" />
                        Ask AI
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Quick reactions */}
          {showReactions && (
            <div
              className={`
              mt-2 flex flex-wrap gap-1 p-2 bg-background border border-border rounded-lg shadow-sm
              ${isOwn ? "mr-12" : "ml-12"}
            `}
            >
              {quickReactions.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent/10"
                  onClick={() => {
                    onReaction(emoji)
                    setShowReactions(false)
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-2 ${isOwn ? "mr-12" : "ml-12"}`}>
              {message.reactions.map((reaction, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`
                    h-6 px-2 text-xs rounded-full
                    ${reaction.users.includes("1") ? "bg-accent/10 border-accent" : ""}
                  `}
                  onClick={() => onReaction(reaction.emoji)}
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            </div>
          )}

          {/* Read status and timestamp for own messages */}
          {isOwn && (
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
              {getReadStatus()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
