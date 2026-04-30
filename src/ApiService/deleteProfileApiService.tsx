import axios from "axios";

const API_URL = "https://devbackend-n4lk.onrender.com/api";

const deleteProfileApiService = async () => {
  const token = localStorage.getItem("token");

  const deleteProfile = await axios.delete(`${API_URL}/profile`,{
    headers: {
        "Authorization" : `Bearer ${token}`
    }
  });

  return deleteProfile.data;
}

export default deleteProfileApiService