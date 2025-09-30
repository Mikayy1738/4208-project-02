import React, { useState, useEffect } from 'react';
import { getFoodDetails, formatNutritionValue, getNutritionLabel, getNutritionUnit } from '../services/foodAPI';

export default function NutritionFacts({ food, servingSize = 1, onClose }) {
  const [detailedFood, setDetailedFood] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (food?.fdcId) {
      loadDetailedNutrition();
    }
  }, [food?.fdcId]);

  const loadDetailedNutrition = async () => {
    setLoading(true);
    try {
      const details = await getFoodDetails(food.fdcId);
      setDetailedFood(details);
    } catch (error) {
      console.error('Failed to load detailed nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNutritionValue = (nutrient) => {
    if (!detailedFood?.nutritionFacts) return 0;
    return (detailedFood.nutritionFacts[nutrient] || 0) * servingSize;
  };

  const formatValue = (nutrient) => {
    const value = getNutritionValue(nutrient);
    const unit = getNutritionUnit(nutrient);
    return formatNutritionValue(value, unit);
  };

  const nutritionSections = [
    {
      title: 'Macronutrients',
      nutrients: ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar']
    },
    {
      title: 'Fats',
      nutrients: ['saturatedFat', 'transFat', 'monounsaturatedFat', 'polyunsaturatedFat', 'cholesterol']
    },
    {
      title: 'Minerals',
      nutrients: ['sodium', 'potassium', 'calcium', 'iron', 'magnesium', 'phosphorus', 'zinc', 'copper', 'manganese', 'selenium']
    },
    {
      title: 'Vitamins',
      nutrients: ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'thiamin', 'riboflavin', 'niacin', 'vitaminB6', 'folate', 'vitaminB12', 'biotin', 'pantothenicAcid', 'choline']
    }
  ];

  if (loading) {
    return (
      <div className="nutrition-facts loading">
        <div className="loading-spinner">Loading nutrition facts...</div>
      </div>
    );
  }

  if (!detailedFood) {
    return (
      <div className="nutrition-facts">
        <div className="nutrition-header">
          <h3>Nutrition Facts</h3>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>
        <div className="no-data">No detailed nutrition data available</div>
      </div>
    );
  }

  return (
    <div className="nutrition-facts">
      <div className="nutrition-header">
        <h3>Nutrition Facts</h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>
      
      <div className="food-info">
        <h4>{detailedFood.description}</h4>
        {detailedFood.brandOwner && (
          <p className="brand">{detailedFood.brandOwner}</p>
        )}
        <p className="serving-info">
          Serving Size: {detailedFood.servingSize} {detailedFood.servingSizeUnit}
          {servingSize !== 1 && ` × ${servingSize}`}
        </p>
      </div>

      <div className="nutrition-sections">
        {nutritionSections.map(section => (
          <div key={section.title} className="nutrition-section">
            <h5>{section.title}</h5>
            <div className="nutrients-list">
              {section.nutrients.map(nutrient => {
                const value = getNutritionValue(nutrient);
                if (value === 0) return null;
                
                return (
                  <div key={nutrient} className="nutrient-item">
                    <span className="nutrient-label">
                      {getNutritionLabel(nutrient)}:
                    </span>
                    <span className="nutrient-value">
                      {formatValue(nutrient)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {detailedFood.ingredients && (
        <div className="ingredients">
          <h5>Ingredients</h5>
          <p className="ingredients-text">{detailedFood.ingredients}</p>
        </div>
      )}

      <div className="nutrition-footer">
        <small>
          * Nutrition information per {detailedFood.servingSize} {detailedFood.servingSizeUnit}
          {servingSize !== 1 && ` × ${servingSize} serving${servingSize > 1 ? 's' : ''}`}
        </small>
      </div>
    </div>
  );
}
