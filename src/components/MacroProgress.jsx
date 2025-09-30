import React, { useState } from 'react';

export default function MacroProgress({ dailyMacros, targetMacros, onUpdateTargets }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTargets, setEditTargets] = useState(targetMacros);

  const calculatePercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    return '#007bff';
  };

  const handleSaveTargets = () => {
    onUpdateTargets(editTargets);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTargets(targetMacros);
    setIsEditing(false);
  };

  const macroItems = [
    { key: 'calories', label: 'Calories', unit: 'kcal', color: '#ff6b6b' },
    { key: 'protein', label: 'Protein', unit: 'g', color: '#4ecdc4' },
    { key: 'carbs', label: 'Carbs', unit: 'g', color: '#45b7d1' },
    { key: 'fat', label: 'Fat', unit: 'g', color: '#f9ca24' },
    { key: 'fiber', label: 'Fiber', unit: 'g', color: '#6c5ce7' }
  ];

  return (
    <div className="macro-progress card">
      <div className="progress-header">
        <h3>Daily Macros</h3>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Targets'}
        </button>
      </div>

      {isEditing ? (
        <div className="edit-targets">
          <h4>Set Daily Targets</h4>
          {macroItems.map(item => (
            <div key={item.key} className="target-input">
              <label>{item.label}:</label>
              <input
                type="number"
                value={editTargets[item.key]}
                onChange={(e) => setEditTargets(prev => ({
                  ...prev,
                  [item.key]: parseInt(e.target.value) || 0
                }))}
                className="form-control"
              />
              <span className="unit">{item.unit}</span>
            </div>
          ))}
          <div className="edit-actions">
            <button className="btn btn-success" onClick={handleSaveTargets}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="macro-circles">
          {macroItems.map(item => {
            const current = dailyMacros[item.key];
            const target = targetMacros[item.key];
            const percentage = calculatePercentage(current, target);
            const remaining = Math.max(0, target - current);

            return (
              <div key={item.key} className="macro-circle">
                <div 
                  className="circle"
                  style={{
                    background: `conic-gradient(${item.color} ${percentage * 3.6}deg, #e9ecef 0deg)`
                  }}
                >
                  <div className="circle-content">
                    <div className="current">{Math.round(current)}</div>
                    <div className="target">/ {target}</div>
                    <div className="unit">{item.unit}</div>
                  </div>
                </div>
                <div className="macro-label">{item.label}</div>
                <div className="macro-remaining">
                  {remaining > 0 ? `${Math.round(remaining)} ${item.unit} left` : 'Complete!'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="macro-summary">
        <div className="summary-item">
          <span className="label">Total Calories:</span>
          <span className="value">{Math.round(dailyMacros.calories)} / {targetMacros.calories}</span>
        </div>
        <div className="summary-item">
          <span className="label">Remaining:</span>
          <span className="value">
            {Math.max(0, targetMacros.calories - dailyMacros.calories)} kcal
          </span>
        </div>
      </div>
    </div>
  );
}
