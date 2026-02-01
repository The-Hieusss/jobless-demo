import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const navLinks = [
  { label: "For Students", href: "#students" },
  { label: "For Startups", href: "#startups" },
  { label: "Product", href: "#product" },
  { label: "Why Jobless", href: "#why" },
];

const stats = [
  { label: "Job Creation ", value: "2x" },
  { label: "Match Rate", value: "80%+" },
  { label: "Engagement Rate", value: "90%" },
];

const features = [
  {
    titlePrimary: "Gamified",
    titleAccent: "Career World",
    desc: "Experience a virtual world where job hunting feels like GAME!",
    image: "/landing/aspect1.svg",
    bg: "linear-gradient(135deg, #fdfdfd 0%, #f9f6ef 100%)",
    border: "transparent",
    shadow: "0 16px 34px rgba(30, 123, 229, 0.14)",
  },
  {
    titlePrimary: "AI Job ",
    titleAccent: "Creation",
    desc: "Meet your perfect fit faster.",
    image: "/landing/aspect2.svg",
    bg: "linear-gradient(135deg, #eff3ff 0%, #f7f5ff 100%)",
    border: "transparent",
    shadow: "0 12px 28px rgba(90, 86, 196, 0.16)",
  },
  {
    titlePrimary: "Seamless",
    titleAccent: "Hiring Flow",
    desc: "Chat, schedule, and track everything in one smart workspace.",
    image: "/landing/aspect3.svg",
    bg: "linear-gradient(135deg, #fff8ec 0%, #f7f0e2 100%)",
    border: "transparent",
    shadow: "0 12px 26px rgba(217, 141, 56, 0.16)",
  },
  {
    titlePrimary: "Growth &",
    titleAccent: "Feedback Loop",
    desc: "AI and recruiters provide instant feedback to help you grow.",
    image: "/landing/aspect4.svg",
    bg: "linear-gradient(135deg, #f9f7ff 0%, #f5f7fb 100%)",
    border: "transparent",
    shadow: "0 12px 26px rgba(104, 83, 172, 0.16)",
  },
];

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen text-[#0c0b1f] app-bg">
      <div className="floating-ornament purple" />
      <div className="floating-ornament gold" />
      <div className="floating-ornament apricot" />

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-6">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/new-logo.svg" alt="Jobless logo" className="h-11 w-auto" />
          <span className="sr-only">Jobless</span>
        </Link>
        <button
          className="mobile-toggle"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <span className={navOpen ? "burger-line open" : "burger-line"} />
          <span className={navOpen ? "burger-line open" : "burger-line"} />
          <span className={navOpen ? "burger-line open" : "burger-line"} />
        </button>
        {/* Desktop nav */}
        <div className="nav-shell desktop-nav hidden lg:flex">
          <div className="nav-links flex flex-wrap items-center gap-6 lg:gap-10">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-actions flex items-center gap-6">
            <Link to="/rsvp" className="nav-cta">
              Join Waitlist
            </Link>
          </div>
        </div>
        {/* Mobile nav dropdown */}
        <div className={`mobile-nav lg:hidden ${navOpen ? "open" : ""}`}>
          <div className="nav-links flex flex-wrap items-center gap-6">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link"
                onClick={() => setNavOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-actions flex items-center gap-6">
            <Link to="/rsvp" className="nav-cta" onClick={() => setNavOpen(false)}>
              Join Waitlist
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-6 pb-12 lg:pt-14">
        <div className="flex flex-col items-center text-center space-y-5">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            The Future of Hiring feels like a{" "}
            <span className="game-bubble">
              <span className="game-bubble__fill" />
              <span className="game-bubble__tail" />
              <span className="game-bubble__text">Game</span>
            </span>
          </h1>
          <p className="max-w-3xl text-lg text-slate-600">
            JOBLESS is an AI-powered virtual world where resumes come alive,
            interviews happen instantly, and talent meets opportunity. It is a
            hiring playground—serious about matches, joyful about the journey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/rsvp"
              className="hero-cta-button"
            >
              <span className="text-lg font-semibold">Join the Waitlist</span>
              <span className="hero-cta-arrow">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Product hero */}
        <div className="relative mt-10 overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-2xl backdrop-blur">
          <div className="absolute -inset-x-10 bottom-0 h-40 bg-gradient-to-t from-[rgba(222,144,65,0.28)] via-[rgba(238,187,14,0.18)] to-transparent" />
          <div className="absolute -inset-x-10 top-0 h-48 bg-gradient-to-b from-[rgba(67,67,192,0.16)] via-transparent to-transparent" />
          <div className="relative">
            <img
              src="/landing/product-demo.svg"
              alt="Jobless virtual office product demo"
              className="w-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card flex flex-col items-center justify-center rounded-2xl border border-white/70 px-6 py-5 text-center shadow-lg"
            >
              <p className="text-2xl font-extrabold text-[#0c0b1f]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stat.label === "Faster Hiring" &&
                  "Level up from resume to real interview."}
                {stat.label === "Match Rate" &&
                  "AI helps you find your perfect fit."}
                {stat.label === "Active Users" &&
                  "Instant interviews keep every match engaged."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem We Solve */}
      <section
        id="why"
        className="relative z-10 mx-auto mt-8 max-w-6xl overflow-hidden rounded-[32px]  px-4 py-16  backdrop-blur"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-y-0 right-[-20%] w-[70%]">
            <svg viewBox="0 0 500 500" className="h-full w-full">
              <defs>
                <linearGradient id="rings" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4343c0" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#eebb0e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#dc8141" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {[60, 120, 180, 240, 300, 360, 430].map((r) => (
                <circle
                  key={r}
                  cx="250"
                  cy="250"
                  r={r}
                  fill="none"
                  stroke="url(#rings)"
                  strokeWidth="1.2"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="why-pill">
            <span className="why-pill__text">Why Jobless</span>
          </span>
          <h2 className="text-3xl sm:text-4xl  text-[#0c0b1f]">
            The Problem We Solve
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Job Searching and Hiring Are Broken.
          </p>
        </div>

        <div className="relative mt-12 flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-8">
            <div className="text-xl sm:text-2xl text-slate-600">
              Students struggle to showcase their real potential.
            </div>
            <div className="h-px w-full bg-slate-200 font-bold" />
            <div className="text-xl sm:text-2xl text-slate-600">
              Resumes are the bottleneck in modern hiring.
            </div>
            <div className="h-px w-full bg-slate-200" />
            <div className="text-xl sm:text-2xl text-slate-600">
              We’re here to make both sides meet smarter, faster, and more
              human.
            </div>
          </div>

          <div className="relative flex-1 min-h-[280px] why-visual">
            <div className="why-chat inline-flex items-center gap-2 rounded-[14px] bg-black px-4 py-3 text-sm font-semibold text-white shadow-2xl">
              Hi! I’m a curious learner who loves solving problems
              <span className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-xs font-bold">
                &gt;
              </span>
            </div>

            <div
              className="avatar-fox"
              style={{ height: "180px", width: "140px" }}
            >
              <div className="why-recruiter-tag top-0 right-8 flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-xl relative">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Student
              </div>
              <img
                src="/landing/fox costume.svg"
                alt="Student avatar"
                className="h-full w-full object-contain"
              />
            </div>
            <div
              className="avatar-suit"
              style={{ height: "190px", width: "150px" }}
            >
              <div className="why-recruiter-tag top-0 right-8 flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-xl relative">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Recruiter
              </div>
              <img
                src="/landing/Suit.svg"
                alt="Recruiter avatar"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section
        id="product"
        className="relative z-10 mx-auto mt-16 max-w-6xl px-4 pb-16"
      >
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.titlePrimary}
              className="feature-card relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-6 sm:p-8"
              style={{
                background: feature.bg,
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-semibold leading-tight">
                    <span className="feature-title-primary">
                      {feature.titlePrimary}
                    </span>{" "}
                    <span className="feature-title-accent">
                      {feature.titleAccent}
                    </span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[200px]">
                    {feature.desc}
                  </p>
                </div>
                <div className="w-32 sm:w-40 lg:w-48 flex-shrink-0">
                  <img
                    src={feature.image}
                    alt={`${feature.titlePrimary} ${feature.titleAccent}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto mb-16 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[32px] px-6 py-10 sm:px-10 sm:py-12 shadow-2xl">
          <div
            className="absolute inset-0"
            style={{ background: "var(--jobless-gradient)" }}
          />
          <div className="absolute left-4 top-4 h-20 w-20 text-white/70">
            <Sparkles className="w-full h-full" />
          </div>
          <div className="absolute right-6 bottom-6 h-10 w-10 text-white/70">
            <Sparkles className="w-full h-full" />
          </div>
          <div className="relative flex flex-col items-center gap-6 text-center text-white">
            <h3 className="text-2xl sm:text-3xl font-semibold">
              The Future of Hiring Starts Here.
            </h3>
            <Link
              to="/rsvp"
              className="rounded-full bg-white px-6 py-3 text-xs font-semibold text-[#0c0b1f] shadow-lg transition hover:-translate-y-0.5"
            >
              Join the Waitlist
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-10 bg-[#1a1a2e] text-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:justify-between">
          {/* Newsletter Section */}
          <div className="space-y-5 max-w-md">
            <h3 className="text-xl font-semibold text-white">
              Join Our Newsletter
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Be the first to know about updates, trading strategies, and{" "}
              <span className="underline">feature releases—straight to your inbox</span>.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-full border border-slate-600 bg-transparent px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
              />
              <button className="gradient-button rounded-full px-6 py-3 text-sm font-semibold text-slate-900">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-slate-500">
              By subscribing, you agree to our{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>{" "}
              and provide consent to receive updates from our company.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-3 gap-12 text-sm">
            <div className="space-y-4">
              <p className="font-medium text-white">General</p>
              <a className="block text-slate-400 hover:text-white" href="#">
                About Us
              </a>
              <a className="block text-slate-400 hover:text-white" href="#">
                Blog
              </a>
              <a className="block text-slate-400 hover:text-white" href="#">
                Contact Us
              </a>
            </div>
            <div className="space-y-4">
              <p className="font-medium text-white">Additional</p>
              <a className="block text-slate-400 hover:text-white" href="#">
                Privacy Policy
              </a>
              <a className="block text-slate-400 hover:text-white" href="#">
                Terms of Service
              </a>
            </div>
            <div className="space-y-4">
              <p className="font-medium text-white">Follow Us</p>
              <a className="block text-slate-400 hover:text-white" href="#">
                Discord
              </a>
              <a className="block text-slate-400 hover:text-white" href="#">
                X
              </a>
              <a className="block text-slate-400 hover:text-white" href="#">
                LinkedIn
              </a>
              <a className="block text-slate-400 hover:text-white" href="#">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-right px-6">
          <p className="text-xs text-slate-500 max-w-6xl mx-auto">
            2025 Jobless. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
