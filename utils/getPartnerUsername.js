import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
async function getPartnerUsername(uid) {
  try {
    // Get the user's document
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      // Get the partner's username
      const partnerUsername = userDoc.data().partner;
      return partnerUsername;
    } else {
      throw new Error("No user found with the given uid.");
    }
  } catch (error) {
    console.error("Error fetching partner's username: ", error);
  }
}

export default getPartnerUsername;
