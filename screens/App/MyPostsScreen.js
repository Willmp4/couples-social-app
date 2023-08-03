import React, { useEffect, useState, useCallback } from "react";
import { FlatList, View, Button } from "react-native";
import styles from "../../styles/ImageList.styles";
import { auth } from "../../utils/Firebase";
import Post from "../../components/Post";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./ProfileScreen";
import useFetchPosts from "../../hooks/BlogHooks/useFetchPosts";
import useDeletePost from "../../hooks/BlogHooks/useDeletePost";
import { useFocusEffect } from "@react-navigation/native";

// // Create a Drawer Navigator
const Drawer = createDrawerNavigator();

function MyPosts() {
  const { posts: fetchedPosts, refreshing, fetchPosts } = useFetchPosts(auth.currentUser.uid, false);
  const [posts, setPosts] = useState(fetchedPosts);
  const deletePost = useDeletePost(setPosts);

  // Update posts state when fetchedPosts changes
  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleDelete = async (postId) => {
    await deletePost(postId);
    fetchPosts(); // Fetch the posts again to update the list after deletion
  };

  return (
    <View style={{}}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.list}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} deletePost={handleDelete} showOptions={true} postType={'user'} />}
        refreshing={refreshing}
        onRefresh={fetchPosts}
      />
    </View>
  );
}

export default function MyPostsScreen({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Posts" drawerPosition="right">
        <Drawer.Screen name="Posts" component={MyPosts} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingRight: 10 }}></View>
    </NavigationContainer>
  );
}
