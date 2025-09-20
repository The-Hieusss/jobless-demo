import { useEffect, useState } from "react";
import  supabase  from "../utils/supabase";
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function ChatRoom() {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!matchId) return;

    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    }

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${matchId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  async function sendMessage() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !matchId) return;

    await supabase.from("messages").insert({
      match_id: matchId,
      sender_id: user.id,
      content: input,
    });
    setInput("");
  }

  return (
    <div className="p-4 flex flex-col h-screen">
      <div className="flex-1 overflow-y-scroll border p-2 mb-4">
        {messages.map((m) => (
          <p key={m.id}>
            <b>{m.sender_id.slice(0, 4)}:</b> {m.content}
          </p>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
