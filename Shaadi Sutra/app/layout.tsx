import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WeddingProvider } from "@/app/context/WeddingContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/shared/AuthGuard";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Shaadi Sutra - Wedding Planner",
  description: "A premium Indian wedding planner and tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased flex flex-col md:flex-row relative",
          cormorant.variable,
          lato.variable
        )}
      >
        <div className="mandala-pattern" />
        <WeddingProvider>
          <AuthProvider>
            <AuthGuard>
              <Navbar />
              <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen flex flex-col">
                {children}
                <div className="mt-8">
                  <Footer />
                </div>
              </main>
            </AuthGuard>
          </AuthProvider>
        </WeddingProvider>
      </body>
    </html>
  );
}
