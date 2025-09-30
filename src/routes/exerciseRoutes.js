import express from "express";
import exercisesData from '../exercises.json' with { type: "json" };

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = (req.query.query || "").trim();
  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    const filtered = exercisesData.filter(exercise => 
      exercise.name?.toLowerCase().includes(query.toLowerCase()) ||
      exercise.primaryMuscles?.some(muscle => muscle.toLowerCase().includes(query.toLowerCase())) ||
      exercise.secondaryMuscles?.some(muscle => muscle.toLowerCase().includes(query.toLowerCase())) ||
      exercise.category?.toLowerCase().includes(query.toLowerCase()) ||
      exercise.equipment?.toLowerCase().includes(query.toLowerCase())
    );
    
    return res.json(filtered.slice(0, 50));
  } catch (err) {
    console.error("Exercise search error:", err.message);
    return res.json([]);
  }
});

export default router;


