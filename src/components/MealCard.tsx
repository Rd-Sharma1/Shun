import type { Food } from "@/constants/foods";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

const MealCard = ({ item }: { item: Food }) => {
    // console.log(item);
    // console.log("Image=", item.image);
    const imageSource: ImageSourcePropType = item.image as ImageSourcePropType;
    return (
        <View style={styles.mealBoxCard}>
            <View>
                <View style={styles.macros}>
                    <Text style={styles.macroText}>P {item.macros.protein}g</Text>
                    <Text style={styles.macroText}>C {item.macros.carbs}g</Text>
                    {typeof item.macros.fat !== "undefined" && (
                        <Text style={styles.macroText}>F {item.macros.fat}g</Text>
                    )}
                </View>
            </View>
            <View style={styles.visual}>
                <Text style={styles.mealName}>{item.nameEn}</Text>
                <Image
                    source={imageSource}
                    style={styles.image}
                    resizeMode="contain"
                    resizeMethod="scale"
                    fadeDuration={200}
                    defaultSource={require("../../assets/brandKit/emptyPlates.jpg")}
                    //   key={title}
                />
                <Text style={styles.mealNameJa}>{item.nameJa}</Text>
                <View style={styles.imageOverlay}></View>
            </View>
        </View>
    );
};

export default MealCard;

const styles = StyleSheet.create({
    mealBoxCard: {
        marginVertical: Spacing.xl,
        width: 250,
        height: 151,
        borderRadius: Spacing.l,
        flexDirection: "row",
        // backgroundColor: "red",
    },

    visual: {
        alignItems: "center",
        textAlign: "center",
        backgroundColor: Colors.surface,
        width: 200,
        height: 150,
        zIndex: -3,
        borderWidth: 1,
        borderRadius: Spacing.l,
        borderColor: Colors.macros + 20,
    },
    mealName: {
        fontFamily: Fonts.serif,
        color: Colors.kanji,
        fontSize: Spacing.xl,
        textTransform: "uppercase",
        textAlign: "center",
    },
    mealNameJa: {
        fontFamily: Fonts.japanese,
        color: Colors.primary,
        fontSize: Spacing.big,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface + 80,
        paddingVertical: Spacing.sm,
        borderTopWidth: 1,
        borderColor: Colors.macros + 20,
    },
    image: {
        ...StyleSheet.absoluteFill,
        width: 200,
        height: 150,
        zIndex: -2,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFill,
        zIndex: -1,
        backgroundColor: Colors.background + 20,
    },

    macros: {
        // left: Spacing.l,
        alignItems: "center",
        height: "100%",
        justifyContent: "space-evenly",
        flexDirection: "column",
        backgroundColor: Colors.macros + 20,
        borderTopLeftRadius: Spacing.l,
        borderBottomLeftRadius: Spacing.l,
        paddingVertical: Spacing.m,
        // alignSelf: "flex-start",
    },
    macroText: {
        color: Colors.accent,
        fontFamily: Fonts.serifItalic,
        fontSize: Spacing.xxl,
        marginHorizontal: Spacing.m,
    },
});
