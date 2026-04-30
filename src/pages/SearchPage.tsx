import { Search } from "lucide-react"
import { useState } from "react"
import PostsSearchBar from "../components/SearchPageComponenets/PostsSearchBar";
import UsersSearchBar from "../components/SearchPageComponenets/UsersSearchBar";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOption] = useState("posts");
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-10 px-10 pt-2 border-t border-gray-200">
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-[3rem_1fr_1px_auto] w-full max-w-2xl justify-stretch border border-gray-300 bg-white items-center px-5 rounded-full shadow-sm focus-within:border-blue-400 transition-all">
                <div className="flex justify-center">
                  <Search className="text-gray-400 w-5 h-5"/>
                </div>
                <input placeholder={`Search ${options}...`} className="bg-transparent p-4 border-none outline-none text-gray-700 placeholder:text-gray-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <select value={options} onChange={(e) => setOption(e.target.value)} className="bg-transparent px-4 py-2 border-none outline-none cursor-pointer text-gray-600 font-medium appearance-none hover:text-blue-600 transition-colors">
                  <option className="bg-gray-700 text-gray-200">posts</option>
                  <option className="bg-gray-700 text-gray-200">users</option>
                </select>
            </div>
        </div>
        <div className="mt-10 flex justify-center items-center w-full" >
          <div className="w-full max-w-4xl">
            {options === "posts" ? (
              <PostsSearchBar query={searchQuery}/>
            ) : (
              <UsersSearchBar query={searchQuery}/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage