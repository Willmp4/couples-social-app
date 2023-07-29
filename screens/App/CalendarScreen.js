import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { createEvent, readEvents, updateEvent, deleteEvent } from "../../services/calendar";
import { Calendar } from "react-native-calendars";
import { Dialog } from "react-native-simple-dialogs";
import CountdownComponent from "../../components/CountdownComponent";
import getPartnerUsername from "../../utils/getPartnerUsername";
import { db, auth } from "../../utils/Firebase";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEventTitle, setNewEventTitle] = useState("");
  const [updatedEventTitle, setUpdatedEventTitle] = useState(""); // new state for the updated event title
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false); // new state for showing or hiding the update dialog
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [countdownEnd, setCountdownEnd] = useState(null); // for the countdown
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const [isLongDistance, setIsLongDistance] = useState(false); // for tracking the relationship status

  useEffect(() => {
    fetchEvents();
    checkLongDistance();
  }, []);

  useEffect(() => {
    initializeCountdown();
  }, [countdownEnd]);

  const initializeCountdown = () => {
    if (countdownEnd && isLongDistance) {
      setIsCountdownVisible(true);
    }
  };

  const createOrUpdateCountdown = async (countdownDate) => {
    if (isLongDistance) {
      // Check if it's a long-distance relationship
      const partnerUsername = await getPartnerUsername(auth.currentUser.uid);
      let partnerUid = null;
      if (partnerUsername) {
        const usernameRef = doc(db, "usernames", partnerUsername);
        const usernameSnap = await getDoc(usernameRef);

        partnerUid = usernameSnap.data().uid;
        // Now you can continue using partnerUid as needed
      }

      const coupleID = getCoupleID(auth.currentUser.uid, partnerUid);
      const countdownRef = doc(db, "countdowns", coupleID);

      await setDoc(countdownRef, {
        endDate: countdownDate, // Use the countdownDate variable
        userId1: auth.currentUser.uid,
        userId2: partnerUsername,
      });
    }
  };

  const fetchCountdownEndDate = async () => {
    const partnerUsername = await getPartnerUsername(auth.currentUser.uid);
    let partnerUid = null;
    if (partnerUsername) {
      const usernameRef = doc(db, "usernames", partnerUsername);
      const usernameSnap = await getDoc(usernameRef);

      partnerUid = usernameSnap.data().uid;
      // Now you can continue using partnerUid as needed
    }

    const coupleID = getCoupleID(auth.currentUser.uid, partnerUid);
    const countdownRef = doc(db, "countdowns", coupleID);
    const countdownSnap = await getDoc(countdownRef);

    if (countdownSnap.exists()) {
      const countdownData = countdownSnap.data();
      setCountdownEnd(countdownData.endDate);
      // Initialize countdown here
      if (countdownData.endDate && isLongDistance) {
        setIsCountdownVisible(true);
      }
    }
  };

  const getCoupleID = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  const fetchEvents = async () => {
    const fetchedEvents = await readEvents();
    setEvents(fetchedEvents);
  };
  const getCountdownTime = () => {
    if (!countdownEnd) return 0;

    const endDate = new Date(countdownEnd.year, countdownEnd.month - 1, countdownEnd.day);
    const diff = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
    return diff > 0 ? diff : 0;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const startCountdown = async () => {
    if (isLongDistance) {
      let countdownDate = {
        year: parseInt(selectedDate.slice(0, 4)),
        month: parseInt(selectedDate.slice(5, 7)),
        day: parseInt(selectedDate.slice(8, 10)),
      };

      setCountdownEnd(countdownDate); // Updating the state directly
      setIsCountdownVisible(true);

      await createOrUpdateCountdown(countdownDate);
    }
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

  const handleDeleteEvent = async (eventId) => {
    await deleteEvent(eventId);
    fetchEvents();
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const openUpdateDialog = (eventId) => {
    setSelectedEventId(eventId);
    setUpdateDialogVisible(true);
  };

  const getIsLongDistance = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.relationshipStatus === "Longdistant";
    }
  };

  const checkLongDistance = async () => {
    const isLongDistanceRelationship = await getIsLongDistance();
    setIsLongDistance(isLongDistanceRelationship);

    if (isLongDistanceRelationship) {
      // Fetch countdown end date if it's a long-distance relationship
      await fetchCountdownEndDate();
    }
  };

  const renderEvents = () => {
    const filteredEvents = events.filter((event) => event.date === selectedDate);
    if (filteredEvents.length === 0) {
      return <Text style={styles.noEventsText}>No events for today</Text>;
    }

    return filteredEvents.map((event) => (
      <View key={event.id} style={styles.eventContainer}>
        <Text>{event.title}</Text>
        <Button title="Update Event" onPress={() => openUpdateDialog(event.id)} />
        <Button title="Delete Event" onPress={() => handleDeleteEvent(event.id)} />
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      {isCountdownVisible && isLongDistance && (
        <CountdownComponent until={getCountdownTime()} onFinish={() => setIsCountdownVisible(false)} />
      )}
      <View style={styles.calendarContainer}>
        <Calendar style={styles.calendar} onDayPress={handleDayPress} />
      </View>
      <Button title="Start Countdown" onPress={startCountdown} />
      {selectedDate && (
        <TouchableOpacity style={styles.addButton} onPress={openDialog}>
          <Text style={styles.addButtonText}>Create Event</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.dateHeader}>{selectedDate}</Text>
      <ScrollView>{renderEvents()}</ScrollView>
      <Dialog visible={dialogVisible} onTouchOutside={() => setDialogVisible(false)}>
        <TextInput style={styles.input} placeholder="Enter Event Title..." value={newEventTitle} onChangeText={setNewEventTitle} />
        <Button title="Save Event" onPress={handleCreateEvent} />
      </Dialog>
      <Dialog visible={updateDialogVisible} onTouchOutside={() => setUpdateDialogVisible(false)}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Event Title..."
          value={updatedEventTitle}
          onChangeText={setUpdatedEventTitle}
        />
        <Button title="Update Event" onPress={handleUpdateEvent} />
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
