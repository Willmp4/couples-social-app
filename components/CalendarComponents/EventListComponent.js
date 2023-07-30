import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function EventList({ events, selectedDate, onOpenUpdateDialog, onDeleteEvent }) {
  const filteredEvents = events.filter((event) => event.date === selectedDate);

  if (filteredEvents.length === 0) {
    return <Text style={styles.noEventsText}>No events for today</Text>;
  }

  return filteredEvents.map((event) => (
    <View key={event.id} style={styles.eventContainer}>
      <Text>{event.title}</Text>
      <Button title="Update Event" onPress={() => onOpenUpdateDialog(event.id)} />
      <Button title="Delete Event" onPress={() => onDeleteEvent(event.id)} />
    </View>
  ));
}

const styles = StyleSheet.create({
  noEventsText: {
    textAlign: "center",
    marginTop: 10,
  },
  eventContainer: {
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
});
