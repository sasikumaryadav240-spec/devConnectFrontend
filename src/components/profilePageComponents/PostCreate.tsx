import React, { useState } from "react";
import PostCreateApiService, { PostUpdateApiService } from "../../ApiService/PostCreateApiService";
import { type postData } from "../../ApiService/profilePostsApiService"; 
interface postprops {
    onClose : (value : boolean) => void;
    post?: postData | null;
}

const PostCreate: React.FC<postprops> = ({ onClose, post }) => {
    const [ newPost, setNewPost] = useState({
        header: post?.header || "",
        idea: post?.idea || ""
    });

    const handleInput = async (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPost(p => ({ ...p, [name] : value}));
    }

    const handleSubmit = async () => {
        if (!newPost.header || !newPost.idea) return alert("Please fill all fields");

        try {
            if(post?._id){
              await PostUpdateApiService(post?._id, newPost);
            }else{
              await PostCreateApiService(newPost);
            }
            setNewPost({ header: "", idea: "" });
            onClose(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Form didn't Updated: " + error);
        }
    }
  return(
        <div className=" bg-black/50 flex flex-col items-center justify-between fixed inset-0 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative justify-center items-center mt-25">
            <div className="flex flex-col items-center gap-5">
              <h1 className="text-2xl font-bold">
                {post ? "Update Idea" : "Post an Idea"}
              </h1>
              <input name="header" value={newPost.header} onChange={handleInput} placeholder="Enter the Title" className="border border-gray-300 w-full px-5 py-2 
                                                              rounded-lg bg-blue-100 outline-none
                                                              focus:ring-2 focus:ring-blue-500
                                                              focus:border-transparent"/>
              <textarea name="idea" value={newPost.idea} onChange={handleInput} placeholder="Enter the idea" className="border border-gray-300 w-full 
                                                                h-[100px] px-5 py-2 rounded-lg 
                                                                bg-blue-100 outline-none text-start 
                                                                align-top placeholder:text-gray-400
                                                                resize-none focus:ring-2 focus:ring-blue-500
                                                                focus:border-transparent"/>
            </div>
            <div className="flex flex-row justify-evenly mt-5">
              <button onClick={() => onClose(false)} className="bg-red-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer">
                Cancel
              </button>
              <button className="bg-green-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer" onClick={handleSubmit}>
                {post ? "Update Idea" : "Post an Idea"}
              </button>
            </div>
          </div>
        </div>
  );
}

export default PostCreate