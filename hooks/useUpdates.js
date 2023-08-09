import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../utils/Firebase";

function useUpdates(numberOfUpdates = 10) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updatesRef = collection(db, "updates");
    const q = query(updatesRef, orderBy("timestamp", "desc"), limit(numberOfUpdates));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let fetchedUpdates = [];
        snapshot.forEach((doc) => {
          fetchedUpdates.push({ id: doc.id, ...doc.data() });
        });
        setUpdates(fetchedUpdates);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [numberOfUpdates]);

  return { updates, loading, error };
}

export default useUpdates;
