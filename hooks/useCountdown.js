import { useState, useEffect, useRef } from "react";
import getPartnerUsername from "../utils/getPartnerUsername";
import { useRelationshipStatus } from "./useRelationshipStatus";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useCountdown = (db, auth) => {
  const [countdownEnd, setCountdownEnd] = useState(null);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const intervalRef = useRef(null);

  const { relationshipStatus } = useRelationshipStatus();

  const getCoupleID = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  const calculateCountdown = () => {
    if (countdownEnd) {
      const endDate = new Date(countdownEnd.year, countdownEnd.month - 1, countdownEnd.day);
      const diff = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
      setCountdownTime(diff > 0 ? diff : 0);

      if (diff <= 0) {
        setIsCountdownVisible(false);
      }
    }
  };

  const fetchCountdownEndDate = async () => {
    if (relationshipStatus === "Longdistant") {
      // Consider fixing this typo
      const partnerUsername = await getPartnerUsername(auth.currentUser.uid);
      let partnerUid = null;
      if (partnerUsername) {
        const usernameRef = doc(db, "usernames", partnerUsername);
        const usernameSnap = await getDoc(usernameRef);
        partnerUid = usernameSnap.data().uid;
      }

      const coupleID = getCoupleID(auth.currentUser.uid, partnerUid);
      const countdownRef = doc(db, "countdowns", coupleID);
      const countdownSnap = await getDoc(countdownRef);

      if (countdownSnap.exists()) {
        const countdownData = countdownSnap.data();
        initializeCountdown(countdownData.endDate);
      }
    }
  };

  const initializeCountdown = (newEndDate) => {
    setCountdownEnd(newEndDate); // Set end date in state
    setIsCountdownVisible(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(calculateCountdown, 1000);
  };

  useEffect(() => {
    fetchCountdownEndDate();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [relationshipStatus]); // Only depending on relationshipStatus here

  useEffect(() => {
    if (countdownEnd) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(calculateCountdown, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [countdownEnd]);

  return {
    countdownTime,
    initializeCountdown,
    isCountdownVisible,
  };
};
