import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import HomeScreen from "./screens/App/HomeScreen";
import ProfileScreen from "./screens/App/ProfileScreen";
import LogIn from "./screens/Auth/LogInScreen";
import SignUp from "./screens/Auth/SignUpScreen";
import ForgotPassword from "./screens/Auth/ForgotPasswordScreen";
import MyPostsScreen from "./screens/App/MyPostsScreen";
import CouplesDashBoard from "./screens/App/CouplesDashboardScreen";
import Toast from 'react-native-toast-message'
import Logout from "./components/Logout";
import useAuth from "./hooks/AuthHooks/useAuth";

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

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
          tabBarActiveTintColor: "black",
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
  const { user, loading } = useAuth()
  return (
    <View style={{ flex: 1 }}>
      <LottieView
        source={require('./assets/snowfall-animation.json')}
        autoPlay
        loop
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      <NavigationContainer>
        {user ? (
          <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="MyTabs" component={MyTabs} />
            <AppStack.Screen name="MyProfile" component={ProfileScreen} />
            <AppStack.Screen name="Logout" component={Logout} />
          </AppStack.Navigator>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="LogIn" component={LogIn} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
          </AuthStack.Navigator>
        )}
        <Toast />
      </NavigationContainer>
    </View>
  );
}
