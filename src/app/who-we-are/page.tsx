import type { Metadata } from "next";
import { WhoWeAreContent } from "@/components/static-pages-client";

export const metadata: Metadata = {
  title: "Who We Are · License & Contracts",
};

export default function WhoWeArePage() {
  return <WhoWeAreContent />;
}
