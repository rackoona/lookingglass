"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Terminal, Info, XCircle } from "lucide-react";
import { useLookingGlass, Method } from "@/hooks/use-looking-glass";

export function LookingGlass() {
  const { target, setTarget, method, setMethod, output, isRunning, execute } =
    useLookingGlass();
  const outputRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom of output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <section aria-labelledby="looking-glass-title">
      <Card className="w-full border border-border bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
              <Terminal className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <CardTitle
                id="looking-glass-title"
                className="text-lg font-semibold tracking-tight"
              >
                Looking glass
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Run ping and trace commands from this test location.
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-border" />

        <CardContent className="pt-6 space-y-6">
          {/* Info row – same pattern as other cards */}
          <div
            className="flex items-center gap-3 rounded-lg bg-primary/5 p-4 border border-primary/20"
            role="status"
          >
            <div className="shrink-0 rounded-lg bg-primary/10 p-1.5">
              <Info className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Choose a target and method, then execute to see live network
              output from this facility.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="lg-target"
                className="text-sm font-medium text-foreground"
              >
                Target
              </Label>
              <Input
                id="lg-target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. google.com or 1.1.1.1"
                disabled={isRunning}
                className="h-10 text-sm bg-muted/40 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 shadow-sm"
              />
            </div>

            <div className="w-full space-y-2 md:w-44">
              <Label
                htmlFor="lg-method"
                className="text-sm font-medium text-foreground"
              >
                Method
              </Label>
              <Select
                value={method}
                onValueChange={(value: Method) => setMethod(value)}
                disabled={isRunning}
              >
                <SelectTrigger
                  id="lg-method"
                  className="h-10 text-sm bg-muted/40 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 shadow-sm"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="ping">ping</SelectItem>
                  <SelectItem value="ping6">ping6</SelectItem>
                  <SelectItem value="traceroute">traceroute</SelectItem>
                  <SelectItem value="traceroute6">traceroute6</SelectItem>
                  <SelectItem value="mtr">mtr</SelectItem>
                  <SelectItem value="mtr6">mtr6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={execute}
              variant={isRunning ? "destructive" : "default"}
              aria-label={
                isRunning
                  ? "Cancel execution"
                  : "Execute network diagnostic command"
              }
              className="h-10 px-6 text-sm font-medium md:self-end shadow-sm hover:shadow-md transition-shadow min-w-[100px]"
            >
              {isRunning ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                "Execute"
              )}
            </Button>
          </div>

          {/* Output panel */}
          <div className="rounded-lg border border-border bg-muted/20 shadow-inner">
            <pre
              ref={outputRef}
              className="max-h-72 overflow-auto whitespace-pre-wrap break-all px-5 py-4 text-xs font-mono leading-relaxed text-foreground/90 min-h-[100px]"
              aria-label="Command output"
              role="log"
              aria-live="polite"
            >
              {output || "Waiting for command..."}
              {isRunning && (
                <span className="animate-pulse inline-block ml-1">_</span>
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default LookingGlass;
