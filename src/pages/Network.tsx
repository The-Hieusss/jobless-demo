import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  name: string;
  profile_pic_url: string | null;
}

export default function Network() {
  const [network, setNetwork] = useState<Profile[]>([]);
  const [, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetwork() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // Get swipes where user liked others
      const { data: swipes, error } = await supabase
        .from("swipes")
        .select("target_id")
        .eq("swiper_id", user.id)
        .eq("direction", "like");

      if (error || !swipes) return;

      const targetIds = swipes.map((s) => s.target_id);
      if (targetIds.length === 0) {
        setNetwork([]);
        return;
      }

      // Fetch profiles of liked users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, profile_pic_url")
        .in("id", targetIds);

      setNetwork(profiles || []);
    }

    fetchNetwork();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE] to-[#93C5FD] px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-header text-white">My Network</h1>
        <div className="text-white">J.</div>
      </div>

      {/* Empty state */}
      {network.length === 0 && (
        <p className="text-center text-white/80 font-body">
          You haven’t liked anyone yet. Start swiping!
        </p>
      )}

      {/* Grid of liked profiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {network.map((person) => (
          <Link
            key={person.id}
            to={`/profile/${person.id}`} // optional detail route
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:scale-[1.02] transition"
          >
            <img
              src={person.profile_pic_url || "https://placehold.co/100x100"}
              alt={person.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-jobless-blue shadow"
            />
            <h2 className="mt-3 text-sm sm:text-base font-body text-jobless-blue">
              {person.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
