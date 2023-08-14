import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

const UPDATE_DISPLAY_DURATION = 5000;

function DynamicUpdateBanner({ updates }) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const fadeAnimation = useRef(new Animated.Value(1)).current; 

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
    // Handle banner press
  };

  const currentUpdate = updates[currentUpdateIndex];
  if (!currentUpdate) return null;

  return (
      <TouchableOpacity onPress={handleBannerPress} style={styles.card}>
          <Animated.View style={{ opacity: fadeAnimation }}>
              <Text style={styles.updateContent}>{currentUpdate.content}</Text>
              <Text style={styles.indicatorText}>{`${currentUpdateIndex + 1} of ${updates.length}`}</Text>
          </Animated.View>
      </TouchableOpacity>
  );
}

const primaryColor = "#000"; // Black
const backgroundColor = "#FFF"; // White
const subtleColor = "#888"; // Subtle Gray

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: backgroundColor,
    borderBottomWidth: 1, // subtle bottom border
    borderRadius: 15, // Rounded edges

    alignItems: "left",
    justifyContent: "left",
    marginVertical: 10,
    shadowColor: "#000",  // Shadow for a card effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,  // Elevation for Android
  },
  updateContent: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
  },
  indicatorText: {
    marginTop: 10,
    fontSize: 12,
    color: subtleColor,
    textAlign: "left",
  },
});

export default DynamicUpdateBanner;
