import type { MetadataRoute } from "next";
import { listBillPaths, listLegislatorPaths } from "@/lib/queries";
import { stateById, STATES } from "@/lib/states";
import { TOPICS } from "@/lib/topics";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const staticRoutes = ["", "/hot-topics", "/submit", "/sponsor", "/about", "/privacy", "/contact"].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
  }));
  const stateRoutes = STATES.flatMap((state) => {
    const paths = [`/${state.slug}`, `/${state.slug}/bills`, `/${state.slug}/legislators`];
    if (state.scorecards) paths.push(`/${state.slug}/scorecards`);
    if (state.vetoes) paths.push(`/${state.slug}/vetoes`);
    return [
      ...paths.map((path) => ({ url: `${base}${path}`, lastModified: now })),
      ...TOPICS.map((topic) => ({ url: `${base}/${state.slug}/topics/${topic.slug}`, lastModified: now })),
    ];
  });
  try {
    const [bills, people] = await Promise.all([listBillPaths(), listLegislatorPaths()]);
    return [
      ...staticRoutes,
      ...stateRoutes,
      ...bills.flatMap((bill) => {
        const state = stateById(bill.stateId);
        if (!state) return [];
        return [{ url: `${base}/${state.slug}/bills/${bill.slug}`, lastModified: bill.updatedAt }];
      }),
      ...people.flatMap((person) => {
        const state = stateById(person.stateId);
        if (!state) return [];
        return [{ url: `${base}/${state.slug}/legislators/${person.slug}`, lastModified: now }];
      }),
    ];
  } catch {
    return [...staticRoutes, ...stateRoutes];
  }
}
