import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

interface Profile {
  id: string;
  name: string;
  profile_pic_url: string | null;
  role: string;
}

export default function MatchBanner() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [matchUser, setMatchUser] = useState<Profile | null>(null);
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    async function fetchMatch() {
      // Get logged in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get logged in user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, profile_pic_url, role")
        .eq("id", user.id)
        .single();
      if (profileError) {
        console.error("Failed to load profile:", profileError);
        return;
      }
      setCurrentUser(profile);

      // Fetch the most recent match where current user is involved
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select("*")
        // quote the UUID values so PostgREST accepts the filter
        .or(`student_id.eq."${user.id}",recruiter_id.eq."${user.id}"`)
        .limit(1)
        .single();

      if (matchError) {
        console.error("Failed to load match:", matchError);
        return;
      }

      if (!matchData) return;

      setMatch(matchData);

      // Figure out the other person's ID
      const otherUserId =
        matchData.student_id === user.id ? matchData.recruiter_id : matchData.student_id;

      // Fetch their profile
      const { data: otherProfile } = await supabase
        .from("profiles")
        .select("id, name, profile_pic_url, role")
        .eq("id", otherUserId)
        .single();

      setMatchUser(otherProfile);
    }

    fetchMatch();
  }, []);

  if (!currentUser || !matchUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E0F2FE] to-[#93C5FD]">
        <p className="text-white text-lg">Loading match...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E0F2FE] to-[#93C5FD] px-4">
      <div className="w-full max-w-lg bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-10 text-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-header font-bold text-white mb-6">
          YOU MATCHED!
        </h1>

        {/* Avatars */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {[currentUser, matchUser].map((p) => (
            <div
              key={p.id}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden"
            >
              <img
                src={p.profile_pic_url || "https://placehold.co/100x100"}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-white/90 font-body text-sm sm:text-base mb-6">
          Keep the fire up! Say hi to your office buddy
        </p>
        {/* CTA */}
        <button
          onClick={() => match && navigate(`/chat/${match.id}`)}
          className="flex items-center justify-between w-full bg-white rounded-full px-5 py-3 shadow-md hover:scale-[1.02] transition"
        >
          <span className="text-gray-600 text-sm sm:text-base font-body">
            Start network now..
          </span>
          <span className="bg-jobless-blue text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-extrabold">
            J.
          </span>
        </button>
      </div>
    </div>
  );
}
