"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Location {
  id: string;
  name: string;
  url: string;
}

interface LocationContextType {
  locations: Location[];
  currentLocation: Location | null;
  setCurrentLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Default location from standard env var
    const defaultUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const defaultLocation: Location = {
      id: "default",
      name: "Default Location",
      url: defaultUrl,
    };

    let parsedLocations: Location[] = [];
    try {
      const locationsEnv = process.env.NEXT_PUBLIC_LOCATIONS;
      if (locationsEnv) {
        parsedLocations = JSON.parse(locationsEnv);
      }
    } catch (e) {
      console.error("Failed to parse NEXT_PUBLIC_LOCATIONS", e);
    }

    if (parsedLocations.length > 0) {
      setLocations(parsedLocations);
      setCurrentLocation(parsedLocations[0]);
    } else {
      setLocations([defaultLocation]);
      setCurrentLocation(defaultLocation);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ locations, currentLocation, setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

