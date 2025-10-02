import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { createRoot } from "react-dom/client";
import App from "./ui/App.jsx"; // your root app component

const root = createRoot(document.getElementById("view"));
root.render(<App />);
