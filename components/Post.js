import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, StyleSheet, Modal, TextInput } from "react-native";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "@firebase/storage";
import { db, storage } from "../utils/Firebase";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

export default function Post({ post, deletePost, showOptions, postType }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    content: post.content,
    imageURL: post.imageURL,
  });
  const [userProfile, setUserProfile] = useState({ profilePicture: "", username: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Get reference to username in 'usernames' collection using username from post
      const usernameRef = doc(db, "usernames", post.username);
      const usernameSnap = await getDoc(usernameRef);

      // If username exists, fetch associated user profile
      if (usernameSnap.exists()) {
        const uid = usernameSnap.data().uid;

        // Get reference to user in 'users' collection using uid from usernames collection
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        // If user exists, set profile picture in state
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserProfile({ profilePicture: userData.profilePicture, username: post.username });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const deletePostHandler = async () => {
    await deletePost(post.id);
  };

  const editPost = async () => {
    const postRef = doc(db, "blogPosts", post.id);

    try {
      await updateDoc(postRef, editData);
      setEditing(false); // Close editing mode after successful update
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <MenuProvider skipInstanceCheck={true}>
      <View style={styles.item}>
        <View style={styles.header}>
          {userProfile.profilePicture ? (
            <Image source={{ uri: userProfile.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder} />
          )}
          <Text style={styles.username}>{post.username}</Text>
          <Menu style={styles.menu}>
            <MenuTrigger text="•••" />
            {showOptions && (
              <MenuOptions>
                {postType === "user" && <MenuOption onSelect={() => setEditing(true)} text="Edit" />}
                {postType === "user" && <MenuOption onSelect={deletePostHandler} text="Delete Post" />}
                {postType === "blog" && <MenuOption onSelect={() => {}} text="Pin Post" />}
                {postType === "blog" && <MenuOption onSelect={() => {}} text="Share Post" />}
                {postType === "blog" && <MenuOption onSelect={() => {}} text="Report Post" />}
                {editing && <MenuOption onSelect={editPost} text="Save Changes" />}
              </MenuOptions>
            )}
          </Menu>
        </View>
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.imageURL }} style={styles.postImage} />
          </View>
          <View style={styles.captionContainer}>
            {editing ? (
              <TextInput
                style={styles.caption}
                value={editData.content}
                onChangeText={(text) => setEditData({ ...editData, content: text })}
              />
            ) : (
              <Text style={styles.caption}>{post.content}</Text>
            )}
          </View>
        </View>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  profileImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "lightgray",
  },
  username: {
    flex: 1,
    fontWeight: "bold", // Make username bold like Instagram
  },
  menu: {
    width: 30, // Adjust width to fit "•••"
  },
  item: {
    marginVertical: 10,
    backgroundColor: "#f8f8f8", // Light background color
    borderRadius: 5, // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      // Shadow positioning
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 2.1, // Shadow blurriness
    elevation: 3, // This is for Android shadow
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  postImage: {
    width: "100%", // use full width
    height: undefined, // let the height adjust to maintain aspect ratio
    aspectRatio: 1, // adjust this value to match the aspect ratio of your images
    resizeMode: "contain", // 'cover' might also be a good option, depending on your needs
    padding: 10, // add some padding around the image
    borderWidth: 1, // add a border
    borderColor: "#000", // border color
  },
  captionContainer: {
    borderWidth: 1, // This will create a border around the view
    borderColor: "black", // This will make the border color black
    padding: 10, // This will give space between the border and the text
    marginBottom: 10, // Add some margin if you like
    borderRadius: 5, // This will round the corners of the border
    marginTop: 10,
  },
  caption: {
    color: "black",
    fontSize: 16,
  },
});
