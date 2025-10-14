import React, { useState, useEffect, useRef } from "react";
import { getExercises, addCustomExercise } from "../services/exerciseService.js";
import CreateExerciseForm from "./CreateExerciseForm.jsx";

export default function ExercisePicker({ onExerciseSelect }) {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const inputRef = useRef(null);

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

  const handleExerciseCreated = (newExercise) => {
    addCustomExercise(newExercise);
    if (onExerciseSelect) {
      onExerciseSelect(newExercise.name);
    }
    setShowCreateForm(false);
    setSearch("");
    setExercises([]);
    setShowDropdown(false);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="exercise-tracker">
        <CreateExerciseForm 
          onExerciseCreated={handleExerciseCreated}
          onCancel={handleCancelCreate}
        />
      </div>
    );
  }

  return (
    <div className="exercise-tracker">
      <div className="mb-3" style={{ position: "relative", maxWidth: "400px" }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search exercises (e.g., squat, chest)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(exercises.length > 0)}
            ref={inputRef}
          />
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => setShowCreateForm(true)}
            title="Create new exercise"
          >
            + New
          </button>
        </div>
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
                className="px-3 py-2 d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer", borderTop: "1px solid #eee" }}
                onMouseDown={() => { 
                  const exerciseName = exercise.name || exercise.exercise_name;
                  if (onExerciseSelect) {
                    onExerciseSelect(exerciseName);
                  }
                  setSearch("");
                  setExercises([]);
                  setShowDropdown(false);
                  if (inputRef.current) {
                    inputRef.current.blur();
                  }
                }}
              >
                <span>{exercise.name || exercise.exercise_name}</span>
                {exercise.isCustom && (
                  <small className="text-muted">Custom</small>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
