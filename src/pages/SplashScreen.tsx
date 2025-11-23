export default function SplashScreen() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background with gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/virtual-space.svg')" }}
      />

      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-jobless-blue/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-jobless-gold/20 blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-purple-400/15 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
        {/* Logo with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-jobless-blue/30 rounded-full scale-150 animate-pulse" />
          <img
            src="/new-logo.svg"
            alt="Jobless logo"
            className="relative h-20 w-20 sm:h-24 sm:w-24 animate-bounce-slow"
          />
        </div>

        {/* Brand name with gradient text */}
        <h1 className="mt-6 font-header text-[3.5rem] sm:text-[5rem] md:text-[7rem] leading-none animate-slide-up">
          <span className="bg-gradient-to-r from-[#0c0b1f] via-[#1e3a5f] to-[#0c0b1f] bg-clip-text text-transparent">
            Jobless
          </span>
          <span className="text-jobless-blue">.</span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 font-body text-slate-600 text-base sm:text-lg md:text-xl animate-fade-in-delayed">
          Your next job starts with a playful interview.
        </p>

        {/* Loading indicator */}
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-jobless-blue animate-bounce delay-0" />
          <div className="w-2 h-2 rounded-full bg-jobless-blue animate-bounce delay-150" />
          <div className="w-2 h-2 rounded-full bg-jobless-blue animate-bounce delay-300" />
        </div>
      </div>
    </div>
  );
}
