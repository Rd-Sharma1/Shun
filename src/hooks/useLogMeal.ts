import { calculateCalories, type Food } from "@/constants/foods";
import { getLoggedMealsForDay, getUserProfile, logMeal } from "@/lib/db";
import { useCallback, useState } from "react";

interface TodayStats {
    kcalEaten: number;
    kcalTarget: number;
    protein: { eaten: number; target: number };
    carbs: { eaten: number; target: number };
    fat: { eaten: number; target: number };
}

export function useLogMeal(userId: string, foodLibrary: Food[]) {
    const [todayStats, setTodayStats] = useState<TodayStats>({
        kcalEaten: 0,
        kcalTarget: 2000,
        protein: { eaten: 0, target: 150 },
        carbs: { eaten: 0, target: 200 },
        fat: { eaten: 0, target: 65 },
    });

    const [loggedFoodIds, setLoggedFoodIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadTodayStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];
            const userProfile = await getUserProfile(userId);
            const loggedMeals = await getLoggedMealsForDay(userId, today);

            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;
            let totalCalories = 0;

            loggedMeals.forEach((meal: any) => {
                const food = foodLibrary.find(f => f.id === meal.foodId);
                if (food) {
                    totalProtein += food.macros.protein;
                    totalCarbs += food.macros.carbs;
                    totalFat += food.macros.fat || 0;
                    totalCalories += calculateCalories(food.macros);
                }
            });

            setLoggedFoodIds(loggedMeals.map((m: any) => m.foodId));
            setTodayStats({
                kcalEaten: totalCalories,
                kcalTarget: userProfile?.dailyCalorieTarget || 2000,
                protein: { eaten: totalProtein, target: userProfile?.proteinTarget || 150 },
                carbs: { eaten: totalCarbs, target: userProfile?.carbsTarget || 200 },
                fat: { eaten: totalFat, target: userProfile?.fatTarget || 65 },
            });
        } catch (error) {
            console.error("[useLogMeal] Failed to load today stats:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, foodLibrary]);

    const handleLogMeal = useCallback(
        async (foodId: string): Promise<boolean> => {
            try {
                const today = new Date().toISOString().split("T")[0];
                const success = await logMeal(userId, foodId, today);

                if (success) {
                    const food = foodLibrary.find(f => f.id === foodId);
                    if (food) {
                        setTodayStats(prev => ({
                            ...prev,
                            kcalEaten: prev.kcalEaten + calculateCalories(food.macros),
                            protein: { ...prev.protein, eaten: prev.protein.eaten + food.macros.protein },
                            carbs: { ...prev.carbs, eaten: prev.carbs.eaten + food.macros.carbs },
                            fat: { ...prev.fat, eaten: prev.fat.eaten + (food.macros.fat || 0) },
                        }));
                        setLoggedFoodIds(prev => [...prev, foodId]);
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error("[useLogMeal] Failed to log meal:", error);
                return false;
            }
        },
        [userId, foodLibrary],
    );

    return { todayStats, loadTodayStats, handleLogMeal, loggedFoodIds, isLoading };
}
