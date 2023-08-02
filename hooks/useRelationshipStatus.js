import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/Firebase";

export const useRelationshipStatus = () => {
  const [relationshipStatus, setRelationshipStatus] = useState(null);

  useEffect(() => {
    const fetchRelationshipStatus = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setRelationshipStatus(userData.relationshipStatus);
      }
    };

    fetchRelationshipStatus();
  }, []);

  return {
    relationshipStatus,
  };
};
