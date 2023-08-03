import React from "react";
import { FlatList, View } from "react-native";
import styles from "../../styles/ImageList.styles";
import { auth } from "../../utils/Firebase";
import Post from "../../components/Post";
import useFetchPosts from "../../hooks/BlogHooks/useFetchPosts";
export default function Blog() {
  const { posts, refreshing, fetchPosts } = useFetchPosts(auth.currentUser.uid, true);

  return (
    <View style>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.list}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} showOptions={true} postType={"blog"} />}
        refreshing={refreshing}
        onRefresh={fetchPosts}
      />
    </View>
  );
}

