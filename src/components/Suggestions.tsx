import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

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
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(res.data);

        const followRes = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/followingList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ids: string[] = followRes.data.getAllId;

        const map: Record<string, boolean> = {};
        ids.forEach((id) => (map[id] = true));

        setFollowingMap(map);

      } catch (err) {
        console.error("Suggestions error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (userId: string) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `https://devbackend-n4lk.onrender.com/api/addFollower/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
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
      <div className="bg-gray-100 rounded-2xl p-5">
        <p className="text-gray-500">Loading suggestions...</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-gray-100 rounded-2xl p-5 text-center">
        <h2 className="text-gray-700 font-semibold">
          No suggestions available
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Follow more users to see suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 w-full sticky top-20 rounded-2xl p-5">
      <h1 className="font-bold text-2xl text-gray-800 mb-3">
        Suggestions
      </h1>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-200 transition"
          >
            <User className="w-[50px] h-[50px] bg-blue-400 p-2 rounded-full text-white" />

            <div className="flex flex-col flex-1">
              <h1 className="font-bold text-gray-800">
                {user.name}
              </h1>
              <p className="text-sm text-gray-600">
                {user.role || "User"}
              </p>
            </div>

            <button
              onClick={() => handleFollow(user._id)}
              disabled={followingMap[user._id]}
              className={`text-sm font-semibold px-3 py-1 rounded ${
                followingMap[user._id]
                  ? "bg-gray-300 text-black"
                  : "text-blue-500"
              }`}
            >
              {followingMap[user._id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;