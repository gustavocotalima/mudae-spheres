import type { Metadata } from "next";

const title = "$ot — Orb Trace";
const description =
  "Practice Mudae's $ot (Orb Trace): spot same-color sequences in rows and columns while spending only 4 blue clicks.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ot" },
  openGraph: {
    title,
    description,
    url: "/ot",
    type: "website",
  },
  twitter: { title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
