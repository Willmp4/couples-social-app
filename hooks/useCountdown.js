import { useState, useEffect } from "react";
import getPartnerUsername from "../utils/getPartnerUsername";
import { useRelationshipStatus } from "./useRelationshipStatus";
import { doc, getDoc, setDoc } from "firebase/firestore";
export const useCountdown = (db, auth) => {
  const [countdownEnd, setCountdownEnd] = useState(null);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);

  const { relationshipStatus } = useRelationshipStatus();

  const getCoupleID = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  useEffect(() => {
    fetchCountdownEndDate();
  }, [relationshipStatus]);

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

  const setCountdownEndDate = async (endDate) => {
    const partnerUsername = await getPartnerUsername(auth.currentUser.uid);
    let partnerUid = null;
    if (partnerUsername) {
      const usernameRef = doc(db, "usernames", partnerUsername);
      const usernameSnap = await getDoc(usernameRef);
      partnerUid = usernameSnap.data().uid;
    }
  
    const coupleID = getCoupleID(auth.currentUser.uid, partnerUid);
    const countdownRef = doc(db, "countdowns", coupleID);
  
    await setDoc(countdownRef, { endDate });
  };

  
  

  const initializeCountdown = (newEndDate) => {
    setCountdownEndDate(newEndDate); // Save to the database
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
