    import { createDrawerNavigator } from "@react-navigation/drawer";
    import OurTime from "./OurTimeScreen";
    import { NavigationContainer } from "@react-navigation/native";
    import { Text } from "react-native";
    import Blog from "./BlogScreen";
    import MakePost from "./BlogPostImage";

    const Drawer = createDrawerNavigator();

    function CouplesDashBoardScreen() {
        return (
            <Text>CouplesDashBoardScreen</Text>
          );
    }

    export default function CouplesDrawer() {
    return (
        <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="Couple">
            <Drawer.Screen name="CouplesDashBoardScreen" component={CouplesDashBoardScreen} />
            <Drawer.Screen name="OurTime" component={OurTime} />
            <Drawer.Screen name="Blog" component={Blog} />
            <Drawer.Screen name="MakePost" component={MakePost} />
        </Drawer.Navigator>
        </NavigationContainer>
    );
    }
