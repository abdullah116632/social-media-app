import axios from "axios";
import { SetPosts } from "../redux/postSlice";
import { SetResult } from "../redux/searchSlice";

const cloudName = process.env.REACT_APP_CLOUD_NAME;
const API_URL = process.env.REACT_APP_BACKEND_API_URL

// const API_URL = "http://localhost:8800";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    console.log(API_URL)
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  try {

    const { data } = await axios.post(`${API_URL}/auth/generate-signature`);
    const { signature, timestamp, api_key } = data;


    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("folder", "socialmedia/uploads");
    formData.append("upload_preset", "socialmedia"); 
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", api_key);

    const isVideo = uploadFile.type.startsWith("video/");

    const cloudinaryEndpoint = isVideo
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload` // Change to 'video/upload' for videos
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;


    const response = await axios.post(cloudinaryEndpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.secure_url; 
  } catch (error) {
    console.error(
      "Upload Error:",
      error.response ? error.response.data : error
    );
  }
};

export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "POST",
      data: data || {},
    });

    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async ({ uri, token }) => {
  try {
    const res = await apiRequest({
      url: uri,
      token,
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/posts/" + id,
      token,
      method: "DELETE",
    });
    return;
  } catch (err) {
    console.log(err);
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;

    const res = await apiRequest({
      url: uri,
      token,
      method: "POST",
    });

    if (res?.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User session expired. Login again");
      window.location.replace("/login");
    }

    return res?.user;
  } catch (err) {
    console.log(err);
  }
};

export const sendFriendRequest = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      token,
      method: "POST",
      data: { requestTo: id },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const cancelFriendRequest = async (token, id) => {
  try{
    const res = await apiRequest({
      url: "/users/cancel-friend-request",
      token,
      method: "POST",
      data: {requestTo: id}
    })
  }catch(e){
    console.log(e)
  }
}

export const viewUserProfile = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/profile-view",
      token,
      method: "POST",
      data: { id },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const searchResult = async (token, dispatch, uri, data) => {
  console.log("uri", uri)
  try {
    const res = await apiRequest({
      url: uri || "/search",
      token: token,
      method: "GET",
      data: data || {},
    });

    dispatch(SetResult(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
}
