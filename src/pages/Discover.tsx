import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";
import { Briefcase, School, Users , Workflow} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  bio: string;
  role: string;
  profile_pic_url: string | null;

  // Student fields
  major?: string;
  industries?: string[];
  role_types?: string[];
  work_style?: string;

  // Recruiter fields
  company_name?: string;
  company_industry?: string;
  looking_for?: string[];
}

export default function Discover() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          bio,
          role,
          profile_pic_url,
          student_details (
            major,
            industries,
            role_types
          ),
          recruiter_details (
            company_name,
            company_industry,
            looking_for
          ),
          recruiter_habits (
            work_style
          )
        `)
        .limit(50);

      if (error) {
        console.error("Failed to load profiles:", error.message);
        return;
      }

      const normalized = (data || []).map((p: any) => ({
        ...p,
        major: p.student_details?.major,
        industries: p.student_details?.industries,
        role_types: p.student_details?.role_types,
        work_style: p.student_habits?.work_style || p.recruiter_habits?.work_style,
        company_name: p.recruiter_details?.company_name,
        company_industry: p.recruiter_details?.company_industry,
        looking_for: p.recruiter_details?.looking_for,
      }));

      setProfiles(normalized);
    }
    fetchProfiles();
  }, []);

  const categories: { [key: string]: (p: Profile) => string | undefined } = {
    "Field": (p) => p.industries?.[0] || p.company_industry,
    "Major": (p) => p.major,
    "Work Style": (p) => p.work_style,
    "Desired Position": (p) => p.role_types?.[0] || p.looking_for?.[0],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE] via-white to-[#93C5FD] px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-header text-jobless-blue mb-10 text-center">
        🔎 Discover People
      </h1>

      <div className="space-y-12">
        {Object.entries(categories).map(([title, keyFn]) => {
          const group = profiles.filter((p) => keyFn(p));
          if (group.length === 0) return null;

          return (
            <section key={title} className="space-y-5">
              {/* Category Header */}
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-header text-jobless-blue">
                  {title}
                </h2>
                {title.includes("Major") && <School className="w-5 h-5 text-jobless-blue" />}
                {title.includes("Field") && <Briefcase className="w-5 h-5 text-jobless-blue" />}
                {title.includes("Work Style") && <Users className="w-5 h-5 text-jobless-blue" />}
                {title.includes("Position") && <Workflow className="w-5 h-5 text-jobless-blue" />}
              </div>

              {/* Profile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.map((p) => (
                  <Link
                    key={p.id}
                    to={`/profile/${p.id}`}
                    className="group bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center 
                               hover:shadow-xl hover:scale-[1.03] transition transform duration-200"
                  >
                    <div className="relative">
                      <img
                        src={p.profile_pic_url || "https://placehold.co/120x120"}
                        alt={p.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-jobless-blue shadow-sm"
                      />
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>

                    <h3 className="mt-4 text-base sm:text-lg font-body text-gray-800 group-hover:text-jobless-blue">
                      {p.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-body text-gray-500 italic">
                      {p.role === "student"
                        ? p.major || "Student"
                        : p.company_name || "Recruiter"}
                    </p>

                    {p.bio && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 font-body">
                        {p.bio}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
