import React from "react";
import { RiMenuUnfold3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../redux/modalSlice";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ isMenuOpen, setIsMenuOpen }) => {

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const navigate = useNavigate()


  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary shadow-xl z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-4 text-2xl text-ascent-1"
          onClick={() => setIsMenuOpen(false)}
        >
          <RiMenuUnfold3Line />
        </button>

        {/* Menu Items */}
        <ul className="mt-16 p-4 space-y-4 text-ascent-1">
          <li className="p-2 hover:bg-ascent-2 hover:text-[#a31212] hover:font-bold cursor-pointer" onClick={() => {setIsMenuOpen(false); navigate("/profile/" + user?._id)}}>
            My Profile
          </li>
          <li className="p-2 lg:hidden hover:bg-ascent-2 hover:text-[#a31212] hover:font-bold cursor-pointer" onClick={() => {setIsMenuOpen(false); navigate("/friends")}}>
            Friends
          </li>
          <li className="p-2 lg:hidden hover:bg-ascent-2 hover:text-[#a31212] hover:font-bold cursor-pointer" onClick={() => {setIsMenuOpen(false); navigate("/friend-request")}}>
            Friend Request
          </li>
          <li className="p-2 lg:hidden hover:bg-ascent-2 hover:text-[#a31212] hover:font-bold cursor-pointer" onClick={() => {setIsMenuOpen(false); navigate("/friend-suggestion")}}>
            Friend Suggestion
          </li>
          <li className="p-2 hover:bg-ascent-2 hover:text-[#a31212] hover:font-bold cursor-pointer" onClick={() => {setIsMenuOpen(false); navigate(`/reset-password`)}}>
            Reset Password
          </li>
          <li className="p-2 hover:bg-ascent-2 hover:text-[#a31212] hover:font-bold cursor-pointer" onClick={() => dispatch(openModal({ modalType: "logoutConfirm" }))}>
            Logout
          </li>
        </ul>
      </div>

      {/* Overlay (click outside to close) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideMenu;
