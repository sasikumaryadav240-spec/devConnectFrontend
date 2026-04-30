import axios from "axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";

export interface userProfile {
    name: string,
    email: string,
    from:string,
    role:string,
    experience:string,
    bio:string,
    skills: string[]
}

interface ApiResponse{
    profile: {
        user : userProfile[]
    }
}

const API_URL = "https://devbackend-n4lk.onrender.com/api";

export const profilApiService = async (_id : string): Promise<userProfile> => {
  const response = await axios.get<ApiResponse>(`${API_URL}/profile`,{
    headers : {
        "Authorization" : `Bearer ${_id}`
    }
  });
  return response.data.profile.user[0];
}
interface MyTokenPayload extends JwtPayload {
  _id: string;
}
export const profilUpdateApiService = async (token: string, updateProfile : Partial<userProfile>): Promise<userProfile> => {
  const decode = jwtDecode<MyTokenPayload>(token);
  const userId = decode._id;
  const response = await axios.put<ApiResponse>(`${API_URL}/profile/${userId}`,updateProfile,{
    headers: { 
      "Authorization" : `Bearer ${token}` 
    }
  });
  return response.data.profile.user[0];
}