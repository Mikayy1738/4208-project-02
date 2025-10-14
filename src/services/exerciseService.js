import exercisesData from '../exercises.json' with { type: "json" };

const CUSTOM_EXERCISES_KEY = 'customExercises';

function getCustomExercises() {
  try {
    const stored = localStorage.getItem(CUSTOM_EXERCISES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom exercises:', error);
    return [];
  }
}

function saveCustomExercises(exercises) {
  try {
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error('Error saving custom exercises:', error);
  }
}

export function addCustomExercise(exercise) {
  const customExercises = getCustomExercises();
  const newExercise = {
    ...exercise,
    id: exercise.id || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isCustom: true
  };
  
  const updatedExercises = [...customExercises, newExercise];
  saveCustomExercises(updatedExercises);
  return newExercise;
}

export function getAllExercises() {
  const customExercises = getCustomExercises();
  return [...exercisesData, ...customExercises];
}

export async function getExercises(search = "") {
  const q = (search || "").trim();
  if (!q || q.length < 2) return [];
  
  try {
    const allExercises = getAllExercises();
    const filtered = allExercises.filter(exercise => 
      exercise.name?.toLowerCase().includes(q.toLowerCase()) ||
      exercise.primaryMuscles?.some(muscle => muscle.toLowerCase().includes(q.toLowerCase())) ||
      exercise.secondaryMuscles?.some(muscle => muscle.toLowerCase().includes(q.toLowerCase())) ||
      exercise.category?.toLowerCase().includes(q.toLowerCase()) ||
      exercise.equipment?.toLowerCase().includes(q.toLowerCase())
    );
    
    return filtered.slice(0, 50);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function deleteCustomExercise(exerciseId) {
  const customExercises = getCustomExercises();
  const updatedExercises = customExercises.filter(ex => ex.id !== exerciseId);
  saveCustomExercises(updatedExercises);
}

export function getCustomExercisesList() {
  return getCustomExercises();
}