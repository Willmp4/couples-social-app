import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, Alert } from "react-native";
import { auth, db } from "../utils/Firebase";
import { collection, query, getDocs, where, doc as docRef, deleteDoc, orderBy, onSnapshot } from "firebase/firestore";
import useAuth from '../hooks/useAuth'; 
import HighlightsCarousel from "../components/HighlightsCarousel";
import styles from "../styles/Home.styles"


const { width } = Dimensions.get("window");
const AUTO_SCROLL_INTERVAL = 4000;

export default function Home() {
  const [highlights, setHighlights] = useState([]);
  const scrollViewRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(0);
  const scrollIntervalRef = useRef(null);
  const { user, loading } = useAuth();

  const fetchAndSetHighlightPosts = () => {
    const highlightsQuery = query(
      collection(db, "highlights"),
      orderBy("created_at", "desc"), // assuming posts have a 'createdAt' field
    );
  
    const unsubscribe = onSnapshot(highlightsQuery, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
  
      setHighlights(posts);
    });
  
    // Return the unsubscribe function to ensure we stop listening when the component is unmounted
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchAndSetHighlightPosts();
  
    // Cleanup: unsubscribe from updates when component unmounts
    return unsubscribe;
  }, [db]);
  
  

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
      Alert.alert("Post deleted.")
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
    scrollIntervalRef.current = setInterval(scrollToNextHighlight, AUTO_SCROLL_INTERVAL);
  };

  const handleScrollBeginDrag = () => clearInterval(scrollIntervalRef.current);

  const handleScrollEndDrag = () => { 
    startAutoScroll();
  }

  const handleMomentumScrollEnd = (event) => {
    const newPosition = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPosition(newPosition);
  };

  useEffect(() => {
    fetchAndSetHighlightPosts();
  }, [db]);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(scrollIntervalRef.current);
  }, [highlights]);

  return (
    <View style={styles.container}>
      {user ? <Text style={styles.welcomeText}>Welcome, {user.displayName}</Text> : <Text>Welcome</Text>}
      <Text style={styles.title}>Highlights</Text>
      <HighlightsCarousel
        ref={scrollViewRef}
        highlights={highlights}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onLongPress={deleteHighlight}
      />

    </View>
  );
}
