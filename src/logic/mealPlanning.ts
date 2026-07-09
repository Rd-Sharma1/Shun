// logic/mealPlanning.ts

import { calculateCalories, type Food } from "@/constants/foods";

export interface UserDietaryProfile {
    dailyCalorieTarget: number;
    preferences?: {
        vegetarian?: boolean;
        vegan?: boolean;
        glutenFree?: boolean;
        dairyFree?: boolean;
    };
}

export interface DailyMealPlan {
    userId: string;
    date: string; // "2026-07-08"
    meals: {
        breakfast: Food;
        lunch: Food;
        dinner: Food;
        snack: Food;
    };
}

type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

function matchesDietaryPreferences(food: Food, profile: UserDietaryProfile): boolean {
    const dietaryTags = (food as Food & { dietaryTags?: string[] }).dietaryTags ?? [];
    const preferences = profile.preferences ?? {};

    if (preferences.vegetarian && dietaryTags.includes("meat")) {
        return false;
    }

    if (
        preferences.vegan &&
        (dietaryTags.includes("meat") || dietaryTags.includes("dairy") || dietaryTags.includes("egg"))
    ) {
        return false;
    }

    if (preferences.glutenFree && dietaryTags.includes("gluten")) {
        return false;
    }

    if (preferences.dairyFree && dietaryTags.includes("dairy")) {
        return false;
    }

    return true;
}

function pickBestMealForSlot(
    mealType: MealSlot,
    targetCalories: number,
    mealLibrary: Food[],
    profile: UserDietaryProfile,
): Food {
    const candidates = mealLibrary.filter(
        food => food.mealTypes.includes(mealType) && matchesDietaryPreferences(food, profile),
    );

    if (candidates.length === 0) {
        const fallback = mealLibrary.find(food => food.mealTypes.includes(mealType)) ?? mealLibrary[0];
        return fallback;
    }

    const ranked = [...candidates].sort((left, right) => {
        const leftDelta = Math.abs(calculateCalories(left.macros) - targetCalories);
        const rightDelta = Math.abs(calculateCalories(right.macros) - targetCalories);

        return leftDelta - rightDelta || left.nameEn.localeCompare(right.nameEn);
    });

    return ranked[0];
}

/**
 * Generate a daily meal plan for a user.
 * Run this once per day (e.g., at midnight or first app open).
 */
export function generateDailyMealPlan(userId: string, profile: UserDietaryProfile, mealLibrary: Food[]): DailyMealPlan {
    const targetCalories = profile.dailyCalorieTarget;

    const allocation = {
        breakfast: Math.round(targetCalories * 0.25),
        lunch: Math.round(targetCalories * 0.3),
        dinner: Math.round(targetCalories * 0.35),
        snack: Math.round(targetCalories * 0.1),
    };

    return {
        userId,
        date: new Date().toISOString().split("T")[0],
        meals: {
            breakfast: pickBestMealForSlot("breakfast", allocation.breakfast, mealLibrary, profile),
            lunch: pickBestMealForSlot("lunch", allocation.lunch, mealLibrary, profile),
            dinner: pickBestMealForSlot("dinner", allocation.dinner, mealLibrary, profile),
            snack: pickBestMealForSlot("snack", allocation.snack, mealLibrary, profile),
        },
    };
}

export function fetchDailyMealPlan(
    userId: string,
    profile: UserDietaryProfile | null | undefined,
    mealLibrary: Food[] = [],
): DailyMealPlan {
    const safeProfile = profile ?? { dailyCalorieTarget: 2000 };
    return generateDailyMealPlan(userId, safeProfile, mealLibrary);
}
