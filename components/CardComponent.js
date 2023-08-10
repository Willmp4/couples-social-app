import React, { useState, useRef } from "react";
import Swiper from "react-native-deck-swiper";
import { View, Text, StyleSheet, Animated } from "react-native";

function Card({ title, content, date, translateY = 0, translateX = 0 }) {
  return (
    <View
      style={[
        styles.card,
        {
          transform: [
            { translateY: translateY },
            { translateX: translateX },
          ],
        },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      {date && <Text style={styles.date}>{date}</Text>}
    </View>
  );
}

const calculateOffsets = (currentIndex, cardIndex, totalCards) => {
  let diff = cardIndex - currentIndex;
  if (diff < 0) diff += totalCards; // Adjust for wrap-around

  return {
    translateY: -10 * diff,
    translateX: -10 * diff
  };
};

export default function CardComponent({ updates = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (updates.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No updates available</Text>
      </View>
    );
  }

  const calculatedStackSize = Math.min(updates.length, 5);

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Swiper
        cards={updates}
        renderCard={(card = {}, cardIndex) => {
          const { translateY, translateX } = calculateOffsets(currentIndex, cardIndex, updates.length);
          return (
            <Card
              title={card.title || "Update"}
              content={card.content}
              date={new Date(card.timestamp?.seconds * 1000).toLocaleDateString()}
              translateY={translateY}
              translateX={translateX}
            />
          );
        }}
        onSwiped={() => {
          setCurrentIndex((prevIndex) => {
            if (prevIndex + 1 >= updates.length) {
              return 0; // reset to the start when we reach the end of the cards
            }
            return prevIndex + 1;
          });
        }}
        infinite={true}
        backgroundColor="transparent"
        cardVerticalMargin={10}
        stackSize={calculatedStackSize}
        stackSeparation={10}
        stackRotation={0} 
        swipeAnimationDuration={500}
        swipeBackAnimationDuration={500}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: "35%",
    height: 100,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",

    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // Android shadow
    elevation: 5,

    marginVertical: 10,
    alignSelf: "center",
    zIndex: 100, // Ensure the primary card is above the stacked cards
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {},
  date: {
    fontSize: 12,
    color: "#888",
  },
});
