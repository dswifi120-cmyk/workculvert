import type { Metadata } from "next";
import { HowWeWorkContent } from "@/components/static-pages-client";

export const metadata: Metadata = {
  title: "How We Work",
};

export default function HowWeWorkPage() {
  return <HowWeWorkContent />;
}
