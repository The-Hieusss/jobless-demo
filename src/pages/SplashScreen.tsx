export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-jobless-white to-jobless-blue/30">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-header text-jobless-blue text-[3.5rem] sm:text-[5rem] md:text-[7rem] leading-none">
          Jobless<span className="text-jobless-blue">.</span>
        </h1>
        <p className="mt-4 font-body text-jobless-blue text-base sm:text-lg md:text-xl">
          Swipe Right on Your Next Job
        </p>
      </div>
    </div>
  );
}
