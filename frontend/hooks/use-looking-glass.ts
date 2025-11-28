import { useState, useRef, useCallback } from "react";
import { lookingGlass } from "@/lib/api";
import { useLocation } from "@/components/location-provider";

export type Method = "ping" | "ping6" | "traceroute" | "traceroute6" | "mtr" | "mtr6";

export function useLookingGlass() {
  const { currentLocation } = useLocation();
  const [target, setTarget] = useState("google.com");
  const [method, setMethod] = useState<Method>("ping");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    if (isRunning) {
      // Cancel existing request
      abortControllerRef.current?.abort();
      setIsRunning(false);
      setOutput((prev) => prev + "\n\n--- Cancelled by user ---");
      return;
    }

    setOutput("");
    setIsRunning(true);
    abortControllerRef.current = new AbortController();

    try {
      if (!currentLocation) {
        throw new Error("No location selected");
      }
      await lookingGlass[method](target, {
        signal: abortControllerRef.current.signal,
        onData: (chunk) => {
          setOutput((prev) => prev + chunk);
        },
        onError: (error) => {
          setOutput((prev) => prev + `\n\nError: ${error.message}`);
          setIsRunning(false);
        },
        onComplete: () => {
          setIsRunning(false);
        },
      }, currentLocation.url);
    } catch (error) {
      console.error("Execution failed:", error);
      setIsRunning(false);
    }
  }, [target, method, isRunning, currentLocation]);

  return {
    target,
    setTarget,
    method,
    setMethod,
    output,
    isRunning,
    execute,
  };
}

