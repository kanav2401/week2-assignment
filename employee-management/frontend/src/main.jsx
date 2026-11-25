
import React from "react";
import ReactDOM from "react-dom/client";

// Global stylesheet
import "./styles/index.css";

// Main application component
import App from "./App.jsx";

// Render the React application
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
