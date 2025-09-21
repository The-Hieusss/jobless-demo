import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const SWIPE_THRESHOLD = 100;

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  profile_pic_url: string | null;
  role: string;
  school?: string | null;
  major?: string | null;
  graduation_year?: number | null;
  company_name?: string | null;
  company_industry?: string | null;
  user_role?: string | null;
  studentHabits?: string[];
  recruiterHabits?: string[];
}

export default function SwipeDeck() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfiles() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // get current user's role
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!myProfile) return;

      const oppositeRole =
        myProfile.role === "student" ? "recruiter" : "student";

      // fetch only opposite role
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
        id, name, bio, profile_pic_url, role,
        student_details (school, major, graduation_year),
        student_habits (personality, three_words, team_role, startup_style, chaos_response),
        recruiter_details (company_name, company_industry, user_role),
        recruiter_habits (values_most, work_style, interview_theme, leader_traits)
      `
        )
        .eq("role", oppositeRole)
        .neq("id", user.id)
        .limit(20);

      if (!error && data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          bio: p.bio,
          role: p.role,
          profile_pic_url: p.profile_pic_url,
          school: p.student_details?.school,
          major: p.student_details?.major,
          graduation_year: p.student_details?.graduation_year,
          company_name: p.recruiter_details?.company_name,
          company_industry: p.recruiter_details?.company_industry,
          user_role: p.recruiter_details?.user_role,
          studentHabits: [
            ...(p.student_habits?.personality || []),
            ...(p.student_habits?.three_words || []),
            ...(p.student_habits?.team_role || []),
            ...(p.student_habits?.startup_style || []),
            ...(p.student_habits?.chaos_response || []),
          ],
          recruiterHabits: [
            ...(p.recruiter_habits?.values_most || []),
            ...(p.recruiter_habits?.work_style || []),
            ...(p.recruiter_habits?.interview_theme || []),
            ...(p.recruiter_habits?.leader_traits || []),
          ],
        }));
        setProfiles(mapped);
      }
    }
    fetchProfiles();
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) handleChoice("like");
    else if (info.offset.x < -SWIPE_THRESHOLD) handleChoice("dislike");
  };

  async function handleChoice(choice: "like" | "dislike") {
    const profile = profiles[index];
    if (!profile || !currentUserId) return;

    const payload = {
      swiper_id: currentUserId,
      target_id: profile.id,
      direction: choice,
    };

    const { error } = await supabase.from("swipes").insert(payload).select();
    if (error) {
      console.error("❌ swipe insert failed:", error.message);
      return;
    }

    // if LIKE, check for mutual like
    if (choice === "like") {
      const { data: mutual } = await supabase
        .from("swipes")
        .select("id")
        .eq("swiper_id", profile.id)
        .eq("target_id", currentUserId)
        .eq("direction", "like")
        .maybeSingle();

      if (mutual) {
        // roles
        const { data: currentRole } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUserId)
          .single();

        const { data: targetRole } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", profile.id)
          .single();

        let studentId: string | null = null;
        let recruiterId: string | null = null;

        if (currentRole?.role === "student" && targetRole?.role === "recruiter") {
          studentId = currentUserId;
          recruiterId = profile.id;
        } else if (currentRole?.role === "recruiter" && targetRole?.role === "student") {
          studentId = profile.id;
          recruiterId = currentUserId;
        }

        if (studentId && recruiterId) {
          await supabase.from("matches").insert({
            student_id: studentId,
            recruiter_id: recruiterId,
          });

          navigate("/match-banner", {
            state: { matchedUser: profile },
          });
          return;
        }
      }
    }

    setIndex((prev) => prev + 1);
    setExpanded(false);
  }

  if (index >= profiles.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-jobless-blue/30 to-white text-jobless-blue p-6 text-center">
        <h2 className="text-3xl font-header font-bold mb-2">
          No more profiles
        </h2>
        <p className="font-body">Check back later for new people 🎉</p>
      </div>
    );
  }

  const current = profiles[index];

  return (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-jobless-blue/10 via-white to-jobless-blue/5 px-4">
      {/* Top bar */}
      <div className="flex justify-between items-center w-full max-w-5xl px-6 py-6">
        <div className="text-5xl font-header text-jobless-blue md:hidden">J.</div>
      </div>

      {/* Card + Controls container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full flex-1">
        {/* Dislike button */}
        <button
          onClick={() => handleChoice("dislike")}
          className="hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg hover:scale-110 transition hover:shadow-red-200"
        >
          <X className="text-red-500 w-10 h-10" />
        </button>

        {/* Swipe Card */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current.id}
            className="
              w-full sm:w-[26rem] md:w-[30rem] lg:w-[34rem] 
              aspect-[3/4]
              rounded-3xl shadow-xl bg-center bg-cover relative cursor-pointer
              overflow-hidden
            "
            style={{
              backgroundImage: `url(${current.profile_pic_url || "https://placehold.co/400x500"})`,
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {/* Gradient Overlay */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-white text-2xl sm:text-3xl font-header drop-shadow-md">
                {current.name}
              </h2>

              {/* Context aware subtitle */}
              <p className="text-white/80 text-sm font-body">
                {current.role === "student"
                  ? `${current.graduation_year ? `${current.graduation_year} · ` : ""}${current.school} ${current.major ? `· ${current.major}` : ""}`
                  : `${current.company_name || "Unknown Company"} · ${current.company_industry || "Industry"}`}
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Student tags */}
                {(current.studentHabits || []).slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-500/20 border border-blue-400 px-3 py-1 text-xs sm:text-sm text-blue-700"
                  >
                    {tag}
                  </span>
                ))}

                {/* Recruiter tags */}
                {(current.recruiterHabits || []).slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-jobless-blue border border-jobless-blue/400 px-3 py-1 text-xs sm:text-sm text-jobless-blue/700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Like button */}
        <button
          onClick={() => handleChoice("like")}
          className="hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg hover:scale-110 transition hover:shadow-green-200"
        >
          <Heart className="text-green-500 w-10 h-10" />
        </button>
      </div>

      {/* Expanded Bio */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full sm:w-[26rem] md:w-[30rem] lg:w-[34rem] mt-6 bg-white text-gray-800 rounded-xl shadow-md p-6 text-sm sm:text-base font-body"
          >
            <p>
              <strong>About:</strong> {current.bio || "No bio yet"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-only controls */}
      <div className="flex md:hidden items-center justify-between w-full max-w-xs sm:max-w-md py-8">
        <button
          onClick={() => handleChoice("dislike")}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md hover:scale-110 transition hover:shadow-red-200"
        >
          <X className="text-red-500 w-8 h-8" />
        </button>

        <button
          onClick={() => handleChoice("like")}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md hover:scale-110 transition hover:shadow-green-200"
        >
          <Heart className="text-green-500 w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
