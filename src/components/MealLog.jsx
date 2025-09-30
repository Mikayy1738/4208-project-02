import React from 'react';

export default function MealLog({ meals, onRemoveMeal }) {
  const groupMealsByTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return meals.reduce((groups, meal) => {
      const mealHour = new Date().setHours(parseInt(meal.timestamp.split(':')[0]));
      const mealDate = new Date(mealHour);
      
      let timeGroup;
      if (mealDate.getHours() < 12) {
        timeGroup = 'Breakfast';
      } else if (mealDate.getHours() < 17) {
        timeGroup = 'Lunch';
      } else {
        timeGroup = 'Dinner';
      }
      
      if (!groups[timeGroup]) {
        groups[timeGroup] = [];
      }
      groups[timeGroup].push(meal);
      return groups;
    }, {});
  };

  const groupedMeals = groupMealsByTime();

  const calculateMealTotals = (mealList) => {
    return mealList.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
      fiber: totals.fiber + meal.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const formatMacro = (value) => Math.round(value);

  return (
    <div className="meal-log card">
      <h3>Today's Meals</h3>
      
      {meals.length === 0 ? (
        <div className="no-meals">
          <p>No meals logged yet</p>
          <p className="text-muted">Add some food to get started!</p>
        </div>
      ) : (
        <div className="meals-container">
          {['Breakfast', 'Lunch', 'Dinner'].map(mealType => {
            const mealList = groupedMeals[mealType] || [];
            const totals = calculateMealTotals(mealList);
            
            if (mealList.length === 0) return null;
            
            return (
              <div key={mealType} className="meal-group">
                <div className="meal-header">
                  <h4>{mealType}</h4>
                  <div className="meal-totals">
                    <span className="calories">{formatMacro(totals.calories)} cal</span>
                    <span className="macros">
                      P: {formatMacro(totals.protein)}g | 
                      C: {formatMacro(totals.carbs)}g | 
                      F: {formatMacro(totals.fat)}g
                    </span>
                  </div>
                </div>
                
                <div className="meal-items">
                  {mealList.map(meal => (
                    <div key={meal.id} className="meal-item">
                      <div className="meal-info">
                        <div className="meal-name">{meal.name}</div>
                        <div className="meal-serving">{meal.serving}</div>
                        <div className="meal-macros">
                          {formatMacro(meal.calories)} cal | 
                          P: {formatMacro(meal.protein)}g | 
                          C: {formatMacro(meal.carbs)}g | 
                          F: {formatMacro(meal.fat)}g
                        </div>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRemoveMeal(meal.id)}
                        title="Remove meal"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {meals.length > 0 && (
        <div className="daily-totals">
          <h4>Daily Totals</h4>
          <div className="totals-grid">
            <div className="total-item">
              <span className="label">Calories:</span>
              <span className="value">{formatMacro(meals.reduce((sum, meal) => sum + meal.calories, 0))}</span>
            </div>
            <div className="total-item">
              <span className="label">Protein:</span>
              <span className="value">{formatMacro(meals.reduce((sum, meal) => sum + meal.protein, 0))}g</span>
            </div>
            <div className="total-item">
              <span className="label">Carbs:</span>
              <span className="value">{formatMacro(meals.reduce((sum, meal) => sum + meal.carbs, 0))}g</span>
            </div>
            <div className="total-item">
              <span className="label">Fat:</span>
              <span className="value">{formatMacro(meals.reduce((sum, meal) => sum + meal.fat, 0))}g</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
