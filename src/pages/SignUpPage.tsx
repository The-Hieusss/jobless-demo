import { useState } from "react";
import  supabase  from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Please log in.");
      navigate("/role-selection");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white shadow-lg p-6 rounded-xl w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Sign Up
        </button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/" className="text-indigo-600 underline">Login</a>
        </p>
      </form>
    </div>
  );
}
