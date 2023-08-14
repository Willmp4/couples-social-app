import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { auth } from "firebase/auth";
const useUserTimezone = (timezone) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      if (timezone) {
        const time = moment.tz(timezone).format("LT");
        setCurrentTime(time);
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  return currentTime;
};

export default useUserTimezone;
