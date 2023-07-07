import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { auth, db } from "../utils/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Highlight from "../components/Highlight";
import useAuth from '../hooks/useAuth'; 

const { width, height } = Dimensions.get("window");

export default function Home() {
  const [highlights, setHighlights] = useState([]);
  const scrollViewRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(0);
  const scrollIntervalRef = useRef(null);
  const { user, loading } = useAuth();


  useEffect(() => {
    getHighlights();
  }, [db]);

  useEffect(() => {
    scrollIntervalRef.current = setInterval(() => {
      setCurrentPosition((prevPosition) => {
        const nextPosition = prevPosition >= highlights.length - 1 ? 0 : prevPosition + 1;
        scrollViewRef.current.scrollTo({ x: nextPosition * width, animated: true });
        return nextPosition;
      });
    }, 4000);
    return () => clearInterval(scrollIntervalRef.current); // Clear interval on unmount
  }, [highlights]);

  const getHighlights = async () => {
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

  return (
    <View style={styles.container}>
      {user ? <Text style={styles.welcomeText}>Welcome, {user.displayName}</Text> : <Text>Welcome</Text>}
      <Text style={styles.title}>Highlights</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        snapToInterval={width}
        decelerationRate="fast"
        onScrollBeginDrag={() => clearInterval(scrollIntervalRef.current)} // Clear the interval when user starts dragging
        onScrollEndDrag={() => {
          scrollIntervalRef.current = setInterval(() => {
            setCurrentPosition((prevPosition) => {
              const nextPosition = prevPosition >= highlights.length - 1 ? 0 : prevPosition + 1;
              scrollViewRef.current.scrollTo({ x: nextPosition * width, animated: true });
              return nextPosition;
            });
          }, 3500);
        }} // Restart the interval when user stops dragging
        onMomentumScrollEnd={(event) => {
          const newPosition = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentPosition(newPosition);
        }}
      >
        {highlights.map((post, index) => (
          <View key={post.id} style={styles.slide}>
            <Highlight post={post} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
  },
  welcomeText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scrollView: {
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  slide: {
    width,
    height: height * 0.3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
    backgroundColor: "#fff",
  },
});
