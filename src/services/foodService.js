import fetch from "node-fetch";
import { convertToGrams, getNutrientValue, extractNutritionFacts } from "../utils/foodUtils.js";

export async function searchFoods(query) {
  if (!process.env.USDA_API_KEY) {
    throw new Error("USDA API key not configured. Please set USDA_API_KEY in .env");
  }

  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}&pageSize=50`
  );
  const data = await response.json();

  return {
    ...data,
    foods: data.foods?.map(food => {
      const servingSizeInGrams = convertToGrams(food.servingSize, food.servingSizeUnit);

      return {
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner,
        ingredients: food.ingredients,
        calories: (getNutrientValue(food.foodNutrients, 'Energy') / servingSizeInGrams) * 100,
        protein: (getNutrientValue(food.foodNutrients, 'Protein') / servingSizeInGrams) * 100,
        carbs: (getNutrientValue(food.foodNutrients, 'Carbohydrate, by difference') / servingSizeInGrams) * 100,
        fat: (getNutrientValue(food.foodNutrients, 'Total lipid (fat)') / servingSizeInGrams) * 100,
        servingSize: 100,
        servingSizeUnit: "g",
        originalServingSize: food.servingSize,
        originalServingSizeUnit: food.servingSizeUnit
      };
    }) || []
  };
}

export async function getFoodDetails(fdcId) {
  if (!process.env.USDA_API_KEY) {
    throw new Error("USDA API key not configured. Please set USDA_API_KEY in .env");
  }

  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${process.env.USDA_API_KEY}`
  );
  const data = await response.json();

  return {
    fdcId: data.fdcId,
    description: data.description,
    brandOwner: data.brandOwner,
    ingredients: data.ingredients,
    servingSize: data.servingSize || 100,
    servingSizeUnit: data.servingSizeUnit || "g",
    nutritionFacts: extractNutritionFacts(data.foodNutrients),
  };
}
