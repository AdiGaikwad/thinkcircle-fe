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
import Link from "next/link";
import { useState } from "react";

export function NavBar() {
  const navItems = [
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          {!loading && !user ? (
            <div className="flex items-center gap-4">
              <NavbarButton variant="secondary" as={Link} href="/login">
                Login
              </NavbarButton>
              <NavbarButton variant="primary" as={Link} href="/register">
                Get Started
              </NavbarButton>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* <NavbarButton variant="secondary" as={Link} href="/login">
              Login
            </NavbarButton> */}
              <NavbarButton variant="primary" as={Link} href="/register">
                Dashboard
              </NavbarButton>
            </div>
          )}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
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
                    {" "}
                    Get Started
                  </NavbarButton>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* <NavbarButton variant="secondary" as={Link} href="/login">
              Login
            </NavbarButton> */}
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full"
                    as={Link}
                    href="/dashboard"
                    variant="primary"
                    as={Link}
                    href="/register"
                  >
                    Dashboard
                  </NavbarButton>
                </div>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
