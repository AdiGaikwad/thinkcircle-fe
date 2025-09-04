"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import domains from "../data/domains";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter()


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    const body = {
      firstname: e.target[0].value ?? e.target[0].value,
      lastname: e.target[1].value ?? e.target[1].value,
      email: e.target[2].value ?? e.target[2].value,
      password: e.target[3].value ?? e.target[3].value,
    };

    try {
      const response = await axios.post(
        `${domains.AUTH_HOST}/api/v1/user/register`,
        body,
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        toast.success(
          response.data.message
            ? response.data.message
            : "User registered successfully"
        );

        const login = await axios.post(`${domains.AUTH_HOST}/api/v1/user/login`, body, {withCredentials: true})

        if(login.data.success){
          localStorage.setItem("token", login.data.token)
          router.push("/dashboard")
        }
        if(!login.data.success){
          router.push("/login")
        }
      }

    } catch (err: any) {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Unable to register user"
      );
      console.log(err);
    } finally{
      setIsLoading(false)
    }

    // Simulate API call
    // setTimeout(() => {
    //   setIsLoading(false)
    //   // Redirect to profile builder in real app
    //   // window.location.href = "/"
    // }, 2000)
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-in-left">
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 animate-fade-in-up">
              <CardTitle className="text-3xl font-bold text-foreground">
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Join ThinkCircle and start your AI-powered learning journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="space-y-2 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/50 ${
                          errors.firstName
                            ? "border-destructive focus:ring-destructive/50"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-destructive animate-scale-in">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div
                    className="space-y-2 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/50 ${
                        errors.lastName
                          ? "border-destructive focus:ring-destructive/50"
                          : ""
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive animate-scale-in">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="space-y-2 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/50 ${
                        errors.email
                          ? "border-destructive focus:ring-destructive/50"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive animate-scale-in">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div
                  className="space-y-2 animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/50 ${
                        errors.password
                          ? "border-destructive focus:ring-destructive/50"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive animate-scale-in">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div
                  className="space-y-2 animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/50 ${
                        errors.confirmPassword
                          ? "border-destructive focus:ring-destructive/50"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive animate-scale-in">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div
                  className="flex items-center space-x-2 animate-fade-in-up"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeToTerms", checked as boolean)
                    }
                    className="transition-all duration-300"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-destructive animate-scale-in">
                    {errors.agreeToTerms}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full cursor-pointer h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div
                className="text-center animate-fade-in-up"
                style={{ animationDelay: "0.7s" }}
              >
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-accent via-accent/90 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/20 to-primary/20 backdrop-blur-sm" />

        {/* Floating Elements */}
        <div className="absolute top-32 right-20 w-14 h-14 bg-white/20 rounded-full animate-float" />
        <div
          className="absolute top-20 left-32 w-10 h-10 bg-white/15 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-40 right-16 w-18 h-18 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 animate-slide-in-right">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Start Your Journey</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Join Thousands of
              <br />
              <span className="text-5xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Smart Learners
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-md leading-relaxed">
              Create your account and unlock personalized AI-powered study
              groups that adapt to your learning style.
            </p>

            <div className="flex items-center gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-sm">Personalized Learning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-sm">Goal Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
