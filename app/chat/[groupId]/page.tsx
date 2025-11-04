"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Pin,
  MessageCircle,
  Clock,
  Sparkles,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { TypingIndicator } from "@/components/typing-indicator";
import { ChatSidebar } from "@/components/chat-sidebar";
import { AIAssistant } from "@/components/ai-assistant";
import { MessageGroupSkeleton } from "@/components/message-skeleton";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; // Updated import
import domains from "@/app/data/domains"; // Updated import
import Link from "next/link";
import { SummaryAssistant } from "@/components/summary-assistant";
import { uploadAttachment } from "@/lib/uploadAttachment";
interface GroupData {
  id: string;
  name: string;
  subjectFocus: string;
  description?: string;
  memberCount: number;
  members: any[];
  adminId: string;
  admin: any;
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = React.use(params);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedMessageForAI, setSelectedMessageForAI] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user, authToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.body.style = "padding-top: 0px";
  }, []);

  const {
    socket,
    fetchMessages,
    sendMessage,
    emitTyping,
    markMessagesAsRead,

    isConnected,
  } = useSocket({
    groupId: groupId,
    onMessageReceived: (message) => {
      console.log("[v0] Message received:", message);
      if (message) {
        setMessages((prev) => {
          const exists = prev.find((m) => m.id === message.id);
          if (!exists) {
            return [...prev, message];
          }
          return prev;
        });
        scrollToBottom();
      }
    },
    onTypingUsers: (users) => {
      // Filter out current user if needed

      console.log("[v0] Typing users:", users);
      // const filtered = users.filter((id) => id !== user?.id);

      setTypingUsers(users);
      // setTypingUsers(groupData);
    },
    onOnlineUsers: (users) => {
      setOnlineUsers(users);
    },
    onMessagesRead: (data) => {
      console.log("[v0] Messages read:", data);
      setMessages((prev) =>
        prev.map((msg) =>
          data.messageIds.includes(msg.id)
            ? { ...msg, isRead: true, fullyRead: true }
            : msg
        )
      );
    },
    onError: (error) => {
      setError(error);
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size exceeds 5 MB limit",
          variant: "destructive",
        });
        e.target.value = ""; // reset input
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      console.log(user);
      const uploadedFiles = await uploadAttachment(
        file,
        authToken!,
        groupId,
        user?.profile.id,
        (percent) => setUploadProgress(percent)
      );

      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploaded = uploadedFiles[0];
        await sendMessage(uploaded.url || uploaded.path || "[Attachment]");
      }

      toast({
        title: "Upload complete",
        description: "Your file has been uploaded successfully.",
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload failed",
        description:
          err instanceof Error ? err.message : "Failed to upload attachment",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTypingUsers([]);
    }, 3500);
  }, [typingUsers]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (!authToken) {
          setError("User not authenticated");
          return;
        }

        const response = await fetch(
          `${domains.AUTH_HOST}/api/v1/group/${groupId}/details`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch group data: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && data.group) {
          setGroupData(data.group);
        } else {
          throw new Error(data.message || "Failed to load group data");
        }
      } catch (err) {
        console.error("Error fetching group data:", err);
        setError(err instanceof Error ? err.message : "Failed to load group");
        toast({
          title: "Error",
          description: "Failed to load group details",
          variant: "destructive",
        });
      }
    };

    if (authToken) {
      fetchGroupData();
    }
  }, [groupId, authToken, toast]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!isConnected || !groupData) {
        return;
      }

      try {
        setIsLoading(true);
        const result = await fetchMessages(undefined, 30);

        if (result && result.messages) {
          setMessages(result.messages);
          setNextCursor(result.nextCursor);
          setHasMoreMessages(!!result.nextCursor);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessages();
  }, [isConnected, groupData, fetchMessages, toast]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScrollUp = useCallback(async () => {
    if (isLoadingMore || !hasMoreMessages || !nextCursor) return;

    try {
      setIsLoadingMore(true);
      const result = await fetchMessages(nextCursor, 20);
      setMessages((prev) => [...result.messages, ...prev]);
      setNextCursor(result.nextCursor);
      setHasMoreMessages(!!result.nextCursor);
    } catch (err) {
      console.error("Error loading more messages:", err);
      toast({
        title: "Error",
        description: "Failed to load more messages",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreMessages, nextCursor, fetchMessages, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) {
      toast({
        title: "Error",
        description: isConnected
          ? "Message cannot be empty"
          : "Not connected to chat",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    emitTyping();

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 3000);
  };

  const togglePin = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    );
  };

  const toggleHighlight = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, isHighlighted: !msg.isHighlighted }
          : msg
      )
    );
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(
            (r: any) => r.emoji === emoji
          );
          if (existingReaction) {
            if (existingReaction.users?.includes("1")) {
              return {
                ...msg,
                reactions: (msg.reactions || [])
                  .map((r: any) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter((u: string) => u !== "1"),
                        }
                      : r
                  )
                  .filter((r: any) => r.count > 0),
              };
            } else {
              return {
                ...msg,
                reactions: (msg.reactions || []).map((r: any) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count + 1,
                        users: [...(r.users || []), "1"],
                      }
                    : r
                ),
              };
            }
          } else {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, count: 1, users: ["1"] },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  const openAIAssistant = (messageId?: string) => {
    setSelectedMessageForAI(messageId || null);
    setAiAssistantOpen(true);
  };

  const closeAIAssistant = () => {
    setAiAssistantOpen(false);
    setSelectedMessageForAI(null);
  };

  const handleAIResponse = (
    response: string,
    type: "explanation" | "definition" | "quiz" | "suggestion"
  ) => {
    const aiMessage = {
      id: Date.now().toString(),
      senderId: "ai",
      sender: {
        id: "ai",
      },
      senderName: "AI Study Assistant",
      senderAvatar: "/placeholder.svg?key=ai",
      message: response,
      createdAt: new Date(),
      type: "text" as const,
      reactions: [],
      readBy: [],
      isPinned: false,
      isHighlighted: type === "explanation" || type === "definition",
      aiType: type,
    };

    setMessages((prev) => [...prev, aiMessage]);
    closeAIAssistant();
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      // console.log(entries)

      const visibleMessageIds = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => {
          const messageId = entry.target.getAttribute("data-message-id");
          return messageId;
        })
        .filter((id) => id !== null) as string[];
      // console.log("visible ids: ", visibleMessageIds);
      //getting messages ids only which are not marked as read
      // and messages that do not match to the current user
      const notReadMessageIds = visibleMessageIds.filter(
        (id) =>
          !messages.find((m) => m.id === id)?.isRead &&
          messages.find((m) => m.id === id)?.sender.id !== user?.id
      );

      if (visibleMessageIds.length > 0) {
        // console.log("marking: ", notReadMessageIds);
        markMessagesAsRead(notReadMessageIds);
      }
    }, observerOptions);

    const messageElements = document.querySelectorAll("[data-message-id]");
    messageElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [messages, markMessagesAsRead]);

  if (isLoading || !groupData) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
        <Card className="rounded-none border-x-0 border-t-0 backdrop-blur-sm bg-card/80">
          <CardHeader className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center animate-pulse">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            </div>
          </CardHeader>
        </Card>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            <MessageGroupSkeleton />
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (error && !groupData) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                Failed to Load Chat
              </p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <div className="flex-1 flex flex-col">
        <Card className="rounded-none border-x-0 border-t-0 backdrop-blur-sm bg-card/80">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <ArrowLeft className="w-8 h-5 text-accent" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{groupData.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {groupData.subjectFocus}
                      </Badge>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {onlineUsers.length}/{groupData.memberCount} online
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isConnected && (
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Connecting...
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAIAssistant()}
                  className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:from-accent/20 hover:to-primary/20"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  Summarize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  onClick={() => openAIAssistant()}
                  className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:from-accent/20 hover:to-primary/20"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  Assistant coming soon
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Clock className="w-4 h-4" />
                  Members
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Users className="w-4 h-4" />
                </Button>
                {/* <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button> */}
              </div>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading earlier messages...</span>
                </div>
              </div>
            )}

            {hasMoreMessages &&
              !isLoadingMore &&
              messages.length > 0 &&
              nextCursor && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScrollUp}
                  className="w-full text-xs bg-transparent"
                >
                  Load earlier messages
                </Button>
              )}

            {messages.filter((msg) => msg.isPinned).length > 0 && (
              <Card className="backdrop-blur-sm bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Pin className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      Pinned Messages
                    </span>
                  </div>
                  <div className="space-y-2">
                    {messages
                      .filter((msg) => msg.isPinned)
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className="text-sm p-2 rounded bg-background/50"
                        >
                          <span className="font-medium">
                            {msg.sender?.firstname}:
                          </span>{" "}
                          {msg.message}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map(
                (message) =>
                  message && (
                    <div key={message.id} data-message-id={message.id}>
                      <ChatMessage
                        message={message}
                        isOwn={message.sender.id === user?.id}
                        onPin={() => togglePin(message.id)}
                        onHighlight={() => toggleHighlight(message.id)}
                        onReaction={(emoji) => addReaction(message.id, emoji)}
                        onAIAssist={() => openAIAssistant(message.id)}
                      />
                    </div>
                  )
              )
            )}

            {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Card className="rounded-none border-x-0 border-b-0 backdrop-blur-sm bg-card/80">
          <CardContent className="p-4">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              {/* <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  placeholder={
                    isConnected ? "Type your message..." : "Connecting..."
                  }
                  disabled={!isConnected || isSending}
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
              </div> */}
              <div className="flex w-full relative">
                {" "}
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  placeholder={
                    isConnected ? "Type your message..." : "Connecting..."
                  }
                  disabled={!isConnected || isSending}
                  className="pr-20 min-h-[44px] resize-none"
                />{" "}
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4" />
                </Button>
                {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {" "}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {" "}
                    <Paperclip className="w-4 h-4" />{" "}
                  </Button>{" "}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {" "}
                    <Smile className="w-4 h-4" />{" "}
                  </Button>{" "}
                </div> */}
              </div>
              {isUploading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading... {uploadProgress ?? 0}%</span>
                </div>
              )}
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected || isSending}
                className="h-11 px-6"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {groupData && sidebarOpen && (
        <ChatSidebar
          group={groupData}
          user={user}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {aiAssistantOpen && groupData && (
        <SummaryAssistant
          isOpen={aiAssistantOpen}
          onClose={closeAIAssistant}
          groupId={groupData?.id}
          // onResponse={handleAIResponse}
          // selectedMessage={
          //   selectedMessageForAI
          //     ? messages.find((m) => m.id === selectedMessageForAI)
          //     : null
          // }
          // conversationContext={messages.slice(-5)}
          // groupSubject={groupData?.subjectFocus || ""}
        />
      )}
    </div>
  );
}
