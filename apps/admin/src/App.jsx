import Web3Dashboard from "./modules/web3-dashboard/Web3Dashboard";
import { AnalyticsPage, AnalyticsRestoredPage } from "./modules/analytics";

function App() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  if (pathname === "/analytics") {
    return <AnalyticsRestoredPage />;
  }

  if (pathname === "/analytics-modern") {
    return <AnalyticsPage />;
  }

  return <Web3Dashboard />;
}

export default App;
