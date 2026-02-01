import { useState } from "react";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function RSVPPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the existing auth signup functionality to create a user account
      // This will populate the auth.users table and can trigger any existing auth flows
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            waitlist: true,
          },
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
      } else {
        // Optionally insert into profiles table if you want additional tracking
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email,
            name,
            waitlist: true,
            created_at: new Date().toISOString(),
          });
        }

        setSubmitted(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error during RSVP:", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/virtual-space.svg')" }}
        />

        {/* Success Card */}
        <div className="rounded-3xl p-6 sm:p-8 w-full max-w-sm flex flex-col items-center space-y-6 shadow-xl border border-white/40 bg-white/20 backdrop-blur-xs">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
          <h1 className="text-center font-header text-[#0c0b1f] text-3xl sm:text-4xl">
            You're on the list!
          </h1>
          <p className="text-center text-slate-700 text-sm sm:text-base">
            Thanks for joining our waitlist. We'll notify you when JOBLESS launches.
          </p>
          <Link
            to="/"
            className="gradient-button w-full rounded-full py-3 text-sm sm:text-base font-semibold text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Bottom-left Brand */}
        <h1 className="absolute bottom-6 left-4 sm:left-6 font-header text-[#0c0b1f] text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none drop-shadow-sm">
          Jobless<span className="text-jobless-blue">.</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/virtual-space.svg')" }}
      />

      {/* RSVP Card */}
      <form
        onSubmit={handleRSVP}
        className="rounded-3xl p-6 sm:p-8 w-full max-w-sm flex flex-col space-y-6 shadow-xl border border-white/40 bg-white/20 backdrop-blur-xs"
      >
        <div className="text-center space-y-2">
          <h1 className="font-header text-[#0c0b1f] text-3xl sm:text-4xl">
            Join the Waitlist
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Be the first to experience the future of hiring
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 border border-slate-200 placeholder:text-slate-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 border border-slate-200 placeholder:text-slate-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create Password"
          className="w-full rounded-full bg-white px-4 py-3 text-sm sm:text-base font-body focus:outline-none focus:ring-2 focus:ring-jobless-blue/30 border border-slate-200 placeholder:text-slate-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="gradient-button w-full rounded-full py-3 text-sm sm:text-base font-semibold disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>

        <p className="text-center font-body text-slate-600 text-xs sm:text-sm">
          By joining, you agree to receive updates about JOBLESS.{" "}
          <Link to="/" className="font-semibold text-jobless-blue underline">
            Back to home
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
