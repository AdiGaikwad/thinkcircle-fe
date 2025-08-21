"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Sparkles, BookOpen, HelpCircle, Brain, Lightbulb, MessageSquare, Loader2, Zap } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  onResponse: (response: string, type: "explanation" | "definition" | "quiz" | "suggestion") => void
  selectedMessage?: Message | null
  conversationContext: Message[]
  groupSubject: string
}

const aiResponses = {
  explanation: {
    "integration by parts":
      "Integration by parts is a technique used to integrate products of functions. The formula is ∫u dv = uv - ∫v du. It's particularly useful when you have a product of two functions where one becomes simpler when differentiated and the other becomes simpler when integrated.\n\nFor example, to solve ∫x·e^x dx:\n1. Let u = x (becomes simpler when differentiated)\n2. Let dv = e^x dx (stays manageable when integrated)\n3. Then du = dx and v = e^x\n4. Apply formula: x·e^x - ∫e^x dx = x·e^x - e^x + C = e^x(x-1) + C",
    "substitution method":
      "The substitution method (u-substitution) is used to simplify integrals by replacing a complex expression with a single variable. Here's the process:\n\n1. Identify a function and its derivative within the integral\n2. Let u = the inner function\n3. Find du = derivative of u\n4. Substitute to get an integral in terms of u\n5. Integrate with respect to u\n6. Substitute back to original variable\n\nExample: ∫2x(x²+1)³ dx\nLet u = x²+1, then du = 2x dx\nIntegral becomes ∫u³ du = u⁴/4 + C = (x²+1)⁴/4 + C",
    calculus:
      "Calculus is the mathematical study of continuous change. It has two main branches:\n\n**Differential Calculus**: Studies rates of change (derivatives)\n- Used to find slopes, velocities, optimization problems\n- Key concept: limit of difference quotient\n\n**Integral Calculus**: Studies accumulation of quantities (integrals)\n- Used to find areas, volumes, total change\n- Key concept: limit of Riemann sums\n\nThese branches are connected by the Fundamental Theorem of Calculus, which shows that differentiation and integration are inverse operations.",
  },
  definition: {
    derivative:
      "A derivative measures the rate of change of a function with respect to its variable. Geometrically, it represents the slope of the tangent line to the function at any point.",
    integral:
      "An integral represents the accumulation of quantities over an interval. Geometrically, it represents the area under a curve.",
    limit:
      "A limit describes the value that a function approaches as the input approaches some value. It's the foundation of calculus.",
    continuity:
      "A function is continuous at a point if the limit exists at that point and equals the function value at that point.",
    "chain rule":
      "The chain rule is used to find the derivative of composite functions. If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x).",
  },
  quiz: [
    {
      question: "What is the derivative of x³ + 2x² - 5x + 1?",
      options: ["3x² + 4x - 5", "3x² + 2x - 5", "x² + 4x - 5", "3x² + 4x - 1"],
      correct: 0,
      explanation: "Using the power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0",
    },
    {
      question: "Which method would you use to integrate ∫x·ln(x) dx?",
      options: ["Substitution", "Integration by parts", "Partial fractions", "Direct integration"],
      correct: 1,
      explanation: "Integration by parts is ideal here. Let u = ln(x) and dv = x dx, so du = 1/x dx and v = x²/2.",
    },
    {
      question: "What is the limit of (sin x)/x as x approaches 0?",
      options: ["0", "1", "∞", "undefined"],
      correct: 1,
      explanation:
        "This is a fundamental limit in calculus. lim(x→0) (sin x)/x = 1, which can be proven using L'Hôpital's rule or geometric arguments.",
    },
  ],
  suggestions: [
    "Try working through a few practice problems with integration by parts to build confidence",
    "Create a step-by-step checklist for the substitution method to avoid missing steps",
    "Draw diagrams to visualize the geometric meaning of integrals and derivatives",
    "Practice identifying which integration technique to use for different types of functions",
    "Set up a study schedule to review one integration technique per day",
    "Form smaller groups to work through challenging problems together",
  ],
}

export function AIAssistant({
  isOpen,
  onClose,
  onResponse,
  selectedMessage,
  conversationContext,
  groupSubject,
}: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState("explain")
  const [customQuery, setCustomQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showQuizResults, setShowQuizResults] = useState(false)

  useEffect(() => {
    if (selectedMessage) {
      setActiveTab("explain")
      setCustomQuery(selectedMessage.content)
    }
  }, [selectedMessage])

  const handleExplain = async (topic?: string) => {
    setIsLoading(true)
    const queryTopic = topic || customQuery.toLowerCase()

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let response = aiResponses.explanation[queryTopic as keyof typeof aiResponses.explanation]

    if (!response) {
      response = `I'd be happy to explain "${queryTopic}" in the context of ${groupSubject}. This topic involves several key concepts that build upon what you've been discussing. Let me break it down step by step with examples relevant to your current study session.`
    }

    setIsLoading(false)
    onResponse(response, "explanation")
  }

  const handleDefine = async (term?: string) => {
    setIsLoading(true)
    const queryTerm = term || customQuery.toLowerCase()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    let response = aiResponses.definition[queryTerm as keyof typeof aiResponses.definition]

    if (!response) {
      response = `**${queryTerm.charAt(0).toUpperCase() + queryTerm.slice(1)}**: This is a key concept in ${groupSubject}. Based on your conversation context, this term relates to the topics you've been discussing about integration techniques and problem-solving strategies.`
    }

    setIsLoading(false)
    onResponse(response, "definition")
  }

  const handleQuiz = () => {
    const quiz = aiResponses.quiz[currentQuiz]
    const quizText = `**Quick Quiz**: ${quiz.question}\n\nA) ${quiz.options[0]}\nB) ${quiz.options[1]}\nC) ${quiz.options[2]}\nD) ${quiz.options[3]}\n\nThink about it and let me know your answer!`

    onResponse(quizText, "quiz")
  }

  const handleSuggestion = () => {
    const randomSuggestion = aiResponses.suggestions[Math.floor(Math.random() * aiResponses.suggestions.length)]
    onResponse(`💡 **Study Suggestion**: ${randomSuggestion}`, "suggestion")
  }

  const quickTopics = ["integration by parts", "substitution method", "chain rule", "derivatives", "limits"]

  const quickTerms = ["derivative", "integral", "limit", "continuity", "chain rule"]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Study Assistant
                  <Badge variant="secondary" className="text-xs">
                    {groupSubject}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Get instant explanations, definitions, and study help</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border/50">
              <TabsTrigger value="explain" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Explain
              </TabsTrigger>
              <TabsTrigger value="define" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Define
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="suggest" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Suggest
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="explain" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <h3 className="font-medium">What would you like me to explain?</h3>

                  {selectedMessage && (
                    <Card className="bg-accent/5 border-accent/20">
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground mb-2">Selected message:</p>
                        <p className="text-sm font-medium">"{selectedMessage.content}"</p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter a topic or concept you'd like explained..."
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={() => handleExplain()}
                      disabled={!customQuery.trim() || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating explanation...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Explain This
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quick topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickTopics.map((topic) => (
                        <Button
                          key={topic}
                          variant="outline"
                          size="sm"
                          onClick={() => handleExplain(topic)}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="define" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <h3 className="font-medium">Which term needs definition?</h3>

                  <div className="space-y-2">
                    <Input
                      placeholder="Enter a term or concept..."
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                    />
                    <Button
                      onClick={() => handleDefine()}
                      disabled={!customQuery.trim() || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Looking up definition...
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Define This
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Common terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickTerms.map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDefine(term)}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <h3 className="font-medium">Test your understanding</h3>
                  <p className="text-sm text-muted-foreground">
                    I'll generate quiz questions based on your current discussion topics.
                  </p>

                  <Button onClick={handleQuiz} className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Quiz Question
                  </Button>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">Pro Tip</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Quiz questions are tailored to your group's current study topics and difficulty level.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suggest" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <h3 className="font-medium">Study suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Get personalized study tips and strategies based on your group's discussion.
                  </p>

                  <Button onClick={handleSuggestion} className="w-full">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Study Suggestion
                  </Button>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Context Aware</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Suggestions are based on your recent messages and identified learning gaps.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
