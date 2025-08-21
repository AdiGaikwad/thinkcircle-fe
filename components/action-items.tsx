"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react"

interface ActionItem {
  id: string
  title: string
  group: string
  dueDate: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

interface ActionItemsProps {
  items: ActionItem[]
  showAll?: boolean
}

export function ActionItems({ items, showAll = false }: ActionItemsProps) {
  const [actionItems, setActionItems] = useState(items)

  const toggleComplete = (id: string) => {
    setActionItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-3 h-3" />
      case "medium":
        return <Clock className="w-3 h-3" />
      case "low":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const pendingItems = actionItems.filter((item) => !item.completed)
  const completedItems = actionItems.filter((item) => item.completed)

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Action Items
            {!showAll && pendingItems.length > 0 && <Badge variant="secondary">{pendingItems.length} pending</Badge>}
          </CardTitle>
          {showAll && (
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="space-y-3">
            {!showAll && <h4 className="font-medium text-sm text-muted-foreground">Pending Tasks</h4>}
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <Checkbox checked={item.completed} onCheckedChange={() => toggleComplete(item.id)} className="mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <Badge className={getPriorityColor(item.priority)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(item.priority)}
                        {item.priority}
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.group}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {item.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Items (only show in full view) */}
        {showAll && completedItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Completed Tasks</h4>
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 opacity-60 transition-colors"
              >
                <Checkbox checked={item.completed} onCheckedChange={() => toggleComplete(item.id)} className="mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm line-through">{item.title}</h4>
                    <Badge className={getPriorityColor(item.priority)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(item.priority)}
                        {item.priority}
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.group}</span>
                    <span>•</span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {actionItems.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">No action items</h3>
            <p className="text-sm text-muted-foreground">All caught up! New tasks will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
