import React from "react";
import Swiper from "react-native-deck-swiper";
import { View, Text, StyleSheet } from "react-native";

function Card({ title, content, date }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      {date && <Text style={styles.date}>{date}</Text>}
    </View>
  );
}

export default function CardComponent({ updates = [] }) {
  // Check if updates exist
  if (updates.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No updates available</Text>
      </View>
    );
  }

  const calculatedStackSize = Math.min(updates.length, 3);
  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Swiper
        cards={updates}
        renderCard={(card = {}) => (
          <Card
            title={card.title || "Update"}
            content={card.content}
            date={new Date(card.timestamp?.seconds * 1000).toLocaleDateString()}
          />
        )}
        infinite={true}
        backgroundColor="transparent"
        cardVerticalMargin={10}
        stackSize={calculatedStackSize}
        stackSeparation={15}
        stackRotation={10}
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
    transform: [{ translateY: -10 }, { rotate: "+5deg" }],
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
