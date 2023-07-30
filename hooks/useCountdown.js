import { useState, useEffect } from "react";

export const useCountdown = (initialEndDate) => {
  const [countdownEnd, setCountdownEnd] = useState(initialEndDate);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);

  const initializeCountdown = (newEndDate) => {
    setIsCountdownVisible(true);
    setCountdownEnd(newEndDate);
  };

  useEffect(() => {
    if (countdownEnd) {
      const calculateCountdown = () => {
        const endDate = new Date(countdownEnd.year, countdownEnd.month - 1, countdownEnd.day);
        const diff = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
        setCountdownTime(diff > 0 ? diff : 0);

        if (diff <= 0) {
          setIsCountdownVisible(false);
        }
      };

      calculateCountdown();

      // Set an interval to update the countdown every second
      const intervalId = setInterval(calculateCountdown, 1000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, [countdownEnd]);

  return {
    countdownTime,
    initializeCountdown,
    isCountdownVisible,
  };
};
