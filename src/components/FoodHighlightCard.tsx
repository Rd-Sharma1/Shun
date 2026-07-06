import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, Fonts, Spacing } from "../constants/theme";

type Props = {
  headerLabel: string;
  title: string;
  bigLabel: string;
  japaneseLabel?: string;
  heroImage: any;
  macros: {
    protein: number;
    carbs: number;
    fat?: number;
  };
};

export default function FoodHighlightCard({
  headerLabel,
  title,
  bigLabel,
  japaneseLabel,
  heroImage,
  macros,
}: Props) {
  const imgSource: ImageSourcePropType = heroImage as ImageSourcePropType;

  return (
    <View style={styles.card}>
      {/* <View style={styles.overlay}> */}

      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>{headerLabel}</Text>

        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.macros}>
        <Text style={styles.macroText}>P {macros.protein}g</Text>
        <Text style={styles.macroText}>C {macros.carbs}g</Text>
        {typeof macros.fat !== "undefined" && (
          <Text style={styles.macroText}>F {macros.fat}g</Text>
        )}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Image
          source={imgSource}
          style={styles.image}
          resizeMode="contain"
          resizeMethod="scale"
          fadeDuration={200}
          defaultSource={require("../../assets/brandKit/emptyPlates.jpg")}
          key={title}
        />

        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={styles.bigLabel}>{bigLabel}</Text>
            {japaneseLabel ? (
              <Text style={styles.japaneseLabel}>{japaneseLabel}</Text>
            ) : null}

            <Pressable style={styles.logBtn}>
              <Text style={styles.logBtnText}>Log the meal</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: "100%",
    width: "100%",
    borderRadius: Spacing.l,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    padding: Spacing.l,
    justifyContent: "space-between",
  },

  image: {
    //  ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
    opacity: 0.9,
    zIndex: -1,
    // backgroundColor: 'green',
  },

  headerRow: {
    alignItems: "center",
  },
  headerLabel: {
    fontFamily: Fonts.regular,
    color: Colors.text,
    fontSize: 12,
    letterSpacing: 1,
  },
  title: {
    fontFamily: Fonts.serif,
    color: Colors.kanji,
    fontSize: 28,
    textTransform: "uppercase",
  },

  footer: {
    alignItems: "center",
    justifyContent: "space-around",
    // backgroundColor: ,
  },
  footerText: {
    alignItems: "center",
    position: "absolute",
    bottom: -Spacing.xl,
    backgroundColor: Colors.surface + "15",
  },
  bigLabel: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: "center",
    fontSize: 40,
    textTransform: "uppercase",
    lineHeight: 38,
    letterSpacing: 0.5,
  },
  japaneseLabel: {
    fontFamily: Fonts.japanese,
    color: Colors.kanji,
    fontSize: 24,
    letterSpacing: -2,
  },
  logBtn: {
    padding: Spacing.l,
    marginVertical: Spacing.m,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.l,
    backgroundColor: Colors.accent + "20",
  },
  logBtnText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontSize: Spacing.xl,
  },

  macros: {
    position: "absolute",
    // left: Spacing.l,
    top: Spacing.big * 4,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: 'rgba(0, 0, 0, 0.13)',
    backgroundColor: Colors.macros + "20",
    borderRadius: Spacing.l,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    alignSelf: "center",
  },
  macroText: {
    color: Colors.primary,
    fontFamily: Fonts.serifItalic,
    fontSize: Spacing.xl,
    marginHorizontal: Spacing.m,
  },
});
