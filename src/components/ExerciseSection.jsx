import React, { useState, useEffect } from "react";
import ExercisePicker from "./ExercisePicker.jsx";

export default function ExerciseSection() {
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedExercises');
    if (saved) {
      setSelectedExercises(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
  }, [selectedExercises]);

  const addExercise = (exerciseName) => {
    if (!exerciseName.trim()) return;
    
    const newExercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: 10,
      weight: 0,
      completed: false
    };
    
    setSelectedExercises(prev => [...prev, newExercise]);
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const updateExercise = (exerciseId, field, value) => {
    setSelectedExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, [field]: value }
          : ex
      )
    );
  };

  const toggleCompleted = (exerciseId) => {
    updateExercise(exerciseId, 'completed', !selectedExercises.find(ex => ex.id === exerciseId)?.completed);
  };

  const logWorkout = () => {
    if (!selectedExercises.length) return;
    const existing = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      exercises: selectedExercises
    };
    localStorage.setItem('workoutLogs', JSON.stringify([entry, ...existing]));
    setSelectedExercises([]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Exercise Section</h3>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <ExercisePicker onExerciseSelect={addExercise} />
        </div>

        <div className="exercise-list">
          {selectedExercises.length === 0 ? (
            <p className="text-muted">No exercises added yet. Add some exercises to get started!</p>
          ) : (
            selectedExercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className={`card mb-3 ${exercise.completed ? 'bg-light' : ''}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{exercise.name}</h5>
                    <div>
                      <button
                        className={`btn btn-sm ${exercise.completed ? 'btn-success' : 'btn-outline-success'} me-2`}
                        onClick={() => toggleCompleted(exercise.id)}
                      >
                        {exercise.completed ? '✓' : '○'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeExercise(exercise.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Sets</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Reps</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Weight (lbs)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                      <small className="text-muted">
                        Total: {exercise.sets * exercise.reps * exercise.weight} lbs
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedExercises.length > 0 && (
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <span>
                Total Exercises: {selectedExercises.length}
              </span>
              <span>
                Completed: {selectedExercises.filter(ex => ex.completed).length}
              </span>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-success"
                onClick={logWorkout}
                disabled={!selectedExercises.length}
              >
                Log Workout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}