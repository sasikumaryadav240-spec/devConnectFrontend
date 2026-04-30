import { useEffect, useState } from "react";
import axios from "axios";
import { User, MapPin } from "lucide-react";

interface Profile {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  from?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
}

const ProfileCard = ({ profile }: { profile: Profile }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/followingList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const followingIds: string[] = res.data.getAllId;

        setIsFollowing(followingIds.includes(profile._id));
      } catch (err) {
        console.error("Follow check error:", err);
      }
    };

    if (profile?._id) {
      checkFollow();
    }
  }, [profile]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");

    try {
      if (isFollowing) {
        await axios.delete(
          `https://devbackend-n4lk.onrender.com/api/removeFollower/${profile._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `https://devbackend-n4lk.onrender.com/api/addFollower/${profile._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setIsFollowing((prev) => !prev);

    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">

      <div className="flex justify-between items-start gap-5 pb-5">

        <div className="flex gap-5">
          <div className="bg-green-300 w-[150px] rounded-xl flex items-center justify-center">
            <User className="text-gray-500 w-[100px] h-[100px]" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold text-gray-700">
              {profile.name}
            </p>

            {profile.email && (
              <p className="text-gray-600">{profile.email}</p>
            )}

            {profile.from && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-600" />
                <p className="text-gray-600">{profile.from}</p>
              </div>
            )}

            {profile.role && (
              <p className="text-gray-700">{profile.role}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleFollowToggle}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            isFollowing
              ? "bg-gray-300 text-black"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {profile.bio && (
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row md:gap-10">
            <p className="font-bold text-gray-600 md:w-32">Bio</p>
            <p className="flex-1 text-gray-800">{profile.bio}</p>
          </div>
        </div>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <div className="flex flex-col md:flex-row my-5">
          <p className="font-bold text-gray-600 md:w-32">Skills</p>
          <div className="flex flex-wrap gap-3 flex-1">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-gray-200 px-4 py-1 rounded-full text-gray-700"
              >
                #{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.experience && (
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row md:gap-10">
            <p className="font-bold text-gray-600 md:w-32">Experience</p>
            <p className="flex-1 text-gray-800">{profile.experience}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileCard;