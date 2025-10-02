import React, { useState, useEffect } from "react";
import { getExercises } from "../services/exerciseService.js";

export default function ExerciseTracker() {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      const enough = (search || "").trim().length >= 3;
      if (!enough) {
        setExercises([]);
        setShowDropdown(false);
        return;
      }
      setLoading(true);
      const data = await getExercises(search);
      if (active) {
        setExercises(data);
        setShowDropdown(true);
      }
      setLoading(false);
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [search]);

  return (
    <div className="exercise-tracker">
      <h1>Exercise Tracker</h1>
      <div className="mb-3" style={{ position: "relative", maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search exercises (e.g., squat, chest)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowDropdown(exercises.length > 0)}
        />
        {(showDropdown || ((search || "").trim().length >= 3)) && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              background: "#fff",
              border: "1px solid #ddd",
              borderTop: "none",
              maxHeight: "300px",
              overflowY: "auto"
            }}
          >
            {loading && (
              <div className="px-3 py-2" style={{ borderTop: "1px solid #eee" }}>Loading…</div>
            )}
            {!loading && exercises.length === 0 && (
              <div className="px-3 py-2" style={{ borderTop: "1px solid #eee" }}>No results</div>
            )}
            {!loading && exercises.length > 0 && exercises.slice(0, 20).map((exercise) => (
              <div
                key={exercise.id || exercise.name}
                className="px-3 py-2"
                style={{ cursor: "pointer", borderTop: "1px solid #eee" }}
                onMouseDown={() => { setSearch(exercise.name || exercise.exercise_name); setShowDropdown(false); }}
              >
                {exercise.name || exercise.exercise_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
