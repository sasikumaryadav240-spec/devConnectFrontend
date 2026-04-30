import axios from "axios";

export interface authorData {
  name: string;
  role: string;
  skills: string[];
}

interface RawPost {
  _id: string;
  header: string;
  idea: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  Author: authorData[];
}

export interface postData {
  _id: string;
  header: string;
  idea: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  userId: {
    name: string;
    role: string;
    skills: string[];
  };
}

export interface ApiResponse {
  postsData: postData[];
}

const API_URL = "https://devbackend-n4lk.onrender.com/api";

export const profilePostsApiService = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get<{ postsData: RawPost[] }>(
    `${API_URL}/profilePosts`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const transformedPosts: postData[] = response.data.postsData.map((post) => ({
    _id: post._id,
    header: post.header,
    idea: post.idea,
    likes: post.likes,
    likedBy: post.likedBy,
    createdAt: post.createdAt,
    userId: {
      name: post.Author?.[0]?.name || "User",
      role: post.Author?.[0]?.role || "No Role",
      skills: post.Author?.[0]?.skills || []
    }
  }));

  return {
    postsData: transformedPosts
  };
};