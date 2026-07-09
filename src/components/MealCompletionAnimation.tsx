import { Colors, Fonts, Spacing } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface MealCompletionAnimationProps {
    visible: boolean;
    onComplete?: () => void;
}

export const MealCompletionAnimation: React.FC<MealCompletionAnimationProps> = ({ visible, onComplete }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 5,
                }),
                Animated.delay(800),
                Animated.parallel([
                    Animated.spring(scaleAnim, {
                        toValue: 1.2,
                        useNativeDriver: true,
                        friction: 3,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                scaleAnim.setValue(0);
                opacityAnim.setValue(1);
                onComplete?.();
            });
        }
    }, [visible, scaleAnim, opacityAnim, onComplete]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <Text style={styles.text}>Meal logged!</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
    },
    content: {
        alignItems: "center",
        gap: Spacing.m,
    },
    checkmark: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.accent,
        justifyContent: "center",
        alignItems: "center",
    },
    checkmarkText: {
        fontSize: 40,
        color: Colors.surface,
        fontWeight: "bold",
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: Colors.kanji,
    },
});
