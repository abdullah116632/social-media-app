import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../redux/modalSlice.js";
import { MdClose } from "react-icons/md";

// Import different modal content components
// import EditProfile from "./modals/EditProfile";
// import DeletePost from "./modals/DeletePost";
// import ReportUser from "./modals/ReportUser";
import LogoutConfirm from "./LogoutConfirm.jsx";
import DeletePostConfirm from "./DeletePostConfirm.jsx";

const MODAL_COMPONENTS = {
  //   editProfile: EditProfile,
  //   deletePost: DeletePost,
  //   reportUser: ReportUser,
  logoutConfirm: LogoutConfirm,
  deletePost: DeletePostConfirm,
};

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen, modalType, modalProps } = useSelector((state) => state.modal);

  if (!isOpen || !modalType) return null; // Don't render when closed

  const ModalContent = MODAL_COMPONENTS[modalType];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bgColor bg-opacity-50 z-50">
      <div className="bg-blue rounded-lg p-5 shadow-lg w-80 md:w-96 relative">
        <button
          className="absolute top-3 right-3 text-ascent-1 hover:text-ascent-2"
          onClick={() => dispatch(closeModal())}
        >
          <MdClose size={22} />
        </button>
        {ModalContent && <ModalContent {...modalProps} />}
      </div>
    </div>
  );
};

export default Modal;
