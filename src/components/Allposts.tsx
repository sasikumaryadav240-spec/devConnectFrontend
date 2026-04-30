import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import axios from "axios";
import { formatTimeAgo } from "../components/profilePageComponents/timePosts";
import GetCommentsPerPost from "./profilePageComponents/GetComments";

interface Post {
  _id: string;
  header: string;
  idea: string;
  likes: number;
  likedBy: string[]; 
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    role: string;
  };
}

type JwtPayload = {
  id: string;
};

const Allposts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
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
        const token = localStorage.getItem("token");

        const postsRes = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/getAllPosts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const postsData = postsRes.data.posts;
        setPosts(postsData);

        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.id;

        const likeMapInit: Record<string, boolean> = {};

        postsData.forEach((post: Post) => {
          likeMapInit[post._id] = post.likedBy?.some(
            (id: string) => id.toString() === userId
          );
        });

        setLikeMap(likeMapInit);

        const followRes = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/followingList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const map: Record<string, boolean> = {};

        const followingList: string[] = followRes.data.getAllId;

        followingList.forEach((userId) => {
          map[userId] = true;
        });

        setFollowingMap(map);

        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error fetching posts");
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
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { likes, liked } = res.data;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes } : p
        )
      );

      setLikeMap((prev) => ({
        ...prev,
        [postId]: liked
      }));

    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async (targetId: string) => {
    if (!targetId) {
      console.error("Invalid targetId");
      return;
    }

    const isFollowing = !!followingMap[targetId];

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      console.log("Calling API with:", targetId);

      if (isFollowing) {
        await axios.delete(
          `https://devbackend-n4lk.onrender.com/api/removeFollower/${targetId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `https://devbackend-n4lk.onrender.com/api/addFollower/${targetId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFollowingMap((prev) => ({
        ...prev,
        [targetId]: !isFollowing,
      }));

    } catch (err: unknown) {
      console.error("Follow error:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if(posts.length === 0) return <div className="flex justify-center items-center text-2xl font-bold">No Posts Availble</div>

  return (
    <div className="mb-5 md:px-10 px-4">
      <div className="h-[1px] w-full bg-gray-300 mb-6"></div>

      {posts.filter((post) => post.userId && typeof post.userId === "object").map((post) => {
        const author = typeof post.userId === "object" ? post.userId : null;
        if (!author?._id) return null;
        const userId = author._id;

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
                onClick={() => handleFollowToggle(userId)}
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  followingMap[userId]
                    ? "bg-gray-300 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                {followingMap[userId] ? "Following" : "Follow"}
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

            <div className="flex gap-10">
              <button className="flex flex-col items-center gap-1" onClick={() => handleLike(post._id)}>
                <ThumbsUp className={
                  likeMap[post._id]
                    ? "text-blue-500"
                    : "text-gray-400"
                }/>
                <p className="text-xs">Like ({post.likes})</p>
              </button>

              <button onClick={() =>
                  setActiveComment({
                    id: post._id,
                    post: post,
                  })
                }  className="flex flex-col items-center gap-1">
                <MessageCircle />
                <p className="text-xs">Comment</p>
              </button>
            </div>

          </div>
        );
      })}
      {activeComment && activeComment.post && (
        <GetCommentsPerPost
          id={activeComment.id}
          post={activeComment.post}
          onClose={() => setActiveComment(null)}
        />
      )}
    </div>
  );
};

export default Allposts;