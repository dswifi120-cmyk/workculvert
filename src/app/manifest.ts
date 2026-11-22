import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WorkCulvert™ — বাংলাদেশের কর্মী ও কাজের মার্কেটপ্লেস",
    short_name: "WorkCulvert",
    description:
      "সারা বাংলাদেশে আপনার আশেপাশের যাচাইকৃত কর্মী, পরিবহন, কেয়ারগিভার ও পেট কেয়ারটেকার মার্কেটপ্লেস — Post work or join as a worker.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8f6ef",
    theme_color: "#0c5b4e",
    categories: ["business", "lifestyle", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Post Any Work",
        short_name: "Any Work",
        url: "/work/any-work#post-form",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Transportation & Parcel",
        short_name: "Transport",
        url: "/work/transportation#post-form",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Pet Caretaker",
        short_name: "Pet Care",
        url: "/work/pet-caretaker#post-form",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
