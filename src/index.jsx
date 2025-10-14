import React from "react";
import { createRoot } from "react-dom/client";
import App from "./ui/App.jsx"; 

const root = createRoot(document.getElementById("view"));
root.render(<App />);
