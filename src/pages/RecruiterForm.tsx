import { useState } from "react";
import  supabase  from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function RecruiterForm() {
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
  });

  const navigate = useNavigate();

  function updateField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let profile_pic_url = null;
    if (form.profile_pic) {
      const { data, error } = await supabase.storage
        .from("profile-pics")
        .upload(`${user.id}/profile.png`, form.profile_pic, { upsert: true });
      if (!error) {
        const { data: url } = supabase.storage.from("profile-pics").getPublicUrl(`${user.id}/profile.png`);
        profile_pic_url = url.publicUrl;
      }
    }

    await supabase.from("profiles").update({
      name: form.name,
      bio: form.bio,
      profile_pic_url,
    }).eq("id", user.id);

    await supabase.from("recruiter_details").upsert({
      id: user.id,
      company_name: form.company_name,
      company_industry: form.company_industry,
      user_role: form.user_role,
      looking_for: form.looking_for.split(",").map(i => i.trim()),
      preferred_majors: form.preferred_majors.split(",").map(i => i.trim()),
      work_type: form.work_type,
    });

    navigate("/swipe");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recruiter Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full Name" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="company_name" placeholder="Company Name" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="company_industry" placeholder="Company Industry" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="user_role" placeholder="Your Role" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="looking_for" placeholder="Looking For (comma separated)" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="preferred_majors" placeholder="Preferred Majors (comma separated)" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="work_type" placeholder="Work Type (remote, hybrid, in-person)" onChange={updateField} className="w-full border p-2 rounded"/>
        <textarea name="bio" placeholder="Short Bio" onChange={updateField} className="w-full border p-2 rounded"/>
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, profile_pic: e.target.files?.[0] || null })}/>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
}
