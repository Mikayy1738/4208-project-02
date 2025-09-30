import express from "express";
import { searchFoods, getFoodDetails } from "../services/foodService.js";

const router = express.Router();

router.get("/:query", async (req, res) => {
  try {
    const foods = await searchFoods(req.params.query);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/details/:fdcId", async (req, res) => {
  try {
    const food = await getFoodDetails(req.params.fdcId);
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
