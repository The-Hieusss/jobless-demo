import { useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { Camera, File } from "lucide-react";

export default function RecruiterFormWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company_name: "",
    company_industry: "",
    user_role: "",
    looking_for: "",
    preferred_majors: "",
    work_type: "",
    bio: "",
    profile_pic: null as File | null,
    resume: null as File | null,
  });

  const [habits, setHabits] = useState({
    valuesMost: [] as string[],
    workStyle: [] as string[],
    interviewTheme: [] as string[],
    leaderTraits: [] as string[],
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleChoice(group: keyof typeof habits, choice: string) {
    setHabits((prev) => ({
      ...prev,
      [group]: prev[group].includes(choice)
        ? prev[group].filter((c) => c !== choice)
        : [...prev[group], choice],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Upload profile picture
    let profile_pic_url = null;
    if (form.profile_pic) {
      const { error } = await supabase.storage
        .from("profile-pics")
        .upload(`${user.id}/recruiter-profile.png`, form.profile_pic, {
          upsert: true,
        });
      if (error)
        console.error("❌ Upload recruiter profile pic failed:", error.message);
      else {
        const { data: url } = supabase.storage
          .from("profile-pics")
          .getPublicUrl(`${user.id}/recruiter-profile.png`);
        profile_pic_url = url.publicUrl;
      }
    }

    // Upload resume
    let resume_url = null;
    if (form.resume) {
      const { error } = await supabase.storage
        .from("resumes")
        .upload(`${user.id}/recruiter-resume.pdf`, form.resume, {
          upsert: true,
        });
      if (error)
        console.error("❌ Upload recruiter resume failed:", error.message);
      else {
        const { data: url } = supabase.storage
          .from("resumes")
          .getPublicUrl(`${user.id}/recruiter-resume.pdf`);
        resume_url = url.publicUrl;
      }
    }

    // Save profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      name: form.name,
      bio: form.bio,
      profile_pic_url,
      resume_url,
      role: "recruiter",
    });
    if (profileError)
      console.error("❌ Profile upsert failed:", profileError.message);

    // Save recruiter details
    const { error: detailsError } = await supabase
      .from("recruiter_details")
      .upsert(
        {
          id: user.id,
          company_name: form.company_name,
          company_industry: form.company_industry,
          user_role: form.user_role,
          looking_for: form.looking_for
            ? form.looking_for.split(",").map((i) => i.trim())
            : [],
          preferred_majors: form.preferred_majors
            ? form.preferred_majors.split(",").map((i) => i.trim())
            : [],
          work_type: form.work_type,
        },
        { onConflict: "id" }
      );
    if (detailsError)
      console.error(
        "❌ Recruiter details upsert failed:",
        detailsError.message
      );

    // Save recruiter habits
    const { error: habitsError } = await supabase
      .from("recruiter_habits")
      .upsert(
        {
          id: user.id,
          values_most: habits.valuesMost,
          work_style: habits.workStyle,
          interview_theme: habits.interviewTheme,
          leader_traits: habits.leaderTraits,
        },
        { onConflict: "id" }
      );
    if (habitsError)
      console.error("❌ Recruiter habits upsert failed:", habitsError.message);

    // Redirect
    setTimeout(() => navigate("/post-signup"));
  }

  const groups = [
    {
      label: "What do you value most when recruiting?",
      key: "valuesMost" as const,
      choices: [
        "Skills and Competence",
        "Adaptive and Flexibility",
        "Creativity and Growth",
      ],
    },
    {
      label: "What do you look for in a candidate’s work style?",
      key: "workStyle" as const,
      choices: [
        "Fast Paced and Agile",
        "Risk Taking",
        "Active and Engage",
        "Detail Oriented",
        "Calm Under Pressure",
        "Collaborative",
      ],
    },
    {
      label: "If interviews were a theme, yours would be…",
      key: "interviewTheme" as const,
      choices: ["Casual Coffee Chat", "Role-Play Scenario", "Problem Solving"],
    },
    {
      label: "How do you spot a future leader?",
      key: "leaderTraits" as const,
      choices: [
        "Confidence and Initiatives",
        "Strategic Thinking",
        "Risk Taking Mindset",
        "Strong Communication",
        "Decisive and Fast Thinker",
        "Ability to Inspire",
      ],
    },
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-jobless-white to-jobless-blue/40 items-center justify-center px-4">
      {/* Step 1: Recruiter Profile */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="bg-jobless-blue/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 w-full max-w-xl shadow-lg space-y-4"
        >
          <h1 className="font-header text-white text-2xl sm:text-3xl mb-4">
            Recruiter Profile
          </h1>
          <input
            name="name"
            placeholder="Full Name"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue/80"
          />
          <input
            name="company_name"
            placeholder="Company Name"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue/80"
          />
          <input
            name="company_industry"
            placeholder="Company Industry"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue"
          />
          <input
            name="user_role"
            placeholder="Your Role"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue"
          />
          <input
            name="looking_for"
            placeholder="Looking For (comma separated)"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue"
          />
          <input
            name="preferred_majors"
            placeholder="Preferred Majors (comma separated)"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue"
          />
          <input
            name="work_type"
            placeholder="Work Type (remote, hybrid, in-person)"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue"
          />
          <textarea
            name="bio"
            placeholder="Short Bio"
            onChange={updateField}
            className="w-full rounded-2xl p-3 bg-white font-body placeholder:text-jobless-blue h-24 resize-none"
          />

          {/* Upload Profile Pic */}
          <label className="flex items-center gap-3 w-full rounded-full px-4 py-3 bg-white cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setForm({ ...form, profile_pic: e.target.files?.[0] || null })
              }
            />
            <span className="inline-flex items-center gap-2 text-jobless-blue font-body font-medium">
              <Camera className="w-5 h-5 text-yellow-400" />
              Upload photo
            </span>
            <span className="ml-auto text-sm text-jobless-blue/70 truncate max-w-[8rem]">
              {form.profile_pic ? form.profile_pic.name : "No file chosen"}
            </span>
          </label>

          {/* Upload Resume */}
          <label className="flex items-center gap-3 w-full rounded-full px-4 py-3 bg-white cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                setForm({ ...form, resume: e.target.files?.[0] || null })
              }
            />
            <span className="inline-flex items-center gap-2 text-jobless-blue font-body font-medium">
              <File className="w-5 h-5 text-jobless-blue/60" />
              Upload resume (PDF)
            </span>
            <span className="ml-auto text-sm text-jobless-blue/70 truncate max-w-[8rem]">
              {form.resume ? form.resume.name : "No file chosen"}
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-white text-jobless-blue font-body font-semibold py-3 rounded-full"
          >
            Next
          </button>
        </form>
      )}

      {/* Step 2: Habits */}
      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-10 w-full max-w-4xl shadow-lg space-y-8"
        >
          <h1 className="font-header text-jobless-blue text-2xl sm:text-3xl">
            Let’s talk, job style habits!
          </h1>
          <p className="font-body text-jobless-blue/90">
            Will they become your office buddy or baddie? You go first!
          </p>

          {groups.map((group) => (
            <div key={group.key} className="space-y-2">
              <h2 className="font-body font-semibold text-jobless-blue">
                {group.label}
              </h2>
              <div className="flex flex-wrap gap-3">
                {group.choices.map((choice) => (
                  <button
                    type="button"
                    key={choice}
                    onClick={() => toggleChoice(group.key, choice)}
                    className={`px-4 py-2 rounded-full border transition font-body text-sm sm:text-base ${
                      habits[group.key].includes(choice)
                        ? "bg-jobless-blue text-white border-jobless-blue"
                        : "border-jobless-blue text-jobless-blue hover:bg-jobless-blue/10"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-jobless-blue text-white font-body font-semibold py-3 rounded-full"
          >
            Finish
          </button>
        </form>
      )}
    </div>
  );
}
