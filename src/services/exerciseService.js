import exercisesData from '../exercises.json' with { type: "json" };

export async function getExercises(search = "") {
  const q = (search || "").trim();
  if (!q || q.length < 2) return [];
  
  try {
    const filtered = exercisesData.filter(exercise => 
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