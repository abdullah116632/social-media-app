import { MdClose } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaArrowCircleRight } from "react-icons/fa";
import { NoProfile } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { handleResultBox } from "../redux/searchSlice";
import { Link } from "react-router-dom";
import { apiRequest, cancelFriendRequest, deletePost, fetchPosts, likePost, sendFriendRequest } from "../utils";
import { Loading, PostCard } from "../components";
import { useEffect, useState } from "react";

const SearchResult = () => {
  const { result, loading } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [friendRequestId, setFriendRequestId] = useState([]);

  // console.log(result);

  const handleSearchBoxClose = () => {
    dispatch(handleResultBox(false));
  };

  const handleFriendRequest = async (id) => {
        try {
          const res = await sendFriendRequest(user.token, id);
          // console.log(res)
          setFriendRequestId((prev) => [...prev, res?.data.requestTo])
        } catch (err) {
          console.log(err);
        }
      };

  const cancelRequest = async (id) => {
    try{
      const res = await cancelFriendRequest(user.token, id);
      setFriendRequestId((prev) => prev.filter(el => el !== id));
    }catch(err){
      console.log(err)
    }
  }

  const fetchRequestedFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: "/users/get-requested-friend-request",
        token: user?.token,
        method: "POST",
      });
      const requestedUserIds = res?.data.map((request) => request.requestTo);
      // console.log(res?.data);
      setFriendRequestId(requestedUserIds);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    // setLoading(false);
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });

    await fetchPost();
  };

  const handleDelete = async (id) => {
    await deletePost(id, user.token);
    await fetchPost();
  };

  const handleClose = () => {
    dispatch(handleResultBox(false));
  };

  useEffect(() => {
    fetchRequestedFriendRequests();
  }, []);

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex flex-col items-center justify-center  min-h-[50vh] rounded-lg pt-4 px-4 pb-20 m-auto max-w-md md:max-w-xl text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-[#000] opacity-70"></div>
        </div>
        <div
          className={`inline-block align-bottom w-full ${
            result.users?.length > 0 || result.posts?.length > 0
              ? `bg-bgColor`
              : `bg-primary`
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between px-6 pt-5 pb-2 mb-2">
            <label
              htmlFor="name"
              className="block font-medium text-xl text-ascent-1 text-left"
            >
              Search result
            </label>

            <button className="text-ascent-1" onClick={handleClose}>
              <MdClose size={22} />
            </button>
          </div>
          <div className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6">
            {/* USERS */}
            <div>
              {result.users?.length > 0 && (
                <h3 className=" text-xl text-blue mb-4">Peoples</h3>
              )}
              {result.users?.map((user) => (
                <div
                  key={user._id}
                  className="w-full flex items-center justify-between border-b bg-primary rounded-lg pb-5 border-[#66666645]"
                >
                  <div onClick={handleSearchBoxClose} className="pt-4">
                    <Link
                      to={"/profile/" + user?._id}
                      className="flex gap-2 ml-3"
                    >
                      <img
                        src={user?.profileUrl ?? NoProfile}
                        alt={user?.email}
                        className="w-14 h-14 object-cover rounded-full"
                      />

                      <div className="flex flex-col justify-center">
                        <p className="text-lg font-medium text-ascent-1">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <span className="text-ascent-2">
                          {user?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="pr-3 pt-5">
                    {friendRequestId?.includes(user._id) ? (
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                      >
                        <FaArrowCircleRight size={20} className="text-[#0f52b6]" onClick={() => cancelRequest(user._id)} />
                      </button>
                    ) : (
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => {}}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" onClick={() => handleFriendRequest(user._id)} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* //POSTS */}
            <div>
              <h3 className=" text-xl text-blue mb-4">Posts</h3>
              {loading ? (
                <Loading />
              ) : result.posts?.length > 0 ? (
                result.posts?.map((post) => (
                  <div onClick={handleSearchBoxClose}>
                    <PostCard
                      key={post?._id}
                      post={post}
                      user={user}
                      deletePost={handleDelete}
                      likePost={handleLikePost}
                    />
                  </div>
                ))
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-lg text-ascent-2 mb-8">
                    No Post Available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
