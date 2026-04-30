import { useEffect, useState } from "react";
import axios from "axios";
import { Crown, User } from "lucide-react";
import ProfileCard from "../components/SearchPageComponenets/profileCard";

interface TopUser {
  _id: string;
  name: string;
  role: string;
  totalPosts: number;
}

const TopContributor = () => {
  const [users, setUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<TopUser | null>(null);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/getTopContributers",
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollowToggle = async (userId: string) => {
    const token = localStorage.getItem("token");
    const isFollowing = !!followingMap[userId];

    try {
      if (isFollowing) {
        await axios.delete(
          `https://devbackend-n4lk.onrender.com/api/removeFollower/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `https://devbackend-n4lk.onrender.com/api/addFollower/${userId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFollowingMap((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-yellow-400";
    if (index === 1) return "bg-gray-300";
    if (index === 2) return "bg-orange-400";
    return "bg-white/30";
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-blue-600 rounded-2xl p-5 shadow">

      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white">Top Contributors</h1>
        <Crown className="text-yellow-500 fill-yellow-500" />
      </div>

      {loading ? (
        <div className="text-white text-center py-10">Loading...</div>
      ) : (
        <div className="flex w-full h-[170px] overflow-x-auto gap-6">

          {users.map((user, index) => (
            <div
              key={user._id}
              className="shrink-0 w-[180px] h-full rounded-2xl 
              bg-gradient-to-t from-blue-500/40 to-red-300/40 
              flex flex-col items-center justify-center p-4 gap-2 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >

              <User
                className={`w-[70px] h-[70px] rounded-2xl p-2 text-white ${getRankStyle(index)}`}
              />

              <h1 className="text-white font-bold text-sm text-center">
                {user.name}
              </h1>

              <p className="text-xs text-yellow-300">
                {user.totalPosts} posts
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(user._id);
                }}
                className={`px-3 py-1 text-xs rounded-full ${
                  followingMap[user._id]
                    ? "bg-gray-300 text-black"
                    : "bg-white text-blue-600"
                }`}
              >
                {followingMap[user._id] ? "Following" : "Follow"}
              </button>

              {index < 3 && (
                <span className="text-xs text-white font-bold">
                  #{index + 1}
                </span>
              )}
            </div>
          ))}

        </div>
      )}

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
            <ProfileCard profile={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopContributor;