import axios from "axios";

const API_URL = "https://devbackend-n4lk.onrender.com/api";

export interface createPostData {
    idea : string,
    header : string
}

export const PostCreateApiService = async (postData : Partial<createPostData>) : Promise<createPostData> => {
  const token = localStorage.getItem("token");

  if(!token){
    alert("Token Expired Please Login Again");
  }
    const response = await axios.post(`${API_URL}/post`,postData,{
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });
    return response.data;
}

export const PostUpdateApiService = async (_id : string, postData : Partial<createPostData>) : Promise<createPostData> => {
    const token = localStorage.getItem("token");

    if(!token){
        alert("Token Expired Please Login Again");
    }
    const response = await axios.put(`${API_URL}/post/${_id}`,postData,{
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });
    return response.data;
}

export const PostDeleteApiService = async (_id : string) => {
    const token = localStorage.getItem("token");

    if(!token){
        alert("Token Expired Please Login Again");
    }
    const response = await axios.delete(`${API_URL}/post/${_id}`,{
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });
    return response.data;
}

export default PostCreateApiService