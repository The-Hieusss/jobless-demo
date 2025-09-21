import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";

interface Match {
  id: string;
  student_id: string;
  recruiter_id: string;
  created_at: string;
  partner: {
    id: string;
    name: string;
    profile_pic_url: string | null;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

export default function ChatStation() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1) fetch matches for current user (quote UUIDs in .or)
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .or(`student_id.eq."${user.id}",recruiter_id.eq."${user.id}"`)
        .order("created_at", { ascending: false });

      if (matchesError) {
        console.error("Failed to load matches:", matchesError);
        setMatches([]);
        return;
      }

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        return;
      }

      // 2) compute partner ids and fetch their profiles in bulk
      const partnerIds = matchesData.map((m: any) =>
        m.student_id === user.id ? m.recruiter_id : m.student_id
      );
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name, profile_pic_url")
        .in("id", partnerIds);

      // 3) fetch recent messages for these matches (ordered newest first)
      const { data: messagesData } = await supabase
        .from("messages")
        .select("match_id, content, created_at")
        .in("match_id", matchesData.map((m: any) => m.id))
        .order("created_at", { ascending: false });

      // 4) build the UI-friendly matches array: attach partner profile + latest message
      const enriched: Match[] = matchesData.map((m: any) => {
        const partnerId = m.student_id === user.id ? m.recruiter_id : m.student_id;
        const partner = profilesData?.find((p: any) => p.id === partnerId) ?? null;
        // messagesData is sorted newest-first; take first message matching this match id
        const lastMsg = messagesData?.find((msg: any) => msg.match_id === m.id);
        return {
          ...m,
          partner: partner
            ? {
                id: partner.id,
                name: partner.name,
                profile_pic_url: partner.profile_pic_url,
              }
            : { id: partnerId, name: "Unknown", profile_pic_url: null },
          lastMessage: lastMsg
            ? { content: lastMsg.content, created_at: lastMsg.created_at }
            : undefined,
        };
      });

      setMatches(enriched);
      setCurrentUserId(user.id);
    }
    fetchMatches();
  }, []);

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E0F2FE] to-[#93C5FD] px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-header text-white mb-6">
        Messages
      </h1>

      <div className="flex flex-col gap-3">
        {matches.length === 0 && (
          <p className="text-white/80 text-center">No matches yet.</p>
        )}

        {matches.map((m) => (
          <Link
            key={m.id}
            to={`/chat/${m.id}`}
            className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-xl shadow hover:scale-[1.01] transition"
          >
            {/* Left side */}
            <div className="flex items-center gap-4">
              <img
                src={m.partner?.profile_pic_url || "https://placehold.co/60x60"}
                alt={m.partner?.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-800">
                  {m.partner?.name || "Unknown"}
                </h2>
                <p className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-[300px]">
                  {m.lastMessage
                    ? m.lastMessage.content.slice(0, 30) +
                      (m.lastMessage.content.length > 30 ? "..." : "")
                    : "No messages yet"}
                </p>
              </div>
            </div>

            {/* Right side */}
            <span className="text-xs text-gray-500 ml-2">
              {m.lastMessage ? formatTime(m.lastMessage.created_at) : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
