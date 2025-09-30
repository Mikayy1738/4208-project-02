export async function searchFood(query) {
  const res = await fetch(`http://localhost:3000/food/${query}`);
  if (!res.ok) throw new Error("Failed to fetch food data");
  return res.json();
}

export async function getFoodDetails(fdcId) {
  const res = await fetch(`http://localhost:3000/food/details/${fdcId}`);
  if (!res.ok) throw new Error("Failed to fetch food details");
  return res.json();
}

export function formatNutritionValue(value, unit = '') {
  if (value === 0 || value === null || value === undefined) return '0';
  return `${Math.round(value * 10) / 10}${unit}`;
}

export function getNutritionLabel(nutrient) {
  const labels = {
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Total Carbohydrates',
    fat: 'Total Fat',
    fiber: 'Dietary Fiber',
    sugar: 'Total Sugars',
    sodium: 'Sodium',
    cholesterol: 'Cholesterol',
    saturatedFat: 'Saturated Fat',
    transFat: 'Trans Fat',
    monounsaturatedFat: 'Monounsaturated Fat',
    polyunsaturatedFat: 'Polyunsaturated Fat',
    potassium: 'Potassium',
    calcium: 'Calcium',
    iron: 'Iron',
    vitaminA: 'Vitamin A',
    vitaminC: 'Vitamin C',
    vitaminD: 'Vitamin D',
    vitaminE: 'Vitamin E',
    vitaminK: 'Vitamin K',
    thiamin: 'Thiamin (B1)',
    riboflavin: 'Riboflavin (B2)',
    niacin: 'Niacin (B3)',
    vitaminB6: 'Vitamin B6',
    folate: 'Folate',
    vitaminB12: 'Vitamin B12',
    biotin: 'Biotin',
    pantothenicAcid: 'Pantothenic Acid',
    choline: 'Choline',
    magnesium: 'Magnesium',
    phosphorus: 'Phosphorus',
    zinc: 'Zinc',
    copper: 'Copper',
    manganese: 'Manganese',
    selenium: 'Selenium'
  };
  return labels[nutrient] || nutrient;
}

export function getNutritionUnit(nutrient) {
  const units = {
    calories: ' kcal',
    protein: 'g',
    carbs: 'g',
    fat: 'g',
    fiber: 'g',
    sugar: 'g',
    sodium: 'mg',
    cholesterol: 'mg',
    saturatedFat: 'g',
    transFat: 'g',
    monounsaturatedFat: 'g',
    polyunsaturatedFat: 'g',
    potassium: 'mg',
    calcium: 'mg',
    iron: 'mg',
    vitaminA: 'mcg',
    vitaminC: 'mg',
    vitaminD: 'mcg',
    vitaminE: 'mg',
    vitaminK: 'mcg',
    thiamin: 'mg',
    riboflavin: 'mg',
    niacin: 'mg',
    vitaminB6: 'mg',
    folate: 'mcg',
    vitaminB12: 'mcg',
    biotin: 'mcg',
    pantothenicAcid: 'mg',
    choline: 'mg',
    magnesium: 'mg',
    phosphorus: 'mg',
    zinc: 'mg',
    copper: 'mg',
    manganese: 'mg',
    selenium: 'mcg'
  };
  return units[nutrient] || '';
}