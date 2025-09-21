"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import domains from "@/app/data/domains";

type User = boolean | object | any;

const AuthContext = createContext<User | any>({
  user: false,
  setUser: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setToken] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ["/login", "/register", "/"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token: any = localStorage.getItem("token");
        setToken(token);
        const response = await axios.get(
          `${domains.AUTH_HOST}/api/v1/user/me`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.data?.success || !response.data?.user) {
          setUser(false);
        } else if (response.data.success && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user && !publicPaths.includes(pathname)) {
        router.replace("/login");
      }
      if(!loading && user && !user.onboarding){
          router.push("/onboarding")
      }
      if (user && publicPaths.includes(pathname)) {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, authToken, setToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
