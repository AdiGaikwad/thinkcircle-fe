"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Edit,
  Save,
  X,
  User,
  BookOpen,
  Clock,
  Target,
  Camera,
  Lock,
  Mail,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import domains from "../data/domains";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  id: string;
  subjects: string[];
  learningStyle: string;
  availability: string;
  goals: string;
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    onboarding: boolean;
    profilepic?: string;
  };
}

export default function ProfilePage() {
  const { user, token, loading, setToken } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isloading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    learningStyle: "",
    availability: "",
    goals: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    email: "",
  });

  const [nameData, setNameData] = useState({
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!loading && user) fetchProfile();
  }, [user, router]);

  const HandleLogOut = () => {
    setToken("");
    window.localStorage.setItem("token", "");
    window.location.reload()
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        domains.AUTH_HOST + "/api/v1/profile/my_profile",
        {
          headers: {
            Authorization: `${token ? token : localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProfile(data.user);
        setFormData({
          subjects: data.user.subjects || [],
          learningStyle: data.user.learningStyle || "",
          availability: data.user.availability || "",
          goals: data.user.goals || "",
        });
        setNameData({
          firstname: data.user.user.firstname || "",
          lastname: data.user.user.lastname || "",
        });
        setEmailData({
          email: data.user.user.email || "",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append("profilepic", file);

      const response = await fetch(
        `${domains.AUTH_HOST}/api/v1/user/update_profile`,
        {
          method: "POST",
          headers: {
            Authorization: `${token ? token : localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Profile photo updated successfully",
        });
        fetchProfile(); // Refresh profile data
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update profile photo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingPassword(true);
      const response = await fetch(
        `${domains.AUTH_HOST}/api/v1/user/update_password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token ? token : localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      setUpdatingEmail(true);
      const response = await fetch(
        `${domains.AUTH_HOST}/api/v1/user/update_email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token ? token : localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email: emailData.email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Email updated successfully",
        });
        fetchProfile(); // Refresh profile data
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleNameUpdate = async () => {
    try {
      setUpdatingName(true);
      const response = await fetch(
        `${domains.AUTH_HOST}/api/v1/profile/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token ? token : localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            firstname: nameData.firstname,
            lastname: nameData.lastname,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Name updated successfully",
        });
        fetchProfile(); // Refresh profile data
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update name",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive",
      });
    } finally {
      setUpdatingName(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        domains.AUTH_HOST + "/api/v1/profile/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setEditing(false);
        fetchProfile(); // Refresh profile data
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubjectAdd = (subject: string) => {
    if (subject.trim() && !formData.subjects.includes(subject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subject.trim()],
      }));
    }
  };

  const handleSubjectRemove = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }));
  };

  if (isloading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Please complete your onboarding first.
            </p>
            <Button onClick={() => router.push("/onboarding")}>
              Complete Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information and study preferences
              </p>
            </div>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        subjects: profile.subjects || [],
                        learningStyle: profile.learningStyle || "",
                        availability: profile.availability || "",
                        goals: profile.goals || "",
                      });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"}>
                    <LogOut /> Log Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to LogOut?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will log you out from this device
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonVariants({ variant: "destructive" })}
                      onClick={() => HandleLogOut()}
                    >
                      <LogOut /> LogOut
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {profile.user.profilepic ? (
                        <img
                          src={profile.user.profilepic || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 mr-2" />
                      )}
                      {uploadingPhoto ? "Uploading..." : "Change Photo"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Update Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <Label className="text-sm font-medium">Name</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <br />
                      <Input
                        value={nameData.firstname}
                        onChange={(e) =>
                          setNameData((prev) => ({
                            ...prev,
                            firstname: e.target.value,
                          }))
                        }
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <br />
                      <Input
                        value={nameData.lastname}
                        onChange={(e) =>
                          setNameData((prev) => ({
                            ...prev,
                            lastname: e.target.value,
                          }))
                        }
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleNameUpdate}
                    disabled={updatingName}
                    size="sm"
                  >
                    {updatingName ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Update Name
                  </Button>
                </div>

                {/* Email Update Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <Label className="text-sm font-medium">Email</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={emailData.email}
                      onChange={(e) => setEmailData({ email: e.target.value })}
                      placeholder="Email address"
                      type="email"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleEmailUpdate}
                      disabled={updatingEmail}
                      size="sm"
                    >
                      {updatingEmail ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  &nbsp;
                  <Input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  &nbsp;
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  &nbsp;
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                  />
                </div>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={
                    updatingPassword ||
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                >
                  {updatingPassword ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Study Subjects */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {subject}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => handleSubjectRemove(subject)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a subject..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSubjectAdd(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          handleSubjectAdd(input.value);
                          input.value = "";
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                    {profile.subjects.length === 0 && (
                      <p className="text-muted-foreground">
                        No subjects added yet.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Style */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Input
                    value={formData.learningStyle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        learningStyle: e.target.value,
                      }))
                    }
                    placeholder="e.g., Visual, Auditory, Kinesthetic..."
                  />
                ) : (
                  <p className="text-sm">
                    {profile.learningStyle || "Not specified"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                    placeholder="When are you available for study sessions?"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {profile.availability || "Not specified"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Study Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea
                    value={formData.goals}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        goals: e.target.value,
                      }))
                    }
                    placeholder="What are your study goals?"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {profile.goals || "Not specified"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
