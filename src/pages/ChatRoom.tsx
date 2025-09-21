import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useParams } from "react-router-dom";
import {  LogOut } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Profile {
  id: string;
  name: string;
  profile_pic_url: string | null;
}

export default function ChatRoom() {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partner, setPartner] = useState<Profile | null>(null);

  // get logged in user
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    }
    init();
  }, []);

  // fetch partner + messages
  useEffect(() => {
    if (!matchId) return;

    async function fetchChatData() {
      // 1. Fetch messages for this match
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });
      setMessages(msgs || []);

      // 2. Fetch match row
      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single();

      if (!match || !currentUserId) return;

      // 3. Figure out who the partner is
      const partnerId =
        match.student_id === currentUserId ? match.recruiter_id : match.student_id;

      // 4. Fetch partner profile
      const { data: partnerProfile } = await supabase
        .from("profiles")
        .select("id, name, profile_pic_url")
        .eq("id", partnerId)
        .single();

      if (partnerProfile) setPartner(partnerProfile);
    }

    fetchChatData();

    // 5. Listen for new messages
    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, currentUserId]);

  async function sendMessage() {
    if (!input.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !matchId) return;

    await supabase.from("messages").insert({
      match_id: matchId,
      sender_id: user.id,
      content: input,
    });
    setInput("");

    window.location.reload();
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#E0F2FE] to-[#93C5FD]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-md rounded-b-xl shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={partner?.profile_pic_url || "https://placehold.co/40x40"}
            alt={partner?.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="text-white font-semibold">
            {partner?.name || "Loading..."}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => window.history.back()}>
          <LogOut className="w-5 h-5 text-black cursor-pointer hover:opacity-80" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((m) => {
          const isMine = m.sender_id === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm sm:text-base shadow 
                  ${isMine
                    ? "bg-jobless-blue text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm"}`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white/30 backdrop-blur-md">
        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 text-sm sm:text-base focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-jobless-blue text-white px-6 py-2 text-sm sm:text-base font-semibold hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
