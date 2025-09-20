import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, Search, User, Home } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/swipe", label: "Home", icon: <Home size={20} /> },
    { path: "/network", label: "Network", icon: <Users size={20} /> },
    { path: "/discover", label: "Discover", icon: <Search size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white shadow-lg p-4 space-y-4">
        <h1 className="text-xl font-bold mb-6">Jobless</h1>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              location.pathname === item.path
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
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
