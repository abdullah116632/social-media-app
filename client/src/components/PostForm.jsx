import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { BsFiletypeGif } from "react-icons/bs";
import { NoProfile } from "../assets";
import { apiRequest, fetchPosts, handleFileUpload } from "../utils";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";

const PostForm = () => {
    const { user, edit } = useSelector((state) => state.user);
    const dispatch = useDispatch()

  const [posting, setPosting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchPost = async () => {
      await fetchPosts(user?.token, dispatch);
      setLoading(false);
    };

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg("");
    try {
      const uri = file && (await handleFileUpload(file));
      const newData = uri ? { ...data, image: uri } : data;

      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST",
      });

      if (res?.state === "failed") {
        setErrMsg(res);
      } else {
        reset({
          description: "",
        });
        setFile(null);
        setErrMsg("");
        await fetchPost();
      }

      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handlePostSubmit)}
      className="bg-primary px-4 rounded-lg"
    >
      <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt="User Image"
          className="w-14 h-14 rounded-full object-cover"
        />
        <TextInput
          styles="w-full rounded-full py-5"
          placeholder="What's on your mind...."
          name="description"
          register={register("description", {
            required: "Write something about post",
          })}
          error={errors.description ? errors.description.message : ""}
        />
      </div>
      {errMsg?.message && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg?.status === "failed"
              ? "text-[#f64949fe]"
              : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}

      <div className="flex items-center justify-between py-4">
        <label
          htmlFor="imgUpload"
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="imgUpload"
            data-max-size="5120"
            accept=".jpg, .png, .jpeg"
          />
          <BiImages />
          <span>Image</span>
        </label>

        <label
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
          htmlFor="videoUpload"
        >
          <input
            type="file"
            data-max-size="5120"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="videoUpload"
            accept="video/*"
          />
          <BiSolidVideo />
          <span>Video</span>
        </label>

        <label
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
          htmlFor="vgifUpload"
        >
          <input
            type="file"
            data-max-size="5120"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="vgifUpload"
            accept=".gif"
          />
          <BsFiletypeGif />
          <span>Gif</span>
        </label>

        <div>
          {posting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              title="Post"
              containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default PostForm;
