import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const Button = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Shared Button</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
