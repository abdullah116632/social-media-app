import { TiSocialSkypeOutline } from "react-icons/ti";
import { SiRipple } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineNotificationsOff } from "react-icons/md";
import { HiOutlineMenu } from "react-icons/hi";
import { SetTheme } from "../redux/theme";
import { openModal } from "../redux/modalSlice";

import { searchResult } from "../utils";
import { useState } from "react";
import { handleResultBox, handleLoading } from "../redux/searchSlice";
import SideMenu from "./SideMenu";

const TopBar = () => {
  const [showNotification, setShowNotification] = useState(true);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {

    if(!data.search)return;

    dispatch(handleLoading(true));
    // await fetchPosts(user.token, dispatch, "", data);
    await searchResult(user.token, dispatch, `/search?query=${data.search}`);
    dispatch(handleLoading(false));
    dispatch(handleResultBox(true));
  };

  const handleNotification = () =>
    setShowNotification((val) => (val === true ? false : true));

  return (
    <div className="topbar w-full flex items-center justify-between py-3 px-4 bg-primary md:rounded-b-lg">
      {/* logo */}
      <Link to="/" className="flex gap-2 md:gap-4 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
        <SiRipple />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          Vibe
        </span>
      </Link>

      {/* search bar */}
      <form
        className="flex flex-row items-center justify-center"
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder="Search..."
          styles="w-[8rem] sm:w-[12rem] md:w-[18rem] lg:w-[38rem]  rounded-l-full py-3 "
          register={register("search")}
        />
        <CustomButton
          title="Search"
          type="submit"
          containerStyles="bg-[#0444a4] text-white px-2 md:px-6 py-2.5 mt-2 rounded-r-full"
        />
      </form>

      {/* ICONS */}
      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme !== "dark" ? <BsMoon /> : <BsSunFill />}
        </button>
        <div
          className="hidden lg:flex cursor-pointer"
          onClick={handleNotification}
        >
          {showNotification === true ? (
            <IoMdNotificationsOutline />
          ) : (
            <MdOutlineNotificationsOff />
          )}
        </div>

          <CustomButton
            onClick={() => dispatch(openModal({ modalType: "logoutConfirm" }))}
            title="Log Out"
            containerStyles="hidden lg:flex text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
            <div className="">
            <HiOutlineMenu className="cursor-pointer" onClick={() => setIsMenuOpen(true)} />
            </div>
      </div>
      <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </div>
  );
};

export default TopBar;
