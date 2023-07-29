import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { createEvent, readEvents, updateEvent, deleteEvent } from '../../services/calendar';
import {Calendar} from 'react-native-calendars';
import { Dialog } from 'react-native-simple-dialogs';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
  const [newEventTitle, setNewEventTitle] = useState('');
  const [updatedEventTitle, setUpdatedEventTitle] = useState(''); // new state for the updated event title
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false); // new state for showing or hiding the update dialog
  const [selectedEventId, setSelectedEventId] = useState(null)

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const fetchedEvents = await readEvents();
    setEvents(fetchedEvents);
  };

  const handleCreateEvent = async () => {
    if (newEventTitle !== '') {
      await createEvent({ title: newEventTitle, date: selectedDate });
      setNewEventTitle('');
      fetchEvents();
      setDialogVisible(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (updatedEventTitle !== '') {
      await updateEvent(selectedEventId, { title: updatedEventTitle, date: selectedDate });
      setUpdatedEventTitle('');
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
  }

  const openUpdateDialog = (eventId) => {
    setSelectedEventId(eventId);
    setUpdateDialogVisible(true);
  }

  const renderEvents = () => {
    const filteredEvents = events.filter(event => event.date === selectedDate);
    if (filteredEvents.length === 0) {
      return <Text style={styles.noEventsText}>No events for today</Text>
    }

    return filteredEvents.map(event => (
      <View key={event.id} style={styles.eventContainer}>
        <Text>{event.title}</Text>
        <Button title="Update Event" onPress={() => openUpdateDialog(event.id)} />
        <Button title="Delete Event" onPress={() => handleDeleteEvent(event.id)} />
      </View>
    ))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />
      </View>
      {selectedDate && (
        <TouchableOpacity style={styles.addButton} onPress={openDialog}>
          <Text style={styles.addButtonText}>Create Event</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.dateHeader}>{selectedDate}</Text>
      <ScrollView>
        {renderEvents()}
      </ScrollView>
      <Dialog
        visible={dialogVisible}
        onTouchOutside={() => setDialogVisible(false)}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Event Title..."
          value={newEventTitle}
          onChangeText={setNewEventTitle}
        />
        <Button title="Save Event" onPress={handleCreateEvent} />
      </Dialog>
      <Dialog
        visible={updateDialogVisible}
        onTouchOutside={() => setUpdateDialogVisible(false)}
      >
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendarContainer: {
    width: '100%',
  },
  calendar: {
    width: '100%',
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    padding: 10,
  },
  eventContainer: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#0a0',
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  }
});
