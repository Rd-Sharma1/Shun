import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function initializeDatabase() {
    try {
        db = await SQLite.openDatabaseAsync("shun.db");

        await db.execAsync(`
      PRAGMA journal_mode = WAL;

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
        date TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, date),
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

      CREATE INDEX IF NOT EXISTS idx_logged_meals_user_date ON logged_meals(userId, date);
      CREATE INDEX IF NOT EXISTS idx_daily_meal_plans_user_date ON daily_meal_plans(userId, date);
    `);

        console.log("[DB] Database initialized successfully");
    } catch (error) {
        console.error("[DB] Failed to initialize database:", error);
    }
}

export async function getUserProfile(userId: string) {
    if (!db) throw new Error("Database not initialized");
    try {
        const result = await db.getFirstAsync("SELECT * FROM user_profiles WHERE userId = ?", [userId]);
        return (result as any) || null;
    } catch (error) {
        console.error("[DB] Failed to fetch user profile:", error);
        return null;
    }
}

export async function createUserProfile(
    userId: string,
    goal: "bulk" | "cut" | "maintain",
    dailyCalorieTarget: number,
    proteinTarget: number,
    carbsTarget: number,
    fatTarget: number,
) {
    if (!db) throw new Error("Database not initialized");
    try {
        await db.runAsync(
            `INSERT INTO user_profiles 
       (userId, goal, dailyCalorieTarget, proteinTarget, carbsTarget, fatTarget) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, goal, dailyCalorieTarget, proteinTarget, carbsTarget, fatTarget],
        );
        console.log("[DB] User profile created for", userId);
    } catch (error) {
        console.error("[DB] Failed to create user profile:", error);
    }
}

export async function getDailyMealPlan(userId: string, date: string) {
    if (!db) throw new Error("Database not initialized");
    try {
        const plan = await db.getFirstAsync("SELECT * FROM daily_meal_plans WHERE userId = ? AND date = ?", [
            userId,
            date,
        ]);

        if (!plan) return null;

        const slots = await db.getAllAsync("SELECT * FROM meal_slots WHERE planId = ? ORDER BY mealType", [
            (plan as any).id,
        ]);

        return { ...plan, slots };
    } catch (error) {
        console.error("[DB] Failed to fetch daily meal plan:", error);
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
    }>,
) {
    if (!db) throw new Error("Database not initialized");
    try {
        const planId = `plan_${userId}_${date}`;

        await db.runAsync("INSERT INTO daily_meal_plans (id, userId, date) VALUES (?, ?, ?)", [planId, userId, date]);

        for (const slot of slots) {
            const slotId = `slot_${planId}_${slot.mealType}`;
            await db.runAsync(
                `INSERT INTO meal_slots (id, planId, mealType, foodId, calorieAllocation)
         VALUES (?, ?, ?, ?, ?)`,
                [slotId, planId, slot.mealType, slot.foodId, slot.calorieAllocation],
            );
        }

        console.log("[DB] Daily meal plan created for", date);
        return planId;
    } catch (error) {
        console.error("[DB] Failed to create daily meal plan:", error);
        return null;
    }
}

export async function logMeal(userId: string, foodId: string, date: string) {
    if (!db) throw new Error("Database not initialized");
    try {
        const id = `log_${userId}_${foodId}_${Date.now()}`;
        await db.runAsync("INSERT INTO logged_meals (id, userId, foodId, date) VALUES (?, ?, ?, ?)", [
            id,
            userId,
            foodId,
            date,
        ]);
        console.log("[DB] Meal logged:", foodId);
        return id;
    } catch (error) {
        console.error("[DB] Failed to log meal:", error);
        return null;
    }
}

export async function getLoggedMealsForDay(userId: string, date: string) {
    if (!db) throw new Error("Database not initialized");
    try {
        const meals = await db.getAllAsync(
            "SELECT * FROM logged_meals WHERE userId = ? AND date = ? ORDER BY loggedAt ASC",
            [userId, date],
        );
        return meals || [];
    } catch (error) {
        console.error("[DB] Failed to fetch logged meals:", error);
        return [];
    }
}

export async function getLoggedMealsForWeek(userId: string, startDate: string) {
    if (!db) throw new Error("Database not initialized");
    try {
        const meals = await db.getAllAsync(
            `SELECT * FROM logged_meals 
       WHERE userId = ? AND date >= ? AND date < date(?, '+7 days')
       ORDER BY loggedAt DESC`,
            [userId, startDate, startDate],
        );
        return meals || [];
    } catch (error) {
        console.error("[DB] Failed to fetch weekly logged meals:", error);
        return [];
    }
}
