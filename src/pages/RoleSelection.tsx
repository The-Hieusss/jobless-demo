import  supabase  from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  async function selectRole(role: "student" | "recruiter") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({ id: user.id, role });
    navigate(role === "student" ? "/student-form" : "/recruiter-form");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">Select Your Role</h2>
      <button onClick={() => selectRole("student")} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">I’m a Student</button>
      <button onClick={() => selectRole("recruiter")} className="bg-green-600 text-white px-6 py-3 rounded-lg">I’m a Recruiter</button>
    </div>
  );
}
