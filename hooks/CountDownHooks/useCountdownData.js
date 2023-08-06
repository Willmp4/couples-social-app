import { useState, useEffect } from "react";
import getPartnerUsername from "../../utils/getPartnerUsername";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../utils/Firebase";
import { useRelationshipStatus } from "../useRelationshipStatus";
import { setDoc } from "firebase/firestore";

export const useCountdownData = (isAuth) => {
  const [countdownEnd, setCountdownEnd] = useState(null);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const { relationshipStatus } = useRelationshipStatus();
  const getCoupleID = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  const updateCountdownDate = async (countdownDate) => {
    if (relationshipStatus === "LongDistance") {
      const partnerUsername = await getPartnerUsername(auth.currentUser.uid);
      let partnerUid = null;
      if (partnerUsername) {
        const usernameRef = doc(db, "usernames", partnerUsername);
        const usernameSnap = await getDoc(usernameRef);
        partnerUid = usernameSnap.data().uid;
      }

      const coupleID = getCoupleID(auth.currentUser.uid, partnerUid);
      const countdownRef = doc(db, "countdowns", coupleID);

      await setDoc(countdownRef, {
        endDate: countdownDate,
      });

      setCountdownEnd(countdownDate);
    }
  };

  const fetchCountdownEndDate = async () => {
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
      setCountdownEnd(countdownData.endDate);
    }
  };

  useEffect(() => {
    let isMounted = true; // create a flag
    if(isMounted && isAuth) {
    const checkLongDistance = async () => {
      if (relationshipStatus === "LongDistance" && isMounted && isAuth) {
        // use this flag before calling async function
        await fetchCountdownEndDate();
      }
    };
    checkLongDistance();
  }
    return () => {
      isMounted = false; // set it to false when component unmounts
    };
  }, [relationshipStatus, isAuth]);

  return { countdownEnd, updateCountdownDate, isCountdownVisible, setIsCountdownVisible };
};
