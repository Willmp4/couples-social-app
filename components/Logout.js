import React from 'react';
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../utils/Firebase";
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button 
      icon={<Icon name="sign-out" size={20} color="white" />} 
      title="Log Out" 
      onPress={logout} 
      buttonStyle={{width: 200, marginTop: 20, backgroundColor: "#808080"}} 
    />
  );
};

export default Logout;
