import type { Metadata } from "next";
import { Jost, Literata } from "next/font/google";
import Footer from "./components/footer";
import { PageTransitionProvider } from "./components/page-transition";
import { WineSelectionProvider } from "./lib/wine-selection";
import "./globals.css";
import "./page-transitions.css";
import "./panel-animations.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sole di Vino",
  description: "Italská vína s duší slunce.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${literata.variable} flex min-h-screen flex-col overflow-x-clip antialiased`}
      >
        <WineSelectionProvider>
          <PageTransitionProvider>
            <div className="flex min-h-screen flex-1 flex-col overflow-x-clip">
              {children}
              <Footer />
            </div>
          </PageTransitionProvider>
        </WineSelectionProvider>
      </body>
    </html>
  );
}
