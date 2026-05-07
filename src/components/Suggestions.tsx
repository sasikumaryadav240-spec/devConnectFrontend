import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, UserPlus, User } from "lucide-react";

interface SuggestionUser {
  _id: string;
  name: string;
  role?: string;
}

const Suggestions = () => {
  const [users, setUsers] = useState<SuggestionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/getSuggestions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(res.data);

        const followRes = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/followingList",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ids: string[] = followRes.data.getAllId;

        const map: Record<string, boolean> = {};

        ids.forEach((id) => {
          map[id] = true;
        });

        setFollowingMap(map);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://devbackend-n4lk.onrender.com/api/addFollower/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowingMap((prev) => ({
        ...prev,
        [userId]: true,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
        <div className="flex flex-col items-center text-center gap-3 py-5">
          <Sparkles className="w-10 h-10 text-blue-500" />

          <h1 className="text-lg font-bold text-gray-800">
            No Suggestions Yet
          </h1>

          <p className="text-sm text-gray-500 leading-6">
            Follow more users and interact with posts to improve suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="text-blue-600 w-5 h-5" />

        <h1 className="text-xl font-bold text-gray-800">
          Suggestions
        </h1>
      </div>

      {/* USERS */}
      <div className="flex flex-col gap-3">

        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
          >

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <User className="text-white w-6 h-6" />
              </div>

              <div className="min-w-0">
                <h1 className="font-bold text-gray-800 truncate">
                  {user.name || "New User"}
                </h1>

                <p className="text-sm text-gray-500 truncate">
                  {user.role || "Developer"}
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={followingMap[user._id]}
              onClick={() => handleFollow(user._id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                followingMap[user._id]
                  ? "bg-gray-200 text-gray-600"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }`}
            >
              <UserPlus size={16} />

              {followingMap[user._id]
                ? "Following"
                : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;