"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Map, Globe2, Info, Loader2 } from "lucide-react";
import { useNetworkInfo } from "@/hooks/use-network-info";

export function NetworkDetails() {
  const { info, loading, error } = useNetworkInfo();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openUrl = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  if (loading) {
    return (
      <Card className="w-full border border-border bg-card shadow-md h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border border-border bg-card shadow-md h-[400px] flex items-center justify-center">
        <div className="text-destructive font-medium">{error}</div>
      </Card>
    );
  }

  return (
    <section aria-labelledby="network-title">
      <Card className="w-full border border-border bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
              <Globe2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <CardTitle
                id="network-title"
                className="text-lg font-semibold tracking-tight"
              >
                Network
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Endpoint and IP details for this test location.
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-border" />

        <CardContent className="pt-6 space-y-6">
          {/* Info row – matches SpeedTest pattern */}
          <div
            className="flex items-center gap-3 rounded-lg bg-primary/5 p-4 border border-primary/20"
            role="status"
          >
            <div className="shrink-0 rounded-lg bg-primary/10 p-1.5">
              <Info className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              These values describe the facility and IP endpoints used when you
              run diagnostics from this location.
            </p>
          </div>

          {/* Top Row: Location and Facility */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Location */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-foreground"
              >
                Location
              </Label>
              <div className="flex shadow-sm">
                <Input
                  id="location"
                  value={info?.location || "Unknown"}
                  readOnly
                  className="rounded-r-none bg-muted/40 text-sm border-r-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <Button
                  variant="outline"
                  aria-label="View location on map"
                  onClick={() => info?.map_url && openUrl(info.map_url)}
                  disabled={!info?.map_url}
                  className="rounded-none bg-background px-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Map className="mr-2 h-4 w-4" aria-hidden="true" />
                  Map
                </Button>
              </div>
            </div>

            {/* Facility */}
            <div className="space-y-2">
              <Label
                htmlFor="facility"
                className="text-sm font-medium text-foreground"
              >
                Facility
              </Label>
              <div className="flex shadow-sm">
                <Input
                  id="facility"
                  value={info?.facility || "Unknown"}
                  readOnly
                  className="bg-muted/40 text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: IPs */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* IPv4 */}
            <div className="space-y-2">
              <Label
                htmlFor="ipv4"
                className="text-sm font-medium text-foreground"
              >
                Test IPv4
              </Label>
              <div className="flex shadow-sm">
                <Input
                  id="ipv4"
                  value={info?.looking_glass_ipv4 || "N/A"}
                  readOnly
                  aria-label="Test IPv4 address"
                  className="rounded-r-none bg-muted/40 font-mono text-xs border-r-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copy IPv4 address"
                  onClick={() =>
                    info?.looking_glass_ipv4 &&
                    copyToClipboard(info.looking_glass_ipv4)
                  }
                  className="rounded-l-none bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>

            {/* IPv6 */}
            <div className="space-y-2">
              <Label
                htmlFor="ipv6"
                className="text-sm font-medium text-foreground"
              >
                Test IPv6
              </Label>
              <div className="flex shadow-sm">
                <Input
                  id="ipv6"
                  value={info?.looking_glass_ipv6 || "N/A"}
                  readOnly
                  aria-label="Test IPv6 address"
                  className="rounded-r-none bg-muted/40 font-mono text-xs border-r-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copy IPv6 address"
                  onClick={() =>
                    info?.looking_glass_ipv6 &&
                    copyToClipboard(info.looking_glass_ipv6)
                  }
                  className="rounded-l-none bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>

            {/* Your IP */}
            <div className="space-y-2">
              <Label
                htmlFor="your-ip"
                className="text-sm font-medium text-foreground"
              >
                Your IP
              </Label>
              <div className="flex shadow-sm">
                <Input
                  id="your-ip"
                  value={info?.your_ip || "N/A"}
                  readOnly
                  aria-label="Your IP address"
                  className="rounded-r-none bg-muted/40 font-mono text-xs border-r-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copy your IP address"
                  onClick={() => info?.your_ip && copyToClipboard(info.your_ip)}
                  className="rounded-l-none bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default NetworkDetails;
