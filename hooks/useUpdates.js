import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, limit, getDocs} from "firebase/firestore";
import { db } from "../utils/Firebase";
import getPartnerUsername from "../utils/getPartnerUsername";

function useUpdates(uid, numberOfUpdates = 5) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchUpdates() {
      const partnerUsername = await getPartnerUsername(uid);
      if (partnerUsername) {
        const partnerPostsQuery = query(
          collection(db, "updates"),
          where("user", "==", partnerUsername),
          orderBy("timestamp", "desc"),
          limit(numberOfUpdates)
        );
        const partnerSnapshot = await getDocs(partnerPostsQuery);
        // console.log("partnerSnapshot", partnerSnapshot);
        partnerUpdates = partnerSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUpdates(partnerUpdates);
        setLoading(false);
      } else {
        // Handle case where partner username is not found
        setLoading(false);
      }
    }

    fetchUpdates();
  }, [uid, numberOfUpdates]);

  return { updates, loading, error };
}

export default useUpdates;
