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
    else navigate("/");
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-jobless-white to-jobless-blue/40">
      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="bg-jobless-blue/80 rounded-2xl p-8 w-80 sm:w-96 flex flex-col space-y-6 shadow-lg"
      >
        <h1 className="text-center font-header text-white text-3xl sm:text-4xl">
          Welcome back
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-white rounded-full px-4 py-3 text-sm sm:text-base font-body focus:outline-none border border-white/40 placeholder:text-jobless-blue/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none border border-white/40 placeholder:text-jobless-blue/80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full text-jobless-white bg-jobless-blue font-body font-semibold py-3 rounded-full hover:opacity-90 transition"
        >
          Login
        </button>

        <p className="text-center text-white text-sm">
          First time here?{" "}
          <Link to="/signup" className="underline hover:opacity-80">
            Sign up
          </Link>
        </p>
      </form>

      {/* Bottom-left Brand */}
      <h1 className="absolute bottom-6 left-6 font-header text-jobless-blue text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none">
        Jobless<span className="text-jobless-blue">.</span>
      </h1>
    </div>
  );
}
