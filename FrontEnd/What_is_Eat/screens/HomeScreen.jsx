import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Coffee Shop</Text>
      <Text style={styles.subTitleText}>
        Your one stop shop for artisanal coffee and tea.
      </Text>
      <Button
        title="Explore"
        onPress={() => navigation.navigate("Explore")}
        color="#8c6b52"
      />
      {/* 추천 상품 리스트는 나중에 추가하기 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#371c07",
    marginBottom: 10
  },
  subTitleText: {
    fontSize: 16,
    color: "#8c6b52",
    textAlign: "center",
    marginBottom: 20
  }
});

export default HomeScreen;