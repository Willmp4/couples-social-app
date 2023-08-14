import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/Firebase";

const usePartnerTimezone = (partner, isAuthenticated) => {
  const [partnerTimezone, setPartnerTimezone] = useState("");
  const [partnerTime, setPartnerTime] = useState("");

  useEffect(() => {
    let unsubscribe; // Declare outside of the async function

    const fetchPartnerTimezone = async () => {
      if (partner && isAuthenticated) {
        const usernameRef = doc(db, "usernames", partner);
        const usernameSnap = await getDoc(usernameRef);

        if (!usernameSnap.exists()) {
          console.error(`No document for username: ${partner}`);
          return;
        }

        const partnerUid = usernameSnap.data().uid;

        const partnerRef = doc(db, "users", partnerUid);
        unsubscribe = onSnapshot(partnerRef, (doc) => {
          // Assign to variable
          if (doc.exists()) {
            const partnerData = doc.data();
            if (partnerData.userTimezone) {
              setPartnerTimezone(partnerData.userTimezone);
            }
          }
        });
      }
    };

    fetchPartnerTimezone();

    return () => unsubscribe && unsubscribe(); // Check if it's defined
  }, [partner, isAuthenticated]);

  useEffect(() => {
    const updatePartnerTime = () => {
      if (partnerTimezone) {
        const time = moment.tz(partnerTimezone).format("LT");
        setPartnerTime(time);
      }
    };

    updatePartnerTime();
    const intervalId = setInterval(updatePartnerTime, 6000);

    return () => clearInterval(intervalId);
  }, [partnerTimezone]);

  return { partnerTimezone, partnerTime };
};

export default usePartnerTimezone;
