import React, { useState } from 'react';
import { addEntry } from '../services/weightService.js';

export default function WeightTracker() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight) return;
    addEntry({ date, weight: parseFloat(weight) });
    setWeight("");
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Log Weight</h5>
        <form className="row g-2" onSubmit={handleSubmit}>
          <div className="col-12 col-sm-5">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <div className="col-12 col-sm-5">
            <label className="form-label">Weight (lb)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="form-control"
              placeholder="e.g. 165.2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-sm-2 d-grid">
            <label className="form-label d-none d-sm-block">&nbsp;</label>
            <button type="submit" className="btn btn-dark">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
