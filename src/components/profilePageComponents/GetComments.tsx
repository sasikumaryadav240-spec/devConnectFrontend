import React, {  useEffect, useState } from "react"
import GetComments from "../../ApiService/getComments";
import { ThumbsUp, User } from "lucide-react";
import { formatTimeAgo } from "./timePosts";

interface CommentProps {
    id : string,
    post?: PostData ;
    onClose : (value : boolean) => void,
}

interface PostData {
  _id: string;
  header: string;
  idea: string;
  likes: number;
  createdAt: string;
  userId: {
    name: string;
    role: string;
  };
}

interface UserInfo {
    name: string;
    role: string;
}

interface PostInfo {
    header: string;
    idea: string;
    likes: number;
    createdAt: string;
}

interface CommentData {
    _id: string;
    comment: string;
    createdAt: string;
    postId: PostInfo;
    userId: UserInfo;
}


const GetCommentsPerPost: React.FC<CommentProps> = ({ id,post, onClose }) => {
    const [ data, setData ] = useState<CommentData[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ isError, setIsError ] = useState<string | null>(null);
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true); 
                setData([]);
                const res: CommentData[] = await GetComments(id)
                setData(res);
            } catch (error) {
                if(error instanceof Error){
                    setIsError(error.message);
                }else{
                    alert("An unknown Error");
                }
            }finally{
                setLoading(false);
            }
        }
        if(id) fetchComments();
    },[id]);

    const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
        setSending(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
        `https://devbackend-n4lk.onrender.com/api/comment/${id}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            comment: newComment,
            }),
        }
        );

        const result = await res.json();
        setData((prev) => [
        ...prev,
        {
            _id: result._id || Date.now().toString(),
            comment: newComment,
            createdAt: new Date().toISOString(),
            userId: {
            name: "You",
            role: "User",
            },
            postId: post!,
        },
        ]);

        setNewComment("");

    } catch (err) {
        console.error("Comment error:", err);
    } finally {
        setSending(false);
    }
    };

    if (loading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;
    if (!post) return <div>Post not found</div>;

    const postInfo = post;
    const postAuthor = post?.userId;
    return(
        <div className=" bg-black/50 flex items-center justify-center fixed inset-0 z-50 backdrop-blur-sm p-4">
            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] relative overflow-hidden mt-20">
                <button 
                    onClick={() => onClose(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold z-10"
                >
                    ✕
                </button>
                <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r overflow-y-auto bg-gray-50">
                    {postInfo && (
                        <div className="w-full bg-gray-50 flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                                    <User className="text-white w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-gray-900 text-xl leading-tight">{postAuthor?.name}</h1>
                                    <p className="text-sm text-gray-500">{postAuthor?.role}</p>
                                    <p className="text-xs text-gray-400">{formatTimeAgo(postInfo.createdAt)}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 leading-snug">{postInfo.header}</h2>
                                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{postInfo.idea}</p>
                            </div>

                            <div className="mt-auto pt-6">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-50 rounded-lg transition-colors group">
                                    <ThumbsUp className="text-gray-400 group-hover:text-blue-500" size={20} />
                                    <span className="font-medium text-gray-700 group-hover:text-blue-600">Like ({postInfo.likes || 0})</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-6">
                            Comments ({data.length})
                        </h3>

                        {data.length === 0 ? (
                            <p className="text-gray-500 italic">No comments yet.</p>
                        ) : (
                            <div className="space-y-6">
                            {data.map((item) => (
                                <div key={item._id} className="border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-800">
                                    {item.userId.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm">{item.comment}</p>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                        <div className="mt-4 border-t pt-4 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                onClick={handleAddComment}
                                disabled={sending}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {sending ? "..." : "Send"}
                            </button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default GetCommentsPerPost