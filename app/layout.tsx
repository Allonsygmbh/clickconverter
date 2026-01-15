import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClickConverter - Dynamische Landingpages f\u00fcr Google Ads",
  description: "Personalisierte Landingpages basierend auf Suchbegriffen. Steigere deine Conversion-Rate automatisch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
