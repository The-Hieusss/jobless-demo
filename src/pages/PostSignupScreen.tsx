import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PostSignupScreen() {
  const navigate = useNavigate();
  const { state: fromState } = useLocation();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/people", { replace: true });
    }, 3000);

    return () => {
      clearTimeout(t);
    };
  }, [navigate, fromState]);

  return (
    <div className="flex items-center justify-center min-h-screen app-bg">
      <div className="flex flex-col items-center text-center space-y-6 w-full px-4">
        {/* Heading */}
        <h1 className="font-header text-[#0c0b1f] text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold">
          Let’s match!
        </h1>
        {/* Gradient Loading Bar */}
        <div className="relative w-40 sm:w-56 md:w-72 lg:w-80 h-3 rounded-full overflow-hidden bg-jobless-blue/20">
          <div
            className="absolute inset-0 animate-[shimmer_2s_infinite]"
            style={{ background: "var(--jobless-gradient)" }}
          />
        </div>
      </div>
    </div>
  );
}
