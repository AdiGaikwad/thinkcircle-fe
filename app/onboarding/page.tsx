"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, BookOpen, Brain, Calendar, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import domains from "../data/domains"

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English Literature",
  "History",
  "Psychology",
  "Economics",
  "Philosophy",
  "Art",
  "Music",
  "Languages",
  "Engineering",
  "Medicine",
  "Law",
]

const learningStyles = [
  { id: "visual", label: "Visual", description: "Learn through images, diagrams, and visual aids" },
  { id: "auditory", label: "Auditory", description: "Learn through listening and discussion" },
  { id: "kinesthetic", label: "Kinesthetic", description: "Learn through hands-on activities" },
  { id: "reading", label: "Reading/Writing", description: "Learn through text and written materials" },
]

const timeSlots = [
  "Early Morning (6-9 AM)",
  "Morning (9-12 PM)",
  "Afternoon (12-3 PM)",
  "Late Afternoon (3-6 PM)",
  "Evening (6-9 PM)",
  "Night (9-12 AM)",
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    learningStyle: "",
    availability: [] as string[],
    goals: "",
    studyPreferences: {
      groupSize: "",
      sessionDuration: "",
      frequency: "",
    },
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleAvailabilityToggle = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((s) => s !== slot)
        : [...prev.availability, slot],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const token = localStorage.getItem("token")  
    try {
      const response = await fetch(`${domains.AUTH_HOST}/api/v1/profile/create_profile`, {
        method: "POST",
        //@ts-ignore
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Success animation
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        throw new Error("Failed to save profile")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.subjects.length > 0
      case 2:
        return formData.learningStyle !== ""
      case 3:
        return formData.availability.length > 0
      case 4:
        return formData.goals.trim() !== ""
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center space-y-2">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">What subjects interest you?</h2>
              <p className="text-muted-foreground">Select all subjects you'd like to study or get help with</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={formData.subjects.includes(subject) ? "default" : "outline"}
                  className={`h-auto p-4 text-left justify-start transition-all duration-200 hover:scale-105 ${
                    formData.subjects.includes(subject)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => handleSubjectToggle(subject)}
                >
                  <span className="text-sm font-medium">{subject}</span>
                  {formData.subjects.includes(subject) && <Check className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>

            {formData.subjects.length > 0 && (
              <div className="text-center animate-fade-in">
                <Badge variant="secondary" className="px-4 py-2">
                  {formData.subjects.length} subject{formData.subjects.length !== 1 ? "s" : ""} selected
                </Badge>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center space-y-2">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">How do you learn best?</h2>
              <p className="text-muted-foreground">Choose your preferred learning style</p>
            </div>

            <div className="space-y-4">
              {learningStyles.map((style) => (
                <Card
                  key={style.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    formData.learningStyle === style.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, learningStyle: style.id }))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.learningStyle === style.id ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {formData.learningStyle === style.id && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{style.label}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{style.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">When are you available?</h2>
              <p className="text-muted-foreground">Select your preferred study times</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Time Slots</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={formData.availability.includes(slot) ? "default" : "outline"}
                      className={`h-auto p-4 text-left justify-between transition-all duration-200 hover:scale-105 ${
                        formData.availability.includes(slot) ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      }`}
                      onClick={() => handleAvailabilityToggle(slot)}
                    >
                      <span>{slot}</span>
                      {formData.availability.includes(slot) && <Check className="w-4 h-4" />}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Study Preferences</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="groupSize" className="text-sm">
                      Preferred Group Size
                    </Label>
                    <select
                      id="groupSize"
                      className="w-full mt-1 p-2 border rounded-md bg-background"
                      value={formData.studyPreferences.groupSize}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          studyPreferences: { ...prev.studyPreferences, groupSize: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select size</option>
                      <option value="2-3">Small (2-3 people)</option>
                      <option value="4-6">Medium (4-6 people)</option>
                      <option value="7+">Large (7+ people)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-sm">
                      Session Duration
                    </Label>
                    <select
                      id="duration"
                      className="w-full mt-1 p-2 border rounded-md bg-background"
                      value={formData.studyPreferences.sessionDuration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          studyPreferences: { ...prev.studyPreferences, sessionDuration: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select duration</option>
                      <option value="30min">30 minutes</option>
                      <option value="1hour">1 hour</option>
                      <option value="2hours">2 hours</option>
                      <option value="3hours+">3+ hours</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="frequency" className="text-sm">
                      Study Frequency
                    </Label>
                    <select
                      id="frequency"
                      className="w-full mt-1 p-2 border rounded-md bg-background"
                      value={formData.studyPreferences.frequency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          studyPreferences: { ...prev.studyPreferences, frequency: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="few-times-week">Few times a week</option>
                      <option value="weekly">Weekly</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {formData.availability.length > 0 && (
              <div className="text-center animate-fade-in">
                <Badge variant="secondary" className="px-4 py-2">
                  {formData.availability.length} time slot{formData.availability.length !== 1 ? "s" : ""} selected
                </Badge>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">What are your study goals?</h2>
              <p className="text-muted-foreground">Tell us what you want to achieve</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="goals" className="text-base font-medium">
                  Academic Goals
                </Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Improve my calculus grades, prepare for SATs, understand organic chemistry concepts, master programming fundamentals..."
                  className="mt-2 min-h-[120px] resize-none"
                  value={formData.goals}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                />
              </div>

              <Card className="bg-accent/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Your Profile Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Subjects:</span> {formData.subjects.join(", ")}
                    </div>
                    <div>
                      <span className="font-medium">Learning Style:</span>{" "}
                      {learningStyles.find((s) => s.id === formData.learningStyle)?.label || "Not selected"}
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span> {formData.availability.length} time slots
                    </div>
                    {formData.studyPreferences.groupSize && (
                      <div>
                        <span className="font-medium">Group Size:</span> {formData.studyPreferences.groupSize}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Setting up your profile...</h2>
            <p className="text-muted-foreground">This will just take a moment</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to ThinkCircle!</h1>
            <p className="text-muted-foreground">Let's set up your learning profile</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()} className="flex items-center space-x-2">
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center space-x-2"
              >
                <span>Complete Setup</span>
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
