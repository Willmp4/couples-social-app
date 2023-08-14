import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, Alert } from "react-native";
import { auth, db } from "../../utils/Firebase";
import { collection, query, getDocs, where, doc as docRef, deleteDoc, orderBy, onSnapshot } from "firebase/firestore";
import useAuth from "../../hooks/AuthHooks/useAuth";
import HighlightsCarousel from "../../components/HighlightsCarousel";
import styles from "../../styles/Home.styles";
import useUpdates from "../../hooks/useUpdates";
import DynamicBanner from "../../components/DynamicUpdateBanner";
const { width } = Dimensions.get("window");
const AUTO_SCROLL_INTERVAL = 4000;

export default function Home() {
  const [highlights, setHighlights] = useState([]);
  const scrollViewRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(0);
  const scrollIntervalRef = useRef(null);
  const { user, loading } = useAuth();
  const { updates } = useUpdates(auth.currentUser.uid);
 
  const fetchAndSetHighlightPosts = () => {
    let unsubscribe; // Initialize unsubscribe outside the if block

    const highlightsQuery = query(
      collection(db, "highlights"),
      orderBy("created_at", "desc") // assuming posts have a 'createdAt' field
    );

    if (auth.currentUser) {
      unsubscribe = onSnapshot(highlightsQuery, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setHighlights(posts);
      });
    }

    // Return the unsubscribe function to ensure we stop listening when the component is unmounted
    return unsubscribe;
  };

  useEffect(() => {
    // Store the unsubscribe function returned by fetchAndSetHighlightPosts
    const unsubscribe = fetchAndSetHighlightPosts();

    // Cleanup: unsubscribe from updates when component unmounts
    return () => {
      if (unsubscribe) {
        // Check if unsubscribe is defined before calling it
        unsubscribe();
      }
    };
  }, [db, auth.currentUser]);

  const deleteHighlight = async (blogPostId) => {
    try {
      // get the reference to the highlights collection
      const highlightsCollectionRef = collection(db, "highlights");

      // create a query to find the document with the matching id
      const queryRef = query(highlightsCollectionRef, where("id", "==", blogPostId));

      // get the documents matching the query
      const querySnapshot = await getDocs(queryRef);

      // iterate over the documents and delete them
      querySnapshot.forEach((doc) => {
        deleteDoc(docRef(highlightsCollectionRef, doc.id));
      });

      fetchAndSetHighlightPosts();
      Alert.alert("Post deleted.");
    } catch (e) {
      console.error("Error deleting highlight: ", e);
    }
  };

  const scrollToNextHighlight = () => {
    setCurrentPosition((prevPosition) => {
      const nextPosition = prevPosition >= highlights.length - 1 ? 0 : prevPosition + 1;
      scrollViewRef.current.scrollTo({ x: nextPosition * width, animated: true });
      return nextPosition;
    });
  };

  const startAutoScroll = () => {
    if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
    }
    scrollIntervalRef.current = setInterval(scrollToNextHighlight, AUTO_SCROLL_INTERVAL);
};

  const handleScrollBeginDrag = () => clearInterval(scrollIntervalRef.current);

  const handleScrollEndDrag = () => {
    startAutoScroll();
  };

  const handleMomentumScrollEnd = (event) => {
    const newPosition = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPosition(newPosition);
  };

  useEffect(() => {
    if (!scrollIntervalRef.current) {
        startAutoScroll();
    }
    
    return () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };
}, [highlights]);


  return (
    <View style={styles.container}>
      {user ? <Text style={styles.welcomeText}>Welcome, {user.displayName}</Text> : <Text>Welcome</Text>}
      <Text style={styles.title}>Highlights</Text>
  
      <View style={styles.highlightsContainer}>
        <HighlightsCarousel
          ref={scrollViewRef}
          highlights={highlights}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onLongPress={deleteHighlight}
        />
      </View>
      <DynamicBanner updates={updates} />
    </View>
  );
}

