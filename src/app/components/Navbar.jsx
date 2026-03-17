import { Link, useNavigate, useLocation } from "react-router";
import { Trash2, Map, LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "../../supabaseClient";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLink = (to, label, Icon) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
          active
            ? "bg-blue-700 text-white"
            : "text-blue-100 hover:bg-blue-700/60"
        }`}
      >
        <Icon size={16} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Trash2 size={20} className="text-white" />
        </div>
        <div>
          <span className="font-semibold text-base tracking-wide">
            Smart Waste
          </span>
          <span className="hidden sm:inline text-blue-200 text-sm ml-1">
            Management System
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {navLink("/dashboard", "Dashboard", LayoutDashboard)}
        {navLink("/bins", "Bins", Trash2)}
        {navLink("/map", "Map", Map)}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-blue-100 hover:bg-blue-700/60 transition-colors ml-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}
