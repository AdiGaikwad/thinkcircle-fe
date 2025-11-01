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
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  Brain,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import domains from "../data/domains";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Simple validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const body = {
      //@ts-ignore
      email: e.target[0].value,
      //@ts-ignore
      password: e.target[1].value,
    };

    try {
      setIsLoading(true);

      const login = new Promise((resolve, reject) => {
        axios
          .post(`${domains.AUTH_HOST}/api/v1/user/login`, body, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.success) {
              localStorage.setItem("token", res.data.token);
              resolve({
                message: res.data.message
                  ? res.data.message
                  : "Logged in successfully !",
              });
              if (res.data.user && res.data.token) {
                setUser(res.data.user);
                setToken(res.data.token);
                router.push("/dashboard");
              }
            }
            if (!res.data.success) {
              console.log(res.data);
              reject({
                message: res.data.message
                  ? res.data.message
                  : "Unable to login ",
              });
              // router.push("/login")
            }
          })
          .catch((err) => {
            console.log(err);
            reject({
              message: err.response.data.message
                ? err.response.data.message
                : "Unable to login. Please try again",
            });
          });
      });
      toast.promise(login, {
        success: (data: any) => data.message,
        error: (data: any) => data.message,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-white/20 rounded-full animate-float" />
        <div
          className="absolute top-40 right-32 w-12 h-12 bg-white/15 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-16 w-20 h-20 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 animate-slide-in-left">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">AI-Powered Learning</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Welcome Back to
              <br />
              <span className="text-5xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                ThinkCircle
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-md leading-relaxed">
              Continue your learning journey with AI-powered study groups
              tailored to your academic goals.
            </p>

            <div className="flex items-center gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm">Smart Matching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-sm">AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-in-right">
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 animate-fade-in-up">
              <CardTitle className="text-3xl font-bold text-foreground">
                Sign In
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div
                  className="space-y-2 animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
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
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  style={{ animationDelay: "0.2s" }}
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  className="flex items-center justify-between animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base cursor-pointer font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div
                className="text-center animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
