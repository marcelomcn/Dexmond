import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/dexmond";

createRoot(document.getElementById("root")!).render(<App />);