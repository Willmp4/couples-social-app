import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { auth, db } from "../utils/Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
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

  const fetchAndSetHighlightPosts = async () => {
    const postsQuery = query(
      collection(db, "blogPosts"),
      orderBy("created_at", "desc"), // assuming posts have a 'createdAt' field
      limit(10) // get 10 posts for highlights
    );

    const querySnapshot = await getDocs(postsQuery);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setHighlights(posts);
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
      />
    </View>
  );
}
