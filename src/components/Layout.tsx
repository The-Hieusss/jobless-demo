import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, Search, User, Home, MessageCircle } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/profile", label: "Profile", icon: <User size={32} /> },
    { path: "/discover", label: "Discover", icon: <Search size={32} /> },
    { path: "/people", label: "People", icon: <Home size={32} /> }, // replace with correct icon if you want
    { path: "/network", label: "Network", icon: <Users size={32} /> },
    { path: "/chat", label: "Chat", icon: <MessageCircle size={32} /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-24 bg-gradient-to-b from-white to-blue-100 text-blue-400 p-4">
        {/* Logo */}
        <div className="text-5xl font-extrabold">J.</div>

        {/* Nav Items */}
        <div className="flex flex-col space-y-10 mt-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-blue-400"
              }`}
            >
              {item.icon}
              <span className="text-sm mt-1">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Bottom Button (X) */}
        <div className="flex justify-center">
          <button className="text-5xl font-light">×</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav (kept same style for now) */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center ${
              location.pathname === item.path
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
