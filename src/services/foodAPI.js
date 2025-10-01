export async function searchFood(query) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${encodeURIComponent(query)}&json=true&page_size=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch food data");
  const data = await res.json();
  const products = Array.isArray(data.products) ? data.products : [];

  const mapSearchProductToFood = (product) => {
    const nutriments = product?.nutriments || {};
    const getPer100g = (key) => {
      const valuePer100g = nutriments[`${key}_100g`];
      if (typeof valuePer100g === 'number') return valuePer100g;
      const value = nutriments[key];
      return typeof value === 'number' ? value : 0;
    };
    const getSodiumMgPer100g = () => {
      // OFF sometimes provides sodium in g per 100g; convert to mg if < 5
      const raw = nutriments['sodium_100g'];
      if (typeof raw !== 'number') return 0;
      return raw <= 5 ? Math.round(raw * 1000) : raw; // heuristic
    };

    return {
      productId: product.code || product._id || String(Math.random()),
      description: product.product_name || product.generic_name || 'Unknown product',
      brandOwner: product.brands || '',
      ingredients: product.ingredients_text || '',
      calories: getPer100g('energy-kcal'),
      protein: getPer100g('proteins'),
      carbs: getPer100g('carbohydrates'),
      fat: getPer100g('fat'),
      fiber: getPer100g('fiber'),
      sugar: getPer100g('sugars'),
      sodium: getSodiumMgPer100g(),
      servingSize: 100,
      servingSizeUnit: 'g',
      originalServingSize: 100,
      originalServingSizeUnit: 'g'
    };
  };

  return {
    total: data.count || products.length || 0,
    page: data.page || 1,
    pageSize: products.length,
    foods: products.map(mapSearchProductToFood)
  };
}

export async function getFoodDetails(productId) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(productId)}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch food details");
  const payload = await res.json();
  const product = payload.product || {};
  const nutriments = product.nutriments || {};

  const buildNutrient = (name, value, unit) => ({
    nutrientId: name,
    nutrientName: name,
    value: typeof value === 'number' ? value : 0,
    unitName: unit
  });

  const foodNutrients = [
    buildNutrient('Energy', nutriments['energy-kcal_100g'], 'kcal'),
    buildNutrient('Protein', nutriments['proteins_100g'], 'g'),
    buildNutrient('Carbohydrate, by difference', nutriments['carbohydrates_100g'], 'g'),
    buildNutrient('Total lipid (fat)', nutriments['fat_100g'], 'g'),
    buildNutrient('Dietary fiber', nutriments['fiber_100g'], 'g'),
    buildNutrient('Sugars, total', nutriments['sugars_100g'], 'g'),
    buildNutrient('Sodium, Na', nutriments['sodium_100g'], 'mg')
  ].filter(n => n.value > 0);

  const nutritionFacts = {
    calories: nutriments['energy-kcal_100g'] || 0,
    protein: nutriments['proteins_100g'] || 0,
    carbs: nutriments['carbohydrates_100g'] || 0,
    fat: nutriments['fat_100g'] || 0,
    fiber: nutriments['fiber_100g'] || 0,
    sugar: nutriments['sugars_100g'] || 0,
    sodium: (() => {
      const raw = nutriments['sodium_100g'];
      if (typeof raw !== 'number') return 0;
      return raw <= 5 ? Math.round(raw * 1000) : raw;
    })()
  };

  return {
    productId: product.code || productId,
    description: product.product_name || product.generic_name || 'Unknown product',
    brandOwner: product.brands || '',
    ingredients: product.ingredients_text || '',
    servingSize: 100,
    servingSizeUnit: 'g',
    foodNutrients,
    nutritionFacts
  };
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