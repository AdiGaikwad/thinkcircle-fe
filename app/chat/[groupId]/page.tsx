"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, MoreVertical, Users, Pin, MessageCircle, Clock, Sparkles } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { TypingIndicator } from "@/components/typing-indicator"
import { ChatSidebar } from "@/components/chat-sidebar"
import { AIAssistant } from "@/components/ai-assistant"

// Mock data for the chat
const groupData = {
  id: "1",
  name: "Advanced Calculus Study Circle",
  subject: "Mathematics",
  members: [
    { id: "1", name: "You", avatar: "/placeholder.svg?key=user1", online: true, typing: false },
    { id: "2", name: "Sarah Chen", avatar: "/placeholder.svg?key=user2", online: true, typing: false },
    { id: "3", name: "Mike Rodriguez", avatar: "/placeholder.svg?key=user3", online: true, typing: false },
    { id: "4", name: "Emma Thompson", avatar: "/placeholder.svg?key=user4", online: false, typing: false },
  ],
  nextSession: "Tomorrow at 7:00 PM",
}

const initialMessages = [
  {
    id: "1",
    senderId: "2",
    senderName: "Sarah Chen",
    senderAvatar: "/placeholder.svg?key=user2",
    content: "Hey everyone! Ready for tomorrow's integration by parts session?",
    timestamp: new Date(Date.now() - 3600000),
    type: "text" as const,
    reactions: [{ emoji: "👍", count: 2, users: ["1", "3"] }],
    readBy: ["1", "3", "4"],
    isPinned: false,
    isHighlighted: false,
  },
  {
    id: "2",
    senderId: "3",
    senderName: "Mike Rodriguez",
    senderAvatar: "/placeholder.svg?key=user3",
    content: "Definitely! I've been struggling with the substitution method. Could we go over some examples?",
    timestamp: new Date(Date.now() - 3500000),
    type: "text" as const,
    reactions: [],
    readBy: ["1", "2"],
    isPinned: false,
    isHighlighted: true, // Highlighted as important question
  },
  {
    id: "3",
    senderId: "1",
    senderName: "You",
    senderAvatar: "/placeholder.svg?key=user1",
    content: "Great idea! I found this helpful resource on integration techniques. Let me share it with you all.",
    timestamp: new Date(Date.now() - 3400000),
    type: "text" as const,
    reactions: [{ emoji: "🔥", count: 1, users: ["2"] }],
    readBy: ["2", "3"],
    isPinned: false,
    isHighlighted: false,
  },
  {
    id: "4",
    senderId: "2",
    senderName: "Sarah Chen",
    senderAvatar: "/placeholder.svg?key=user2",
    content: "Perfect! Also, should we create a shared document for practice problems?",
    timestamp: new Date(Date.now() - 3200000),
    type: "text" as const,
    reactions: [{ emoji: "💡", count: 3, users: ["1", "3", "4"] }],
    readBy: ["1", "3"],
    isPinned: true, // Pinned message
    isHighlighted: false,
  },
  {
    id: "5",
    senderId: "3",
    senderName: "Mike Rodriguez",
    senderAvatar: "/placeholder.svg?key=user3",
    content: "Yes! I can start a Google Doc and share the link here. What topics should we focus on?",
    timestamp: new Date(Date.now() - 3000000),
    type: "text" as const,
    reactions: [],
    readBy: ["1", "2"],
    isPinned: false,
    isHighlighted: false,
  },
]

export default function ChatPage({ params }: { params: { groupId: string } }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [selectedMessageForAI, setSelectedMessageForAI] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = Math.random() > 0.8 ? "2" : null // Sarah typing occasionally
      if (randomUser && !typingUsers.includes(randomUser)) {
        setTypingUsers([randomUser])
        setTimeout(() => setTypingUsers([]), 3000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [typingUsers])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      senderId: "1",
      senderName: "You",
      senderAvatar: "/placeholder.svg?key=user1",
      content: newMessage,
      timestamp: new Date(),
      type: "text" as const,
      reactions: [],
      readBy: [],
      isPinned: false,
      isHighlighted: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, readBy: ["2", "3"] } : msg)))
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const togglePin = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg)))
  }

  const toggleHighlight = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isHighlighted: !msg.isHighlighted } : msg)),
    )
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji)
          if (existingReaction) {
            if (existingReaction.users.includes("1")) {
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r) =>
                    r.emoji === emoji ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== "1") } : r,
                  )
                  .filter((r) => r.count > 0),
              }
            } else {
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "1"] } : r,
                ),
              }
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: ["1"] }],
            }
          }
        }
        return msg
      }),
    )
  }

  const openAIAssistant = (messageId?: string) => {
    setSelectedMessageForAI(messageId || null)
    setAiAssistantOpen(true)
  }

  const closeAIAssistant = () => {
    setAiAssistantOpen(false)
    setSelectedMessageForAI(null)
  }

  const handleAIResponse = (response: string, type: "explanation" | "definition" | "quiz" | "suggestion") => {
    const aiMessage = {
      id: Date.now().toString(),
      senderId: "ai",
      senderName: "AI Study Assistant",
      senderAvatar: "/placeholder.svg?key=ai",
      content: response,
      timestamp: new Date(),
      type: "text" as const,
      reactions: [],
      readBy: [],
      isPinned: false,
      isHighlighted: type === "explanation" || type === "definition",
      aiType: type,
    }

    setMessages((prev) => [...prev, aiMessage])
    closeAIAssistant()
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <div className="flex-1 flex flex-col">
        <Card className="rounded-none border-x-0 border-t-0 backdrop-blur-sm bg-card/80">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{groupData.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {groupData.subject}
                      </Badge>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {groupData.members.filter((m) => m.online).length} online
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAIAssistant()}
                  className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:from-accent/20 hover:to-primary/20"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  AI Assistant
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Clock className="w-4 h-4" />
                  {groupData.nextSession}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Users className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.filter((msg) => msg.isPinned).length > 0 && (
              <Card className="backdrop-blur-sm bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Pin className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">Pinned Messages</span>
                  </div>
                  <div className="space-y-2">
                    {messages
                      .filter((msg) => msg.isPinned)
                      .map((msg) => (
                        <div key={msg.id} className="text-sm p-2 rounded bg-background/50">
                          <span className="font-medium">{msg.senderName}:</span> {msg.content}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.senderId === "1"}
                onPin={() => togglePin(message.id)}
                onHighlight={() => toggleHighlight(message.id)}
                onReaction={(emoji) => addReaction(message.id, emoji)}
                onAIAssist={() => openAIAssistant(message.id)}
              />
            ))}

            {typingUsers.length > 0 && (
              <TypingIndicator
                users={typingUsers.map((id) => groupData.members.find((m) => m.id === id)?.name || "Someone")}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Card className="rounded-none border-x-0 border-b-0 backdrop-blur-sm bg-card/80">
          <CardContent className="p-4">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-20 min-h-[44px] resize-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="h-11 px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {sidebarOpen && <ChatSidebar group={groupData} onClose={() => setSidebarOpen(false)} />}

      {aiAssistantOpen && (
        <AIAssistant
          isOpen={aiAssistantOpen}
          onClose={closeAIAssistant}
          onResponse={handleAIResponse}
          selectedMessage={selectedMessageForAI ? messages.find((m) => m.id === selectedMessageForAI) : null}
          conversationContext={messages.slice(-5)}
          groupSubject={groupData.subject}
        />
      )}
    </div>
  )
}
