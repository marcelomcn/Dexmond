import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/dexmond";

// Initialize lightweight-charts with error handling
const script = document.createElement('script');
script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
script.async = true;
script.crossOrigin = "anonymous";
script.onerror = () => {
  console.error('Failed to load chart library');
};
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(<App />);