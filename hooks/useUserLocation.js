import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { getCountryFromCoordinates, getTimezoneFromCoordinates } from "../utils/getLocation";

const useUserLocation = () => {
  const [country, setCountry] = useState(null);
  const [timezone, setTimezone] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const userTimezone = await getTimezoneFromCoordinates(location.coords.latitude, location.coords.longitude, process.env.GEOCODING_API_KEY);
      const currentCountry = await getCountryFromCoordinates(location.coords.latitude, location.coords.longitude, process.env.GEOCODING_API_KEY);

      setCountry(currentCountry);
      setTimezone(userTimezone);
    })();
  }, []);

  return { country, timezone };
};

export default useUserLocation;
