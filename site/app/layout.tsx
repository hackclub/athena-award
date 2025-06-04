import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import AuthWrapper from "@/components/context/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Athena Award",
  description:
    "Hack Club's interactive initiative to support girls learning to code",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`phantom-sans`}>
        <PlausibleProvider domain="award.athena.hackclub.com">
          <SessionProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </SessionProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
