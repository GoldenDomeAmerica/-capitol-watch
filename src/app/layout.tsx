import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { headers } from "next/headers";
import { connection } from "next/server";
import { Footer, Header } from "@/components/chrome";
import { SponsorBar } from "@/components/sponsor-bar";
import { getActiveSponsor, recordPageview } from "@/lib/queries";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} · Georgia bills in plain English`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const headerList = await headers();
  const pathName = headerList.get("x-acw-path");
  if (pathName && !pathName.startsWith("/api") && !pathName.startsWith("/go/")) {
    await recordPageview(pathName);
  }
  let sponsor: Awaited<ReturnType<typeof getActiveSponsor>> = null;
  try {
    sponsor = await getActiveSponsor();
  } catch {
    sponsor = null;
  }

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SponsorBar
          sponsor={
            sponsor
              ? {
                  id: sponsor.id,
                  slug: sponsor.slug,
                  name: sponsor.name,
                  tagline: sponsor.tagline,
                  paidForBy: sponsor.paidForBy,
                }
              : null
          }
        />
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
