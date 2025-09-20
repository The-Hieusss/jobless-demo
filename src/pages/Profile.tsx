import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex flex-col items-center space-y-4">
        {profile.profile_pic_url && <img src={profile.profile_pic_url} className="w-32 h-32 rounded-full"/>}
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p>{profile.bio}</p>
        {profile.resume_url && (
          <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Download Resume</a>
        )}
      </div>
    </div>
  );
}
