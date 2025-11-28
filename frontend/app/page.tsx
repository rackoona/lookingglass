// app/page.tsx (or wherever)
import AppHeader from "@/components/app-header";
import LookingGlass from "@/components/looking-glass";
import NetworkDetails from "@/components/network-info";
import SpeedTest from "@/components/speed-test";

export default function Home() {
  return (
    <>
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <AppHeader />

      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
          <NetworkDetails />
          <LookingGlass />
          <SpeedTest />
        </div>

        <footer
          className="mt-12 sm:mt-16 mb-8 sm:mb-12 border-t border-border pt-6 sm:pt-8 px-4"
          role="contentinfo"
        >
          <p className="text-center text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://rackoona.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/80 hover:text-foreground transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
            >
              Rackoona
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
