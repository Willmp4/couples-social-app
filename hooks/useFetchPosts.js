import { useState, useCallback, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../utils/Firebase";
import getPartnerUsername from "../utils/getPartnerUsername";
import useAuth from "./useAuth";

function useFetchPosts(uid, partnerRequired = true) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    let isCancelled = false;

    user = auth.currentUser;

    try {
      setRefreshing(true);
      const userPostsQuery = query(collection(db, "blogPosts"), where("username", "==", user.displayName), orderBy("created_at", "desc"));

      const userSnapshot = await getDocs(userPostsQuery);
      const userPosts = userSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      let partnerPosts = [];

      if (partnerRequired) {
        const partnerUsername = await getPartnerUsername(uid);
        if (partnerUsername) {
          const partnerPostsQuery = query(
            collection(db, "blogPosts"),
            where("username", "==", partnerUsername),
            orderBy("created_at", "desc")
          );
          const partnerSnapshot = await getDocs(partnerPostsQuery);
          partnerPosts = partnerSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        }
      }

      if (!isCancelled) {
        setPosts([...userPosts, ...partnerPosts]);
      }
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      if (!isCancelled) {
        setRefreshing(false);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [uid, partnerRequired]);

  useEffect(() => {
    fetchPosts();
    return fetchPosts; // This is the clean-up function.
  }, [fetchPosts]);

  return { posts, refreshing, fetchPosts };
}

export default useFetchPosts;
