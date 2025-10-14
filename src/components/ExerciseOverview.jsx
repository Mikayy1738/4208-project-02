import React, { useEffect, useMemo, useState } from "react";

export default function ExerciseOverview({ selectedDate, range = "day" }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("workoutLogs") || "[]");
      setLogs(Array.isArray(stored) ? stored : []);
    } catch (_) {
      setLogs([]);
    }
  }, []);

  const filteredLogs = useMemo(() => {
    if (!selectedDate) return logs;
    const target = new Date(selectedDate);
    const startOfDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const endOfDay = new Date(target.getFullYear(), target.getMonth(), target.getDate(), 23, 59, 59, 999);

    let start = startOfDay;
    let end = endOfDay;

    if (range === "7") {
      start = new Date(startOfDay);
      start.setDate(start.getDate() - 6);
    } else if (range === "30") {
      start = new Date(startOfDay);
      start.setDate(start.getDate() - 29);
    } else if (range === "all") {
      start = new Date(0);
      end = new Date(8640000000000000);
    }

    return logs.filter((log) => {
      const dt = new Date(log.timestamp).getTime();
      return dt >= start.getTime() && dt <= end.getTime();
    });
  }, [logs, selectedDate, range]);

  return (
    <div className="container">
      <h2>Exercise History</h2>
      {logs.length === 0 ? (
        <p className="text-muted">No workout history yet.</p>
      ) : (
        <div className="mt-3">
          {filteredLogs.length === 0 && (
            <p className="text-muted">No workouts in selected range.</p>
          )}
          {filteredLogs.map((log) => (
            <div key={log.id} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>{new Date(log.timestamp).toLocaleString()}</span>
                <span className="badge bg-secondary">
                  {log.exercises?.length || 0} exercises
                </span>
              </div>
              <div className="card-body">
                {(log.exercises || []).map((ex) => (
                  <div key={ex.id} className="row align-items-center mb-2">
                    <div className="col-5 fw-semibold">{ex.name}</div>
                    <div className="col-2">Sets: {ex.sets}</div>
                    <div className="col-2">Reps: {ex.reps}</div>
                    <div className="col-2">Weight: {ex.weight}</div>
                    <div className="col-1 text-end">{ex.completed ? "✓" : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}