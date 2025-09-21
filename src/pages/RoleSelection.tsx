import supabase from "../utils/supabase";
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
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-jobless-white to-jobless-blue">
      {/* Centered Content */}
      <div className="flex flex-col items-center text-center space-y-10">
        <h2 className="font-header text-jobless-blue text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          Are <span className="font-bold text-white">you</span>
        </h2>

        <div className="flex flex-col space-y-6 w-48 sm:w-56 md:w-64 lg:w-72">
          <button
            onClick={() => selectRole("student")}
            className="bg-jobless-blue text-jobless-white font-body font-semibold py-3 sm:py-4 rounded-full hover:opacity-90 transition text-sm sm:text-base md:text-lg"
          >
            STUDENT
          </button>
          <button
            onClick={() => selectRole("recruiter")}
            className="bg-jobless-blue text-jobless-white font-body font-semibold py-3 sm:py-4 rounded-full hover:opacity-90 transition text-sm sm:text-base md:text-lg"
          >
            RECRUITER
          </button>
        </div>
      </div>

      {/* Bottom-left Brand */}
      <h1 className="absolute bottom-6 left-6 font-header text-jobless-blue text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem] leading-none">
        Jobless<span className="text-jobless-blue">.</span>
      </h1>
    </div>
  );
}
