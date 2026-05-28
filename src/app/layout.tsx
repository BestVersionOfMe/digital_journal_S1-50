import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { JournalShell } from "./JournalShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/** Display serif for page / section titles — pairs with Inter body (calm journal, stays in blue‑grey world). */
const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Best Version of Me",
  description: "Digital journal prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${lora.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(31,95,174,0.16),transparent_34%),linear-gradient(180deg,#F7FBFF_0%,#EAF4FF_42%,#F8FBFF_100%)] font-sans text-bvm-fg antialiased">
        <JournalShell>{children}</JournalShell>
      </body>
    </html>
  );
}
