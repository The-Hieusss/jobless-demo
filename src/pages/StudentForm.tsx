import { useState } from "react";
import  supabase  from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function StudentForm() {


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



  const navigate = useNavigate();

  function updateField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upload profile pic
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

    // Upload resume
    let resume_url = null;
    if (form.resume) {
      const { data, error } = await supabase.storage
        .from("resumes")
        .upload(`${user.id}/resume.pdf`, form.resume, { upsert: true });
      if (!error) {
        const { data: url } = await supabase.storage.from("resumes").createSignedUrl(`${user.id}/resume.pdf`, 60 * 60);
        resume_url = url ? url.signedUrl : null;
      }
    }

    await supabase.from("profiles").update({
      name: form.name,
      bio: form.bio,
      profile_pic_url,
      resume_url,
    }).eq("id", user.id);

    await supabase.from("student_details").upsert({
      id: user.id,
      school: form.school,
      birthday: form.birthday,
      education_level: form.education_level,
      major: form.major,
      graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
      industries: form.industries.split(",").map(i => i.trim()),
      role_types: form.role_types.split(",").map(i => i.trim()),
    });

    navigate("/swipe");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full Name" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="school" placeholder="School" onChange={updateField} className="w-full border p-2 rounded"/>
        <input type="date" name="birthday" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="education_level" placeholder="Education Level" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="major" placeholder="Major" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="graduation_year" placeholder="Graduation Year" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="industries" placeholder="Industries (comma separated)" onChange={updateField} className="w-full border p-2 rounded"/>
        <input name="role_types" placeholder="Role Types (comma separated)" onChange={updateField} className="w-full border p-2 rounded"/>
        <textarea name="bio" placeholder="Short Bio" onChange={updateField} className="w-full border p-2 rounded"/>
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, profile_pic: e.target.files?.[0] || null })}/>
        <input type="file" accept="application/pdf" onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}/>
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
}
