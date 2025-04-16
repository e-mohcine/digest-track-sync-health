
export interface FoodAnalysisResult {
  foods: string[];
  calories: string;
  macronutrients: {
    proteins: string;
    carbs: string;
    fats: string;
  };
  transitImpact: string;
  advice: string;
}
