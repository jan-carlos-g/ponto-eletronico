import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
