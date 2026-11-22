import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/hind-siliguri/300.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
import "@fontsource/tiro-bangla/400.css";
import "@fontsource/tiro-bangla/400-italic.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import { LanguageProvider } from "@/components/language-provider";
import { PwaProvider } from "@/components/pwa-provider";
import { getServerLocale } from "@/lib/server-locale";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0c5b4e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://workculvert.com"),
  title: {
    default: "WorkCulvert™ — আপনার এলাকার কর্মী ও কাজের মার্কেটপ্লেস",
    template: "%s · WorkCulvert™",
  },
  description:
    "সারা বাংলাদেশে আপনার আশেপাশের এলাকায় যেকোনো বৈধ কাজ পোস্ট করুন অথবা ইলেকট্রিশিয়ান, প্লাম্বার, ক্লিনার, কেয়ারগিভার, পেট কেয়ারটেকার ও পরিবহন কর্মী হিসেবে যুক্ত হোন।",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WorkCulvert",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "WorkCulvert™ — বাংলাদেশের কর্মী ও কাজের মার্কেটপ্লেস",
    description:
      "কাজ খুঁজছেন? নাকি কর্মী খুঁজছেন? আপনার লোকেশন অনুযায়ী যাচাইকৃত দক্ষ কর্মী ও ফ্রেশারদের এক প্ল্যাটফর্মে।",
    images: ["/images/craftsman.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialLocale = await getServerLocale();

  return (
    <html lang={initialLocale}>
      <body className="bg-paper text-ink antialiased">
        <LanguageProvider initialLocale={initialLocale}>
          <PwaProvider>
            <div className="noise" aria-hidden="true" />
            {children}
          </PwaProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
