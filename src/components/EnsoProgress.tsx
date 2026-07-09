import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withSpring } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { Colors, Fonts, Spacing } from "../constants/theme";

interface EnsoProgressProps {
    kcalEaten: number;
    kcalTarget: number;
    protein: { eaten: number; target: number };
    carbs: { eaten: number; target: number };
    fat: { eaten: number; target: number };
}

export const EnsoProgress: React.FC<EnsoProgressProps> = ({ kcalEaten, kcalTarget, protein, carbs, fat }) => {
    const fillProgress = useSharedValue(0);
    const progressPercent = kcalTarget > 0 ? Math.min(100, Math.max(0, (kcalEaten / kcalTarget) * 100)) : 0;

    useEffect(() => {
        fillProgress.value = withSpring(progressPercent, {
            damping: 18,
            stiffness: 120,
        });
    }, [fillProgress, progressPercent]);

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.78;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference - (arcLength * fillProgress.value) / 100,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.visualArea}>
                <Svg width={140} height={140} viewBox="0 0 140 140">
                    <Circle
                        cx="70"
                        cy="70"
                        r={radius}
                        stroke={Colors.background}
                        strokeWidth={10}
                        fill={Colors.surface}
                    />
                    <AnimatedCircle
                        cx="70"
                        cy="70"
                        r={radius}
                        stroke={Colors.accent}
                        strokeWidth={10}
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        animatedProps={animatedProps}
                    />
                    <Path
                        d="M70 28c-9 10-16 20-16 33 0 10 7 20 16 27 9-7 16-17 16-27 0-13-7-23-16-33z"
                        fill="none"
                        opacity={0.95}
                    />
                </Svg>

                <View style={styles.centerLabel}>
                    <Text style={styles.ringValue}>{Math.round(progressPercent)}%</Text>
                    <Text style={styles.ringLabel}>complete</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <Text style={styles.statLabel}>
                    P {protein.eaten}/{protein.target}g
                </Text>
                <Text style={styles.statLabel}>
                    C {carbs.eaten}/{carbs.target}g
                </Text>
                <Text style={styles.statLabel}>
                    F {fat.eaten}/{fat.target}g
                </Text>
            </View>
        </View>
    );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.l,
        paddingVertical: Spacing.l,
        gap: Spacing.l,
    },
    visualArea: {
        width: 140,
        height: 140,
        justifyContent: "center",
        alignItems: "center",
    },
    centerLabel: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    ringValue: {
        fontFamily: Fonts.bold,
        color: Colors.kanji,
        fontSize: 20,
    },
    ringLabel: {
        fontFamily: Fonts.regular,
        color: Colors.text,
        fontSize: 12,
        marginTop: 2,
    },
    stats: {
        flex: 1,
        gap: Spacing.sm,
    },
    statLabel: {
        fontFamily: Fonts.medium,
        color: Colors.text,
        fontSize: 14,
        letterSpacing: 0.2,
    },
});
