import { useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      navigate("/role-selection"); 
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/virtual-space.svg')" }}
      />
      {/* Sign Up Card */}
      <form
        onSubmit={handleSignup}
        className="rounded-3xl p-6 sm:p-8 w-full max-w-sm flex flex-col space-y-6 shadow-xl border border-white/40 bg-white/20 backdrop-blur-xs"
      >
        <h1 className="text-center font-header text-[#0c0b1f] text-3xl sm:text-4xl">
          Create account
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 border border-slate-200 placeholder:text-slate-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 border border-slate-200 placeholder:text-slate-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="gradient-button w-full rounded-full py-3 text-sm sm:text-base font-semibold"
        >
          Sign Up
        </button>

        <p className="text-center font-body text-slate-600 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-jobless-blue underline"
          >
            Login
          </Link>
        </p>
      </form>

      {/* Bottom-left Brand */}
      <h1 className="absolute bottom-6 left-4 sm:left-6 font-header text-[#0c0b1f] text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none drop-shadow-sm">
        Jobless<span className="text-jobless-blue">.</span>
      </h1>
    </div>
  );
}
