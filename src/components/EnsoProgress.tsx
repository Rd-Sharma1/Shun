// components/EnsoProgress.tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

interface EnsoProgressProps {
  kcalEaten: number;
  kcalTarget: number;
  protein: { eaten: number; target: number };
  carbs: { eaten: number; target: number };
  fat: { eaten: number; target: number };
}

export const EnsoProgress: React.FC<EnsoProgressProps> = ({
  kcalEaten,
  kcalTarget,
  protein,
  carbs,
  fat,
}) => {
  const fillProgress = useSharedValue(0);

  useEffect(() => {
    // Animate from current to new progress
    fillProgress.value = withSpring((kcalEaten / kcalTarget) * 100);
  }, [kcalEaten]);

  // SVG circle stroke-dasharray animation
  // Circumference = 2 * π * r, arc = ~280 degrees
  const circumference = 2 * Math.PI * 45; // r=45
  const arcLength = (circumference * 280) / 360; // 280-degree arc

  return (
    <View style={styles.container}>
      <Animated.View style={useAnimatedStyle}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          {/* Background arc */}
          <circle cx={60} cy={60} r={45} fill="none" stroke="#f0f0f0" strokeWidth={4} />
          
          {/* Filled arc — animates based on fillProgress */}
          <Animated.circle
            cx={60}
            cy={60}
            r={45}
            fill="none"
            stroke="#a74a3e" // Deep red, Japanese aesthetic
            strokeWidth={4}
            strokeDasharray={arcLength}
            strokeDashoffset={animatedOffset} // Drives from circumference to 0
          />
        </svg>
      </Animated.View>

      {/* Stats on the right */}
      <View style={styles.stats}>
        <Text style={styles.statLabel}>
          P: {protein.eaten}/{protein.target}g
        </Text>
        <Text style={styles.statLabel}>
          C: {carbs.eaten}/{carbs.target}g
        </Text>
        <Text style={styles.statLabel}>
          F: {fat.eaten}/{fat.target}g
        </Text>
      </View>
    </View>
  );
};