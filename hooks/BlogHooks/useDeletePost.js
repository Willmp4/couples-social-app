import { useState } from "react";
import { db } from "../../utils/Firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function useDeletePost(setPosts) {
  const deletePost = async (postId) => {
    setPosts((prevPosts) => {
      const newPosts = prevPosts.filter((post) => post.id !== postId);

      (async () => {
        try {
          // Delete the post in database
          await deleteDoc(doc(db, "blogPosts", postId));

          // Show a success message
          toast.success("Post deleted successfully!");
        } catch (error) {
          // If the deletion fails, revert the posts back to the previous state
          setPosts(prevPosts);

          // Log error and show an error message
          console.error("Error deleting post: ", error);
          toast.error("An error occurred while deleting the post. Please try again.");
        }
      })();

      return newPosts;
    });
  };

  return deletePost;
}

export default useDeletePost;
