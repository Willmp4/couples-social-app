import { 
    addDoc, 
    collection, 
    doc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc
  } from "firebase/firestore";
  import { db } from "../utils/Firebase";
  
  // Create event
  export const createEvent = async (newEvent) => {
    const eventCollection = collection(db, 'Calendar');
    
    try {
      const docRef = await addDoc(eventCollection, newEvent);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // return the id of the newly created event
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e; // rethrow the error, so it can be handled in the component
    }
  };
  
  // Read events
  export const readEvents = async () => {
    const eventCollection = collection(db, 'Calendar');
    
    try {
      const eventSnapshot = await getDocs(eventCollection);
      const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return eventList;
    } catch (e) {
      console.error("Error reading documents: ", e);
      throw e; // rethrow the error, so it can be handled in the component
    }
  };
  
  // Update event
  export const updateEvent = async (eventId, updatedEvent) => {
    const eventDoc = doc(db, 'Calendar', eventId);
    
    try {
      await updateDoc(eventDoc, updatedEvent);
      console.log("Document updated with ID: ", eventId);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e; // rethrow the error, so it can be handled in the component
    }
  };
  
  // Delete event
  export const deleteEvent = async (eventId) => {
    const eventDoc = doc(db, 'Calendar', eventId);
    
    try {
      await deleteDoc(eventDoc);
      console.log("Document deleted with ID: ", eventId);
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw e; // rethrow the error, so it can be handled in the component
    }
  };
  