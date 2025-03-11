import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { BsFiletypeGif } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { NoProfile } from "../assets";
import { apiRequest, fetchPosts, handleFileUpload } from "../utils";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";

const PostForm = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [posting, setPosting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    // setLoading(false);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsModalOpen(true); 
    }
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
        setPreview(null);
        setIsModalOpen(false);
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
    <>
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
              onChange={handleFileSelect}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-bgColor bg-opacity-50 z-50">
          <div className="bg-secondary rounded-lg shadow-lg p-6 w-96 md:w-[26rem] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-ascent-1 hover:text-ascent-2"
            >
              <MdClose size={24} />
            </button>
            <div className="mt-3">
              <TextInput
                styles="w-full rounded-md py-2 border border-gray-300 px-3"
                placeholder="Write a caption..."
                name="description"
                register={register("description", {
                  required: "Write something about your post",
                })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>
            <h2 className="text-lg font-semibold my-3 text-white">Preview</h2>

            {file?.type.startsWith("image/") && !file?.type.endsWith("gif") && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
            )}

            {file?.type.endsWith("gif") && (
              <img
                src={preview}
                alt="GIF Preview"
                className="w-full h-auto rounded-lg"
              />
            )}

            {file?.type.startsWith("video/") && (
              <video controls className="w-full h-auto rounded-lg">
                <source src={preview} type={file.type} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="py-1 px-6 font-semibold text-md bg-ascent-1 text-blue rounded-md"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </button>
              <div>
            {posting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                title="Post"
                onClick={handleSubmit(handlePostSubmit)}
                containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-md font-semibold text-md"
              />
            )}
          </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostForm;
