import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import ProfileCard from "./profileCard";

interface UserType {
  _id: string;
  name: string;
  role: string;
  email?: string;
  bio?: string;
  from?: string;
  skills?: string[];
  experience?: string;
}

const UsersSearchBar = ({ query }: { query: string }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://devbackend-n4lk.onrender.com/api/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(res.data);
      } catch (err) {
        if(err instanceof Error){
          setError(err.message);
        }else{
          alert("Users Search is Not Working");
        }
      }finally{
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const filteredUsers = users.filter((user) => {
    if (!query) return true;

    const text = query.toLowerCase();

    return (
      user.name?.toLowerCase().includes(text) ||
      user.role?.toLowerCase().includes(text)
    );
  });

  if (!filteredUsers.length && !loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        No users found
      </div>
    );
  }

  if(loading) return <div className="flex justify-center items-center font-bold text-xl text-gray-500">Loading....</div>
  if(error) return <div className="flex justify-center items-center font-bold text-xl text-red-500">{error}</div>

  if(filteredUsers.length === 0) return <div className="flex justify-center items-center text-2xl font-bold">No Users Availble</div>

  return (
    <div>

      {filteredUsers.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className="flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-100"
        >
          <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
            <User className="text-white" />
          </div>

          <div>
            <p className="font-bold">{user?.name || "user"}</p>
            <p className="text-sm text-gray-500">{user?.role || "role"}</p>
          </div>
        </div>
      ))}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ProfileCard profile={selectedUser} />
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersSearchBar;