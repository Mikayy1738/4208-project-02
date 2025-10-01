# Architecture Sketch 
 
### Directory structure

```
4208-project-02/
|--- index.html                            
|--- docs/                                  # Project documentation                    
|--- src/                                   
|     |--- backend/                         
|     |     |--- server.js                  # Express server and API wiring
|     |--- components/                      
|     |     |--- Calender.jsx               # Calendar UI for date selection
|     |     |--- CaloriesChart.jsx          # Calorie data chart
|     |     |--- CurrentWeight.jsx          # Current weight display
|     |     |--- DataImport.jsx             # Import external data UI
|     |     |--- ExerciseTracker.jsx        # Exercise logging component
|     |     |--- MacroInput.jsx             # Macro goal input fields
|     |     |--- MacroProgress.jsx          # Macro progress summary
|     |     |--- MacroSplitChart.jsx        # Macro distribution chart
|     |     |--- MacroTracker.jsx           # Macro tracking container
|     |     |--- MealLog.jsx                # Meal logging UI
|     |     |--- NavBar.jsx                 # Top navigation bar
|     |     |--- NutritionFacts.jsx         # Nutrition facts panel
|     |     |--- WeightChart.jsx            # Weight over time chart
|     |     |--- WeightTracker.jsx          # Weight tracking container
|     |--- exercises.json                   # Exercise reference data
|     |--- main.jsx                         # Frontend entry; mounts app
|     |--- models/                          
|     |     |--- exercise_schema.json       # Exercise object schema
|     |--- routes/                          
|     |     |--- exerciseRoutes.js          # Endpoints for exercises
|     |     |--- foodRoutes.js              # Endpoints for food search/details
|     |--- services/                        
|     |     |--- exerciseService.js         # Exercise CRUD operations
|     |     |--- foodAPI.js                 # External food API wrapper
|     |     |--- foodService.js             # Food domain logic
|     |     |--- weightService.js           # Weight domain logic
|     |--- state/                           
|     |--- ui/                              
|     |     |--- App.jsx                    # Root layout and routing
|     |     |--- Dashboard.jsx              # Main dashboard view
|     |     |--- ExerciseMenu.jsx           # Exercise feature entry
|     |     |--- FoodDetails.jsx            # Detailed food view
|     |     |--- FoodSearch.jsx             # Food search screen
|     |     |--- MacroMenu.jsx              # Macro settings screen
|     |     |--- WeightMenu.jsx             # Weight feature entry
|     |--- utils/                           
|     |     |--- foodUtils.js               # Food data utilities
|--- styles/                                 
|     |--- styles.css                       # Base styles and theme
```
