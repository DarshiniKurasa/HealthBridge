import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/firebase"; // Import firebase initialization

createRoot(document.getElementById("root")!).render(<App />);
