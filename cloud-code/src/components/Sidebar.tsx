import type { NavItem, ViewId } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { id: "performance", label: "Performance", icon: "📈", description: "Search performance overview" },
  { id: "income", label: "Income Tracker", icon: "💰", description: "Revenue streams & growth" },
  { id: "pages", label: "Pages", icon: "📄", description: "Indexing status & coverage" },
  { id: "sitemaps", label: "Sitemaps", icon: "🗺️", description: "Sitemap submissions & health" },
  { id: "links", label: "Links", icon: "🔗", description: "Internal & external link analytics" },
  { id: "settings", label: "Settings", icon: "⚙️", description: "Ownership & property management" },
];

interface SidebarProps {
  activeView: ViewId;
  onSelect: (id: ViewId) => void;
}

export default function Sidebar({ activeView, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">CC</span>
        <div>
          <p className="sidebar-brand-name">cloud-code</p>
          <p className="sidebar-brand-sub">Console</p>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Console navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-nav-item${activeView === item.id ? " active" : ""}`}
            onClick={() => onSelect(item.id)}
            aria-current={activeView === item.id ? "page" : undefined}
          >
            <span className="sidebar-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar-nav-text">
              <span className="sidebar-nav-label">{item.label}</span>
              <span className="sidebar-nav-desc">{item.description}</span>
            </span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Property</p>
        <strong>datacentral-cloud-llc.com</strong>
      </div>
    </aside>
  );
}
