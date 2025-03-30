"use client";

import { ThemeProvider } from "~~/components/ThemeProvider";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem>
      <ScaffoldEthAppWithProviders>
        <div className="relative min-h-screen w-full overflow-x-hidden">
          {/* Global background with proper stacking */}
          <div className="fixed inset-0 bg-black" style={{ zIndex: -3 }} />
          
          {/* Noise texture with proper opacity */}
          <div 
            className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.15]" 
            style={{ zIndex: -2, mixBlendMode: 'overlay' }} 
          />
          
          {/* Gradient overlay with better visibility */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-[#9333EA]/20 via-black to-black"
            style={{ zIndex: -1 }}
          />
          
          {/* Main content */}
          <main className="relative z-0">
            {children}
          </main>
        </div>
      </ScaffoldEthAppWithProviders>
    </ThemeProvider>
  );
} 