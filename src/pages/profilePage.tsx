import { MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { type userProfile, profilApiService} from "../ApiService/profilApiService";
import UpdateProfile from "../components/profilePageComponents/UpdateProfile";
import { useNavigate } from "react-router-dom";
import deleteProfileApiService from "../ApiService/deleteProfileApiService";

const ProfilePage = () => {
  const [ isEditProfileOpen, setIsEditProfileOpen ] = useState<boolean>(false);
  const [ isAccountDeleteOpen, setIsAccountDeleteOpen ] = useState<boolean>(false);
  const [ isLogoutOpen, setIsLogoutOpen ] = useState<boolean>(false);
  const [ profile, setProfile ] = useState<userProfile | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, isError ] = useState<boolean>(false);
  const navigation = useNavigate();
  const handleLogout = () => {
      localStorage.removeItem("token");
      navigation("/", {replace : true})
  }

  const handleDeleteProfile = async () => {
    try {
      await deleteProfileApiService();
      localStorage.removeItem("token");
      window.location.href = "/";

    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete account");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loadData = async () => {
      try {
        const data = await profilApiService(token?.toString() || "");
        setProfile(data);
      } catch (error) {
        isError(true);
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    loadData();
  },[]);

  useEffect(() => {
    if (isEditProfileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isEditProfileOpen]);

  useEffect(() => {
    if(isAccountDeleteOpen){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }

    document.body.style.overflow = "auto";
  },[isAccountDeleteOpen])

  useEffect(() => {
    if(isLogoutOpen){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }

    document.body.style.overflow = "auto";
  },[isLogoutOpen])

  if(loading) return <p className="flex justify-center items-center">Loading</p>
  {if(error) return <p className="text-red-500">Failed to load profile. Please try again.</p>}
  return (
    <div>
      <div className="flex-grow border-t border-gray-300"></div>
      <div className="flex flex-col px-10 md:px-20 pt-5">
        <div className="flex flex-row gap-5 pb-5">
          <div className="bg-green-300 w-[150px] rounded-xl">
            <User className="text-gray-500 w-[140px] h-full p-2"/>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold text-gray-700">{profile?.name}</p>
            <p className="font-medium text-gray-700">{profile?.email}</p>
            <div className="flex flex-row gap-2">
              <MapPin className="text-xl font-bold text-gray-700"/>
              <p className="font-medium text-gray-700">{profile?.from}</p>
            </div>
            <p className="font-medium text-gray-700">{profile?.role}</p>
          </div>
        </div>
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row md:gap-10">
            <p className="font-bold text-gray-600 md:w-32 mb-2 md:mb-0">Bio</p>
            <p className="flex-1 text-gray-800 leading-relaxed">{profile?.bio}</p>
          </div>
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex flex-col md:flex-row my-5">
          <p className="font-bold text-gray-600 md:w-41 mb-2 md:mb-0">Skills</p>
          <div className="flex flex-wrap gap-3 flex-1">
            {profile?.skills.map((skill) => (
              <span key={skill} className="font-semibold text-sm text-gray-700 bg-gray-200 px-4 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row md:gap-10">
            <p className="font-bold text-gray-600 md:w-32 mb-2 md:mb-0">Experience</p>
            <p className="flex-1 text-gray-800">{profile?.experience}</p>
          </div>
        </div>
        <div className="flex flex-row gap-5 justify-center">
          <button className="bg-blue-500 rounded-lg text-white font-bold px-5 py-3 mb-5" onClick={() => setIsEditProfileOpen(true)}>Edit Profile</button>
          <button className="bg-red-700 rounded-lg text-white font-bold px-5 py-3 mb-5" onClick={() => setIsAccountDeleteOpen(true)}>Delete Account</button>
          <button className="bg-orange-500 rounded-lg text-white font-bold px-5 py-3 mb-5" onClick={() => setIsLogoutOpen(true)}>Log Out</button>
        </div>
        {isEditProfileOpen && (
          <UpdateProfile onClose={setIsEditProfileOpen} profile={profile}/>
        )}
        {isAccountDeleteOpen && (
          <div className="flex justify-center items-center fixed inset-0 z-50 p-10 backdrop-blur-sm">
            <div className="flex flex-col gap-5 bg-white px-5 py-3 shadow rounded-lg">
              <div className="flex justify-center items-center ">
                <h1 className="text-xl font-bold text-gray-700">
                  Are you sure to Delete?
                </h1>
              </div>
              <div className="flex flex-row gap-5 justify-evenly">
                <button onClick={() => setIsAccountDeleteOpen(false)} className="px-4 py-2 bg-orange-500 rounded-lg text-gray-200 font-bold">
                  cancel
                </button>
                <button className="px-4 py-2 bg-red-500 rounded-lg text-gray-200 font-bold"
                onClick={handleDeleteProfile}
                >Delete</button>
              </div>
            </div>
          </div>
        )}

        {isLogoutOpen && (
          <div className="flex justify-center items-center fixed inset-0 z-50 p-10 backdrop-blur-sm">
            <div className="flex flex-col gap-5 bg-white px-5 py-3 shadow rounded-lg">
              <div className="flex justify-center items-center ">
                <h1 className="text-xl font-bold text-gray-700">
                  Are you sure to Logout?
                </h1>
              </div>
              <div className="flex flex-row gap-5 justify-evenly">
                <button onClick={() => setIsLogoutOpen(false)} className="px-4 py-2 bg-blue-500 rounded-lg text-gray-200 font-bold">
                  cancel
                </button>
                <button className="px-4 py-2 bg-red-500 rounded-lg text-gray-200 font-bold"
                onClick={() => handleLogout()}
                >LogOut</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage