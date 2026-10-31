import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hind_Siliguri, Tiro_Bangla, Space_Grotesk } from "next/font/google";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

const tiro = Tiro_Bangla({
  subsets: ["bengali", "latin"],
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://workculvert.com"),
  title: {
    default: "WorkCulvert — বগুড়ার কর্মী ও কাজের মার্কেটপ্লেস",
    template: "%s · WorkCulvert",
  },
  description:
    "ইলেকট্রিশিয়ান, প্লাম্বার, ক্লিনার, কেয়ারগিভার — বগুড়ার যাচাইকৃত দক্ষ কর্মীদের সাথে মিনিটেই সংযোগ করুন, অথবা আপনার পছন্দের কাজ খুঁজে নিন।",
  openGraph: {
    title: "WorkCulvert — বগুড়ার কর্মী ও কাজের মার্কেটপ্লেস",
    description:
      "কাজ খুঁজছেন? নাকি কর্মী খুঁজছেন? বগুড়ার যাচাইকৃত দক্ষ কর্মী ও নিয়োগদাতাদের এক প্ল্যাটফর্মে।",
    images: ["/images/craftsman.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body
        className={`${hind.variable} ${tiro.variable} ${grotesk.variable} bg-paper text-ink antialiased`}
      >
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
