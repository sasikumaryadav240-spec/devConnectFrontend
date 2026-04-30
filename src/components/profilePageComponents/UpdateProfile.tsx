import React, { useState } from "react"
import { profilUpdateApiService, type userProfile } from "../../ApiService/profilApiService";

interface UpdateProfileProps {
    onClose : (value : boolean) => void,
    profile : userProfile | null;
}

const UpdateProfile: React.FC<UpdateProfileProps> =  ({ onClose, profile}) => {
  const [ formData, setFormData ] = useState({
    name: profile?.name || "",
    from: profile?.from || "",
    role: profile?.role || "",
    bio: profile?.bio || "",
    experience: profile?.experience || "",
    skills: profile?.skills.join(", ") || ""
  });

  const inputHandler = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(!token){ 
      alert("Session expired. Please login again.");
      return
    };

    try {
      const formattedSkills: string[] = formData.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s !== "");
      const finalData = {
        ...formData, skills: formattedSkills
      };

      await profilUpdateApiService(token,finalData);
      onClose(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Form didn't Updated: " + error);
    }
  }

  return (
    <form className="flex flex-col fixed inset-0 z-40 justify-center items-center bg-black/40 backdrop-blur-sm pt-30" onSubmit={handleSubmit}>
            <div className="bg-white py-5 px-15 rounded-lg flex flex-col items-center justify-center max-h-[90vh] md:w-full md:max-w-2xl">
              <div className="p-6 border-b border-gray-100 text-center">
                <h1 className="text-gray-700 font-bold text-2xl font-sans">Edit Profile</h1>
              </div>
              <div className="p-8 overflow-y-auto flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-semibold text-gray-500">General Info</label>
                  <input name="name" placeholder="Enter the Name" value={formData.name} onChange={inputHandler} className="border border-gray-300 px-5 py-3 w-full bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input name="from" placeholder="Enter the Place" value={formData.from} onChange={inputHandler} className="border border-gray-300 px-5 py-3 w-full bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input name="role" placeholder="Enter the Role" value={formData.role} onChange={inputHandler} className="border border-gray-300 px-5 py-3 w-full bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"/>
                  
                  <label className="text-sm font-semibold text-gray-500 mt-2">Professional Details</label>
                  <textarea name="bio" placeholder="Enter the Bio" value={formData.bio} onChange={inputHandler} rows={3} className="border border-gray-300 px-5 py-3 
                                                                            w-full bg-blue-50 rounded-lg resize-none 
                                                                            outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input name="skills" placeholder="Enter the Skills" value={formData.skills} onChange={inputHandler} className="border border-gray-300 px-5 py-3 w-full bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"/>
                  
                  <textarea name="experience" placeholder="Enter the Experience" value={formData.experience} onChange={inputHandler} rows={4} className="border border-gray-300 px-5 py-3 
                                                                            w-full bg-blue-50 rounded-lg resize-none 
                                                                            outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex flex-row justify-end gap-4 bg-gray-50 rounded-b-xl">
                <button 
                  onClick={() => onClose(false)}
                  className="px-6 py-2 text-gray-200 hover:text-gray-100 bg-orange-400 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition">
                  Submit Changes
                </button>
              </div>
            </div>
          </form>
  )
}

export default UpdateProfile