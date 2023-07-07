import * as Location from "expo-location";
import axios from "axios";
import moment from 'moment-timezone';

export const getCountryFromCoordinates = async (latitude, longitude, apiKey) => {
  try {
    //Print latitude and longitude to console
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
    const results = response.data.results;
    const countryComponent = results.find((result) => result.types.includes("country"));
    const country = countryComponent?.formatted_address || "Unknown";
    return country;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return "Unknown";
  }
};

export const getTimezoneFromCoordinates = async (latitude, longitude, apiKey) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=1331161200&key=${apiKey}`);
    const timezoneId = response.data.timeZoneId; // This will return the IANA timezone identifier
    return timezoneId;
  } catch (error) {
    console.error("Error in getting timezone:", error);
    return "Unknown";
  }
};



export const getCurrentTimeInTimezone = (timezone) => {
  return moment.tz(timezone).format();
}



export const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return null;
  }

  try {
    let location = await Location.getCurrentPositionAsync({});
    const country = await getCountryFromCoordinates(location.coords.latitude, location.coords.longitude);
    location.country = country;
    return location;
  } catch (error) {
    console.error("Error in retrieving location:", error);
    return null;
  }
};