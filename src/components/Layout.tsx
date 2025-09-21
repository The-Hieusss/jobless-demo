import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Search, User, Smile, MessageCircle, LogOut} from "lucide-react";
import supabase from "../utils/supabase";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setCurrentUserId(user?.id ?? null);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signup");
  };


  const navItems = [
    { path: currentUserId ? `/profile/${currentUserId}` : "/profile", label: "Profile", icon: <User size={28} className="text-black/60" /> },
    { path: "/discover", label: "Discover", icon: <Search size={28} className="text-black/60" /> },
    { path: "/people", label: "People", icon: <Smile size={28} className="text-black/60" /> },
    { path: "/network", label: "Network", icon: <Users size={28} className="text-black/60" /> },
    { path: "/chat", label: "Chat", icon: <MessageCircle size={28} className="text-black/60" /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-24 bg-gradient-to-b from-white to-jobless-blue/30 text-jobless-blue p-6">
        {/* Logo */}
        <div className="text-5xl font-header text-jobless-blue">J.</div>

        {/* Nav Items */}
        <div className="flex flex-col space-y-10 mt-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center transition ${
                location.pathname === item.path
                  ? "text-jobless-blue"
                  : "text-jobless-blue/60 hover:text-jobless-blue"
              }`}
            >
              {item.icon}
              <span className="text-md font-body mt-1 text-jobless-blue">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-center mt-10">
          <button
            className="text-4xl font-light text-jobless-blue/70 hover:text-jobless-blue"
            onClick={handleSignOut}
          >
            <LogOut className="w-8 h-8 text-black" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-jobless-white border-t border-jobless-blue/20 flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center transition ${
              location.pathname === item.path
                ? "text-jobless-blue"
                : "text-jobless-blue/60 hover:text-jobless-blue"
            }`}
          >
            {item.icon}
            <span className="text-xs font-body">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
