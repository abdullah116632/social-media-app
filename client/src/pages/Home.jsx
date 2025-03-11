import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from "../components";

import { fetchPosts, getUserInfo, likePost } from "../utils";
import { UserLogin } from "../redux/userSlice";
import PostForm from "../components/PostForm";
import FriendRequest from "../components/FriendRequest";
import SuggestedFriends from "../components/SuggestedFriends";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });

    await fetchPost();
  };

  const getUser = async () => {
    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res };
    dispatch(UserLogin(newData));
  };

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
  }, []);

  return (
    <>
      <div className="w-full px-0 md:px-4  bg-bgColor h-screen overflow-auto">
        <TopBar />

        <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-[30%] h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
            <div className="lg:hidden">
            <FriendRequest />
            </div>
            <div className="lg:hidden">
              <SuggestedFriends />
            </div>
          </div>

          {/* CENTER */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <PostForm />

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-[30%] h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendRequest />
            <SuggestedFriends />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
