import type { Metadata } from "next";

const title = "$oh — Orb Harvest";
const description =
  "Practice Mudae's $oh (Orb Harvest): collect random spheres across five clicks and master blue/teal reveal mechanics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/oh" },
  openGraph: {
    title,
    description,
    url: "/oh",
    type: "website",
  },
  twitter: { title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
