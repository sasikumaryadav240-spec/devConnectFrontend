import axios from "axios";

const API_URL = "https://devbackend-n4lk.onrender.com/api";

export const GetComments = async (_id: string) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/commentsPerPost/${_id}`,{
    headers : {
      "Authorization" : `Bearer ${token}`
    }
  });

  return response.data;
}

export default GetComments