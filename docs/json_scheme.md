# External JSON Schemas & Merge Policy

## Sources
- OpenFoodFacts: food search and product details
- Local `exercises.json` validated by `src/models/exercise_schema.json`

## Normalized Shapes (app-internal)
- FoodSearchItem
  {
    "productId": "<string>",
    "description": "<string>",
    "brandOwner": "<string>",
    "ingredients": "<string>",
    "calories": <number>,
    "protein": <number>,
    "carbs": <number>,
    "fat": <number>,
    "fiber": <number>,
    "sugar": <number>,
    "sodium": <number>,
    "servingSize": 100,
    "servingSizeUnit": "g",
    "originalServingSize": 100,
    "originalServingSizeUnit": "g"
  }

- FoodDetails
  {
    "productId": "<string>",
    "description": "<string>",
    "brandOwner": "<string>",
    "ingredients": "<string>",
    "servingSize": 100,
    "servingSizeUnit": "g",
    "foodNutrients": [
      { "nutrientId": "<string>", "nutrientName": "<string>", "value": <number>, "unitName": "<string>" }
    ],
    "nutritionFacts": {
      "calories": <number>,
      "protein": <number>,
      "carbs": <number>,
      "fat": <number>,
      "fiber": <number>,
      "sugar": <number>,
      "sodium": <number>
    }
  }

- Exercise
  {
    "id": "<string>",
    "name": "<string>",
    "force": "static|pull|push|null",
    "level": "beginner|intermediate|expert",
    "mechanic": "isolation|compound|null",
    "equipment": "medicine ball|dumbbell|body only|bands|kettlebells|foam roll|cable|machine|barbell|exercise ball|e-z curl bar|other|null",
    "primaryMuscles": ["abdominals|abductors|adductors|biceps|calves|chest|forearms|glutes|hamstrings|lats|lower back|middle back|neck|quadriceps|shoulders|traps|triceps"],
    "secondaryMuscles": ["abdominals|abductors|adductors|biceps|calves|chest|forearms|glutes|hamstrings|lats|lower back|middle back|neck|quadriceps|shoulders|traps|triceps"],
    "instructions": ["<string>"],
    "category": "powerlifting|strength|stretching|cardio|olympic weightlifting|strongman|plyometrics",
    "images": ["<string>"]
  }

## Mapping Rules
- OpenFoodFacts → FoodSearchItem
  - productId = `code` or `_id`
  - description = `product_name` or `generic_name`
  - brandOwner = `brands`
  - ingredients = `ingredients_text`
  - calories/protein/carbs/fat/fiber/sugar from `nutriments["<key>_100g"]` with fallback to `<key>`
  - sodium from `nutriments["sodium_100g"]` (g→mg if ≤ 5)
  - servingSize fields fixed at 100 g

- OpenFoodFacts → FoodDetails
  - productId/description/brandOwner/ingredients as above
  - servingSize fields fixed at 100 g
  - foodNutrients array built from common nutrients present (> 0)
  - nutritionFacts derived from per-100g nutriments

- exercises.json → Exercise
  - Conforms to `src/models/exercise_schema.json`

## Validation
- FoodSearchItem/FoodDetails: require `productId`, `description`; numeric fields default to 0 when missing
- Exercise: require fields per `exercise_schema.json`; reject items missing required fields

## Merge/Dedup Policy
- Key by:
  - Food: `productId`
  - Exercise: `id`
- If a new record with the same key arrives, replace the existing record from the same source
- If multiple foods share the same barcode across sources, prefer the item with more complete fields (non-empty `description` and `brandOwner`, more non-zero nutrients)
