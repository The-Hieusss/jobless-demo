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
    <div className="relative flex min-h-screen items-center justify-center px-4 bg-gradient-to-b from-jobless-white to-jobless-blue/40">
      {/* Sign Up Card */}
      <form
        onSubmit={handleSignup}
        className="bg-jobless-blue/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 w-full max-w-sm flex flex-col space-y-6 shadow-lg"
      >
        <h1 className="text-center font-header text-white text-3xl sm:text-4xl">
          Create account
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue border border-white/40 placeholder:text-jobless-blue/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue border border-white/40 placeholder:text-jobless-blue/80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-jobless-blue text-jobless-white font-body font-semibold py-3 rounded-full hover:opacity-90 transition"
        >
          Sign Up
        </button>

        <p className="text-center font-body text-white text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline hover:opacity-80 font-body font-medium"
          >
            Login
          </Link>
        </p>
      </form>

      {/* Bottom-left Brand */}
      <h1 className="absolute bottom-6 left-4 sm:left-6 font-header text-jobless-blue text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none">
        Jobless<span className="text-jobless-blue">.</span>
      </h1>
    </div>
  );
}
