import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import MakePost from "./screens/BlogPostImage";
import ProfileScreen from "./screens/ProfileScreen";
import LogIn from "./screens/LogInScreen";
import SignUp from "./screens/SignUpScreen";
import ForgotPassword from "./screens/ForgotPasswordScreen";
import MyPostsScreen from "./screens/MyPostsScreen";
import { ActivityIndicator } from "react-native-paper";
import { auth } from "./utils/Firebase";
import CouplesDashBoard from "./screens/CouplesDashboardScreen";
import Toast from 'react-native-toast-message'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs({ navigation }) {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "CouplesDashboard") {
              iconName = focused ? "heart" : "heart-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="CouplesDashboard" component={CouplesDashBoard} />
        <Tab.Screen name="Profile" component={MyPostsScreen} />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator animating={true} color="#00f0ff" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MyTabs" component={MyTabs} initialParams={{ screen: "Home" }} />
            <Stack.Screen name="MyProfile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="LogIn" component={LogIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
        )}
      </Stack.Navigator>
      <Toast/>
    </NavigationContainer>
  );
}
