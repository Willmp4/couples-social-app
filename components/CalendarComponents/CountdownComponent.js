import React from "react";
import Countdown from "react-native-countdown-component";
import { useCountdownLogic } from "../../hooks/CountDownHooks/useCountdownLogic";
import { Button, View, StyleSheet } from "react-native";

export default function CountdownComponent({ countdownTime, isCountdownVisible, size = 20 }) {
  const { setIsCountdownVisible } = useCountdownLogic();

  return (
    <View style={styles.container}>
      {countdownTime > 0 && isCountdownVisible && (
        <Countdown
          until={countdownTime}
          onFinish={() => setIsCountdownVisible(false)}
          size={size}
          timeLabelStyle={styles.timeLabel}
          timeToShow={["D", "H", "M", "S"]}
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
    backgroundColor: "000",
    borderWidth: 2,
    borderColor: "#000",
  },
  digitText: {
    color: "#000",
  },
});
