import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RVR COLORIDO 2K26 — National Cultural & Sports Fest",
    template: "%s | COLORIDO 2K26",
  },
  description:
    "RVR COLORIDO 2K26 — National Cultural & Sports Fest. Where Talent Meets Competition. Hosted by R.V.R. & J.C. College of Engineering (Autonomous), Guntur. Open to eligible students from RVR & J.C. College and participating colleges in cultural and sports events.",
  keywords: [
    "COLORIDO",
    "RVR",
    "college fest",
    "cultural fest",
    "sports fest",
    "2026",
    "national fest",
    "RVR & JC College",
  ],
  openGraph: {
    title: "RVR COLORIDO 2K26 — National Cultural & Sports Fest",
    description:
      "Where Talent Meets Competition. Join the biggest national-level college cultural and sports fest.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
