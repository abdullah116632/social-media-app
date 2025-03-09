import React from "react";
import { useDispatch } from "react-redux";
// import { closeModal } from "../redux/modalSlice.js";
import { closeModal } from "../redux/modalSlice";
import { Logout } from "../redux/userSlice"; // Your logout action

const LogoutConfirm = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout()); // Dispatch logout action
    dispatch(closeModal()); // Close the modal
  };

  return (
    <div className="text-center p-5">
      <h2 className="text-lg font-semibold">Are you sure you want to log out?</h2>
      <div className="mt-4 flex justify-center gap-4">
        <button 
          className="bg-[#ef4444] text-white px-4 py-2 rounded-md"
          onClick={handleLogout}
        >
          Yes, Logout
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

export default LogoutConfirm;
