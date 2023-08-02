import { useState, useEffect } from "react";
import { readEvents, createEvent, updateEvent, deleteEvent } from "../services/calendar";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const fetchedEvents = await readEvents();
    setEvents(fetchedEvents);
  };

  const handleCreateEvent = async (newEventTitle, selectedDate) => {
    await createEvent({ title: newEventTitle, date: selectedDate });
    fetchEvents();
  };

  const handleUpdateEvent = async (selectedEventId, updatedEventTitle, selectedDate) => {
    await updateEvent(selectedEventId, { title: updatedEventTitle, date: selectedDate });
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId) => {
    await deleteEvent(eventId);
    fetchEvents();
  };

  return { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent };
};
