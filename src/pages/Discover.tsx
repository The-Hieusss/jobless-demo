import { useEffect, useState } from "react";
import  supabase  from "../utils/supabase";

export default function Discover() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase.from("profiles").select("id,name,bio,profile_pic_url,role").limit(20);
      setProfiles(data || []);
    }
    fetchProfiles();
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {profiles.map((p) => (
        <div key={p.id} className="border p-4 rounded shadow">
          {p.profile_pic_url && <img src={p.profile_pic_url} className="w-20 h-20 rounded-full mb-2"/>}
          <h2 className="font-bold">{p.name}</h2>
          <p className="text-sm text-gray-600">{p.role}</p>
          <p className="text-sm">{p.bio}</p>
        </div>
      ))}
    </div>
  );
}
