"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import io, { type Socket } from "socket.io-client"
import { useAuth } from "@/context/AuthContext" // Fixed AuthContext import path to use contexts instead of context
import domains from "@/app/data/domains"

interface SocketHookOptions {
  groupId: string
  onMessageReceived?: (message: any) => void
  onTypingUsers?: (users: string[]) => void
  onOnlineUsers?: (users: string[]) => void
  onMessagesRead?: (data: any) => void
  onError?: (error: string) => void
}

export function useSocket({
  groupId,
  onMessageReceived,
  onTypingUsers,
  onOnlineUsers,
  onMessagesRead,
  onError,
}: SocketHookOptions) {
  const socketRef = useRef<Socket | null>(null)
  const { authToken } = useAuth()
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const [isConnected, setIsConnected] = useState(false)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current || !authToken || !groupId) {
      return
    }

    const socketUrl = domains.SOCKET_HOST
    if (!socketUrl) {
      onError?.("Socket server URL not configured")
      return
    }

    initializedRef.current = true
    console.log("[v0] Initializing socket with URL:", socketUrl)

    const socket = io(socketUrl, {
      auth: { token: authToken },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("[v0] Socket connected, joining group:", groupId)
      setIsConnected(true)
      socket.emit("join-group", { groupId }, (ack: any) => {
        if (!ack?.success) {
          console.error("[v0] Failed to join group:", ack?.message)
          onError?.(ack?.message || "Failed to join group")
        } else {
          console.log("[v0] Successfully joined group")
        }
      })
    })

    socket.on("connect_error", (error) => {
      console.error("[v0] Connection error:", error)
      setIsConnected(false)
      onError?.(`Connection error: ${error.message}`)
    })

    socket.on("new-message", (message) => {
      console.log("[v0] New message received:", message)
      onMessageReceived?.(message)
    })

    socket.on("receive-message", (message) => {
      console.log("[v0] Message received:", message)
      onMessageReceived?.(message)
    })

    socket.on("user-typing", ({ fullname }) => {
      onTypingUsers?.([fullname])
      // onTypingUsers?.([userId])
    })

    socket.on("group-online-users", (users: string[]) => {
      onOnlineUsers?.(users)
    })

    socket.on("messages-read", (data) => {
      onMessagesRead?.(data)
    })

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
      setIsConnected(false)
    })

    socket.on("error", (error) => {
      console.error("[v0] Socket error:", error)
      setIsConnected(false)
      onError?.(typeof error === "string" ? error : "Socket error occurred")
    })

    return () => {
      console.log("[v0] Cleaning up socket connection")
      if (socketRef.current) {
        socketRef.current.emit("leave-group", { groupId })
        socketRef.current.disconnect()
        setIsConnected(false)
        initializedRef.current = false
      }
    }
  }, [authToken, groupId])

  const fetchMessages = useCallback(
    (before?: string, limit = 30) => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error("Socket not connected"))
          return
        }

        socketRef.current.emit("fetch-messages", { groupId, before, limit }, (ack: any) => {
          if (ack?.success) {
            resolve(ack.data)
          } else {
            reject(new Error(ack?.message || "Failed to fetch messages"))
          }
        })
      })
    },
    [groupId],
  )

  const sendMessage = useCallback(
    (message: string, attachments?: any[]) => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error("Socket not connected"))
          return
        }

        socketRef.current.emit("send-message", { groupId, message, attachments }, (ack: any) => {
          if (ack?.success) {
            onMessageReceived?.(ack.data)
            resolve(ack)
          } else {
            reject(new Error(ack?.message || "Failed to send message"))
          }
        })
      })
    },
    [groupId, onMessageReceived],
  )

  const emitTyping = useCallback(() => {
    if (!socketRef.current?.connected) return

    socketRef.current.emit("typing", { groupId })

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 3000)
  }, [groupId])

  const markMessagesAsRead = useCallback(
    (messageIds: string[]) => {
      if (!socketRef.current?.connected || messageIds.length === 0) return

      socketRef.current.emit("read-messages", { groupId, messageIds }, (ack: any) => {
        console.log("[v0] Messages marked as read:", ack)
      })
    },
    [groupId],
  )

  return {
    socket: socketRef.current,
    fetchMessages,
    sendMessage,
    emitTyping,
    markMessagesAsRead,
    isConnected,
  }
}
