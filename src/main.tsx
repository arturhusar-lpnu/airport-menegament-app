import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./auth/AuthProvider.tsx";
import { ToastContainer } from "react-toastify";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ToastContainer />
  </StrictMode>
);
