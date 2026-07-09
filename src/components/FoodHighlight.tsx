import React from "react";
import { Food } from "../constants/foods";
import FoodHighlightCard from "./FoodHighlightCard";

type Props = {
    food: Food;
    onLogPress?: () => void;
};

export default function FoodHighlight({ food, onLogPress }: Props) {
    // const foodId = food.id;
    const heroTitle = food.nameEn;
    const heroSubtitle = food.aliases?.find(alias => alias.toLowerCase() !== food.nameEn.toLowerCase()) || heroTitle;
    const japaneseLabel = food.nameJa;
    const headerLabel = food.notes ?? "Season special";

    return (
        <FoodHighlightCard
            headerLabel={headerLabel}
            title={heroTitle}
            bigLabel={heroSubtitle}
            japaneseLabel={japaneseLabel}
            heroImage={food.image}
            macros={food.macros}
            onLogPress={onLogPress}
        />
    );
}
