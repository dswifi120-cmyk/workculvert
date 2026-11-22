import type { Metadata } from "next";
import { HelpPageContent } from "@/components/static-pages-client";

export const metadata: Metadata = {
  title: "Help & Support",
};

export default function HelpPage() {
  return <HelpPageContent />;
}
