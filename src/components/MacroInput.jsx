import React, { useState, useEffect } from 'react';
import { searchFood, formatNutritionValue, getNutritionUnit } from '../services/foodAPI.js';
import NutritionFacts from './NutritionFacts.jsx';

export default function MacroInput({ onAddMeal }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState(100); // Default to 100g
  const [showNutritionFacts, setShowNutritionFacts] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchFood(query);
        setResults(data.foods?.slice(0, 20) || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setQuery(food.description);
    setShowDropdown(false);
  };

  const handleAddToMeals = () => {
    if (selectedFood && servingSize !== '') {
      // Calculate multiplier based on grams vs 100g base
      const multiplier = servingSize / 100;
      
      const macroData = {
        productId: selectedFood.productId,
        description: selectedFood.description,
        brandOwner: selectedFood.brandOwner,
        calories: (selectedFood.calories || 0) * multiplier,
        protein: (selectedFood.protein || 0) * multiplier,
        carbs: (selectedFood.carbs || 0) * multiplier,
        fat: (selectedFood.fat || 0) * multiplier,
        fiber: (selectedFood.fiber || 0) * multiplier,
        sugar: (selectedFood.sugar || 0) * multiplier,
        sodium: (selectedFood.sodium || 0) * multiplier,
        serving: `${servingSize}g`,
        servingSize: servingSize,
        servingSizeUnit: 'g'
      };
      
      onAddMeal(macroData);
      setSelectedFood(null);
      setQuery('');
      setServingSize(100);
      setShowNutritionFacts(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFood(null);
    setQuery('');
    setServingSize(100);
    setShowNutritionFacts(false);
  };

  return (
    <div className="macro-input card">
      <h3>Add Food</h3>
      <div className="dropdown">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search for food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
          />
          {loading && <div className="spinner">Loading...</div>}
        </div>

        {showDropdown && results.length > 0 && (
          <div className="dropdown-menu show" style={{display: 'block', width: '100%'}}>
            {results.map((food) => (
              <div
                key={food.productId}
                className="dropdown-item"
                onClick={() => handleFoodSelect(food)}
              >
                <div className="food-item">
                  <div className="food-name">{food.description}</div>
                  {food.brandOwner && (
                    <div className="food-brand">{food.brandOwner}</div>
                  )}
                  <div className="food-macros">
                    {formatNutritionValue(food.calories, ' cal')} | 
                    P: {formatNutritionValue(food.protein, 'g')} | 
                    C: {formatNutritionValue(food.carbs, 'g')} | 
                    F: {formatNutritionValue(food.fat, 'g')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedFood && (
          <div className="selected-food">
            <div className="food-header">
              <h4>{selectedFood.description}</h4>
              {selectedFood.brandOwner && (
                <p className="brand">{selectedFood.brandOwner}</p>
              )}
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClearSelection}
              >
                Change Food
              </button>
            </div>
            
            <div className="macro-preview">
              <div className="macro-grid">
                <div className="macro-item">
                  <span className="macro-label">Calories:</span>
                  <span className="macro-value">
                    {servingSize === '' ? '0' : formatNutritionValue((selectedFood.calories || 0) * (servingSize / 100), ' cal')}
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Protein:</span>
                  <span className="macro-value">
                    {servingSize === '' ? '0' : formatNutritionValue((selectedFood.protein || 0) * (servingSize / 100), 'g')}
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Carbs:</span>
                  <span className="macro-value">
                    {servingSize === '' ? '0' : formatNutritionValue((selectedFood.carbs || 0) * (servingSize / 100), 'g')}
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Fat:</span>
                  <span className="macro-value">
                    {servingSize === '' ? '0' : formatNutritionValue((selectedFood.fat || 0) * (servingSize / 100), 'g')}
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Fiber:</span>
                  <span className="macro-value">
                    {servingSize === '' ? '0' : formatNutritionValue((selectedFood.fiber || 0) * (servingSize / 100), 'g')}
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Sugar:</span>
                  <span className="macro-value">
                    {servingSize === '' ? '0' : formatNutritionValue((selectedFood.sugar || 0) * (servingSize / 100), 'g')}
                  </span>
                </div>
              </div>
            </div>

            <div className="serving-controls">
              <label>Amount (grams):</label>
              <div className="serving-input-group">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={servingSize}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setServingSize('');
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 0) {
                        setServingSize(numValue);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) <= 0) {
                      setServingSize(100);
                    }
                  }}
                  className="form-control"
                />
                <span className="serving-unit">
                  grams
                  {selectedFood.originalServingSize && (
                    <span className="base-serving">
                      (nutrition per 100g, original: {selectedFood.originalServingSize} {selectedFood.originalServingSizeUnit})
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                onClick={() => setShowNutritionFacts(!showNutritionFacts)}
                className="btn btn-outline-info"
              >
                {showNutritionFacts ? 'Hide' : 'Show'} Full Nutrition Facts
              </button>
              <button 
                onClick={handleAddToMeals}
                className="btn btn-primary"
                disabled={servingSize === '' || servingSize <= 0}
              >
                Add to Meals
              </button>
            </div>

            {showNutritionFacts && (
              <div className="nutrition-facts-container">
                <NutritionFacts 
                  food={selectedFood} 
                  servingSize={servingSize}
                  onClose={() => setShowNutritionFacts(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
