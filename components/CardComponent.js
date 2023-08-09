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
        cardVerticalMargin={30}
        stackSize={2}
        stackSeparation={30}
        stackRotation={8}
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
    borderColor: "#E0E0E0", // light gray border

    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,

    marginVertical: 10,
    alignSelf: "center",
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
