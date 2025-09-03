import { ProfileBuilder } from "@/components/profile-builder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Users,
  MessageCircle,
  Sparkles,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ThinkCircle
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your learning experience with AI-powered study groups that
            match your goals, schedule, and learning style for maximum academic
            success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/login">
              <Button
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center cursor-pointer gap-2 bg-transparent hover:text-gray-200"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            {/* <Link href="/dashboard">
              <Button size="lg" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                View Dashboard
              </Button>
            </Link> */}
            {/* <Link href="/matching">
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                Find Study Groups
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="backdrop-blur-sm bg-card/80 border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Platform analyzes your learning style, subjects, and schedule to form
                optimal study groups
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Dynamic Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Join diverse study groups that adapt to your progress and
                changing academic needs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Real-Time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Seamless group discussions with typing indicators and smart
                conversation summaries
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get instant explanations, definitions, and study suggestions
                during group sessions
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Profile Builder Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Create Your Learning Profile
            </h2>
            <p className="text-muted-foreground text-lg">
              Tell us about your academic interests and learning preferences to
              get matched with the perfect study group
            </p>
          </div>
          <ProfileBuilder />
        </div>
      </div>
    </div>
  );
}
