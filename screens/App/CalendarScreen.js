import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Button, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import EventList from "../../components/CalendarComponents/EventListComponent";
import EventDialog from "../../components/CalendarComponents/EventDialogsComponent";
import CountdownComponent from "../../components/CalendarComponents/CountdownComponent";
import { useCountdown } from "../../hooks/useCountdown";
import { useRelationshipStatus } from "../../hooks/useRelationshipStatus";
import { db, auth } from "../../utils/Firebase";
import { createEvent, readEvents, updateEvent, deleteEvent } from "../../services/calendar";

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEventTitle, setNewEventTitle] = useState("");

  const [updatedEventTitle, setUpdatedEventTitle] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { countdownTime, initializeCountdown, isCountdownVisible } = useCountdown(db, auth);

  const { relationshipStatus } = useRelationshipStatus();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const fetchedEvents = await readEvents();
    setEvents(fetchedEvents);
  };

  const handleCreateEvent = async () => {
    if (newEventTitle !== "") {
      await createEvent({ title: newEventTitle, date: selectedDate });
      setNewEventTitle("");
      fetchEvents();
      setDialogVisible(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (updatedEventTitle !== "") {
      await updateEvent(selectedEventId, { title: updatedEventTitle, date: selectedDate });
      setUpdatedEventTitle("");
      fetchEvents();
      setUpdateDialogVisible(false);
    }
  };

  const onStartCountdownPress = () => {
    const dateParts = selectedDate.split("-");
    const selectedEndDate = {
      // Note the addition of the 'endDate' property here
      year: parseInt(dateParts[0], 10),
      month: parseInt(dateParts[1], 10),
      day: parseInt(dateParts[2], 10),
    };
    initializeCountdown(selectedEndDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      {isCountdownVisible && countdownTime > 0 && <CountdownComponent until={countdownTime} onFinish={initializeCountdown} />}

      <View style={styles.calendarContainer}>
        <Calendar style={styles.calendar} onDayPress={(day) => setSelectedDate(day.dateString)} />
      </View>
      {relationshipStatus === "Longdistant" && <Button title="Start Countdown" onPress={() => onStartCountdownPress(selectedDate)} />}
      {selectedDate && (
        <TouchableOpacity style={styles.addButton} onPress={() => setDialogVisible(true)}>
          <Text style={styles.addButtonText}>Create Event</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.dateHeader}>{selectedDate}</Text>
      <ScrollView>
        <EventList
          events={events}
          selectedDate={selectedDate}
          onOpenUpdateDialog={(eventId) => {
            setSelectedEventId(eventId);
            setUpdateDialogVisible(true);
          }}
          onDeleteEvent={deleteEvent}
        />
      </ScrollView>
      <EventDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="Create Event"
        value={newEventTitle}
        placeholder="Enter Event Title..."
        onChange={setNewEventTitle}
        onSave={handleCreateEvent}
      />
      <EventDialog
        visible={updateDialogVisible}
        onClose={() => setUpdateDialogVisible(false)}
        title="Update Event"
        value={updatedEventTitle}
        placeholder="Enter New Event Title..."
        onChange={setUpdatedEventTitle}
        onSave={handleUpdateEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  calendarContainer: {
    width: "100%",
  },
  calendar: {
    width: "100%",
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    padding: 10,
  },
  eventContainer: {
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    width: "100%",
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
