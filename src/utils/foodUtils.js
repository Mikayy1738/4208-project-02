export function convertToGrams(servingSize, unit) {
  if (!servingSize || !unit) return 100;
  switch (unit.toLowerCase()) {
    case "g": case "gram": case "grams": return servingSize;
    case "oz": case "ounce": return servingSize * 28.35;
    case "lb": case "pound": return servingSize * 453.59;
    case "kg": return servingSize * 1000;
    case "ml": return servingSize;
    case "cup": return servingSize * 240;
    case "tbsp": return servingSize * 15;
    case "tsp": return servingSize * 5;
    default: return servingSize;
  }
}

export function getNutrientValue(nutrients, nutrientName) {
  if (!nutrients) return 0;
  const nutrient = nutrients.find(n => {
    const name = n.nutrientName || n.nutrient?.name || n.name;
    return name && (name === nutrientName || name.toLowerCase().includes(nutrientName.toLowerCase()));
  });
  return nutrient ? nutrient.value || nutrient.amount || 0 : 0;
}

export function extractNutritionFacts(nutrients) {
  const map = { calories: ["Energy"], protein: ["Protein"], carbs: ["Carbohydrate, by difference"], fat: ["Total lipid (fat)"] };
  const facts = {};
  Object.entries(map).forEach(([key, [nutrient]]) => {
    const value = getNutrientValue(nutrients, nutrient);
    if (value > 0) facts[key] = value;
  });
  return facts;
}
