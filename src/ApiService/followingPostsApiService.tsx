import axios from "axios";

const API_URL = "https://devbackend-n4lk.onrender.com/api";

const followingPostsApiService = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/followingPosts`,{
    headers:{
        "Authorization" : `Bearer ${token}`
    }
  });

  return response.data;
}

export default followingPostsApiService