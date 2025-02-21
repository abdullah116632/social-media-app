import axios from "axios";
import { SetPosts } from "../redux/postSlice";

const cloudName = process.env.REACT_APP_CLOUD_NAME;

const API_URL = "http://localhost:8800";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
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
  console.log("request come", uploadFile);
  try {
    // Step 1: Get the signature and timestamp from your server
    const { data } = await axios.post(`${API_URL}/auth/generate-signature`);
    const { signature, timestamp, api_key } = data;

    console.log("Received Signature Data:", data);


    // Step 2: Prepare the form data
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("folder", "socialmedia/uploads");
    formData.append("upload_preset", "socialmedia"); // ✅ Ensure preset is included
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", api_key);

    console.log("api key", api_key)


    // Step 3: Upload the file to Cloudinary
    console.log("cloud_name", cloudName)
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("responese ", response);

    console.log("Cloudinary Response:", response);
    return response.data.secure_url; // Get uploaded file URL
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

    return;
  } catch (error) {
    console.log(error);
  }
};

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
