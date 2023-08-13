import React, { useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

const UPDATE_DISPLAY_DURATION = 5000;

function DynamicUpdateBanner({ updates }) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const fadeAnimation = useRef(new Animated.Value(1)).current; // Use useRef here

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentUpdateIndex((prevIndex) => (prevIndex + 1) % updates.length);
      });
    }, UPDATE_DISPLAY_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, [fadeAnimation, updates]);


  const handleBannerPress = () => {
    // Handle banner press: Maybe navigate to details or show actions related to the update
  };

  const currentUpdate = updates[currentUpdateIndex];
  if (!currentUpdate) return null;

  return (
      <TouchableOpacity onPress={handleBannerPress} style={styles.card}>
          <Animated.View style={{ opacity: fadeAnimation }}>
              <Text>{currentUpdate.content}</Text>
              <Text style={styles.indicatorText}>{`${currentUpdateIndex + 1} of ${updates.length}`}</Text>
          </Animated.View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,  // Rounded edges
    shadowColor: "#000",  // Shadow for a card effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,  // Elevation for Android
    margin: 10,
  },
  indicatorText: {
    marginTop: 5,
    fontSize: 12,
    color: '#aaa',
  },
});

export default DynamicUpdateBanner;
