import { useState, useEffect } from "react";
import { useCountdownData } from "./useCountdownData";

export const useCountdownLogic = (isAuth) => {
  const [countdownTime, setCountdownTime] = useState(0);
  const { countdownEnd, updateCountdownDate, isCountdownVisible, setIsCountdownVisible } = useCountdownData(isAuth);

  const getCountdownTime = () => {
    if (!countdownEnd) return 0;
    const endDate = new Date(countdownEnd.year, countdownEnd.month - 1, countdownEnd.day);
    const diff = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
    return diff > 0 ? diff : 0;
  };

  const startCountdown = async (selectedDate) => {
    let countdownDate = {
      year: parseInt(selectedDate.slice(0, 4)),
      month: parseInt(selectedDate.slice(5, 7)),
      day: parseInt(selectedDate.slice(8, 10)),
    };
    await updateCountdownDate(countdownDate); // Update countdown date
    const diff = getCountdownTime(); // Calculate countdown time after updating the date
    if (diff > 0) {
      setCountdownTime(diff);
      setIsCountdownVisible(true);
    }
  };

  useEffect(() => {
    let isMounted = true; // create a flag
    const diff = getCountdownTime();
    if (diff > 0 && isMounted && isAuth) {
      // use this flag before updating the state
      setCountdownTime(diff);
      setIsCountdownVisible(true);
    }
    return () => {
      isMounted = false; // set it to false when component unmounts
    };
  }, [countdownEnd, isAuth]);

  return { countdownTime, isCountdownVisible, startCountdown, setIsCountdownVisible };
};
