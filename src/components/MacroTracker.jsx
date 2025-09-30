import React, { useState, useEffect } from 'react';
import MacroProgress from './MacroProgress';
import MacroInput from './MacroInput';
import MealLog from './MealLog';

export default function MacroTracker() {
  const [dailyMacros, setDailyMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  const [targetMacros, setTargetMacros] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25
  });

  const [meals, setMeals] = useState([]);

  const addMeal = (food) => {
    const newMeal = {
      id: Date.now(),
      name: food.description,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      fiber: food.fiber || 0,
      serving: food.serving || '1 serving',
      timestamp: new Date().toLocaleTimeString()
    };

    setMeals(prev => [...prev, newMeal]);
    
    setDailyMacros(prev => ({
      calories: prev.calories + newMeal.calories,
      protein: prev.protein + newMeal.protein,
      carbs: prev.carbs + newMeal.carbs,
      fat: prev.fat + newMeal.fat,
      fiber: prev.fiber + newMeal.fiber
    }));
  };

  const removeMeal = (mealId) => {
    const mealToRemove = meals.find(meal => meal.id === mealId);
    if (mealToRemove) {
      setDailyMacros(prev => ({
        calories: prev.calories - mealToRemove.calories,
        protein: prev.protein - mealToRemove.protein,
        carbs: prev.carbs - mealToRemove.carbs,
        fat: prev.fat - mealToRemove.fat,
        fiber: prev.fiber - mealToRemove.fiber
      }));
      
      setMeals(prev => prev.filter(meal => meal.id !== mealId));
    }
  };

  const updateTargetMacros = (newTargets) => {
    setTargetMacros(newTargets);
  };

  return (
    <div className="macro-tracker">
      <div className="row">
        <div className="col-md-8">
          <MacroProgress 
            dailyMacros={dailyMacros}
            targetMacros={targetMacros}
            onUpdateTargets={updateTargetMacros}
          />
          <MacroInput onAddMeal={addMeal} />
        </div>
        <div className="col-md-4">
          <MealLog 
            meals={meals}
            onRemoveMeal={removeMeal}
          />
        </div>
      </div>
    </div>
  );
}
