// logic/mealVariants.ts

import { calculateCalories, type Food } from "@/constants/foods";

/**
 * Get meal variants for the current meal slot.
 * Shows: [LEFT_OPTION, HIGHLIGHT, RIGHT_OPTION]
 */
export function getMealVariantsForSwap(
    mealType: Food["mealTypes"][number],
    targetCalories: number,
    mealLibrary: Food[],
): { left: Food; center: Food; right: Food } | null {
    const candidates = mealLibrary.filter(food => food.mealTypes.includes(mealType));
    const fallbackPool = candidates.length >= 3 ? candidates : mealLibrary;

    if (fallbackPool.length < 3) {
        return null;
    }

    const ranked = [...fallbackPool].sort((left, right) => {
        const leftDelta = Math.abs(calculateCalories(left.macros) - targetCalories);
        const rightDelta = Math.abs(calculateCalories(right.macros) - targetCalories);

        return leftDelta - rightDelta || left.nameEn.localeCompare(right.nameEn);
    });

    return {
        left: ranked[0],
        center: ranked[1],
        right: ranked[2],
    };
}

export function getFoodVariantsForSwap(
    mealType: Food["mealTypes"][number],
    targetCalories: number,
    foodLibrary: Food[],
): { left: Food; center: Food; right: Food } | null {
    return getMealVariantsForSwap(mealType, targetCalories, foodLibrary);
}
