"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Sparkles, Users } from "lucide-react"

const mockProfiles = [
  { name: "You", avatar: "/diverse-students-studying.png", color: "bg-primary" },
  { name: "Sarah", avatar: "/diverse-students-studying.png", color: "bg-accent" },
  { name: "Mike", avatar: "/diverse-students-studying.png", color: "bg-secondary" },
  { name: "Emma", avatar: "/diverse-students-studying.png", color: "bg-chart-1" },
  { name: "Alex", avatar: "/diverse-students-studying.png", color: "bg-chart-2" },
  { name: "Jordan", avatar: "/diverse-students-studying.png", color: "bg-chart-3" },
]

export function MatchingAnimation() {
  const [activeConnections, setActiveConnections] = useState<number[]>([])
  const [pulseIndex, setPulseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections((prev) => {
        const newConnections = [...prev]
        const randomIndex = Math.floor(Math.random() * 6)
        if (newConnections.includes(randomIndex)) {
          return newConnections.filter((i) => i !== randomIndex)
        } else {
          return [...newConnections, randomIndex].slice(-3) // Keep max 3 connections
        }
      })

      setPulseIndex((prev) => (prev + 1) % mockProfiles.length)
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 overflow-hidden">
      <CardContent className="p-8">
        <div className="relative">
          {/* Central AI Brain */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 animate-ping" />
          </div>

          {/* Student Profiles in Circle */}
          <div className="relative w-80 h-80 mx-auto">
            {mockProfiles.map((profile, index) => {
              const angle = index * 60 * (Math.PI / 180) // 60 degrees apart
              const radius = 120
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={profile.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  <div className={`relative ${pulseIndex === index ? "animate-pulse" : ""}`}>
                    <Avatar className="w-12 h-12 border-2 border-background shadow-lg">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                      <AvatarFallback className={profile.color}>{profile.name[0]}</AvatarFallback>
                    </Avatar>

                    {/* Connection Lines */}
                    {activeConnections.includes(index) && (
                      <div className="absolute inset-0">
                        <svg
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          width="240"
                          height="240"
                          style={{ zIndex: -1 }}
                        >
                          <line
                            x1="120"
                            y1="120"
                            x2={120 - x}
                            y2={120 - y}
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.3" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}

                    {/* Floating Sparkles */}
                    {activeConnections.includes(index) && (
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-4 h-4 text-accent animate-bounce" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-center mt-2 font-medium">{profile.name}</p>
                </div>
              )
            })}
          </div>

          {/* Floating Elements */}
          <div className="absolute top-4 left-4 animate-float">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
          </div>

          <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: "1s" }}>
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
          </div>

          <div className="absolute bottom-8 left-12 animate-float" style={{ animationDelay: "2s" }}>
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
