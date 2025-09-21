import { useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { Camera, File } from "lucide-react";

export default function StudentFormWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [, setLoading] = useState(false);

  const [form, setForm] = useState({
    school: "",
    name: "",
    birthday: "",
    education_level: "",
    major: "",
    graduation_year: "",
    industries: "",
    role_types: "",
    bio: "",
    profile_pic: null as File | null,
    resume: null as File | null,
  });

  const [habits, setHabits] = useState({
    personality: [] as string[],
    threeWords: [] as string[],
    teamRole: [] as string[],
    startupStyle: [] as string[],
    chaosResponse: [] as string[],
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
        .upload(`${user.id}/profile.png`, form.profile_pic, { upsert: true });
      if (error) console.error("❌ Upload profile pic failed:", error.message);
      else {
        const { data: url } = supabase.storage
          .from("profile-pics")
          .getPublicUrl(`${user.id}/profile.png`);
        profile_pic_url = url.publicUrl;
      }
    }

    // Upload resume
    let resume_url = null;
    if (form.resume) {
      const { error } = await supabase.storage
        .from("resumes")
        .upload(`${user.id}/resume.pdf`, form.resume, { upsert: true });
      if (error) console.error("❌ Upload resume failed:", error.message);
      else {
        const { data: url } = supabase.storage
          .from("resumes")
          .getPublicUrl(`${user.id}/resume.pdf`);
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
      role: "student",
    });
    if (profileError)
      console.error("❌ Profile upsert failed:", profileError.message);

    // Save student details
    const { error: detailsError } = await supabase
      .from("student_details")
      .upsert(
        {
          id: user.id,
          school: form.school,
          birthday: form.birthday,
          education_level: form.education_level,
          major: form.major,
          graduation_year: form.graduation_year
            ? parseInt(form.graduation_year)
            : null,
          industries: form.industries
            ? form.industries.split(",").map((i) => i.trim())
            : [],
          role_types: form.role_types
            ? form.role_types.split(",").map((i) => i.trim())
            : [],
        },
        { onConflict: "id" }
      );
    if (detailsError)
      console.error("❌ Student details upsert failed:", detailsError.message);

    // Save habits
    const { error: habitsError } = await supabase.from("student_habits").upsert(
      {
        id: user.id,
        personality: habits.personality,
        three_words: habits.threeWords,
        team_role: habits.teamRole,
        startup_style: habits.startupStyle,
        chaos_response: habits.chaosResponse,
      },
      { onConflict: "id" }
    );
    if (habitsError)
      console.error("❌ Student habits upsert failed:", habitsError.message);

    // Redirect
    setTimeout(() => navigate("/post-signup"));
  }

  const groups = [
    {
      label: "Who are you?",
      key: "personality" as const,
      choices: ["Introvert", "Extrovert", "Ambivert"],
    },
    {
      label: "Describe you in THREE words",
      key: "threeWords" as const,
      choices: [
        "Active",
        "Innovative",
        "Leadership",
        "Analytical",
        "Speech",
        "Confident",
        "Adaptive",
        "Decisive",
        "Discipline",
        "Strategic",
      ],
    },
    {
      label: "What role do you naturally take in a team?",
      key: "teamRole" as const,
      choices: [
        "Planner/ Organizer",
        "Starter/ Risk- taker",
        "Leader/ Manager",
        "Supporter/ Networker",
        "Researcher/ Analyst",
        "Speaker/ Presenter",
      ],
    },
    {
      label: "How do you like to work in a startup environment?",
      key: "startupStyle" as const,
      choices: [
        "Risk Taker",
        "Fast Mover",
        "Hacker",
        "Builder",
        "Perfectionist",
      ],
    },
    {
      label: "What do you do when things get chaotic?",
      key: "chaosResponse" as const,
      choices: [
        "Firefighter",
        "Calm Anchor",
        "Chaos Embracer",
        "Focused Worker",
        "Ignore-er",
      ],
    },
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-jobless-white to-jobless-blue/40 items-center justify-center px-4">
      {/* Step 1: Student Profile */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="bg-jobless-blue/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 w-full max-w-xl shadow-lg space-y-4"
        >
          <h1 className="font-header text-white text-2xl sm:text-3xl mb-4">
            Student Profile
          </h1>
          <input
            name="name"
            placeholder="Full Name"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body placeholder:text-jobless-blue/80"
          />
          <input
            name="school"
            placeholder="School"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body text-jobless-blue placeholder:text-jobless-blue/80"
          />
          <input
            type="date"
            name="birthday"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body text-jobless-blue placeholder:text-jobless-blue/80"
          />
          <input
            name="education_level"
            placeholder="Education Level"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body text-jobless-blue placeholder:text-jobless-blue/80"
          />
          <input
            name="major"
            placeholder="Major"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body text-jobless-blue placeholder:text-jobless-blue/80"
          />
          <input
            name="graduation_year"
            placeholder="Graduation Year"
            onChange={updateField}
            className="w-full rounded-full p-3 bg-white font-body text-jobless-blue placeholder:text-jobless-blue/80"
          />
          <textarea
            name="bio"
            placeholder="Short Bio"
            onChange={updateField}
            className="w-full rounded-2xl p-3 bg-white font-body text-jobless-blue placeholder:text-jobless-blue/80 h-24 resize-none"
          />

          <label className="flex items-center gap-3 w-full rounded-full px-4 py-3 bg-white cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setForm({
                  ...form,
                  profile_pic: e.target.files?.[0] || null,
                })
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

          <label className="flex items-center gap-3 w-full rounded-full px-4 py-3 bg-white cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                setForm({
                  ...form,
                  resume: e.target.files?.[0] || null,
                })
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
