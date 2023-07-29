import React from "react";
import Countdown from "react-native-countdown-component";

export default function CountdownComponent({ until, onFinish, size = 20 }) {
  return <Countdown until={until} onFinish={onFinish} size={size} />;
}
