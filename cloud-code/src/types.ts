export type ViewId =
  | "performance"
  | "income"
  | "pages"
  | "sitemaps"
  | "links"
  | "settings";

export interface NavItem {
  id: ViewId;
  label: string;
  icon: string;
  description: string;
}

export interface RevenueStream {
  id: string;
  name: string;
  monthly: number;
  growth: number;
  color: string;
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  projected: number;
}

export interface IndexedPageReason {
  reason: string;
  count: number;
  severity: "info" | "warning" | "error";
}

export interface SitemapEntry {
  id: string;
  url: string;
  status: "success" | "pending" | "error";
  discovered: number;
  lastSubmitted: string;
  errors: number;
}

export interface LinkingSite {
  id: string;
  domain: string;
  linksFound: number;
  targetPages: number;
}
