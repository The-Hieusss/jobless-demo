import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import {
  File,
  School,
  Briefcase,
  Calendar,
  Building2,
  Pencil,
  Save,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [habits, setHabits] = useState<any>(null);

  // pic upload state
  const [uploadingPic, setUploadingPic] = useState(false);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // handle profile picture selection & upload
  async function handleProfilePicChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingPic(true);

    try {
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };
      const ext =
        mimeToExt[file.type] ||
        (file.name.includes(".") ? file.name.split(".").pop() || "png" : "png");

      const filename = `${profile.id}/profile.${ext}`;

      // upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile-pics")
        .upload(filename, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // get public URL
      const { data: urlData } = supabase.storage
        .from("profile-pics")
        .getPublicUrl(filename);

      const publicUrl = urlData.publicUrl;

      // update DB immediately so it persists
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_pic_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // update local state
      setFormData((prev: any) => ({ ...prev, profile_pic_url: publicUrl }));
      setProfile((prev: any) => ({ ...prev, profile_pic_url: publicUrl }));
    } catch (err) {
      console.error("Profile pic upload failed:", err);
    } finally {
      setUploadingPic(false);
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      if (!id) return;

      // Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      setProfile(profileData);
      setFormData(profileData);

      if (!profileData) return;

      if (profileData.role === "student") {
        const { data: detailsData } = await supabase
          .from("student_details")
          .select("*")
          .eq("id", id)
          .single();
        setDetails(detailsData);
        setFormData((prev: any) => ({ ...prev, ...detailsData }));

        // Try fetching habits by `id`, fall back to `profile_id` (some schemas use profile_id)
        let habitsData = null;
        const resById = await supabase
          .from("student_habits")
          .select("*")
          .eq("id", id)
          .single();
        if (resById.error && !resById.data) {
          const resByProfile = await supabase
            .from("student_habits")
            .select("*")
            .eq("profile_id", id)
            .single();
          if (resByProfile.error && !resByProfile.data) {
            console.debug(
              "No student_habits row found for id or profile_id:",
              id,
              {
                byIdError: resById.error,
                byProfileError: resByProfile.error,
              }
            );
          }
          habitsData = resByProfile.data ?? null;
        } else {
          habitsData = resById.data ?? null;
        }
        setHabits(habitsData);
        if (habitsData)
          setFormData((prev: any) => ({ ...prev, ...habitsData }));
      } else if (profileData.role === "recruiter") {
        const { data: detailsData } = await supabase
          .from("recruiter_details")
          .select("*")
          .eq("id", id)
          .single();
        setDetails(detailsData);
        setFormData((prev: any) => ({ ...prev, ...detailsData }));

        // Try fetching habits by `id`, fall back to `profile_id`
        let habitsData = null;
        const resByIdR = await supabase
          .from("recruiter_habits")
          .select("*")
          .eq("id", id)
          .single();
        if (resByIdR.error && !resByIdR.data) {
          const resByProfileR = await supabase
            .from("recruiter_habits")
            .select("*")
            .eq("profile_id", id)
            .single();
          if (resByProfileR.error && !resByProfileR.data) {
            console.debug(
              "No recruiter_habits row found for id or profile_id:",
              id,
              {
                byIdError: resByIdR.error,
                byProfileError: resByProfileR.error,
              }
            );
          }
          habitsData = resByProfileR.data ?? null;
        } else {
          habitsData = resByIdR.data ?? null;
        }
        setHabits(habitsData);
        if (habitsData)
          setFormData((prev: any) => ({ ...prev, ...habitsData }));
      }
    }
    fetchProfile();
  }, [id]);

  async function handleSave() {
    if (!profile) return;

    // Update main profile
    await supabase
      .from("profiles")
      .update({
        name: formData.name,
        bio: formData.bio,
        profile_pic_url: formData.profile_pic_url ?? profile.profile_pic_url,
      })
      .eq("id", profile.id);

    if (profile.role === "student") {
      await supabase
        .from("student_details")
        .update({
          school: formData.school,
          education_level: formData.education_level,
          graduation_year: formData.graduation_year,
          major: formData.major,
          industries: formData.industries || [],
          role_types: formData.role_types || [],
        })
        .eq("id", profile.id);

      await supabase
        .from("student_habits")
        .update({
          personality: formData.personality || [],
          three_words: formData.three_words || [],
          team_role: formData.team_role || [],
          startup_style: formData.startup_style || [],
          chaos_response: formData.chaos_response || [],
        })
        .eq("id", profile.id);
    } else if (profile.role === "recruiter") {
      await supabase
        .from("recruiter_details")
        .update({
          company_name: formData.company_name,
          user_role: formData.user_role,
          company_industry: formData.company_industry,
          looking_for: formData.looking_for || [],
          preferred_majors: formData.preferred_majors || [],
          work_type: formData.work_type,
        })
        .eq("id", profile.id);

      await supabase
        .from("recruiter_habits")
        .update({
          values_most: formData.values_most || [],
          work_style: formData.work_style || [],
          interview_theme: formData.interview_theme || [],
          leader_traits: formData.leader_traits || [],
        })
        .eq("id", profile.id);
    }

    setEditing(false);
    window.location.reload();
  }

  if (!profile)
    return <p className="text-center mt-10 text-jobless-blue">Loading...</p>;

  const isOwner = currentUserId === profile.id;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-jobless-white to-jobless-blue/40 p-4 sm:p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile picture — editable when owner is editing */}
          {editing ? (
            <label className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-jobless-blue shadow-md cursor-pointer bg-white flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
                aria-label="Upload profile picture"
              />
              {formData.profile_pic_url || profile.profile_pic_url ? (
                <img
                  src={formData.profile_pic_url || profile.profile_pic_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-jobless-blue/70">
                  <File className="w-6 h-6" />
                  <span className="text-xs mt-1">Add photo</span>
                </div>
              )}
              {uploadingPic && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="text-sm">Uploading…</span>
                </div>
              )}
            </label>
          ) : profile.profile_pic_url ? (
            <img
              src={profile.profile_pic_url}
              alt={profile.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-jobless-blue shadow-md object-cover"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-jobless-blue shadow-md flex items-center justify-center text-jobless-blue/70">
              <File className="w-6 h-6" />
            </div>
          )}

          {editing ? (
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="text-xl sm:text-2xl font-header text-jobless-blue text-center border-b focus:outline-none"
            />
          ) : (
            <h1 className="font-header text-2xl sm:text-3xl text-jobless-blue">
              {profile.name}
            </h1>
          )}

          {editing ? (
            <textarea
              value={formData.bio || ""}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="font-body text-jobless-blue/80 border rounded-md p-2 w-full"
            />
          ) : (
            <p className="font-body text-jobless-blue/80">{profile.bio}</p>
          )}

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

          {isOwner && (
            <div className="flex gap-3 mt-4">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:opacity-90 transition"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:opacity-90 transition"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-jobless-blue text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details */}
        {profile.role === "student" && details && (
          <StudentDetails
            details={details}
            editing={editing}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {profile.role === "recruiter" && details && (
          <RecruiterDetails
            details={details}
            editing={editing}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {/* Habits */}
        {habits && (
          <div className="bg-jobless-blue/5 rounded-xl p-4 sm:p-6 space-y-4">
            <h2 className="font-header text-lg sm:text-xl text-jobless-blue">
              🌟{" "}
              {profile.role === "student" ? "Job Style Habits" : "Work Style"}
            </h2>
            <div className="space-y-3 font-body">
              {Object.entries(habits).map(([key, values]) => {
                if (key === "id") return null;
                const safeValues = Array.isArray(values)
                  ? values
                  : values
                  ? [values]
                  : [];
                return (
                  <div key={key}>
                    <h3 className="text-jobless-blue font-semibold mb-2">
                      {formatHabitLabel(key)}
                    </h3>
                    {editing ? (
                      <input
                        type="text"
                        value={formData[key]?.join(", ") || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [key]: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {safeValues.map((val) => (
                          <span
                            key={val}
                            className="px-3 py-1 rounded-full border border-jobless-blue text-jobless-blue text-sm"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    )}
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

function StudentDetails({ details, editing, formData, setFormData }: any) {
  return (
    <div className="bg-jobless-blue/5 rounded-xl p-4 sm:p-6 space-y-4">
      <h2 className="font-header text-lg sm:text-xl text-jobless-blue">
        🎓 Student Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-jobless-blue/90">
        {editing ? (
          <>
            <input
              type="text"
              value={formData.school || ""}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              placeholder="School"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={formData.education_level || ""}
              onChange={(e) =>
                setFormData({ ...formData, education_level: e.target.value })
              }
              placeholder="Education Level"
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={formData.graduation_year || ""}
              onChange={(e) =>
                setFormData({ ...formData, graduation_year: e.target.value })
              }
              placeholder="Graduation Year"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={formData.major || ""}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
              placeholder="Major"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={(formData.industries || []).join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  industries: e.target.value
                    .split(",")
                    .map((s: string) => s.trim()),
                })
              }
              placeholder="Industries (comma separated)"
              className="p-2 border rounded col-span-2"
            />
            <input
              type="text"
              value={(formData.role_types || []).join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role_types: e.target.value
                    .split(",")
                    .map((s: string) => s.trim()),
                })
              }
              placeholder="Role Types (comma separated)"
              className="p-2 border rounded col-span-2"
            />
          </>
        ) : (
          <>
            <p className="flex items-center gap-2">
              <School className="w-4 h-4" /> {details.school}
            </p>
            <p className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {details.education_level}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Graduation:{" "}
              {details.graduation_year}
            </p>
            <p>
              <span className="font-semibold">Major:</span> {details.major}
            </p>
            <p>
              <span className="font-semibold">Industries:</span>{" "}
              {details.industries?.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Role Types:</span>{" "}
              {details.role_types?.join(", ")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function RecruiterDetails({ details, editing, formData, setFormData }: any) {
  return (
    <div className="bg-jobless-blue/5 rounded-xl p-4 sm:p-6 space-y-4">
      <h2 className="font-header text-lg sm:text-xl text-jobless-blue">
        🏢 Recruiter Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-jobless-blue/90">
        {editing ? (
          <>
            <input
              type="text"
              value={formData.company_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              placeholder="Company Name"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={formData.user_role || ""}
              onChange={(e) =>
                setFormData({ ...formData, user_role: e.target.value })
              }
              placeholder="Your Role"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={formData.company_industry || ""}
              onChange={(e) =>
                setFormData({ ...formData, company_industry: e.target.value })
              }
              placeholder="Industry"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={(formData.looking_for || []).join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  looking_for: e.target.value
                    .split(",")
                    .map((s: string) => s.trim()),
                })
              }
              placeholder="Looking For (comma separated)"
              className="p-2 border rounded col-span-2"
            />
            <input
              type="text"
              value={(formData.preferred_majors || []).join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferred_majors: e.target.value
                    .split(",")
                    .map((s: string) => s.trim()),
                })
              }
              placeholder="Preferred Majors (comma separated)"
              className="p-2 border rounded col-span-2"
            />
            <input
              type="text"
              value={formData.work_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, work_type: e.target.value })
              }
              placeholder="Work Type"
              className="p-2 border rounded col-span-2"
            />
          </>
        ) : (
          <>
            <p className="flex items-center gap-2">
              <Building2 className="w-4 h-4" /> {details.company_name}
            </p>
            <p className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {details.user_role}
            </p>
            <p>
              <span className="font-semibold">Industry:</span>{" "}
              {details.company_industry}
            </p>
            <p>
              <span className="font-semibold">Looking For:</span>{" "}
              {details.looking_for?.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Preferred Majors:</span>{" "}
              {details.preferred_majors?.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Work Type:</span>{" "}
              {details.work_type}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function formatHabitLabel(key: string) {
  switch (key) {
    // Student
    case "personality":
      return "Personality";
    case "three_words":
      return "Three Words";
    case "team_role":
      return "Team Role";
    case "startup_style":
      return "Startup Style";
    case "chaos_response":
      return "Chaos Response";
    // Recruiter
    case "values_most":
      return "Values Most";
    case "work_style":
      return "Work Style";
    case "interview_theme":
      return "Interview Theme";
    case "leader_traits":
      return "Leader Traits";
    default:
      return key;
  }
}
