import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/modalSlice";
import { deletePost, fetchPosts } from "../utils";

const DeletePostConfirmation = ({ postId }) => {
    const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleDelete = async () => {
      await deletePost(postId, user.token);
      await fetchPosts(user?.token, dispatch);
      dispatch(closeModal()); 
    };

  return (
    <div className="text-center p-5">
      <h2 className="text-lg font-semibold">Are you sure you want to delete this post? This action cannot be undone.</h2>
      <div className="mt-4 flex justify-center gap-4">
        <button 
          className="bg-[#ef4444] text-white px-4 py-2 rounded-md"
          onClick={handleDelete}
        >
          Yes, Delete
        </button>
        <button 
          className="bg-[#d1d5db] px-4 py-2 rounded-md"
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePostConfirmation;
