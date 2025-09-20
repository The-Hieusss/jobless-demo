import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import  supabase  from "../utils/supabase";

const SWIPE_THRESHOLD = 100;

const variants = {
  enter: { scale: 0.9, opacity: 0, y: 50 },
  center: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: { scale: 0.8, opacity: 0, y: -50, transition: { duration: 0.3 } },
};

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  profile_pic_url: string | null;
  role: "student" | "recruiter";
}

export default function SwipeDeck() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id,name,bio,profile_pic_url,role")
        .neq("id", user.id)
        .limit(20);

      if (!error) setProfiles(data || []);
    }
    fetchProfiles();
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      handleChoice("like");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleChoice("dislike");
    }
  };

  async function handleChoice(choice: "like" | "dislike") {
    const profile = profiles[index];
    if (!profile || !currentUserId) return;

    // Record swipe in DB
    await supabase.from("swipes").insert({
      swiper_id: currentUserId,
      target_id: profile.id,
      direction: choice,
    });

    // Check for mutual right swipe (match)
    if (choice === "like") {
      const { data: mutual } = await supabase
        .from("swipes")
        .select("*")
        .eq("swiper_id", profile.id)
        .eq("target_id", currentUserId)
        .eq("direction", "like")
        .maybeSingle();

      if (mutual) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUserId)
          .single();

        const { data: targetProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", profile.id)
          .single();

        if (userProfile && targetProfile) {
          if (userProfile.role === "student" && targetProfile.role === "recruiter") {
            await supabase.from("matches").insert({
              student_id: currentUserId,
              recruiter_id: profile.id,
            });
          } else if (userProfile.role === "recruiter" && targetProfile.role === "student") {
            await supabase.from("matches").insert({
              student_id: profile.id,
              recruiter_id: currentUserId,
            });
          }
        }
      }
    }

    // Advance deck
    setIndex((prev) => prev + 1);
    setExpanded(false);
  }

  useEffect(() => {
    setExpanded(false);
  }, [index]);

  if (index >= profiles.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">No more profiles</h2>
        <p className="mb-2">Check back later for new people 🎉</p>
      </div>
    );
  }

  const current = profiles[index];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current.id}
          className="w-80 h-96 sm:w-96 sm:h-[28rem] rounded-3xl shadow-xl bg-center bg-cover relative cursor-pointer"
          style={{
            backgroundImage: `url(${current.profile_pic_url || "https://placehold.co/300x400"})`,
          }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-3xl flex justify-between items-center">
            <div>
              <h2 className="text-yellow-400 text-2xl font-bold">{current.name}</h2>
              <p className="text-white/80 text-sm mt-1">{current.role}</p>
            </div>
            {expanded ? (
              <X className="text-white" />
            ) : (
              <div className="text-white text-sm whitespace-nowrap">See Profile</div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 sm:w-96 mt-4 bg-white text-gray-800 rounded-xl shadow-md p-4 overflow-hidden"
          >
            <p className="text-sm mb-1">
              <strong>About:</strong> {current.bio || "No bio yet"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Buttons */}
      <div className="mt-8 flex gap-10">
        <button
          onClick={() => handleChoice("dislike")}
          className="p-4 rounded-full bg-red-100 hover:bg-red-200 transition"
        >
          <X className="text-red-600" size={32} />
        </button>
        <button
          onClick={() => handleChoice("like")}
          className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition"
        >
          <Heart className="text-green-600" size={32} />
        </button>
      </div>
    </div>
  );
}
