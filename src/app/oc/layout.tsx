import type { Metadata } from "next";

const title = "$oc — Orb Chest";
const description =
  "Practice Mudae's $oc (Orb Chest): use the color clues to deduce the red sphere's position on a 5x5 grid.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/oc" },
  openGraph: {
    title,
    description,
    url: "/oc",
    type: "website",
  },
  twitter: { title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
