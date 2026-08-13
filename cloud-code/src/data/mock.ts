import type {
  DailyRevenuePoint,
  IndexedPageReason,
  LinkingSite,
  RevenueStream,
  SitemapEntry,
} from "../types";

export const revenueStreams: RevenueStream[] = [
  { id: "ads", name: "Programmatic Ads", monthly: 18420, growth: 12.4, color: "#00f3ff" },
  { id: "affiliate", name: "Affiliate Commissions", monthly: 9210, growth: 6.1, color: "#9d00ff" },
  { id: "subs", name: "Subscriptions", monthly: 24875, growth: 21.8, color: "#00ff88" },
  { id: "sponsor", name: "Sponsorships", monthly: 5300, growth: -3.2, color: "#ffb020" },
  { id: "api", name: "API Licensing", monthly: 12640, growth: 34.5, color: "#ff3d81" },
];

export const dailyRevenue: DailyRevenuePoint[] = [
  { date: "Mon", revenue: 2380, projected: 2200 },
  { date: "Tue", revenue: 2510, projected: 2280 },
  { date: "Wed", revenue: 2290, projected: 2360 },
  { date: "Thu", revenue: 2870, projected: 2440 },
  { date: "Fri", revenue: 3120, projected: 2520 },
  { date: "Sat", revenue: 2650, projected: 2600 },
  { date: "Sun", revenue: 2990, projected: 2680 },
];

export const indexingSummary = {
  indexed: 4218,
  notIndexed: 612,
};

export const indexingReasons: IndexedPageReason[] = [
  { reason: "Crawled - currently not indexed", count: 248, severity: "warning" },
  { reason: "Discovered - currently not indexed", count: 165, severity: "info" },
  { reason: "Duplicate without user-selected canonical", count: 92, severity: "warning" },
  { reason: "Excluded by noindex tag", count: 74, severity: "info" },
  { reason: "Server error (5xx)", count: 21, severity: "error" },
  { reason: "Redirect error", count: 12, severity: "error" },
];

export const sitemaps: SitemapEntry[] = [
  { id: "sm-1", url: "/sitemap.xml", status: "success", discovered: 4830, lastSubmitted: "2026-08-10", errors: 0 },
  { id: "sm-2", url: "/sitemap-blog.xml", status: "success", discovered: 612, lastSubmitted: "2026-08-10", errors: 0 },
  { id: "sm-3", url: "/sitemap-products.xml", status: "pending", discovered: 0, lastSubmitted: "2026-08-12", errors: 0 },
  { id: "sm-4", url: "/sitemap-legacy.xml", status: "error", discovered: 118, lastSubmitted: "2026-07-29", errors: 6 },
];

export const linkStats = {
  internalLinks: 18420,
  externalLinks: 3210,
};

export const topLinkingSites: LinkingSite[] = [
  { id: "ls-1", domain: "techradar.com", linksFound: 412, targetPages: 38 },
  { id: "ls-2", domain: "producthunt.com", linksFound: 287, targetPages: 21 },
  { id: "ls-3", domain: "news.ycombinator.com", linksFound: 264, targetPages: 14 },
  { id: "ls-4", domain: "reddit.com", linksFound: 198, targetPages: 26 },
  { id: "ls-5", domain: "medium.com", linksFound: 143, targetPages: 19 },
];

export const linkDistribution = [
  { name: "Homepage", links: 940 },
  { name: "Blog Posts", links: 1620 },
  { name: "Product Pages", links: 780 },
  { name: "Docs", links: 410 },
  { name: "Landing Pages", links: 560 },
];
