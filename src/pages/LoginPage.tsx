import { useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate("/people");
  }

  return (
    <div className="relative flex h-screen items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/virtual-space.svg')" }}
      />
      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/40 bg-white/20 backdrop-blur-xs p-8 shadow-xl space-y-6"
      >
        <h1 className="text-center font-header text-[#0c0b1f] text-3xl sm:text-4xl">
          Welcome back
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 placeholder:text-slate-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 placeholder:text-slate-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="gradient-button w-full rounded-full py-3 text-sm sm:text-base font-semibold"
        >
          Login
        </button>

        <p className="text-center text-slate-600 text-sm">
          First time here?{" "}
          <Link to="/signup" className="font-semibold text-jobless-blue underline">
            Sign up
          </Link>
        </p>
      </form>

      {/* Bottom-left Brand */}
      <h1 className="absolute bottom-6 left-6 font-header text-[#0c0b1f] text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none drop-shadow-sm">
        Jobless<span className="text-jobless-blue">.</span>
      </h1>
    </div>
  );
}
