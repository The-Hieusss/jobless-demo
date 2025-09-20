import { useEffect, useState } from "react";
import  supabase  from "../utils/supabase";
import { Link } from "react-router-dom";

export default function Network() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("matches")
        .select("*")
        .or(`student_id.eq.${user.id},recruiter_id.eq.${user.id}`);
      setMatches(data || []);
    }
    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Network</h1>
      <ul className="space-y-2">
        {matches.map((m) => (
          <li key={m.id} className="p-3 border rounded">
            <Link to={`/chat/${m.id}`} className="text-indigo-600 underline">
              Chat with Match {m.id.slice(0, 6)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
