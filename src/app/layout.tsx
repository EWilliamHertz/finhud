import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "FIN-HUD | Command Center",
  description: "Hyper-modern financial monitoring system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <div className="fixed inset-0 bg-hud-grid pointer-events-none opacity-20" />
        <div className="fixed inset-0 scanline animate-scanline" />
        
        <main className="relative min-h-screen flex flex-col">
          <Navigation />
          <div className="flex-1 container mx-auto px-4 py-8 md:px-8">
            {children}
          </div>
        </main>
        
        {/* Ambient HUD Elements */}
        <div className="fixed top-0 left-0 w-full h-1 bg-neon-cyan/10" />
        <div className="fixed bottom-0 left-0 w-full h-1 bg-neon-cyan/10" />
        <div className="fixed top-0 left-0 h-full w-1 bg-neon-cyan/10" />
        <div className="fixed top-0 right-0 h-full w-1 bg-neon-cyan/10" />
      </body>
    </html>
  );
}
