import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ThemeContext";
import { AnimationProvider } from "./components/AnimationContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AnimationProvider>
      <App />
    </AnimationProvider>
  </ThemeProvider>
);
