import React, { useState } from "react";

const MUSCLE_GROUPS = [
  "abdominals", "abductors", "adductors", "biceps", "calves", "chest",
  "forearms", "glutes", "hamstrings", "lats", "lower back", "middle back",
  "neck", "quadriceps", "shoulders", "traps", "triceps"
];

const EQUIPMENT_OPTIONS = [
  "body only", "dumbbell", "barbell", "kettlebell", "cable", "machine",
  "bands", "medicine ball", "exercise ball", "foam roll", "e-z curl bar", "other"
];


export default function CreateExerciseForm({ onExerciseCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    equipment: "",
    primaryMuscles: [],
    secondaryMuscles: [],
    instructions: [""],
    images: []
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Exercise name is required";
    }
    
    if (!formData.equipment) {
      newErrors.equipment = "Equipment is required";
    }
    
    if (formData.primaryMuscles.length === 0) {
      newErrors.primaryMuscles = "At least one primary muscle is required";
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newExercise = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      equipment: formData.equipment,
      primaryMuscles: formData.primaryMuscles,
      secondaryMuscles: formData.secondaryMuscles,
      instructions: formData.instructions.filter(inst => inst.trim()),
      images: formData.images.filter(img => img.trim()),
      isCustom: true
    };

    onExerciseCreated(newExercise);
  };

  const handleMuscleChange = (muscle, isPrimary) => {
    const field = isPrimary ? 'primaryMuscles' : 'secondaryMuscles';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(muscle)
        ? prev[field].filter(m => m !== muscle)
        : [...prev[field], muscle]
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  const updateInstruction = (index, value) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const updateImage = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>Create New Exercise</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Exercise Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter exercise name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Equipment *</label>
                <select
                  className={`form-control ${errors.equipment ? 'is-invalid' : ''}`}
                  value={formData.equipment}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                >
                  <option value="">Select equipment</option>
                  {EQUIPMENT_OPTIONS.map(equipment => (
                    <option key={equipment} value={equipment}>{equipment}</option>
                  ))}
                </select>
                {errors.equipment && <div className="invalid-feedback">{errors.equipment}</div>}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Primary Muscles *</label>
            <div className={`border rounded p-2 ${errors.primaryMuscles ? 'border-danger' : ''}`}>
              <div className="row">
                {MUSCLE_GROUPS.map(muscle => (
                  <div key={muscle} className="col-md-3 col-sm-4 col-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`primary-${muscle}`}
                        checked={formData.primaryMuscles.includes(muscle)}
                        onChange={() => handleMuscleChange(muscle, true)}
                      />
                      <label className="form-check-label" htmlFor={`primary-${muscle}`}>
                        {muscle}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {errors.primaryMuscles && <div className="text-danger small">{errors.primaryMuscles}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Secondary Muscles</label>
            <div className="border rounded p-2">
              <div className="row">
                {MUSCLE_GROUPS.map(muscle => (
                  <div key={muscle} className="col-md-3 col-sm-4 col-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`secondary-${muscle}`}
                        checked={formData.secondaryMuscles.includes(muscle)}
                        onChange={() => handleMuscleChange(muscle, false)}
                      />
                      <label className="form-check-label" htmlFor={`secondary-${muscle}`}>
                        {muscle}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Instructions</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Instruction ${index + 1}`}
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeInstruction(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={addInstruction}
            >
              Add Instruction
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URLs (Optional)</label>
            {formData.images.map((image, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="url"
                  className="form-control"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={addImage}
            >
              Add Image URL
            </button>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Create Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
