import axios from "axios";

export interface authorData {
    name : string;
    role : string;
    skills : string[]
}

export interface postsData {
    _id : string;
    header : string;
    idea : string;
    likes : number;
    likedBy: string[];
    createdAt : string;
    Author : authorData[];
}

export interface ApiResponse {
    postsData: postsData[];
}

const API_URL = "https://devbackend-n4lk.onrender.com/api";

export const profilePostsApiService = async (): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const response = await axios.get<ApiResponse>(`${API_URL}/profilePosts`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data; 
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error; 
    }
}
