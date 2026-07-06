import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FoodHighlight from "../../components/FoodHighlight";
import { foods } from "../../constants/foods";
import { Colors, Fonts, Spacing, useAppFonts } from "../../constants/theme";

const ScreenX = Dimensions.get("window").width;

export default function GetStarted() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dayStats}>
        <Image
          source={require("../../../assets/brandKit/enso.png")}
          alt="ProgressBar"
          resizeMode="contain"
          style={{ width: 60, height: 60 }}
        />
        <View>
          <Text style={styles.statsText}>Protein: 473</Text>
          <Text style={styles.statsText}>Carbs: 32</Text>
          <Text style={styles.statsText}>Water: 5</Text>
        </View>
      </View>

      <FlatList
        data={foods}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => {
          return (
            <View style={styles.highlightMeal}>
              <FoodHighlight food={item} />
            </View>
          );
        }}
        horizontal
        ItemSeparatorComponent={<View style={{ width: ScreenX * 0.1 }}></View>}
        ListHeaderComponent={<View style={{ width: ScreenX * 0.1 }}></View>}
        ListFooterComponent={<View style={{ width: ScreenX * 0.1 }}></View>}
        alwaysBounceHorizontal
        decelerationRate={"fast"}
        fadingEdgeLength={100}
        snapToAlignment="start"
        snapToInterval={ScreenX - ScreenX * 0.1}
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
          width: ScreenX,
          height: "80%",
          paddingVertical: Spacing.xl,
        }}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  dayStats: {
    flexDirection: "row",
    width: "80%",
    borderRadius: Spacing.l,
    // position: "absolute",
    // top: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginBottom: 12,
  },
  statsText: {
    fontFamily: Fonts.regular,
    color: Colors.text,
  },

  highlightMeal: {
    height: "84%",
    width: ScreenX * 0.8,
    padding: Spacing.xl,
    textAlign: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    position: "static",
  },
});
