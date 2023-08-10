import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { Dialog } from "react-native-simple-dialogs";
import CountdownComponent from "../../components/CalendarComponents/CountdownComponent";
import { useEvents } from "../../hooks/CalendarEventHooks/useCalendarEvents";
import { useRelationshipStatus } from "../../hooks/useRelationshipStatus";
import { useCountdownLogic } from "../../hooks/CountDownHooks/useCountdownLogic";
import { auth } from "../../utils/Firebase";
import useAuth from "../../hooks/AuthHooks/useAuth";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEventTitle, setNewEventTitle] = useState("");
  const [updatedEventTitle, setUpdatedEventTitle] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent } = useEvents();
  const { countdownTime, isCountdownVisible, startCountdown, setIsCountdownVisible } = useCountdownLogic(auth.currentUser);
  const { relationshipStatus } = useRelationshipStatus();
  const { user } = useAuth();
  const isLongDistance = relationshipStatus === "LongDistance";

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const openUpdateDialog = (eventId) => {
    setSelectedEventId(eventId);
    setUpdateDialogVisible(true);
  };

  const renderStartCountdownButton = () => {
    if (selectedDate) {
      return (
        <TouchableOpacity style={styles.countdownButton} onPress={() => startCountdown(selectedDate)}>
          <Text style={styles.countdownButtonText}>⏰</Text> 
        </TouchableOpacity>
      );
    }
  };
  

  const renderEvents = () => {
    const filteredEvents = events.filter((event) => event.date === selectedDate);
    if (filteredEvents.length === 0) {
      return <Text style={styles.noEventsText}>No events for today</Text>;
    }

    return filteredEvents.map((event) => (
      <View key={event.id} style={styles.eventContainer}>
        <View style={styles.eventDetails}>
          <Text style={styles.eventText}>{event.title}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => openUpdateDialog(event.id)}>
              <Text style={styles.buttonText}>Update Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleDeleteEvent(event.id)}>
              <Text style={styles.buttonText}>Delete Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <CountdownComponent countdownTime={countdownTime} isCountdownVisible={isCountdownVisible} />
      <View style={styles.calendarContainer}>
        <Calendar style={styles.calendar} onDayPress={handleDayPress} />
      </View>
      {selectedDate && (
        <TouchableOpacity style={styles.fab} onPress={openDialog}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.dateHeader}>{selectedDate}</Text>
      {renderStartCountdownButton()}
      <ScrollView>{renderEvents()}</ScrollView>
      <Dialog visible={dialogVisible} onTouchOutside={() => setDialogVisible(false)}>
        <TextInput style={styles.input} placeholder="Enter Event Title..." value={newEventTitle} onChangeText={setNewEventTitle} />
        <Button title="Save Event" onPress={() => handleCreateEvent(newEventTitle, selectedDate)} />
      </Dialog>
      <Dialog visible={updateDialogVisible} onTouchOutside={() => setUpdateDialogVisible(false)}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Event Title..."
          value={updatedEventTitle}
          onChangeText={setUpdatedEventTitle}
        />
        <Button title="Update Event" onPress={() => handleUpdateEvent(selectedEventId, updatedEventTitle, selectedDate)} />
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5", // Setting a lighter background color for contrast
  },
  countdownButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 120, // Set to the same distance from the bottom as the plus sign button
    left: 20, // Set to the left side
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  countdownButtonText: {
    fontSize: 30, // Set font size for the clock emoji
    color: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  fab: {
    width: 56, // Set to desired dimensions
    height: 56,
    borderRadius: 28, // Half of width and height to create a circle
    backgroundColor: "#000",
    position: "absolute",
    bottom: 120, // Set desired distance from the bottom
    right: 20, // Set desired distance from the right
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Add elevation for Android
  },
  fabText: {
    fontSize: 30, // Set font size for the plus sign
    color: "#fff",
  },
  calendarContainer: {
    width: "100%",
    marginBottom: 10,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 10,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
    padding: 10,
  },
  eventContainer: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  eventDetails: {
    // New style to stack elements vertically
    flexDirection: "column",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5, // Add some margin to separate buttons from the title
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 12,
    textAlign: "center", // Center the text within the button
  },
  eventText: {
    color: "#fff", // White color for better visibility on a black background
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#0a0",
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
