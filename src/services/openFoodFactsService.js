import fetch from "node-fetch";

function mapSearchProductToFood(product) {
  const nutriments = product?.nutriments || {};
  const per100g = 100;

  const getPer100g = (key) => {
    const valuePer100g = nutriments[`${key}_100g`];
    if (typeof valuePer100g === "number") return valuePer100g;
    const value = nutriments[key];
    return typeof value === "number" ? value : 0;
  };

  return {
    productId: product.code || product._id || String(Math.random()),
    description: product.product_name || product.generic_name || "Unknown product",
    brandOwner: product.brands || "",
    ingredients: product.ingredients_text || "",
    calories: getPer100g("energy-kcal"),
    protein: getPer100g("proteins"),
    carbs: getPer100g("carbohydrates"),
    fat: getPer100g("fat"),
    servingSize: per100g,
    servingSizeUnit: "g",
    originalServingSize: per100g,
    originalServingSizeUnit: "g"
  };
}

export async function searchFoods(query) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${encodeURIComponent(query)}&json=true&page_size=50`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenFoodFacts search failed with status ${response.status}`);
  }
  const data = await response.json();
  const products = Array.isArray(data.products) ? data.products : [];
  return {
    total: data.count || products.length || 0,
    page: data.page || 1,
    pageSize: products.length,
    foods: products.map(mapSearchProductToFood)
  };
}

export async function getFoodDetails(productId) {
  // Treat productId as barcode/code from OpenFoodFacts search mapping
  const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(productId)}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenFoodFacts details failed with status ${response.status}`);
  }
  const payload = await response.json();
  const product = payload.product || {};
  const nutriments = product.nutriments || {};

  const buildNutrient = (name, value, unit) => ({
    nutrientId: name,
    nutrientName: name,
    value: typeof value === "number" ? value : 0,
    unitName: unit
  });

  const foodNutrients = [
    buildNutrient("Energy", nutriments["energy-kcal_100g"], "kcal"),
    buildNutrient("Protein", nutriments["proteins_100g"], "g"),
    buildNutrient("Carbohydrate, by difference", nutriments["carbohydrates_100g"], "g"),
    buildNutrient("Total lipid (fat)", nutriments["fat_100g"], "g"),
    buildNutrient("Dietary fiber", nutriments["fiber_100g"], "g"),
    buildNutrient("Sugars, total", nutriments["sugars_100g"], "g"),
    buildNutrient("Sodium, Na", nutriments["sodium_100g"], "mg")
  ].filter(n => n.value > 0);

  return {
    productId: product.code || productId,
    description: product.product_name || product.generic_name || "Unknown product",
    brandOwner: product.brands || "",
    ingredients: product.ingredients_text || "",
    servingSize: 100,
    servingSizeUnit: "g",
    foodNutrients
  };
}


