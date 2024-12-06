import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { connectDb } from "@/utils/db/index.ts";
import App from "@/App.tsx";
import "./index.css";

connectDb()
  .then(() => console.log("Connected to database"))
  .catch(console.error);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
