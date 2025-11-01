"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useAuth } from "@/context/AuthContext";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function NavBar() {


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const navItems : any = [
    
    // {
    //   name: "Features",
    //   link: "#features",
    // },
    // {
    //   name: "Pricing",
    //   link: "#pricing",
    // },
    // {
    //   name: "Contact",
    //   link: "#contact",
    // },
  ];
  document.body.style =
    pathname != "/register" && pathname != "/login"
      ? "padding-top: 70px"
      : "padding-top: 0px;";

  const ThemeBtn = () => {
    return (
      <NavbarButton
        variant={"secondary"}
        className="cursor-pointer mt-1"
        onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
      >
        {theme == "dark" ? <Sun /> : <Moon />}
      </NavbarButton>
    );
  };

  return (
    <div className="relative w-full">
      {pathname != "/login" && pathname != "/register" && !pathname.includes("/chat") && (
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <NavItems items={[]} />

            {!loading && !user ? (
              <div className="flex items-center gap-4">
                <NavbarButton variant="secondary" as={Link} href="/login">
                  Login
                </NavbarButton>
                <NavbarButton variant="primary" as={Link} href="/register">
                  Get Started
                </NavbarButton>
                <ThemeBtn />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* <NavbarButton variant="secondary" as={Link} href="/login">
              Login
            </NavbarButton> */}
                {pathname != "/dashboard" && (
                  <NavbarButton variant="primary" as={Link} href="/dashboard">
                    Dashboard
                  </NavbarButton>
                )}
                <ThemeBtn />
              </div>
            )}
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <div className="flex justify-between">
                <ThemeBtn />
                <div className="py-2.5">
                  <MobileNavToggle
                    isOpen={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  />
                </div>
              </div>
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item:any, idx:any) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                {!loading && !user ? (
                  <div className="flex items-center gap-4">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                      as={Link}
                      href="/login"
                    >
                      Login
                    </NavbarButton>
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                      as={Link}
                      href="/register"
                    >
                      Get Started
                    </NavbarButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* <NavbarButton variant="secondary" as={Link} href="/login">
              Login
            </NavbarButton> */}
                    {pathname != "/dashboard" && (
                      <NavbarButton
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full"
                        as={Link}
                        href="/dashboard"
                        variant="primary"
                      >
                        Dashboard
                      </NavbarButton>
                    )}
                  </div>
                )}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      )}

      {/* Navbar */}
    </div>
  );
}
