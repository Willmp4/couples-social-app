import { getCountryFromCoordinates, getCurrentTimeInTimezone, getTimezoneFromCoordinates } from "../utils/getLocation";
import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as Location from "expo-location";
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, storage, db } from "../utils/Firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";
import Constants from "expo-constants";

const OurTime = () => {
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState("");
  const [country, setCountry] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [userTimezone, setUserTimezone] = useState("");
  const [partnerTimezone, setPartnerTimezone] = useState("");
  const [partnerTime, setPartnerTime] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setPartner(userData.partner);
            setUserTimezone(userData.userTimezone);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    (async () => {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Get the user's current location
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      // Get the timezone from the location coordinates
      const timezone = await getTimezoneFromCoordinates(location.coords.latitude, location.coords.longitude, process.env.GEOCODING_API_KEY);

      // Update the user's document in Firestore with the new timezone
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { userTimezone: timezone });

      // Save the timezone in state
      setUserTimezone(timezone);

      // Get the country from the location coordinates
      const currentCountry = await getCountryFromCoordinates(
        location.coords.latitude,
        location.coords.longitude,
        process.env.GEOCODING_API_KEY
      );

      // Save the country in state
      setCountry(currentCountry);
    })();
  }, []);

  useEffect(() => {
    const updateCurrentTime = async () => {
      try {
        // Get current time in the user's timezone
        const time = moment.tz(userTimezone).format("LT");
        setCurrentTime(time);
      } catch (error) {
        console.error("Error updating current time:", error);
      }
    };

    // Update the time immediately
    if (userTimezone) {
      updateCurrentTime();
    }

    // Then update the time every second
    const intervalId = setInterval(updateCurrentTime, 1000);

    // Remember to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [userTimezone]);

  useEffect(() => {
    const updatePartnerTime = async () => {
      try {
        const time = moment.tz(partnerTimezone).format("LT");
        setPartnerTime(time);
      } catch (error) {
        console.error("Error updating partner time:", error);
      }
    };

    // Update the time immediately
    if (partnerTimezone) {
      updatePartnerTime();
    }

    // Then update the time every second
    const intervalId = setInterval(updatePartnerTime, 1000);

    // Remember to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [partnerTimezone]);

  useEffect(() => {
    const fetchPartnerTimezone = async () => {
      if (partner) {
        // Get the partner's UID from the 'username' collection
        const usernameRef = doc(db, "usernames", partner);
        const usernameSnap = await getDoc(usernameRef);

        if (!usernameSnap.exists()) {
          console.error(`No document for username: ${partner}`);
          return;
        }

        const partnerUid = usernameSnap.data().uid;

        // Listen for updates in the partner's document in Firestore
        const partnerRef = doc(db, "users", partnerUid);
        const unsubscribe = onSnapshot(partnerRef, (doc) => {
          if (doc.exists()) {
            const partnerData = doc.data();
            if (partnerData.userTimezone) {
              setPartnerTimezone(partnerData.userTimezone);
            }
          }
        });

        return () => unsubscribe();
      }
    };

    fetchPartnerTimezone();
  }, [partner]);

  return (
    <View>
      <Text style={styles.title}>Our Time</Text>
      <Text style={styles.title}>Country: {country}</Text>
      <Text style={styles.title}>Current Time: {currentTime}</Text>
      <Text style={styles.title}>Partner Time: {partnerTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    width: 200,
    marginTop: 20,
    //Grey
    backgroundColor: "#808080",
  },
  image: {
    //Make the image a circle
    borderRadius: 100,
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default OurTime;
