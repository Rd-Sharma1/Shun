export interface Food {
    id: string;
    nameEn: string;
    nameJa?: string;
    aliases?: string[];
    image: any; // require() result
    macros: {
        protein: number; // grams
        carbs: number; // grams
        fat?: number; // grams
    };
    mealTypes: ("breakfast" | "lunch" | "dinner" | "snack")[];
    servingSize?: string; // "1 bowl", "150g", etc.
    notes?: string;
}

export function calculateCalories(macros: Food["macros"]): number {
    const protein = macros.protein * 4;
    const carbs = macros.carbs * 4;
    const fat = (macros.fat || 0) * 9;
    return protein + carbs + fat;
}

export const foods: Food[] = [
    {
        id: "meal3",
        nameEn: "Katsuon",
        nameJa: "カツオン",
        aliases: ["Katsuon", "Katsu"],
        image: require("../../assets/foods/meal3.png"),
        macros: { protein: 42, carbs: 55, fat: 18 },
        mealTypes: ["lunch"], // Can only be lunch
        servingSize: "1 bowl",
        notes: "Highlight dish",
    },
    {
        id: "sushi",
        nameEn: "Sashimi Bowl",
        nameJa: "刺身丼",
        aliases: ["Sashimi", "Chirashi"],
        image: require("../../assets/foods/sushi.png"),
        macros: { protein: 34, carbs: 18, fat: 6 },
        mealTypes: ["lunch", "dinner"], // Can only be lunch
        servingSize: "1 bowl",
    },
    {
        id: "pancakes",
        nameEn: "Fluffy Pancakes",
        nameJa: "パンケーキ",
        image: require("../../assets/foods/pancakes.png"),
        macros: { protein: 8, carbs: 72, fat: 14 },
        mealTypes: ["breakfast"], // Can only be breakfast
        servingSize: "2 pieces",
    },
    {
        id: "ramen",
        nameEn: "Ramen",
        nameJa: "ラーメン",
        image: require("../../assets/foods/ramen.png"),
        macros: { protein: 24, carbs: 68, fat: 20 },
        mealTypes: ["lunch", "dinner"], // Can be lunch or dinner
        servingSize: "1 bowl",
    },
    {
        id: "cappucino",
        nameEn: "Cappuccino",
        nameJa: "カプチーノ",
        image: require("../../assets/foods/cappucino.png"),
        macros: { protein: 3, carbs: 6, fat: 3 },
        mealTypes: ["breakfast", "snack"], // Can be breakfast or snack
        servingSize: "1 cup",
    },
];

export default foods;
