import { useState } from "react";
import type { ViewId } from "./types";
import Sidebar from "./components/Sidebar";
import Performance from "./components/Performance";
import IncomeTracker from "./components/IncomeTracker";
import Pages from "./components/Pages";
import Sitemaps from "./components/Sitemaps";
import Links from "./components/Links";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState<ViewId>("performance");

  function renderView() {
    switch (activeView) {
      case "performance":
        return <Performance />;
      case "income":
        return <IncomeTracker />;
      case "pages":
        return <Pages />;
      case "sitemaps":
        return <Sitemaps />;
      case "links":
        return <Links />;
      case "settings":
        return <Settings />;
      default:
        return <Performance />;
    }
  }

  return (
    <div className="cloud-code-shell">
      <Sidebar activeView={activeView} onSelect={setActiveView} />
      <main className="cloud-code-main">{renderView()}</main>
    </div>
  );
}

export default App;
