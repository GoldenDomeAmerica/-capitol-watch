import type { MetadataRoute } from "next";
import { listBillPaths, listLegislatorPaths } from "@/lib/queries";
import { TOPICS } from "@/lib/topics";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const staticRoutes = ["", "/georgia/bills", "/georgia/legislators", "/georgia/scorecards", "/submit", "/sponsor", "/about", "/privacy"].map(
    (path) => ({ url: `${base}${path || "/"}`, lastModified: now }),
  );
  const topics = TOPICS.map((topic) => ({
    url: `${base}/georgia/topics/${topic.slug}`,
    lastModified: now,
  }));
  try {
    const [bills, people] = await Promise.all([listBillPaths(), listLegislatorPaths()]);
    return [
      ...staticRoutes,
      ...topics,
      ...bills.map((bill) => ({
        url: `${base}/georgia/bills/${bill.slug}`,
        lastModified: bill.updatedAt,
      })),
      ...people.map((person) => ({
        url: `${base}/georgia/legislators/${person.slug}`,
        lastModified: now,
      })),
    ];
  } catch {
    return [...staticRoutes, ...topics];
  }
}
