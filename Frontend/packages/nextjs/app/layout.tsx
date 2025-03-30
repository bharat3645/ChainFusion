import "@rainbow-me/rainbowkit/styles.css";
import { GeistSans } from "geist/font/sans";
import { Header } from "~~/components/Header";
import ClientLayout from "./client-layout";
import "~~/styles/globals.css";

export const metadata = {
  title: "ChainFusion - Web2 to Web3",
  description: "Revolutionize your Web2 applications with AI-powered Web3 integration. Built at ETH India."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen text-white antialiased selection:bg-purple-500/20 selection:text-purple-400">
        <ClientLayout>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 pt-16">
              {children}
            </div>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
