// hooks/useTodaysMealHighlight.ts

import { calculateCalories, type Food } from "@/constants/foods";
import { getCurrentMealType, getHighlightMealForNow } from "@/logic/mealLookup";
import { fetchDailyMealPlan } from "@/logic/mealPlanning";
import { getMealVariantsForSwap } from "@/logic/mealVariants";
import { useEffect, useState } from "react";

const DEFAULT_PROFILE = { dailyCalorieTarget: 2000 };

export function useTodaysMealHighlight(userId: string, mealLibrary: Food[]) {
    const [highlight, setHighlight] = useState<Food | null>(null);
    const [variants, setVariants] = useState<{ left: Food; center: Food; right: Food } | null>(null);

    useEffect(() => {
        const dailyPlan = fetchDailyMealPlan(userId, DEFAULT_PROFILE, mealLibrary);
        const mealType = getCurrentMealType();
        const highlightMeal = getHighlightMealForNow(dailyPlan) ?? dailyPlan.meals.breakfast;
        const mealTypeKey = mealType?.type ?? "breakfast";
        const targetCalories = calculateCalories(highlightMeal.macros);

        setHighlight(highlightMeal);
        setVariants(getMealVariantsForSwap(mealTypeKey, targetCalories, mealLibrary));
    }, [mealLibrary, userId]);

    return { highlight, variants };
}
