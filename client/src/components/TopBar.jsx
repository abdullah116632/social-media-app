import { TiSocialSkypeOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineNotificationsOff } from "react-icons/md";
import { SetTheme } from "../redux/theme";
import { openModal } from "../redux/modalSlice";

import { searchResult } from "../utils";
import { useState } from "react";
import { handleResultBox, handleLoading } from "../redux/searchSlice";

const TopBar = () => {
  const [showNotification, setShowNotification] = useState(true);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    dispatch(handleLoading(true))
    // await fetchPosts(user.token, dispatch, "", data);
    await searchResult(user.token, dispatch, `/search?query=${data.search}`)
    dispatch(handleLoading(false))
    dispatch(handleResultBox(true))
  };

  const handleNotification = () => setShowNotification((val) => val === true ? false : true)

  return (
    <div className='topbar w-full flex items-center justify-between py-3 px-4 bg-primary md:rounded-b-lg'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
          <TiSocialSkypeOutline />
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          Funbook
        </span>
      </Link>

      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem]  rounded-l-full py-3 '
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />
      </form>

      {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme !== "dark" ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className='hidden lg:flex cursor-pointer' onClick={handleNotification}>
          {
            showNotification === true ? <IoMdNotificationsOutline /> : <MdOutlineNotificationsOff />
          }
        </div>

        <div>
          <CustomButton
            onClick={() => dispatch(openModal({ modalType: "logoutConfirm" }))}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;