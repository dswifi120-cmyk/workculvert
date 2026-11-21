import type { Metadata } from "next";
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
import { getServerLocale } from "@/lib/server-locale";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://workculvert.com"),
  title: {
    default: "WorkCulvert — বগুড়ার কর্মী ও কাজের মার্কেটপ্লেস",
    template: "%s · WorkCulvert",
  },
  description:
    "ইলেকট্রিশিয়ান, প্লাম্বার, ক্লিনার, কেয়ারগিভার ও পরিবহন — বগুড়ার যাচাইকৃত দক্ষ কর্মীদের সাথে মিনিটেই সংযোগ করুন, অথবা আপনার পছন্দের কাজ খুঁজে নিন।",
  openGraph: {
    title: "WorkCulvert — বগুড়ার কর্মী ও কাজের মার্কেটপ্লেস",
    description:
      "কাজ খুঁজছেন? নাকি কর্মী খুঁজছেন? বগুড়ার যাচাইকৃত দক্ষ কর্মী ও নিয়োগদাতাদের এক প্ল্যাটফর্মে।",
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
          <div className="noise" aria-hidden="true" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
