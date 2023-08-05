import React from "react";
import Countdown from "react-native-countdown-component";
import { useCountdownLogic } from "../../hooks/CountDownHooks/useCountdownLogic";
import { Button, View, StyleSheet } from "react-native";
import { useCountdownData } from "../../hooks/CountDownHooks/useCountdownData";

export default function CountdownComponent({ countdownTime, isCountdownVisible, size = 20 }) {
  const { setIsCountdownVisible } = useCountdownData();

  console.log("CountdownComponent: ", countdownTime, isCountdownVisible, size);
  return (
    <View style={styles.container}>
      {countdownTime !== undefined && countdownTime !== null && countdownTime > 0 && isCountdownVisible && (
        <Countdown
          until={1000}
          onFinish={() => {}}
          size={size}
          timeLabelStyle={styles.timeLabel}
          digitStyle={styles.digit}
          digitTxtStyle={styles.digitText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  timeLabel: {
    color: "#000",
  },
  digit: {
    borderWidth: 2,
    borderColor: "#000",
  },
  digitText: {
    color: "#000",
  },
});
