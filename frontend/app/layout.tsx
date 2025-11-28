import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationProvider } from "@/components/location-provider";
const segoeUI = {
  variable: '--font-sans',
  style: { fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif' },
};

const monoFont = {
  variable: '--font-mono',
  style: {
    fontFamily: '"Cascadia Code", "Consolas", "Courier New", monospace',
  },
};

export const metadata: Metadata = {
  title: "Looking Glass",
  description: "by Rackoona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${segoeUI.variable} ${monoFont.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LocationProvider>{children}</LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
