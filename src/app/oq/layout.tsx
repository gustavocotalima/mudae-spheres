import type { Metadata } from "next";

const title = "$oq — Orb Quest";
const description =
  "Practice Mudae's $oq (Orb Quest): a minesweeper variant where finding 3 purple spheres transforms the 4th into red.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/oq" },
  openGraph: {
    title,
    description,
    url: "/oq",
    type: "website",
  },
  twitter: { title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
