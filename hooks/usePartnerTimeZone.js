import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/Firebase";

const usePartnerTimezone = (partner) => {
  const [partnerTimezone, setPartnerTimezone] = useState("");
  const [partnerTime, setPartnerTime] = useState("");

  useEffect(() => {
    const fetchPartnerTimezone = async () => {
      if (partner) {
        const usernameRef = doc(db, "usernames", partner);
        const usernameSnap = await getDoc(usernameRef);

        if (!usernameSnap.exists()) {
          console.error(`No document for username: ${partner}`);
          return;
        }

        const partnerUid = usernameSnap.data().uid;

        const partnerRef = doc(db, "users", partnerUid);
        const unsubscribe = onSnapshot(partnerRef, (doc) => {
          if (doc.exists()) {
            const partnerData = doc.data();
            if (partnerData.userTimezone) {
              setPartnerTimezone(partnerData.userTimezone);
            }
          }
        });

        return () => unsubscribe();
      }
    };

    fetchPartnerTimezone();
  }, [partner]);

  useEffect(() => {
    const updatePartnerTime = () => {
      if (partnerTimezone) {
        const time = moment.tz(partnerTimezone).format("LT");
        setPartnerTime(time);
      }
    };

    updatePartnerTime();
    const intervalId = setInterval(updatePartnerTime, 1000);

    return () => clearInterval(intervalId);
  }, [partnerTimezone]);

  return { partnerTimezone, partnerTime };
};

export default usePartnerTimezone;
