"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Gauge, Info, Download } from "lucide-react";
import { useLocation } from "@/components/location-provider";

type SpeedTestSize = "100m" | "1g" | "10g";

export function SpeedTest() {
  const { currentLocation } = useLocation();
  const [size, setSize] = useState<SpeedTestSize>("100m");

  const handleStartTest = () => {
    const baseUrl = currentLocation?.url || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    let endpoint = "";

    switch (size) {
      case "100m":
        endpoint = "/speedtest/100M";
        break;
      case "1g":
        endpoint = "/speedtest/1G";
        break;
      case "10g":
        endpoint = "/speedtest/10G";
        break;
    }

    if (endpoint) {
      window.location.href = `${baseUrl}${endpoint}`;
    }
  };

  return (
    <section aria-labelledby="speed-test-title">
      <Card className="w-full border border-border bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
              <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <CardTitle
                id="speed-test-title"
                className="text-lg font-semibold tracking-tight"
              >
                Speed test
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose a file size to benchmark your connection.
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-border" />

        <CardContent className="pt-6 space-y-6">
          <div
            className="flex items-center gap-3 rounded-lg bg-primary/5 p-4 border border-primary/20"
            role="status"
          >
            <div className="shrink-0 rounded-lg bg-primary/10 p-1.5">
              <Info className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Larger files give a more stable measurement, but take longer to
              finish.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label
                htmlFor="speed-test-size"
                className="text-sm font-medium text-foreground"
              >
                Test file size
              </Label>
              <ToggleGroup
                id="speed-test-size"
                type="single"
                value={size}
                onValueChange={(val) => val && setSize(val as SpeedTestSize)}
                variant="outline"
                className="grid grid-cols-3 gap-3"
              >
                <ToggleGroupItem
                  value="100m"
                  aria-label="100 megabytes"
                  className="h-11 justify-center text-sm font-medium shadow-sm hover:shadow-md transition-all data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/20 data-[state=on]:shadow-md"
                >
                  100&nbsp;MB
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="1g"
                  aria-label="1 gigabyte"
                  className="h-11 justify-center text-sm font-medium shadow-sm hover:shadow-md transition-all data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/20 data-[state=on]:shadow-md"
                >
                  1&nbsp;GB
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="10g"
                  aria-label="10 gigabytes"
                  className="h-11 justify-center text-sm font-medium shadow-sm hover:shadow-md transition-all data-[state=on]:bg-primary/10 data-[state=on]:border-primary data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/20 data-[state=on]:shadow-md"
                >
                  10&nbsp;GB
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-sm text-muted-foreground">
                Start with{" "}
                <span className="font-medium text-foreground">100&nbsp;MB</span>
                , then increase if the link is stable.
              </p>
            </div>

            <Button className="w-full" onClick={handleStartTest}>
              <Download className="mr-2 h-4 w-4" />
              Start Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default SpeedTest;
