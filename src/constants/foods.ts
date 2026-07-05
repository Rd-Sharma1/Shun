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
  notes?: string;
}

export const foods: Food[] = [
  {
    id: "meal3",
    nameEn: "Katsuon",
    nameJa: "カツオン",
    aliases: ["Katsuon", "Katsu"],
    image: require("../../assets/foods/meal3.png"),
    macros: { protein: 42, carbs: 55, fat: 18 },
    notes: "Highlight dish",
  },
  {
    id: "sushi",
    nameEn: "Sashimi Bowl",
    nameJa: "刺身丼",
    aliases: ["Sashimi", "Chirashi"],
    image: require("../../assets/foods/sushi.png"),
    macros: { protein: 34, carbs: 18, fat: 6 },
  },
  {
    id: "pancakes",
    nameEn: "Fluffy Pancakes",
    nameJa: "パンケーキ",
    image: require("../../assets/foods/pancakes.png"),
    macros: { protein: 8, carbs: 72, fat: 14 },
  },
  {
    id: "ramen",
    nameEn: "Ramen",
    nameJa: "ラーメン",
    image: require("../../assets/foods/ramen.png"),
    macros: { protein: 24, carbs: 68, fat: 20 },
  },
  {
    id: "cappucino",
    nameEn: "Cappuccino",
    nameJa: "カプチーノ",
    image: require("../../assets/foods/cappucino.png"),
    macros: { protein: 3, carbs: 6, fat: 3 },
  },
];

export default foods;
