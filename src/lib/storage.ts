import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
    ONBOARDING_COMPLETE: "shun_onboarding_complete",
    USER_ID: "shun_user_id",
    USER_GOAL: "shun_user_goal",
    DAILY_CALORIE_TARGET: "shun_daily_calorie_target",
    PROTEIN_TARGET: "shun_protein_target",
    CARBS_TARGET: "shun_carbs_target",
    FAT_TARGET: "shun_fat_target",
};

export async function getOnboardingStatus() {
    try {
        const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        return status === "true";
    } catch (error) {
        console.error("[AsyncStorage] Failed to get onboarding status:", error);
        return false;
    }
}

export async function setOnboardingComplete(userId: string) {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
        console.log("[AsyncStorage] Onboarding marked complete");
    } catch (error) {
        console.error("[AsyncStorage] Failed to set onboarding complete:", error);
    }
}

export async function getUserId(): Promise<string | null> {
    try {
        const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        return userId;
    } catch (error) {
        console.error("[AsyncStorage] Failed to get user ID:", error);
        return null;
    }
}

export async function setUserProfile(
    userId: string,
    goal: "bulk" | "cut" | "maintain",
    dailyCalorieTarget: number,
    proteinTarget: number,
    carbsTarget: number,
    fatTarget: number,
) {
    try {
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.USER_ID, userId],
            [STORAGE_KEYS.USER_GOAL, goal],
            [STORAGE_KEYS.DAILY_CALORIE_TARGET, dailyCalorieTarget.toString()],
            [STORAGE_KEYS.PROTEIN_TARGET, proteinTarget.toString()],
            [STORAGE_KEYS.CARBS_TARGET, carbsTarget.toString()],
            [STORAGE_KEYS.FAT_TARGET, fatTarget.toString()],
        ]);
        console.log("[AsyncStorage] User profile saved");
    } catch (error) {
        console.error("[AsyncStorage] Failed to save user profile:", error);
    }
}

export async function getUserProfile() {
    try {
        const values = await AsyncStorage.multiGet([
            STORAGE_KEYS.USER_ID,
            STORAGE_KEYS.USER_GOAL,
            STORAGE_KEYS.DAILY_CALORIE_TARGET,
            STORAGE_KEYS.PROTEIN_TARGET,
            STORAGE_KEYS.CARBS_TARGET,
            STORAGE_KEYS.FAT_TARGET,
        ]);

        const profile = {
            userId: values[0][1],
            goal: values[1][1] as "bulk" | "cut" | "maintain",
            dailyCalorieTarget: values[2][1] ? parseInt(values[2][1]) : 2000,
            proteinTarget: values[3][1] ? parseFloat(values[3][1]) : 150,
            carbsTarget: values[4][1] ? parseFloat(values[4][1]) : 200,
            fatTarget: values[5][1] ? parseFloat(values[5][1]) : 65,
        };

        return profile;
    } catch (error) {
        console.error("[AsyncStorage] Failed to get user profile:", error);
        return null;
    }
}

export async function clearOnboarding() {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        console.log("[AsyncStorage] Onboarding cleared");
    } catch (error) {
        console.error("[AsyncStorage] Failed to clear onboarding:", error);
    }
}
