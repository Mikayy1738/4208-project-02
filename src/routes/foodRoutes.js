import express from "express";
import { searchFoods as searchFoodsOFF, getFoodDetails as getFoodDetailsOFF } from "../services/openFoodFactsService.js";

const router = express.Router();

// OpenFoodFacts routes
router.get("/:query", async (req, res) => {
  try {
    const foods = await searchFoodsOFF(req.params.query);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/details/:productId", async (req, res) => {
  try {
    const food = await getFoodDetailsOFF(req.params.productId);
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
