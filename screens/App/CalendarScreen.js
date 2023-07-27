import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, TextInput, ScrollView } from 'react-native';
import { createEvent, readEvents, updateEvent, deleteEvent } from '../../services/calendar';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const fetchedEvents = await readEvents();
    setEvents(fetchedEvents);
  };

  const handleCreateEvent = async () => {
    if (newEventTitle !== '' && selectedDate) {
      await createEvent({ title: newEventTitle, date: selectedDate });
      setNewEventTitle('');
      setSelectedDate(null);
      fetchEvents();
    }
  };

  return (
    <View style={styles.container}>
      <Text>Calendar</Text>
      <Calendar onDayPress={(day) => setSelectedDate(day.dateString)} />
      <Text>Selected date: {selectedDate}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Event Title..."
        value={newEventTitle}
        onChangeText={setNewEventTitle}
      />
      <Button title="Create Event" onPress={handleCreateEvent} />
      <ScrollView>
        {events.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <Text>{event.title}</Text>
            <Text>{event.date}</Text>
            <Button title="Update Event" onPress={() => updateEvent(event.id, { title: newEventTitle, date: selectedDate })} />
            <Button title="Delete Event" onPress={() => deleteEvent(event.id)} />
          </View>
        ))}
      </ScrollView>
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
});
