import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ThemeSelector = () => {
  const [theme, setTheme] = useState("theme-cobalt-apricot");

  const setBodyClass = (newTheme: string) => {
    const body = document.body;
    // Remove any existing theme-* classes
    body.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        body.classList.remove(cls);
      }
    });
    // Add the new theme class
    body.classList.add(newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("designTheme");
    if (storedTheme) {
      setTheme(storedTheme);
      setBodyClass(storedTheme);
    } else {
      setTheme("theme-aqua-clementine");
      setBodyClass("theme-aqua-clementine");
    }
  }, []);

  const handleChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("designTheme", newTheme);
    setBodyClass(newTheme);
  };

  return (
    <div className="space-y-2 cursor-pointer">
      <Label htmlFor="group-select">Themes </Label>
      <Select value={theme} onValueChange={(value) => handleChange(value)}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Choose a group to manage requests" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            className="cursor-pointer"
            value={"theme-aqua-clementine"}
          >
            <span className="bg-[#0ea5a5] w-3 h-3 rounded-full"></span> Aqua
            Clementine
          </SelectItem>
          <SelectItem className="cursor-pointer" value={"theme-teal-coral"}>
            <span className="bg-[#0f766e] w-3 h-3 rounded-full"></span> Teal
            Coral
          </SelectItem>
          <SelectItem className="cursor-pointer" value={"theme-cobalt-apricot"}>
            <span className="bg-[#2563eb] w-3 h-3 rounded-full"></span> Cobalt
            Apricot
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelector;
