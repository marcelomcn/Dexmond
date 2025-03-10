import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/dexmond";

// Initialize lightweight-charts
const script = document.createElement('script');
script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
script.async = true;
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(<App />);