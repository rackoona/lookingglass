"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/components/location-provider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function AppHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { locations, currentLocation, setCurrentLocation } = useLocation();

  // Handle mounting safely with useEffect
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-lg"
          aria-label="Rackoona homepage"
        >
          <div className="relative h-6 sm:h-7 w-32 sm:w-36 transition-transform group-hover:scale-105">
            <Image
              src="https://rackoona.com/_next/image?url=%2Frackoona_logo.png&w=384&q=75"
              alt="Rackoona"
              fill
              className={`object-contain transition-all duration-300 ${
                mounted && resolvedTheme === "dark" ? "brightness-0 invert" : ""
              }`}
              sizes="(max-width: 640px) 128px, 144px"
              priority
            />
          </div>
        </Link>

        <nav
          className="flex items-center gap-2 sm:gap-4"
          aria-label="Main navigation"
        >
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "light" ? "dark" : "light")
            }
            aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-muted/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Sun
              className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              aria-hidden="true"
            />
            <Moon
              className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              aria-hidden="true"
            />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Location selector */}
          <div className="w-44 sm:w-56">
            <Select
              value={currentLocation?.id || ""}
              onValueChange={(value) => {
                const location = locations.find((l) => l.id === value);
                if (location) setCurrentLocation(location);
              }}
            >
              <SelectTrigger
                className="h-9 sm:h-10 justify-between rounded-lg bg-muted/50 border-border text-xs sm:text-sm font-medium hover:bg-muted/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Select test location"
              >
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
