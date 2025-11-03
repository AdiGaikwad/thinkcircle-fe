"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, RefreshCcw, X, Sparkles, BookOpen, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import domains from "@/app/data/domains"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SummaryAssistantProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
}

interface Summary {
  id: string
  content: string
  createdAt: string
  groupId: string
  topicsCovered?: string[]
  keyQuestions?: string[]
  actionItems?: string[]
}

export function SummaryAssistant({ isOpen, onClose, groupId }: SummaryAssistantProps) {
  const { authToken } = useAuth()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const fetchSummaries = async () => {
    if (!authToken || !groupId) return
    try {
      setLoading(true)
      setError(null)

      const res = await axios.get(`${domains.AUTH_HOST}/api/v1/summary/group/${groupId}/summary`, {
        headers: { Authorization: `${authToken}` },
      })

      if (res.data?.summary) {
        setSummaries(res.data.summary)
      } else {
        setError("No summaries found for this group yet.")
      }
    } catch (err: any) {
      console.error("[SummaryAssistant] Fetch error:", err)
      setError(err.response?.data?.message || "Failed to fetch summaries.")
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async () => {
    if (!authToken || !groupId) return
    try {
      setGenerating(true)
      setError(null)

      const res = await axios.post(
        `${domains.AUTH_HOST}/api/v1/summary/group/${groupId}/summary`,
        {},
        {
          headers: { Authorization: `${authToken}` },
        },
      )

      if (res.data?.summary) {
        await fetchSummaries()
      } else {
        setError(res.data?.message || "Failed to generate summary.")
      }
    } catch (err: any) {
      console.error("[SummaryAssistant] Generation error:", err)
      setError(err.response?.data?.message || "Error generating summary.")
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchSummaries()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <Card
        className={`w-full max-w-2xl max-h-[85vh] bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/30 shadow-2xl overflow-hidden transform transition-all duration-300 ${
          generating ? "animate-ai-glow" : "hover:border-cyan-500/50"
        }`}
      >
        {/* Gradient background effect when generating */}
        {generating && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 blur-xl animate-pulse" />
        )}

        {/* Header with modern styling */}
        <CardHeader className="relative border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/50 to-slate-950/50 backdrop-blur-sm pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              Session Summary
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Action buttons */}
        <div className="relative flex justify-between items-center gap-3 px-6 py-4 border-b border-cyan-500/10">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSummaries}
            disabled={loading || generating}
            className="flex items-center gap-2 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 bg-transparent"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <button
            onClick={generateSummary}
            disabled={generating}
            className="relative inline-flex h-11 overflow-hidden rounded-lg p-[2px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,#3b82f6_25%,#8b5cf6_50%,#ec4899_75%,#06b6d4_100%)]" />
            <span className="relative inline-flex h-full w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-slate-900">
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Summarizing...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Generate Summary</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Content area */}
        <CardContent className="relative p-0 overflow-hidden">
          {error && (
            <div className="m-4 p-4 text-sm text-red-200 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg border border-red-500/30 backdrop-blur-sm animate-fade-in">
              <div className="flex gap-2 items-start">
                <span className="text-red-400 mt-0.5">!</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-16 text-muted-foreground gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-spin opacity-30" />
                <div
                  className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin opacity-20"
                  style={{ animationDirection: "reverse" }}
                />
                <Loader2 className="absolute inset-0 w-full h-full text-cyan-400 animate-spin" />
              </div>
              <p className="text-center">Loading summaries...</p>
            </div>
          ) : summaries.length > 0 ? (
            <ScrollArea className="h-[50vh]">
              <div className="space-y-3 p-4">
                {summaries.map((summary, index) => (
                  <div
                    key={summary.id}
                    className="group animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className="border border-cyan-500/20 bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm">
                      <CardContent className="p-4 space-y-3">
                        {/* Topics Covered */}
                        {summary.topicsCovered && summary.topicsCovered.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-cyan-400" />
                              <p className="text-sm font-semibold text-cyan-300">Topics Covered</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {summary.topicsCovered.map((topic, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-200 hover:border-cyan-400/60 transition-all duration-200"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Questions */}
                        {summary.keyQuestions && summary.keyQuestions.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <p className="text-sm font-semibold text-purple-300">Key Questions</p>
                            </div>
                            <div className="space-y-1">
                              {summary.keyQuestions.map((question, i) => (
                                <p
                                  key={i}
                                  className="text-sm text-slate-300 pl-4 border-l-2 border-purple-500/30 hover:border-purple-400 transition-colors"
                                >
                                  {question}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Items */}
                        {summary.actionItems && summary.actionItems.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <p className="text-sm font-semibold text-green-300">Action Items</p>
                            </div>
                            <div className="space-y-1">
                              {summary.actionItems.map((item, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                  <p className="text-sm text-slate-300">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                          {new Date(summary.createdAt).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col justify-center items-center py-16 text-slate-400 gap-3">
              <Sparkles className="w-12 h-12 opacity-30" />
              <p className="text-center text-sm">No summaries yet. Generate your first one!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
