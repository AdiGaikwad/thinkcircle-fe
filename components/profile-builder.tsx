"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Target, BookOpen, User, Sparkles } from "lucide-react"

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Engineering",
  "Psychology",
  "History",
  "Literature",
  "Economics",
  "Statistics",
  "Philosophy",
  "Art",
  "Music",
  "Languages",
]

const learningStyles = [
  { id: "visual", label: "Visual", description: "Learn through images, diagrams, and charts" },
  { id: "auditory", label: "Auditory", description: "Learn through listening and discussion" },
  { id: "kinesthetic", label: "Kinesthetic", description: "Learn through hands-on activities" },
  { id: "reading", label: "Reading/Writing", description: "Learn through text and written materials" },
]

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]

const timeSlots = [
  "Early Morning (6-9 AM)",
  "Morning (9-12 PM)",
  "Afternoon (12-5 PM)",
  "Evening (5-8 PM)",
  "Night (8-11 PM)",
  "Late Night (11 PM-2 AM)",
]

export function ProfileBuilder() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    selectedSubjects: [] as string[],
    subjectSkills: {} as Record<string, string>,
    learningStyles: [] as string[],
    goals: "",
    availability: [] as string[],
    studyPreferences: {
      groupSize: "",
      sessionLength: "",
      frequency: "",
    },
  })

  const addSubject = (subject: string) => {
    if (!profile.selectedSubjects.includes(subject)) {
      setProfile((prev) => ({
        ...prev,
        selectedSubjects: [...prev.selectedSubjects, subject],
      }))
    }
  }

  const removeSubject = (subject: string) => {
    setProfile((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter((s) => s !== subject),
      subjectSkills: Object.fromEntries(Object.entries(prev.subjectSkills).filter(([key]) => key !== subject)),
    }))
  }

  const setSubjectSkill = (subject: string, skill: string) => {
    setProfile((prev) => ({
      ...prev,
      subjectSkills: { ...prev.subjectSkills, [subject]: skill },
    }))
  }

  const toggleLearningStyle = (style: string) => {
    setProfile((prev) => ({
      ...prev,
      learningStyles: prev.learningStyles.includes(style)
        ? prev.learningStyles.filter((s) => s !== style)
        : [...prev.learningStyles, style],
    }))
  }

  const toggleAvailability = (slot: string) => {
    setProfile((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((s) => s !== slot)
        : [...prev.availability, slot],
    }))
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = () => {
    console.log("Profile submitted:", profile)
    // Here we would typically send the profile to the backend
    alert("Profile created successfully! You will be matched with study groups soon.")
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">Step {step} of 4</span>
        </div>
        <CardTitle className="flex items-center gap-2">
          {step === 1 && <User className="w-5 h-5" />}
          {step === 2 && <BookOpen className="w-5 h-5" />}
          {step === 3 && <Target className="w-5 h-5" />}
          {step === 4 && <Calendar className="w-5 h-5" />}
          {step === 1 && "Basic Information"}
          {step === 2 && "Academic Interests"}
          {step === 3 && "Learning Preferences"}
          {step === 4 && "Availability & Goals"}
        </CardTitle>
        <CardDescription>
          {step === 1 && "Tell us about yourself"}
          {step === 2 && "Select your subjects and skill levels"}
          {step === 3 && "How do you learn best?"}
          {step === 4 && "When are you available to study?"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Select Your Subjects</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant={profile.selectedSubjects.includes(subject) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent/20 transition-colors"
                    onClick={() =>
                      profile.selectedSubjects.includes(subject) ? removeSubject(subject) : addSubject(subject)
                    }
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            {profile.selectedSubjects.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-3 block">Set Your Skill Level</Label>
                <div className="space-y-3">
                  {profile.selectedSubjects.map((subject) => (
                    <div key={subject} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">{subject}</span>
                      <Select
                        value={profile.subjectSkills[subject] || ""}
                        onValueChange={(value) => setSubjectSkill(subject, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Learning Styles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.learningStyles.includes(style.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleLearningStyle(style.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={profile.learningStyles.includes(style.id)}
                        onChange={() => toggleLearningStyle(style.id)}
                      />
                      <div>
                        <h4 className="font-medium">{style.label}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{style.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Preferred Group Size</Label>
                <Select
                  value={profile.studyPreferences.groupSize}
                  onValueChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      studyPreferences: { ...prev.studyPreferences, groupSize: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (2-3 people)</SelectItem>
                    <SelectItem value="medium">Medium (4-6 people)</SelectItem>
                    <SelectItem value="large">Large (7+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Session Length</Label>
                <Select
                  value={profile.studyPreferences.sessionLength}
                  onValueChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      studyPreferences: { ...prev.studyPreferences, sessionLength: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hours">2 hours</SelectItem>
                    <SelectItem value="3hours">3+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Study Frequency</Label>
                <Select
                  value={profile.studyPreferences.frequency}
                  onValueChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      studyPreferences: { ...prev.studyPreferences, frequency: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="few-times-week">Few times a week</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                When are you available to study?
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.availability.includes(slot)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleAvailability(slot)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={profile.availability.includes(slot)}
                        onChange={() => toggleAvailability(slot)}
                      />
                      <span className="font-medium">{slot}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Academic Goals & Learning Objectives
              </Label>
              <Textarea
                id="goals"
                placeholder="Describe your academic goals, what you want to achieve, and any specific topics you'd like to focus on..."
                value={profile.goals}
                onChange={(e) => setProfile((prev) => ({ ...prev, goals: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Previous
          </Button>

          {step < 4 ? (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Next
              <Sparkles className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex items-center gap-2">
              Create Profile
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
