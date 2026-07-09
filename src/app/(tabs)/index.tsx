import { EnsoProgress } from "@/components/EnsoProgress";
import MealCard from "@/components/MealCard";
import { MealCompletionAnimation } from "@/components/MealCompletionAnimation";
import { MealConfirmationModal } from "@/components/MealConfirmationModal";
import { useLogMeal } from "@/hooks/useLogMeal";
import { useTodaysMealHighlight } from "@/hooks/useTodaysMealHighlight";
import { createDailyMealPlan, createUserProfile, getDailyMealPlan, initializeDatabase } from "@/lib/db";
import { getUserId, setUserProfile } from "@/lib/storage";
import { generateDailyMealPlan } from "@/logic/mealPlanning";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import FoodHighlight from "../../components/FoodHighlight";
import { foods, type Food } from "../../constants/foods";
import { Colors, Fonts, Spacing, useAppFonts } from "../../constants/theme";

const ScreenX = Dimensions.get("window").width;
const DEMO_USER_ID = "demo-user";

export default function GetStarted() {
    const [fontsLoaded] = useAppFonts();
    const { highlight, variants } = useTodaysMealHighlight(DEMO_USER_ID, foods);
    const { todayStats, loadTodayStats, handleLogMeal } = useLogMeal(DEMO_USER_ID, foods);

    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [isLoggingMeal, setIsLoggingMeal] = useState(false);

    // Initialize database on app startup
    useEffect(() => {
        const initialize = async () => {
            // Initialize database
            await initializeDatabase();

            // Check if user profile exists, if not create one
            const userProfile = await getUserId();
            if (!userProfile) {
                // Create default user profile
                await setUserProfile(DEMO_USER_ID, "cut", 2000, 150, 200, 65);
                await createUserProfile(DEMO_USER_ID, "cut", 2000, 150, 200, 65);
            }

            // Generate daily meal plan if it doesn't exist
            const today = new Date().toISOString().split("T")[0];
            const existingPlan = await getDailyMealPlan(DEMO_USER_ID, today);

            if (!existingPlan) {
                const plan = generateDailyMealPlan(DEMO_USER_ID, { dailyCalorieTarget: 2000 }, foods);

                const slots = [
                    { mealType: "breakfast", foodId: plan.meals.breakfast.id, calorieAllocation: 500 },
                    { mealType: "lunch", foodId: plan.meals.lunch.id, calorieAllocation: 600 },
                    { mealType: "dinner", foodId: plan.meals.dinner.id, calorieAllocation: 700 },
                    { mealType: "snack", foodId: plan.meals.snack.id, calorieAllocation: 200 },
                ];

                await createDailyMealPlan(DEMO_USER_ID, today, slots);
            }

            // Load today's stats
            await loadTodayStats();
        };

        initialize();
    }, [loadTodayStats]);

    if (!fontsLoaded) {
        return null;
    }

    const highlightMeal = highlight ?? foods[0];
    const carouselMeals = variants ? [variants.left, variants.center, variants.right] : foods;

    const handleMealPress = (food: Food) => {
        setSelectedFood(food);
        setModalVisible(true);
    };

    const handleConfirmMeal = async () => {
        if (!selectedFood) return;

        setIsLoggingMeal(true);
        try {
            const success = await handleLogMeal(selectedFood.id);
            if (success) {
                setModalVisible(false);
                setShowCompletion(true);
                setSelectedFood(null);
                setTimeout(() => {
                    setShowCompletion(false);
                }, 1500);
            }
        } catch (error) {
            console.error("Failed to log meal:", error);
        } finally {
            setIsLoggingMeal(false);
        }
    };

    const handleAlternativeMeal = () => {
        // TODO: Implement alternative meal selection flow
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
                <View style={styles.dayStats}>
                    <EnsoProgress
                        kcalEaten={todayStats.kcalEaten}
                        kcalTarget={todayStats.kcalTarget}
                        protein={todayStats.protein}
                        carbs={todayStats.carbs}
                        fat={todayStats.fat}
                    />
                </View>

                <View style={styles.highlightMeal}>
                    <FoodHighlight food={highlightMeal} onLogPress={() => handleMealPress(highlightMeal)} />
                </View>

                <View style={styles.mealCarouselStyle}>
                    <FlatList
                        data={carouselMeals}
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => {
                            return <MealCard item={item} />;
                        }}
                        horizontal
                        ItemSeparatorComponent={<View style={{ width: ScreenX * 0.1 }}></View>}
                        ListFooterComponent={<View style={{ width: ScreenX * 0.1 }}></View>}
                        ListHeaderComponent={<View style={{ width: ScreenX * 0.1 }}></View>}
                        alwaysBounceHorizontal
                        decelerationRate={"fast"}
                        fadingEdgeLength={100}
                        snapToAlignment="center"
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>

            <MealConfirmationModal
                visible={modalVisible}
                food={selectedFood}
                onConfirm={handleConfirmMeal}
                onAlternative={handleAlternativeMeal}
                onClose={() => setModalVisible(false)}
                loading={isLoggingMeal}
            />

            <MealCompletionAnimation visible={showCompletion} onComplete={() => setShowCompletion(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    dayStats: {
        flexDirection: "row",
        width: "80%",
        borderRadius: Spacing.l,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.surface,
        marginBottom: 12,
        alignSelf: "center",
    },
    statsText: {
        fontFamily: Fonts.regular,
        color: Colors.text,
    },
    highlightMeal: {
        height: 550,
        width: ScreenX * 0.8,
        padding: Spacing.xl,
        textAlign: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.surface,
        alignSelf: "center",
        marginBottom: Spacing.l,
        borderRadius: Spacing.l,
    },
    mealCarouselStyle: {
        height: 200,
        width: ScreenX,
    },
});
