// logic/mealLookup.ts

import type { Food } from "@/constants/foods";
import type { DailyMealPlan } from "./mealPlanning";

interface MealTimeSlot {
    type: "breakfast" | "lunch" | "dinner" | "snack";
    startTime: string; // "12:00"
    endTime: string; // "14:00"
}

const MEAL_SCHEDULE: MealTimeSlot[] = [
    { type: "breakfast", startTime: "07:00", endTime: "09:30" },
    { type: "lunch", startTime: "12:00", endTime: "14:00" },
    { type: "dinner", startTime: "19:00", endTime: "21:00" },
    { type: "snack", startTime: "15:00", endTime: "16:30" },
];

/**
 * Determine which meal the user should eat RIGHT NOW
 * Returns: breakfast, lunch, dinner, or snack
 */
export function getCurrentMealType(now: Date = new Date()): MealTimeSlot | null {
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    return MEAL_SCHEDULE.find(slot => timeString >= slot.startTime && timeString <= slot.endTime) || null;
}

/**
 * Get the actual meal for right now from today's plan
 */
export function getHighlightMealForNow(dailyPlan: DailyMealPlan, now: Date = new Date()): Food | null {
    const mealType = getCurrentMealType(now);
    if (!mealType) return null; // Outside meal hours

    return dailyPlan.meals[mealType.type] || null;
}
