import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getCountryFromCoordinates, getTimezoneFromCoordinates } from "../utils/getLocation";
import { auth, db } from "../utils/Firebase";

const useUserLocation = () => {
  const [country, setCountry] = useState(null);
  const [timezone, setTimezone] = useState(null);

  const updateLocationData = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    const currentCountry = await getCountryFromCoordinates(
      location.coords.latitude,
      location.coords.longitude,
      process.env.GEOCODING_API_KEY
    );

    const userTimezone = await getTimezoneFromCoordinates(
      location.coords.latitude,
      location.coords.longitude,
      process.env.GEOCODING_API_KEY
    );

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { country: currentCountry, userTimezone });

    setCountry(currentCountry);
    setTimezone(userTimezone);
  };

  useEffect(() => {
    (async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() || {};

      if (userData.country && userData.userTimezone) {
        setCountry(userData.country);
        setTimezone(userData.userTimezone);
      } else {
        await updateLocationData();
      }
    })();
  }, []);

  // Periodic check for location change, e.g., every 15 minutes
  useEffect(() => {
    const intervalId = setInterval(updateLocationData, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { country, timezone };
};

export default useUserLocation;
