import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import foodRoutes from "../routes/foodRoutes.js";
import exerciseRoutes from "../routes/exerciseRoutes.js";

dotenv.config();

const app = express();
app.use(cors());

// Health check
app.get("/test", (req, res) => {
  res.json({ message: "Backend server is working!", timestamp: new Date().toISOString() });
});

// Mount routes
app.use("/food", foodRoutes);
app.use("/exercise", exerciseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
