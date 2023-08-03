import React from "react";
import Countdown from "react-native-countdown-component";
import { useCountdownLogic } from "../../hooks/useCountdownLogic";
import { Button } from "react-native";

export default function CountdownComponent({ selectedDate, isLongDistance, size = 20 }) {
  const { countdownTime, isCountdownVisible, startCountdown } = useCountdownLogic();

  return (
    <>
      {countdownTime > 0 && isCountdownVisible && (
        <Countdown until={countdownTime} onFinish={() => setIsCountdownVisible(false)} size={size} />
      )}
      {isLongDistance && <Button title="Start Countdown" onPress={() => startCountdown(selectedDate)} />}
    </>
  );
}
