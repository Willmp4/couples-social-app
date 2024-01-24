// OurTime.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../utils/Firebase";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import useUserLocation from "../../hooks/useUserLocation";
import useUserTimezone from "../../hooks/useUserTimeZone";
import useAuth from "../../hooks/useAuth";
import usePartnerTimezone from "../../hooks/usePartnerTimeZone";

const OurTime = () => {
  const { user, loading } = useAuth();
  const [partner, setPartner] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setPartner(userData.partner);
          setRelationshipStatus(userData.relationshipStatus);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const { country, timezone } = useUserLocation();
  const currentTime = useUserTimezone(timezone);
  const { partnerTimezone, partnerTime } = usePartnerTimezone(partner);

  // Modify the return statement to conditionally render based on relationshipStatus
  return (
    <View>
      {relationshipStatus === "LongDistance" && (
        <>
          <Text style={styles.title}>Our Time</Text>
          <Text style={styles.title}>Country: {country}</Text>
          <Text style={styles.title}>Current Time: {currentTime}</Text>
          <Text style={styles.title}>Partner TimeZone: {partnerTimezone}</Text>
          <Text style={styles.title}>Partner Time: {partnerTime}</Text>
        </>
      )}
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
