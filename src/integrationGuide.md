# SQLite Integration Guide

## Step 1: Initialize Database (App.tsx)

```tsx
import { useEffect } from 'react';
import { initializeDatabase } from './lib/db';

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    // Your app code
  );
}
```

## Step 2: Create User Profile (Onboarding - for now, hardcode for testing)

```tsx
import { createUserProfile } from "./lib/db";

// Call this once during onboarding
await createUserProfile(
    "user_123", // userId (hardcode for now)
    "cut", // goal
    2000, // dailyCalorieTarget
    150, // proteinTarget
    200, // carbsTarget
    65, // fatTarget
);
```

## Step 3: Generate Daily Meal Plan (App.tsx or HomeScreen)

```tsx
import { createDailyMealPlan, getDailyMealPlan } from "./lib/db";
import { FOOD_LIBRARY } from "./data/foods";

// Call this once per day (e.g., first app open)
const today = new Date().toISOString().split("T")[0];
const existingPlan = await getDailyMealPlan("user_123", today);

if (!existingPlan) {
    // Generate new plan for today
    const slots = [
        { mealType: "breakfast", foodId: "egg_toast_001", calorieAllocation: 500 },
        { mealType: "lunch", foodId: "katsuon_001", calorieAllocation: 600 },
        { mealType: "snack", foodId: "yogurt_001", calorieAllocation: 200 },
        { mealType: "dinner", foodId: "salmon_001", calorieAllocation: 700 },
    ];

    await createDailyMealPlan("user_123", today, slots);
}
```

## Step 4: Wire to HomeScreen

```tsx
import { useLogMeal } from "./hooks/useLogMeal";
import { useTodaysMealPlan } from "./hooks/useTodaysMealPlan";
import { EnsoProgress } from "./components/EnsoProgress";

export function HomeScreen() {
    const userId = "user_123"; // TODO: Get from auth

    const { todayStats, loadTodayStats, handleLogMeal } = useLogMeal(userId);
    const { highlightFood, currentMealType, loading } = useTodaysMealPlan(userId);

    useEffect(() => {
        loadTodayStats();
    }, []);

    if (loading) return <Text>Loading...</Text>;

    return (
        <ScrollView>
            {/* Progress Ring */}
            <EnsoProgress
                kcalEaten={todayStats.kcalEaten}
                kcalTarget={todayStats.kcalTarget}
                protein={todayStats.protein}
                carbs={todayStats.carbs}
                fat={todayStats.fat}
            />

            {/* Highlight Meal */}
            {highlightFood && (
                <View>
                    <Image source={highlightFood.image} style={{ width: 300, height: 300 }} />
                    <Text>{highlightFood.nameEn}</Text>
                    <Text>
                        P {highlightFood.macros.protein}g | C {highlightFood.macros.carbs}g
                    </Text>

                    {/* Log Button */}
                    <Pressable
                        onPress={() => handleLogMeal(highlightFood.id)}
                        style={{ backgroundColor: "#a74a3e", padding: 16, borderRadius: 8 }}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>Log the meal</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
}
```

## Done

That's it. You can now:

1. Log meals (button works)
2. Stats update in real-time
3. Database persists data

Next: Onboarding flow to replace hardcoded userId.

import { useState, useEffect } from 'react';
import { getDailyMealPlan } from './db';
import { FOOD_LIBRARY } from './data/foods';
import { Food } from './types/food';

// Meal time slots
const MEAL_SCHEDULE = {
breakfast: { start: 6, end: 10 }, // 6am - 10am
lunch: { start: 11, end: 15 }, // 11am - 3pm
snack: { start: 15, end: 17 }, // 3pm - 5pm
dinner: { start: 17, end: 22 }, // 5pm - 10pm
};

export function useTodaysMealPlan(userId: string) {
const [highlightFood, setHighlightFood] = useState<Food | null>(null);
const [currentMealType, setCurrentMealType] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const loadTodaysPlan = async () => {
setLoading(true);
const today = new Date().toISOString().split('T')[0];
const plan = await getDailyMealPlan(userId, today);

      if (plan) {
        // Determine current meal based on time
        const now = new Date();
        const hour = now.getHours();

        let currentType: string | null = null;
        for (const [type, range] of Object.entries(MEAL_SCHEDULE)) {
          if (hour >= range.start && hour < range.end) {
            currentType = type;
            break;
          }
        }

        setCurrentMealType(currentType);

        // Get the food for current meal type
        if (currentType) {
          const slot = (plan.slots as any[]).find(s => s.mealType === currentType);
          if (slot) {
            const food = FOOD_LIBRARY.find(f => f.id === slot.foodId);
            setHighlightFood(food || null);
          }
        }
      }

      setLoading(false);
    };

    loadTodaysPlan();

}, [userId]);

return {
highlightFood,
currentMealType,
loading,
};
}

//useLogMeal
import { useState, useCallback } from 'react';
import { logMeal, getLoggedMealsForDay } from './db';
import { FOOD_LIBRARY } from './data/foods';
import { calculateCalories } from './types/food';

export function useLogMeal(userId: string) {
const [todayStats, setTodayStats] = useState({
kcalEaten: 0,
kcalTarget: 2000, // TODO: Pull from UserProfile
protein: { eaten: 0, target: 150 },
carbs: { eaten: 0, target: 200 },
fat: { eaten: 0, target: 65 },
});

const [loggedFoodIds, setLoggedFoodIds] = useState<string[]>([]);

// Load today's logged meals on mount
const loadTodayStats = useCallback(async () => {
const today = new Date().toISOString().split('T')[0];
const loggedMeals = await getLoggedMealsForDay(userId, today);

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCalories = 0;

    loggedMeals.forEach((meal: any) => {
      const food = FOOD_LIBRARY.find(f => f.id === meal.foodId);
      if (food) {
        totalProtein += food.macros.protein;
        totalCarbs += food.macros.carbs;
        totalFat += (food.macros.fat || 0);
        totalCalories += calculateCalories(food.macros);
      }
    });

    setLoggedFoodIds(loggedMeals.map((m: any) => m.foodId));
    setTodayStats(prev => ({
      ...prev,
      kcalEaten: totalCalories,
      protein: { ...prev.protein, eaten: totalProtein },
      carbs: { ...prev.carbs, eaten: totalCarbs },
      fat: { ...prev.fat, eaten: totalFat },
    }));

}, [userId]);

const handleLogMeal = useCallback(async (foodId: string) => {
const today = new Date().toISOString().split('T')[0];
const success = await logMeal(userId, foodId, today);

    if (success) {
      // Immediately update UI
      const food = FOOD_LIBRARY.find(f => f.id === foodId);
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
    }

}, [userId]);

return {
todayStats,
loadTodayStats,
handleLogMeal,
loggedFoodIds,
};
}
//db.ts
import \* as SQLite from 'expo-sqlite';
import { Food } from './types/food';

let db: SQLite.SQLiteDatabase;

export async function initializeDatabase() {
try {
db = await SQLite.openDatabaseAsync('shun.db');

    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        userId TEXT PRIMARY KEY,
        goal TEXT NOT NULL,
        dailyCalorieTarget INTEGER NOT NULL,
        proteinTarget REAL NOT NULL,
        carbsTarget REAL NOT NULL,
        fatTarget REAL NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS daily_meal_plans (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        date TEXT NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES user_profiles(userId)
      );

      CREATE TABLE IF NOT EXISTS meal_slots (
        id TEXT PRIMARY KEY,
        planId TEXT NOT NULL,
        mealType TEXT NOT NULL,
        foodId TEXT NOT NULL,
        calorieAllocation INTEGER NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(planId) REFERENCES daily_meal_plans(id)
      );

      CREATE TABLE IF NOT EXISTS logged_meals (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        foodId TEXT NOT NULL,
        date TEXT NOT NULL,
        loggedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES user_profiles(userId)
      );
    `);

    console.log('Database initialized');

} catch (error) {
console.error('Failed to initialize database:', error);
}
}

export async function getUserProfile(userId: string) {
try {
const result = await db.getFirstAsync(
'SELECT \* FROM user_profiles WHERE userId = ?',
[userId]
);
return result as any || null;
} catch (error) {
console.error('Failed to fetch user profile:', error);
return null;
}
}

export async function createUserProfile(
userId: string,
goal: 'bulk' | 'cut' | 'maintain',
dailyCalorieTarget: number,
proteinTarget: number,
carbsTarget: number,
fatTarget: number
) {
try {
await db.runAsync(
`INSERT INTO user_profiles 
       (userId, goal, dailyCalorieTarget, proteinTarget, carbsTarget, fatTarget) 
       VALUES (?, ?, ?, ?, ?, ?)`,
[userId, goal, dailyCalorieTarget, proteinTarget, carbsTarget, fatTarget]
);
console.log('User profile created');
} catch (error) {
console.error('Failed to create user profile:', error);
}
}

export async function getDailyMealPlan(userId: string, date: string) {
try {
const plan = await db.getFirstAsync(
'SELECT \* FROM daily_meal_plans WHERE userId = ? AND date = ?',
[userId, date]
);

    if (!plan) return null;

    const slots = await db.getAllAsync(
      'SELECT * FROM meal_slots WHERE planId = ?',
      [(plan as any).id]
    );

    return { ...plan, slots };

} catch (error) {
console.error('Failed to fetch daily meal plan:', error);
return null;
}
}

export async function createDailyMealPlan(
userId: string,
date: string,
slots: Array<{
mealType: string;
foodId: string;
calorieAllocation: number;
}>
) {
try {
const planId = `plan_${userId}_${date}`;

    await db.runAsync(
      'INSERT INTO daily_meal_plans (id, userId, date) VALUES (?, ?, ?)',
      [planId, userId, date]
    );

    for (const slot of slots) {
      const slotId = `slot_${planId}_${slot.mealType}`;
      await db.runAsync(
        `INSERT INTO meal_slots (id, planId, mealType, foodId, calorieAllocation)
         VALUES (?, ?, ?, ?, ?)`,
        [slotId, planId, slot.mealType, slot.foodId, slot.calorieAllocation]
      );
    }

    console.log('Daily meal plan created');
    return planId;

} catch (error) {
console.error('Failed to create daily meal plan:', error);
return null;
}
}

export async function logMeal(userId: string, foodId: string, date: string) {
try {
const id = `log_${userId}_${foodId}_${Date.now()}`;
await db.runAsync(
'INSERT INTO logged_meals (id, userId, foodId, date) VALUES (?, ?, ?, ?)',
[id, userId, foodId, date]
);
console.log('Meal logged');
return id;
} catch (error) {
console.error('Failed to log meal:', error);
return null;
}
}

export async function getLoggedMealsForDay(userId: string, date: string) {
try {
const meals = await db.getAllAsync(
'SELECT \* FROM logged_meals WHERE userId = ? AND date = ?',
[userId, date]
);
return meals || [];
} catch (error) {
console.error('Failed to fetch logged meals:', error);
return [];
}
}

export async function getLoggedMealsForWeek(userId: string, startDate: string) {
try {
// Get 7 days of data starting from startDate
const meals = await db.getAllAsync(
`SELECT * FROM logged_meals 
       WHERE userId = ? AND date >= ? AND date < datetime(?, '+7 days')
       ORDER BY loggedAt DESC`,
[userId, startDate, startDate]
);
return meals || [];
} catch (error) {
console.error('Failed to fetch weekly logged meals:', error);
return [];
}
}
