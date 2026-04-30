import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { formatTimeAgo } from "../components/profilePageComponents/timePosts";
import followingPostsApiService from "../ApiService/followingPostsApiService";
import axios from "axios";
import GetCommentsPerPost from "../components/profilePageComponents/GetComments";

interface Post {
  _id: string;
  header: string;
  idea: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  userId: {
    _id :string;
    name: string;
    role: string;
  };
}

type JwtPayload = {
  id: string;
};

const FollowingPosts = () => {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeComment, setActiveComment] = useState<{
    id: string;
    post: Post | null;
  } | null>(null);
  const [likeMap, setLikeMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await followingPostsApiService();
        setPosts(res);
        const token = localStorage.getItem("token");

        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          const userId = decoded.id;

          const likeMapInit: Record<string, boolean> = {};

          res.forEach((post: Post) => {
            likeMapInit[post._id] = post.likedBy?.some(
              (id) => id.toString() === userId
            );
          });

          setLikeMap(likeMapInit);
        }
        const map: Record<string, boolean> = {};

        res.forEach((post: Post) => {
          map[post.userId._id] = true;
        });

        setFollowingMap(map);
      } catch (err) {
        if(err instanceof Error){
          setError(err.message);
        }else{
          alert("Error fetching posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `https://devbackend-n4lk.onrender.com/api/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { likes, liked } = res.data;

      // update posts
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes } : p
        )
      );

      // update like state
      setLikeMap((prev) => ({
        ...prev,
        [postId]: liked,
      }));

    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleFollowToggle = async (targetId: string) => {
  const isFollowing = followingMap[targetId];

  try {
    const token = localStorage.getItem("token");

    if (isFollowing) {
      await axios.delete(
        `https://devbackend-n4lk.onrender.com/api/removeFollower/${targetId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } else {
      await axios.post(
        `https://devbackend-n4lk.onrender.com/api/addFollower/${targetId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    }
    setFollowingMap(prev => ({
        ...prev,
        [targetId]: !isFollowing
      }));

    } catch (err: unknown) {
      console.error(err);
    }
  };

  if(posts.length === 0) return <div className="flex justify-center items-center text-2xl font-bold">No Posts Availble</div>

  return (
    <div className="mb-5 md:px-30 px-4">
      <div className="h-[1px] w-full bg-gray-300 mb-6"></div>

      {loading && <div className="text-center py-10 font-bold">Loading Posts...</div>}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {posts.map((post) => {
        const author = post.userId;

        return (
          <div key={post._id} className="mb-12 border-b border-gray-100 pb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-[60px] h-[60px] bg-blue-400 rounded-full flex items-center justify-center">
                  <User className="text-white w-8 h-8" />
                </div>

                <div>
                  <h1 className="font-bold text-gray-800 text-lg">
                    {author?.name}
                  </h1>
                  <p className="text-sm text-gray-600">{author?.role}</p>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFollowToggle(post.userId._id)}
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  followingMap[post.userId._id]
                    ? "bg-gray-300 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                {followingMap[post.userId._id] ? "Unfollow" : "Follow"}
              </button>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {post.header}
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {post.idea}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-10">
              <button className="flex flex-col items-center gap-1" onClick={() => handleLike(post._id)}>
                <ThumbsUp size={22} className={
                  likeMap[post._id]
                    ? "text-blue-500"
                    : "text-gray-400"
                }/>
                <p className="text-xs">Like ({post.likes})</p>
              </button>

              <button 
                    onClick={() =>
                      setActiveComment({
                        id: post._id,
                        post: post,
                      })
                    } className="flex flex-col items-center gap-1">
                <MessageCircle size={22} />
                <p className="text-xs">Comment</p>
              </button>
            </div>
          </div>
        );
      })}
      {activeComment?.post && (
        <GetCommentsPerPost
          id={activeComment.id}
          post={activeComment.post}
          onClose={() => setActiveComment(null)}
        />
      )}
    </div>
  );
};

export default FollowingPosts;