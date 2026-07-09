import { Food } from "@/constants/foods";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import React, { useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface MealConfirmationModalProps {
    visible: boolean;
    food: Food | null;
    onConfirm: () => void;
    onAlternative: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const MealConfirmationModal: React.FC<MealConfirmationModalProps> = ({
    visible,
    food,
    onConfirm,
    onAlternative,
    onClose,
    loading = false,
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
            }).start();
        } else {
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, scaleAnim]);

    if (!food) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Did you eat this?</Text>
                        <Text style={styles.subtitle}>{food.nameEn}</Text>
                    </View>

                    <View style={styles.macroInfo}>
                        <View style={styles.macroRow}>
                            <Text style={styles.macroLabel}>Protein</Text>
                            <Text style={styles.macroValue}>{food.macros.protein}g</Text>
                        </View>
                        <View style={styles.macroRow}>
                            <Text style={styles.macroLabel}>Carbs</Text>
                            <Text style={styles.macroValue}>{food.macros.carbs}g</Text>
                        </View>
                        {food.macros.fat && (
                            <View style={styles.macroRow}>
                                <Text style={styles.macroLabel}>Fat</Text>
                                <Text style={styles.macroValue}>{food.macros.fat}g</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.button, styles.primaryButton, loading && styles.disabled]}
                            onPress={onConfirm}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Yes, I ate this</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.secondaryButton, loading && styles.disabled]}
                            onPress={onAlternative}
                            disabled={loading}
                        >
                            <Text style={styles.secondaryButtonText}>I ate something else</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.tertiaryButton, loading && styles.disabled]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.tertiaryButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    container: {
        width: "85%",
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: Spacing.xl,
        gap: Spacing.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        gap: Spacing.sm,
    },
    title: {
        fontFamily: Fonts.serif,
        fontSize: 20,
        fontWeight: "600",
        color: Colors.kanji,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.kanji,
        textAlign: "center",
        opacity: 0.8,
    },
    macroInfo: {
        gap: Spacing.sm,
        paddingVertical: Spacing.m,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.macros,
        opacity: 0.6,
    },
    macroRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    macroLabel: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.kanji,
    },
    macroValue: {
        fontFamily: Fonts.bold,
        fontSize: 13,
        color: Colors.kanji,
    },
    actions: {
        gap: Spacing.m,
        paddingTop: Spacing.m,
    },
    button: {
        paddingVertical: Spacing.m,
        borderRadius: 8,
        alignItems: "center",
    },
    primaryButton: {
        backgroundColor: Colors.accent,
    },
    buttonText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.surface,
    },
    secondaryButton: {
        backgroundColor: Colors.macros,
    },
    secondaryButtonText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.surface,
    },
    tertiaryButton: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.kanji,
    },
    tertiaryButtonText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.kanji,
    },
    disabled: {
        opacity: 0.5,
    },
});
