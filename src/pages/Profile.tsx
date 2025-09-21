import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import { File, School, Briefcase, Calendar, Building2 } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [habits, setHabits] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!id) return;

      // Fetch main profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      setProfile(profileData);

      if (!profileData) return;

      if (profileData.role === "student") {
        const { data: detailsData } = await supabase
          .from("student_details")
          .select("*")
          .eq("id", id)
          .single();
        setDetails(detailsData);

        const { data: habitsData } = await supabase
          .from("student_habits")
          .select("*")
          .eq("id", id)
          .single();
        setHabits(habitsData);
      } else if (profileData.role === "recruiter") {
        const { data: detailsData } = await supabase
          .from("recruiter_details")
          .select("*")
          .eq("id", id)
          .single();
        setDetails(detailsData);

        const { data: habitsData } = await supabase
          .from("recruiter_habits")
          .select("*")
          .eq("id", id)
          .single();
        setHabits(habitsData);
      }
    }
    fetchProfile();
  }, [id]);

  if (!profile) return <p className="text-center mt-10 text-jobless-blue">Loading...</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-jobless-white to-jobless-blue/40 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          {profile.profile_pic_url && (
            <img
              src={profile.profile_pic_url}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-jobless-blue shadow-md object-cover"
            />
          )}
          <h1 className="font-header text-2xl sm:text-3xl text-jobless-blue">{profile.name}</h1>
          <p className="font-body text-jobless-blue/80">{profile.bio}</p>
          {profile.resume_url && profile.role === "student" && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jobless-blue text-white px-4 py-2 rounded-full font-body hover:opacity-90 transition"
            >
              <File className="w-4 h-4" /> Download Resume
            </a>
          )}
        </div>

        {/* Student Details */}
        {profile.role === "student" && details && (
          <div className="bg-jobless-blue/5 rounded-xl p-6 space-y-4">
            <h2 className="font-header text-xl text-jobless-blue">🎓 Student Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-jobless-blue/90">
              <p className="flex items-center gap-2"><School className="w-4 h-4" /> {details.school}</p>
              <p className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {details.education_level}</p>
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Graduation: {details.graduation_year}</p>
              <p><span className="font-semibold">Major:</span> {details.major}</p>
              <p><span className="font-semibold">Industries:</span> {details.industries?.join(", ")}</p>
              <p><span className="font-semibold">Role Types:</span> {details.role_types?.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Recruiter Details */}
        {profile.role === "recruiter" && details && (
          <div className="bg-jobless-blue/5 rounded-xl p-6 space-y-4">
            <h2 className="font-header text-xl text-jobless-blue">🏢 Recruiter Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-jobless-blue/90">
              <p className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {details.company_name}</p>
              <p className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {details.user_role}</p>
              <p><span className="font-semibold">Industry:</span> {details.company_industry}</p>
              <p><span className="font-semibold">Looking For:</span> {details.looking_for?.join(", ")}</p>
              <p><span className="font-semibold">Preferred Majors:</span> {details.preferred_majors?.join(", ")}</p>
              <p><span className="font-semibold">Work Type:</span> {details.work_type}</p>
            </div>
          </div>
        )}

        {/* Habits */}
        {habits && (
          <div className="bg-jobless-blue/5 rounded-xl p-6 space-y-4">
            <h2 className="font-header text-xl text-jobless-blue">
              🌟 {profile.role === "student" ? "Job Style Habits" : "Work Style"}
            </h2>
            <div className="space-y-3 font-body">
              {Object.entries(habits).map(([key, values]) => {
                if (key === "id") return null;
                const safeValues = Array.isArray(values) ? values : values ? [values] : [];
                return (
                  <div key={key}>
                    <h3 className="text-jobless-blue font-semibold mb-2">{formatHabitLabel(key)}</h3>
                    <div className="flex flex-wrap gap-2">
                      {safeValues.map((val) => (
                        <span key={val} className="px-3 py-1 rounded-full border border-jobless-blue text-jobless-blue text-sm">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatHabitLabel(key: string) {
  switch (key) {
    // Student
    case "personality": return "Personality";
    case "three_words": return "Three Words";
    case "team_role": return "Team Role";
    case "startup_style": return "Startup Style";
    case "chaos_response": return "Chaos Response";

    // Recruiter
    case "values_most": return "Values Most";
    case "work_style": return "Work Style";
    case "interview_theme": return "Interview Theme";
    case "leader_traits": return "Leader Traits";

    default: return key;
  }
}
