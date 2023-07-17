import { useState, useCallback, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../utils/Firebase";
import getPartnerUsername from "../utils/getPartnerUsername";
import useAuth from "./useAuth";

function useFetchPosts(uid, partnerRequired = true) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    const user = auth.currentUser;

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

      let allPosts = [...userPosts, ...partnerPosts];
      allPosts.sort((a, b) => b.created_at - a.created_at);

      setPosts(allPosts);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setRefreshing(false);
    }
  }, [uid, partnerRequired]);

  useEffect(() => {
    let isCancelled = false;

    fetchPosts();

    // This is the cleanup function.
    return () => {
      isCancelled = true;
    };
  }, [fetchPosts]);

  return { posts, refreshing, fetchPosts };
}

export default useFetchPosts;
