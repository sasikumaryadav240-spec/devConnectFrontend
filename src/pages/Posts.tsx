import { MessageCircle, ThumbsUp, User } from "lucide-react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import { profilePostsApiService, type ApiResponse, type postData} from "../ApiService/profilePostsApiService";
import { formatTimeAgo } from "../components/profilePageComponents/timePosts";
import PostCreate from "../components/profilePageComponents/PostCreate";
import { PostDeleteApiService } from "../ApiService/PostCreateApiService";
import GetCommentsPerPost from "../components/profilePageComponents/GetComments";
import axios from "axios";

type JwtPayload = {
  id: string;
};

const Posts = () => {
  const [ isFormOpen, setisFromOpen ] = useState<boolean>(false);
  const [ profileData, setProfileData ] = useState<ApiResponse | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ isError, setIsError ] = useState("");
  const [ isMenuId, setIsMenuId ] = useState<string | null>(null);
  const [postToEdit, setPostToEdit] = useState<postData | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [likeMap, setLikeMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.body.style.overflow = (isFormOpen || activeCommentId) ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isFormOpen, activeCommentId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await profilePostsApiService();
        setProfileData(data);

        const token = localStorage.getItem("token");

        if (token && data?.postsData) {
          const decoded = jwtDecode<JwtPayload>(token);
          const userId = decoded.id;

          const likeMapInit: Record<string, boolean> = {};

          data.postsData.forEach((post) => {
            likeMapInit[post._id] = post.likedBy?.some(
              (id: string) => id.toString() === userId
            );
          });

          setLikeMap(likeMapInit);
        }
      } catch (error) {
        if(error instanceof Error){
          setIsError(error.toString());
        }else{
          setIsError("Server Error");
        }
      }finally{
        setIsLoading(false);
      }
    }
    loadData();
  },[])

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

      // update posts count
      setProfileData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          postsData: prev.postsData.map((p) =>
            p._id === postId ? { ...p, likes } : p
          ),
        };
      });

      // update like state
      setLikeMap((prev) => ({
        ...prev,
        [postId]: liked,
      }));

    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDelete = async (_id : string) => {
    try {
      await PostDeleteApiService(_id);
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  }

  const selectedPost = profileData?.postsData.find(p => p._id === activeCommentId);

  return (
    <div>
      <div className="flex-grow border-t border-gray-300"></div>
      <div className="flex flex-row justify-center items-center">
        <p className="border-1 border-gray-300 p-2 m-2 bg-gray-200 rounded-full cursor-pointer" onClick={() => setisFromOpen(true)}> + Create Post</p>
      </div>

      {!isLoading && !isError && profileData?.postsData?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-gray-500 text-lg font-semibold">
            No posts yet
          </p>

          <button
            onClick={() => setisFromOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Create your first post in Dev Connect
          </button>
        </div>
      )}

      {isFormOpen && (
        <PostCreate onClose={setisFromOpen}/>
      )}
      
      <div className="mb-5 md:px-30 px-4">
        <div className="h-[1px] w-full bg-gray-300 mb-6"></div>
        
        {isLoading && <div className="text-center py-10 font-bold">Loading Posts...</div>}
        {isError && <div className="text-center text-red-500 py-10">{isError}</div>}

        {profileData?.postsData.map((post) => {
          const author = post.userId;

          return (
            <div key={post._id} className="mb-12 border-b border-gray-100 pb-8">
              <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row gap-4 items-center">
                  <div className="w-[60px] h-[60px] bg-blue-400 rounded-full flex items-center justify-center overflow-hidden">
                    <User className="text-white w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold text-gray-800 text-lg">
                      {author?.name || "User"}
                    </h1>
                    <h2 className="text-sm text-gray-600">
                      {author?.role}
                    </h2>
                    <h2 className="text-xs text-gray-400">
                      {formatTimeAgo(post.createdAt)}
                    </h2>
                  </div>
                </div>
                <div className="relative">
                  <button className="text-gray-400 font-bold hover:text-gray-600 transition" 
                  onClick={(e) => { e.stopPropagation();
                  setIsMenuId(isMenuId === post._id ? null : post._id);
                  }}>
                    ...
                  </button>
                  {isMenuId === post._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                      <button
                      onClick={() => {
                        setIsMenuId(null);
                        setPostToEdit(post);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >Update</button>
                      <button onClick={
                        () => {
                          setIsMenuId(null);
                          handleDelete(post._id)
                              }
                      }
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >Delete</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <h3 className="text-xl font-bold text-gray-900">{post.header}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.idea}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {author?.skills?.map((skill, idx) => (
                    <span key={idx} className="text-blue-600 font-medium text-sm">
                      #{skill.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-10">
                <button className="flex flex-col justify-center items-center gap-1 group"
                onClick={() => handleLike(post._id)}>
                  <ThumbsUp
                    size={22}
                    className={
                      likeMap[post._id]
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-blue-500"
                    }
                  />
                  <p className="text-xs font-semibold text-gray-500">Like ({post.likes})</p>
                </button>
                <button className="flex flex-col justify-center items-center gap-1 group" onClick={() => setActiveCommentId(post._id)}>
                  <MessageCircle className="text-gray-400 group-hover:text-blue-500 transition-colors" size={22} />
                  <p className="text-xs font-semibold text-gray-500">Comment</p>
                </button>
              </div>
                      {postToEdit && (
                    <PostCreate 
                      key={postToEdit._id} 
                      post={postToEdit} 
                      onClose={() => setPostToEdit(null)} 
                    />
                  )}
            </div>
          );
        })}
        {activeCommentId && (
          <GetCommentsPerPost 
            key={activeCommentId}
            id={activeCommentId} 
            post={selectedPost}
            onClose={() => setActiveCommentId(null)} 
          />
        )}
      </div>

    </div>
  )
}

export default Posts